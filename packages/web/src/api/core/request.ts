import { userLoginStore } from '@/stores/UserStore'
import Message from '@/utils/Message'
import axios from 'axios'
import VueCookies from 'vue-cookies'

const contentTypeForm = 'application/x-www-form-urlencoded;charset=UTF-8'
const contentTypeJson = 'application/json'
const instance = axios.create({
    withCredentials: true,
    baseURL: "/api",
    timeout: 10 * 1000,
});

type Api = {
    url: string,
    method: 'GET' | 'POST' | 'PUT' | 'DELETE',
    body: any,
    dataType: 'form' | 'json' | 'url',
    uploadProgressCallback?: Function,
}

//请求前拦截器
instance.interceptors.request.use(
    (config) => {
        return config;
    },
    () => {
        Message.error("请求发送失败");
        return Promise.reject("请求发送失败");
    }
);
//请求后拦截器
instance.interceptors.response.use(
    (response) => {
        const { responseType } = response.config;
        const responseData = response.data;
        if (responseType == "arraybuffer" || responseType == "blob") {
            return responseData;
        }
        // 正常请求
        if (responseData.code == 0) {
            return responseData.data;
        } else if (responseData.code == 40000) {
            Message.error("请求参数错误");
        } else if (responseData.code == 40100) {
            const loginState = userLoginStore();
            // 登录超时
            loginState.setLogin(true);
            return Promise.reject({ showError: false });
        }
        // TODO 其他错误码处理
        else {
            Message.error(responseData.message);
        }
        return Promise.reject({ showError: false });
    },
    function (error) {
        return Promise.reject(error);
    }
);

const request = <T>(config: Api): Promise<T> => {
    let contentType = contentTypeForm;
    let formData = new FormData();// 创建form对象
    for (let key in config.body) {
        formData.append(key, config.body[key] == undefined ? "" : config.body[key]);
    }
    if (config.dataType != null && config.dataType == 'json') {
        contentType = contentTypeJson;
    }
    // 如果是 GET 请求，将参数拼接到 URL 上
    if (config.method === 'GET' && config.body) {
        const queryString = new URLSearchParams(config.body).toString();
        config.url = `${config.url}?${queryString}`;
    }
    // @ts-ignore
    const token = VueCookies.get('token')
    
    let headers = {
        'Content-Type': contentType,
        'X-Requested-With': 'XMLHttpRequest',
        "token": token
    }
    return instance.request({
        headers: headers,
        url: config.url,
        method: config.method,
        data: config.method === 'GET' ? undefined : (config.dataType == 'json' ? config.body : formData),
        // withCredentials: true,
        onUploadProgress: (event) => {
            if(config.uploadProgressCallback) {
                config.uploadProgressCallback(event);
            }
        },
    });
};

export default request;
