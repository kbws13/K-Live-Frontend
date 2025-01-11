import type { UserVO } from "@/api/models/response/User/UserVO";
import { defineStore } from "pinia";

const userLoginStore = defineStore('loginState', {
    state: () => {
        return {
            showLogin: false,
            userInfo: {

            } as UserVO,
        }
    },
    actions: {
        setLogin(show: boolean) {
            this.showLogin = show
        },
        saveUserInfo(userInfo: UserVO) {
            this.userInfo = userInfo;
        },
    }
})

export {
    userLoginStore
}