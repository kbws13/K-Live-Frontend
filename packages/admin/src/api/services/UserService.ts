import type {CheckCodeVO} from "@/api/models/response/User/CheckCodeVO";
import request from "@/api/core/request";
import {Admin, Web} from "@/api/core/Url";
import type {UserVO} from "@/api/models/response/User/UserVO";
import type {UserLoginRequest} from "@/api/models/request/User/UserLoginRequest";
import type {UserLoadRequest} from "@/api/models/request/User/UserLoadRequest";
import type {Page} from "@/common/Page";
import type {User} from "@/api/models/response/User/User";
import type {UserChangeStatusRequest} from "@/api/models/request/User/UserChangeStatusRequest";

export class UserService {
    /**
     * 获取验证码
     * @returns CheckCodeVO
     */
    public static async checkCode(): Promise<CheckCodeVO> {
        return await request({
            url: Web.checkCode,
            method: 'GET',
            body: null,
            dataType: 'json'
        })
    }

    /**
     * 用户登录
     * @param userLoginRequest 登录请求参数
     * @returns UserVO
     */
    public static async login(userLoginRequest: UserLoginRequest): Promise<UserVO> {
        return await request<UserVO>({
            url: Web.login,
            method: 'POST',
            body: userLoginRequest,
            dataType: 'json'
        })
    }

    public static async loadUser(userLoadRequest: UserLoadRequest): Promise<Page<User>> {
        return await request<Page<User>>({
            url: Admin.loadUser,
            method: 'POST',
            body: userLoadRequest,
            dataType: 'json'
        })
    }

    public static async changeStatus(userChangeStatusRequest: UserChangeStatusRequest): Promise<boolean> {
        return await request<boolean>({
            url: Admin.changeStatus,
            method: 'POST',
            body: userChangeStatusRequest,
            dataType: 'json'
        });
    }
}