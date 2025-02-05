import axios from "axios";
import properties from "../property/config";
import { accessToken, refreshToken } from "../store";
import messageModule from "./swalConfig";
import { commonModule } from "./commonModule";
import { navigate } from "svelte-routing";

export const axiosInstance = axios.create({
    baseURL: properties.API_SERVER + '/api',
    timeout: 3000,
    headers: {'Content-Type': 'application/json'},
    withCredentials: true
});

axiosInstance.interceptors.request.use(async (config: any) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (err) => {
    return Promise.reject(err);
});

axiosInstance.interceptors.response.use(async (response: any) => {
    return response;
}, async (err) => {
    if (err?.response?.status === 401) {
        if (location.href.includes('/login')) {
            accessToken.set(null);
            refreshToken.set(null);
            messageModule.error(`<span class="font-bold">Login failed</span><br><span class="text-red-500 font-bold">[ Invalid username or password. ] (${err.response.status})<span>`);
        } else {
            const user: any = commonModule.decodeJwtToken(localStorage.getItem('refreshToken'));
            
            if (user) {
                try {
                    const res = await refreshAxiosInstance.post<Record<'access_token', string>>('/auth/refresh', user);
                    const access_token: string = res.data.access_token;
                    accessToken.set(access_token);
                    return axiosInstance(err.config);
                } catch (refreshError) {
                    navigate('/login');

                    messageModule.error('Refresh token is invalid or expired, please login again', () => {
                        accessToken.set(null);
                        refreshToken.set(null);
                    });
                }
            } else {
                navigate('/login');
                messageModule.alert('Please login first.', () => {
                    accessToken.set(null);
                    refreshToken.set(null);
                }, 'info');
            }
        }
    } else {
        messageModule.error(`<span class="text-red-500 font-bold">${err?.response?.data?.message || err?.message}</span>`);
    }
});




export const axiosMultipartInstance = axios.create({
    baseURL: properties.API_SERVER + '/api',
    timeout: 3000,
    headers: { 'Content-Type': 'multipart/form-data'},
    withCredentials: true
});


axiosMultipartInstance.interceptors.request.use(async (config: any) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (err) => {
    return Promise.reject(err);
});


axiosMultipartInstance.interceptors.response.use(async (response: any) => {
    return response;
}, async (err) => {
    if (err?.response?.status === 401) {
        const user: any = commonModule.decodeJwtToken(localStorage.getItem('refreshToken'));
        if (user) {
            try {
                const res = await refreshAxiosInstance.post<Record<'access_token', string>>('/auth/refresh', user);
                const access_token: string = res.data.access_token;
                accessToken.set(access_token);
                return axiosMultipartInstance(err.config);
            } catch (refreshError) {
                messageModule.error('Refresh token is invalid or expired, please login again', () => {
                    navigate('/login');
                });
            }
        } else {
            messageModule.alert('Please login first.', () => {
                navigate('/login');
            }, 'info');
        }
    } else {
        messageModule.error(`<span class="text-red-500 font-bold">${err?.response?.data?.message || err?.message}</span>`);
    }
});


const refreshAxiosInstance = axios.create({
    baseURL: properties.API_SERVER + '/api',
    timeout: 3000,
    headers: { 'Content-Type': 'application/json' },
    withCredentials: true
});

refreshAxiosInstance.interceptors.request.use((config: any) => {
    const token = localStorage.getItem('refreshToken');
    if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
}, (err) => {
    return Promise.reject(err);
})