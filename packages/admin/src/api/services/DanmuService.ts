import request from "../core/request";
import { Interact } from "../core/Url";
import type { DanmuLoadRequest } from "../models/request/Danmu/DanmuLoadRequest";
import type { DanmuPostRequest } from "../models/request/Danmu/DanmuPostRequest";
import type { Danmu } from "../models/response/Danmu/Danmu";

export class DanmuService {
    public static async postDanmu(danmuPostRequest: DanmuPostRequest): Promise<void> {
        return request<void>({
            url: Interact.postDanmu,
            method: 'POST',
            body: danmuPostRequest,
            dataType: 'json'
        })
    }

    public static async loadDanmu(danmuLoadRequest: DanmuLoadRequest): Promise<Danmu[]> {
        return request<Danmu[]>({
            url: Interact.loadDanmu,
            method: 'POST',
            body: danmuLoadRequest,
            dataType: 'json'
        })
    }
}