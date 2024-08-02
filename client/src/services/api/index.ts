import { useAppDispatch, useAppSelector } from '../../app/hook';
import axios from 'axios';
import config from '../../config';
import { logout, setToken, useUser } from '../../features/auth/authSlice';
import { useEffect } from 'react';

const publicAxios = axios.create({
    baseURL: `${config.baseURL}/api/v1` || 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true,
});

const privateAxios = axios.create({
    baseURL: config.baseURL
        ? `${config.baseURL}/api/v1`
        : 'http://localhost:3000/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
});

function usePrivateAxios() {
    const userData = useAppSelector(useUser);
    const dispatch = useAppDispatch();

    const accessToken = userData?.accessToken;

    useEffect(() => {
        const requestInterceptor = privateAxios.interceptors.request.use(
            (config) => {
                if (!config.headers.Authorization && accessToken) {
                    config.headers.Authorization = `Bearer ${accessToken}`;
                }
                return config;
            },
            (error) => {
                console.error('Request Interceptor Error:', error);
                return Promise.reject(error);
            }
        );

        const responseInterceptor = privateAxios.interceptors.response.use(
            (response) => response,
            async (error) => {
                const originalRequest = error?.config;
                if (error?.response?.status === 403 && !originalRequest?.sent) {
                    originalRequest.sent = true;

                    try {
                        console.log('refresh request');

                        const { data } = await publicAxios.get('/user/refresh');
                        if (data?.data?.accessToken) {
                            console.log("Prev token =>", userData?.accessToken);
                            
                            dispatch(setToken(data?.data?.accessToken));
                            
                            console.log("new token =>", data?.data?.accessToken);
                            originalRequest.headers.Authorization = `Bearer ${data?.data?.accessToken}`;
                        }
                        return privateAxios(originalRequest);
                    } catch (e) {
                        if (e instanceof Error) {
                            dispatch(logout());
                            console.error('Respnse Interceptor Error:', e);
                            return Promise.reject(e);
                        }
                    }
                }
                return Promise.reject(error);
            }
        );

        return () => {
            privateAxios.interceptors.request.eject(requestInterceptor);
            privateAxios.interceptors.response.eject(responseInterceptor);
        };
    }, [accessToken]);
    return privateAxios;
}

export default publicAxios;
export { usePrivateAxios, privateAxios };
