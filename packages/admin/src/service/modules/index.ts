import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig } from 'axios';
import message from "@arco-design/web-vue/es/message";

class Service {
    instance: AxiosInstance

    // 创建 axios 实例
    constructor(config: AxiosRequestConfig) {
        this.instance = axios.create(config);

        // 请求拦截器
        this.instance.interceptors.request.use(
            config => {
                const token = localStorage.getItem("token");
                if (token) {
                    config.headers['token'] = token
                }
                return config
            }
        );

        // 响应拦截器
        this.instance.interceptors.response.use(
            res => {
                const { data } = res.data;
                return data;
            },
            error => {
                const { msg } = error
                message.error(msg);
            }
        )
    }

    // 创建网络请求的方法
    request<T = any>(config: AxiosRequestConfig) {
        return this.instance.request<T>(config)
    }

    get<T = any>(configOrUrl: string | AxiosRequestConfig) {
        if (typeof configOrUrl === 'string') {
            return this.request<T>({ url: configOrUrl, method: 'GET' })
        } else {
            return this.request<T>({ ...configOrUrl, method: 'GET' })
        }
    }

    post<T = any>(config: AxiosRequestConfig) {
        return this.request<T>({ ...config, method: 'POST' })
    }

    delete<T = any>(config: AxiosRequestConfig) {
        return this.request<T>({ ...config, method: 'delete' })
    }
}

export default Service;