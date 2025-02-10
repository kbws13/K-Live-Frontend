import type {CheckCodeVO} from "@/api/models/response/User/CheckCodeVO";
import request from "@/api/core/request";
import {Web} from "@/api/core/Url";
import type {UserVO} from "@/api/models/response/User/UserVO";
import type {UserLoginRequest} from "@/api/models/request/User/UserLoginRequest";

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
}