import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
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
    const isRefreshingUpdate = Cookies.get('refresher') || false;
    const refreshToken = Cookies.get('refreshToken')


    if (error.response.status === 401) {

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
                    .catch(() => {
                        requestsToRefresh.forEach((cb) => cb(null))
                    })
                    .finally(() => {
                        requestsToRefresh = []
                        Cookies.remove('refresher')
                    })
            }

        return new Promise((resolve, reject) => {
            requestsToRefresh.push((token) => {
                if (token) {
                    error.config.headers.Authorization = 'Bearer ' + token
                    resolve(axios(error.config))
                }

                reject(error)
            })
        })
    }

    return Promise.reject(error);
})