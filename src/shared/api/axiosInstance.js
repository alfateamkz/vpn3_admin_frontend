import axios from "axios";
import Cookies from "js-cookie";

export const axiosInstance = axios.create({
    baseURL: `${process.env.REACT_APP_URL}`,
    headers: {
        "Content-Type": "application/json"
    },
});

axiosInstance.interceptors.request.use(function (config) {
    const token = Cookies.get('accessToken')
    config.headers.Authorization = `Bearer ${token}`

    return config;
}, function (error) {
    return Promise.reject(error);
});

let requestsToRefresh = []

axiosInstance.interceptors.response.use(function (response) {
    return response;
}, function (error) {
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