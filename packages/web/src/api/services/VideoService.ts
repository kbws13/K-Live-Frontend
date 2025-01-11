import request from "../core/request";
import { Web } from "../core/Url";
import type { Video } from "../models/response/Video/Video";

export class VideoService {
    /**
     * 获取推荐视频
     * @returns Video[]
     */
    public static async getRecommendVideo(keyword?: string, videoId?: string): Promise<Video[]> {
        return await request<Video[]>({
            url: Web.getRecommendVideo,
            method: "GET",
            body: {
                keyword: keyword ?? '',
                videoId: videoId ?? '',
            },
            dataType: "url"
        })
    }
}