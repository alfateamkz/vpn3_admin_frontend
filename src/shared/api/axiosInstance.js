import axios from "axios";
import Cookies from "js-cookie";
import { getConfig } from "../config/configLoader";

// Функция для получения baseURL из конфига или env
function getBaseURL() {
    const config = getConfig();
    return config?.baseURL || process.env.REACT_APP_URL || "";
}

const axiosInstance = axios.create({
    baseURL: getBaseURL(),
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    },
    timeout: 30000, // 30 секунд
});

// Обновляем baseURL при изменении конфига
export function updateAxiosBaseURL() {
    const newBaseURL = getBaseURL();
    if (newBaseURL && axiosInstance.defaults.baseURL !== newBaseURL) {
        axiosInstance.defaults.baseURL = newBaseURL;
        console.log("🔄 BaseURL обновлен:", newBaseURL);
    }
}

axiosInstance.interceptors.request.use(function (config) {
    const token = Cookies.get('accessToken')
    config.headers.Authorization = `Bearer ${token}`
    
    // Обновляем baseURL из конфига при каждом запросе (на случай если конфиг загрузился позже)
    const currentBaseURL = getBaseURL();
    if (currentBaseURL && config.baseURL !== currentBaseURL) {
        config.baseURL = currentBaseURL;
    }
    
    // Добавляем timestamp для предотвращения кеширования
    if (config.params) {
        config.params._t = Date.now()
    } else {
        config.params = { _t: Date.now() }
    }
    
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    console.log(`[API Request] Full URL: ${config.baseURL}${config.url}`)
    
    return config;
}, function (error) {
    return Promise.reject(error);
});

let requestsToRefresh = []

axiosInstance.interceptors.response.use(function (response) {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
    return response;
}, function (error) {
    console.error(`[API Error] ${error.response?.status || 'NO_STATUS'} - ${error.message}`)
    console.error('Error details:', error.response?.data)
    console.error('Error config:', error.config?.url)
    console.error('Error request config:', error.config)
    
    // Исключаем эндпоинт refresh, login и broadcast из обработки 401, чтобы избежать рекурсии
    const isRefreshEndpoint = error.config?.url?.includes('/auth/refresh')
    const isLoginEndpoint = error.config?.url?.includes('/auth/login')
    const isBroadcastEndpoint = error.config?.url?.includes('/broadcast')
    
    console.log('[Auth Check] isRefreshEndpoint:', isRefreshEndpoint, 'isLoginEndpoint:', isLoginEndpoint, 'isBroadcastEndpoint:', isBroadcastEndpoint)
    
    // Проверяем статус код ошибки
    if (error.response?.status === 401 && !isRefreshEndpoint && !isLoginEndpoint && !isBroadcastEndpoint) {
        console.log('[401 Error] Starting token refresh process')
        const isRefreshingUpdate = Cookies.get('refresher') === 'true';
        const refreshToken = Cookies.get('refreshToken')
        
        console.log('[401 Error] isRefreshingUpdate:', isRefreshingUpdate, 'hasRefreshToken:', !!refreshToken)
        
        // Если нет refresh токена - перенаправляем на авторизацию
        if (!refreshToken) {
            console.log('[401 Error] No refresh token, redirecting to auth')
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            window.location.href = '/auth'
            return Promise.reject(error)
        }
        
        if (!isRefreshingUpdate) {
            console.log('[401 Error] Starting refresh token request')
            Cookies.set('refresher', 'true')

            const baseURL = getBaseURL();
            axios.post(`${baseURL}/auth/refresh`, {}, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                }
            })
                .then((res) => {
                    console.log('[401 Error] Token refresh successful')
                    Cookies.set('refreshToken', res.data.refresh_token)
                    Cookies.set('accessToken', res.data.access_token)
                    requestsToRefresh.forEach((cb) => cb(res.data.access_token))
                })
                .catch((refreshError) => {
                    console.error('[401 Error] Token refresh failed:', refreshError)
                    console.error('[401 Error] Refresh error response:', refreshError.response?.data)
                    requestsToRefresh.forEach((cb) => cb(null))
                    
                    // Если refresh не удался - перенаправляем на авторизацию
                    Cookies.remove('accessToken')
                    Cookies.remove('refreshToken')
                    window.location.href = '/auth'
                })
                .finally(() => {
                    console.log('[401 Error] Clearing refresher flag')
                    requestsToRefresh = []
                    Cookies.remove('refresher')
                })
        } else {
            console.log('[401 Error] Already refreshing, waiting for result')
        }

        return new Promise((resolve, reject) => {
            requestsToRefresh.push((token) => {
                if (token) {
                    console.log('[401 Error] Retrying request with new token')
                    // Создаем новый конфиг, чтобы не мутировать оригинальный
                    const config = {
                        ...error.config,
                        headers: {
                            ...error.config.headers,
                            Authorization: 'Bearer ' + token
                        }
                    }
                    // Используем axiosInstance вместо axios для применения всех перехватчиков
                    resolve(axiosInstance(config))
                } else {
                    console.log('[401 Error] Token refresh failed, rejecting request')
                    reject(error)
                }
            })
        })
    }

    // Обрабатываем серверные ошибки (500+)
    if (error.response?.status >= 500) {
        console.error('Server error:', error.response.status);
        console.error('Request URL:', error.config?.url);
        // Серверные ошибки не должны вызывать редирект или очистку токенов
        // Просто возвращаем ошибку
        return Promise.reject(error);
    }
    
    // Для всех остальных ошибок (404, 422, etc.) просто возвращаем
    // Не перенаправляем на авторизацию и не очищаем токены
    return Promise.reject(error);
})

export { axiosInstance };