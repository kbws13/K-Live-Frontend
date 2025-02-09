import request from "../core/request";
import {Web} from "../core/Url";
import type {VideoPostAddRequest} from "../models/request/CreateCenter/VideoPostAddRequest";
import type {VideoPostEditVO} from "../models/response/Video/VideoPostEditVO";
import type {Video} from "@/api/models/response/Video/Video";
import type {VideoStatusCountVO} from "@/api/models/response/CreateCenter/VideoStatusCountVO";

export class CreateCenterService {

    public static async loadAllVideo(): Promise<Video[]> {
        return await request<Video[]>({
            url: Web.loadAllVideo,
            method: "GET",
            body: null,
            dataType: "url",
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
}