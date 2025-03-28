import request from "../core/request";
import {Web} from "../core/Url";
import type {VideoPostAddRequest} from "../models/request/CreateCenter/VideoPostAddRequest";
import type {Video} from "@/api/models/response/Video/Video";
import type {VideoStatusCountVO} from "@/api/models/response/CreateCenter/VideoStatusCountVO";
import type {VideoPostEditVO} from "@/api/models/response/VideoPost/VideoPostEditVO";
import type {VideoPostQueryRequest} from "@/api/models/request/VideoPost/VideoPostQueryRequest";
import type {Page} from "@/common/Page";
import type {VideoPostVO} from "@/api/models/response/VideoPost/VideoPostVO";

export class CreateCenterService {

    public static async loadAllVideo(): Promise<Video[]> {
        return await request<Video[]>({
            url: Web.loadAllVideo,
            method: "GET",
            body: null,
            dataType: "url",
        })
    }

    /**
     * 查询稿件接口
     * @param videoPostQueryRequest
     */
    public static async loadVideoPost(videoPostQueryRequest: VideoPostQueryRequest): Promise<Page<VideoPostVO>> {
        return await request<Page<VideoPostVO>>({
            url: Web.loadVideoPost,
            method: "POST",
            body: videoPostQueryRequest,
            dataType: "json",
        })
    }

    public static async addPostVideo(videoPostAddRequest: VideoPostAddRequest): Promise<void> {
        return await request<void>({
            url: Web.addPostVideo,
            method: 'POST',
            body: videoPostAddRequest,
            dataType: 'json'
        })
    }

    public static async getVideoInfoById(videoId: string): Promise<VideoPostEditVO> {
        return await request<VideoPostEditVO>({
            url: Web.getVideoInfoById,
            method: 'GET',
            body: {
                videoId: videoId
            },
            dataType: 'url'
        })
    }

    /**
     * 修改视频互动设置
     * @param videoId 视频 id
     * @param interaction 互动设置
     */
    public static async changeVideoInteraction(videoId: string, interaction: string): Promise<string> {
        return await request<string>({
            url: Web.changeVideoInteraction,
            method: 'POST',
            body: {
                videoId: videoId,
                interaction: interaction,
            },
            dataType: 'form'
        })
    }

    /**
     * 获取各个状态视频的数量
     */
    public static async getVideoStatusCount(): Promise<VideoStatusCountVO> {
        return await request<VideoStatusCountVO>({
            url: Web.getVideoStatusCount,
            method: "GET",
            body: null,
            dataType: "json",
        })
    }

    /**
     * 删除视频
     * @param videoId
     */
    public static async deleteVideo(videoId: string): Promise<void> {
        await request<void>({
            url: Web.deleteVideo,
            method: "POST",
            body: {
                "videoId": videoId,
            },
            dataType: "form",
        })
    }
}