import request from "@/api/core/request";
import type {Page} from "@/common/Page";
import type {VideoPlayHistory} from "@/api/models/response/VideoPlayHistory/VideoPlayHistory";
import {Web} from "@/api/core/Url";
import type {VideoHistoryQueryRequest} from "@/api/models/request/VideoPlayHistory/VideoHistoryQueryRequest";

export class VideoPlayHistoryService {
    /**
     * 加载用户观看历史记录
     * @param videoHistoryQueryRequest
     */
    public static async loadHistory(videoHistoryQueryRequest: VideoHistoryQueryRequest): Promise<Page<VideoPlayHistory>> {
        return await request<Page<VideoPlayHistory>>({
            url: Web.loadHistory,
            method: "POST",
            body: videoHistoryQueryRequest,
            dataType: "json",
        })
    }

    /**
     * 清空历史记录
     */
    public static async cleanHistory(): Promise<boolean> {
        return await request<boolean>({
            url: Web.cleanHistory,
            method: "GET",
            body: null,
            dataType: "json"
        })
    }

    /**
     * 删除单条历史记录
     * @param videoId 视频 id
     */
    public static async deleteHistory(videoId: string): Promise<boolean> {
        return await request<boolean>({
            url: Web.deleteHistory,
            method: "POST",
            body: {
                videoId: videoId,
            },
            dataType: "form",
        })
    }
}