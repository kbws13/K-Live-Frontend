import Service from "@/service/modules";
import {BASE_URL, TIMEOUT} from "@/service/config";

const Api = new Service({
    baseURL: BASE_URL,
    withCredentials: true,
    timeout: TIMEOUT,
})

export default Api;