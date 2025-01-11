import request from "../core/request";
import { Web } from "../core/Url";
import type { UserLoginRequest } from "../models/request/User/UserLoginRequest";
import type { CheckCodeVO } from "../models/response/User/CheckCodeVO";
import type { UserVO } from "../models/response/User/UserVO";

export class UserService {

    /**
     * 获取验证码
     * @returns CheckCodeVO
     */
    public static async checkCode(): Promise<CheckCodeVO> {
        return await request<CheckCodeVO>({
            url: Web.checkCode,
            method: 'GET',
            body: null,
            dataType: 'json'
        });
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

    /**
     * 退出登录
     * @returns void
     */
    public static async logout(): Promise<void> {
        return await request<void>({
            url: Web.logout,
            method: 'GET',
            body: null,
            dataType: 'json'
        })
    }

    /**
     * 自动登录
     * @returns UserVO
     */
    public static async autoLogin(): Promise<UserVO> {
        return await request<UserVO>({
            url: Web.autoLogin,
            method: 'GET',
            body: null,
            dataType: 'json'
        })
    }

    /**
     * 获取用户信息
     * @param userId 用户 id
     * @returns UserVO
     */
    public static async getUserInfo(userId?: string): Promise<UserVO> {
        return await request<UserVO>({
            url: Web.getUserInfo,
            method: 'GET',
            body: {
                userId: userId,
            },
            dataType: 'url',
        })
    }
}