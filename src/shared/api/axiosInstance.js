import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_URL}`,
    headers: {
        "Content-Type": "application/json",
        "Cache-Control": "no-cache, no-store, must-revalidate",
        "Pragma": "no-cache",
        "Expires": "0"
    },
    timeout: 30000, // 30 секунд
});

axiosInstance.interceptors.request.use(function (config) {
    const token = Cookies.get('accessToken')
    config.headers.Authorization = `Bearer ${token}`
    
    // Добавляем timestamp для предотвращения кеширования
    if (config.params) {
        config.params._t = Date.now()
    } else {
        config.params = { _t: Date.now() }
    }
    
    console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`)
    
    return config;
}, function (error) {
    return Promise.reject(error);
});

let requestsToRefresh = []

axiosInstance.interceptors.response.use(function (response) {
    console.log(`[API Response] ${response.config.method?.toUpperCase()} ${response.config.url} - ${response.status}`)
    return response;
}, function (error) {
    console.error(`[API Error] ${error.response?.status} - ${error.message}`)
    console.error('Error details:', error.response?.data)
    console.error('Error config:', error.config?.url)
    
    // Исключаем эндпоинт refresh, login и broadcast из обработки 401, чтобы избежать рекурсии
    const isRefreshEndpoint = error.config?.url?.includes('/auth/refresh')
    const isLoginEndpoint = error.config?.url?.includes('/auth/login')
    const isBroadcastEndpoint = error.config?.url?.includes('/broadcast')
    
    // Проверяем статус код ошибки
    if (error.response?.status === 401 && !isRefreshEndpoint && !isLoginEndpoint && !isBroadcastEndpoint) {
        const isRefreshingUpdate = Cookies.get('refresher') || false;
        const refreshToken = Cookies.get('refreshToken')
        
        // Если нет refresh токена - перенаправляем на авторизацию
        if (!refreshToken) {
            console.log('No refresh token, redirecting to auth')
            Cookies.remove('accessToken')
            Cookies.remove('refreshToken')
            window.location.href = '/auth'
            return Promise.reject(error)
        }
        
        if (!isRefreshingUpdate) {
            Cookies.set('refresher', 'true')

            axios.post(`${import.meta.env.REACT_APP_URL}/auth/refresh`, {}, {
                headers: {
                    Authorization: `Bearer ${refreshToken}`
                }
            })
                .then((res) => {
                    Cookies.set('refreshToken', res.data.refresh_token)
                    Cookies.set('accessToken', res.data.access_token)
                    requestsToRefresh.forEach((cb) => cb(res.data.access_token))
                })
                .catch((refreshError) => {
                    console.error('Token refresh failed:', refreshError)
                    requestsToRefresh.forEach((cb) => cb(null))
                    
                    // Если refresh не удался - перенаправляем на авторизацию
                    Cookies.remove('accessToken')
                    Cookies.remove('refreshToken')
                    window.location.href = '/auth'
                })
                .finally(() => {
                    requestsToRefresh = []
                    Cookies.remove('refresher')
                })
        }

        return new Promise((resolve, reject) => {
            requestsToRefresh.push((token) => {
                if (token) {
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