import request from "../core/request";
import { Web } from "../core/Url";

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
}