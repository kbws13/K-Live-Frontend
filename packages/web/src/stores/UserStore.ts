import type { UserVO } from "@/api/models/response/User/UserVO";
import { defineStore } from "pinia";

const userLoginStore = defineStore('loginState', {
    state: () => {
        return {
            showLogin: false,
            userInfo: {

            } as UserVO,
            messageNoReadCount: 0,
            deviceId: '',
        }
    },
    actions: {
        setLogin(show: boolean) {
            this.showLogin = show
        },
        saveUserInfo(userInfo: UserVO) {
            this.userInfo = userInfo;
        },
        saveMessageNoReadCount(count: number) {
            this.messageNoReadCount = count;
        },
        readMessageCount(count: number) {
            this.messageNoReadCount -= count;
        },
        saveDeviceId(deviceId: string) {
            this.deviceId = deviceId;
        }
    }
})

export {
    userLoginStore
}