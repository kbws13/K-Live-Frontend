import request from "../core/request";
import { Web } from "../core/Url";
import type { VideoReportRequest } from "../models/request/Video/VideoReportRequest";
import type { Video } from "../models/response/Video/Video";
import type { VideoFile } from "../models/response/Video/VideoFile";
import type { VideoInfoResultVO } from "../models/response/Video/VideoInfoResultVO";

export class VideoService {
    /**
     * 获取视频信息
     * @param videoId 视频id
     * @returns Video
     */
    public static async getVideoInfo(videoId: string): Promise<VideoInfoResultVO> {
        return await request<VideoInfoResultVO>({
            url: Web.getVideoInfo,
            method: "GET",
            body: {
                videoId: videoId
            },
            dataType: "url"
        })
    }
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

    /**
     * 上报在线观看人数
     * @param videoReportRequest 上报视频观看请求
     * @returns number
     */
    public static async reportVideoPlayOnline(videoReportRequest: VideoReportRequest): Promise<number> {
        return await request<number>({
            url: Web.reportVideoPlayOnline,
            method: "POST",
            body: videoReportRequest,
            dataType: "json"
        })
    }

    public static async loadVideoPList(videoId: string): Promise<VideoFile[]> {
        return await request<VideoFile[]>({
            url: Web.loadVideoPList,
            method: "GET",
            body: {
                videoId: videoId
            },
            dataType: "url"
        })
    }
}