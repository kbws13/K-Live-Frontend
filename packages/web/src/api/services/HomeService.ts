import request from "../core/request";
import { Web } from "../core/Url";
import type {UserUpdateRequest} from "@/api/models/request/User/UserUpdateRequest";
import type {HomeLoadVideoRequest} from "@/api/models/request/Home/HomeLoadVideoRequest";
import type {Page} from "@/common/Page";
import type {Video} from "@/api/models/response/Video/Video";
import type {FocusVO} from "@/api/models/response/Focus/FocusVO";

export class HomeService {
    /**
     * 关注用户
     * @param focusUserId 关注用户 id
     * @returns 是否成功
     */
    public static async focus(focusUserId: string): Promise<boolean> {
        return await request<boolean>({
            url: Web.focus,
            method: "POST",
            body: {
                focusUserId: focusUserId
            },
            dataType: "json"
        })
    }

    /**
     * 取消关注用户
     * @param focusUserId 关注用户 id
     * @returns 是否成功
     */
    public static async cancelFocus(focusUserId: string): Promise<boolean> {
        return await request<boolean>({
            url: Web.cancelFocus,
            method: "POST",
            body: {
                focusUserId: focusUserId
            },
            dataType: "json"
        })
    }

    /**
     * 更新个人信息
     * @param userUpdateRequest
     */
    public static async updateUserInfo(userUpdateRequest: UserUpdateRequest): Promise<boolean> {
        return await request<boolean>({
            url: Web.updateUserInfo,
            method: "POST",
            body: userUpdateRequest,
            dataType: "json"
        })
    }

    /**
     * 更新主题
     * @param theme
     */
    public static async updateTheme(theme: number): Promise<boolean> {
        return await request<boolean>({
            url: Web.updateTheme,
            method: "POST",
            body: {
                theme: theme,
            },
            dataType: "form"
        })
    }

    /**
     * 获取主页视频列表
     * @param homeLoadVideoRequest
     */
    public static async loadVideoList(homeLoadVideoRequest: HomeLoadVideoRequest): Promise<Page<Video>> {
        return await request<Page<Video>>({
            url: Web.loadVideoList,
            method: "POST",
            body: homeLoadVideoRequest,
            dataType: "json"
        })
    }

    /**
     * 加载关注列表
     * @param pageNo
     */
    public static async loadFocusList(pageNo: number): Promise<Page<FocusVO>> {
        return await request<Page<FocusVO>>({
            url: Web.loadFocusList,
            method: "GET",
            body: {
                pageNo: pageNo,
            },
            dataType: "url"
        })
    }

    /**
     * 加载粉丝列表
     * @param pageNo
     */
    public static async loadFansList(pageNo: number): Promise<Page<FocusVO>> {
        return await request<Page<FocusVO>>({
            url: Web.loadFansList,
            method: "GET",
            body: {
                pageNo: pageNo,
            },
            dataType: "url"
        })
    }
}