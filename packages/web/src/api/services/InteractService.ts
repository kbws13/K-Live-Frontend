import request from "../core/request";
import { Interact } from "../core/Url";
import type { ActionDoRequest } from "../models/request/Action/ActionDoRequest";
import type {Page} from "@/common/Page";
import type {Action} from "@/api/models/response/Action/Action";

export class InteractService {
    /**
     * 执行行为
     * @param actionDoRequest
     */
    public static async doAction(actionDoRequest: ActionDoRequest): Promise<void> {
        return await request({
            url: Interact.doAction,
            method: 'POST',
            body: actionDoRequest,
            dataType: 'json'
        });
    }

    /**
     * 获取收藏视频
     * @param userId
     * @param pageNo
     * @param pageSize
     */
    public static async loadUserCollection(userId: string, pageNo: number, pageSize: number = 20): Promise<Page<Action>> {
        return await request<Page<Action>>({
            url: Interact.loadUserCollection,
            method: "GET",
            body: {
                userId: userId,
                pageNo: pageNo,
                pageSize: pageSize,
            },
            dataType: "url",
        })
    }
}