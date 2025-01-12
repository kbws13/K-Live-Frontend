import request from "../core/request";
import { Web } from "../core/Url";
import type { VideoPostAddRequest } from "../models/request/CreateCenter/VideoPostAddRequest";
import type { VideoPostEditVO } from "../models/response/Video/VideoPostEditVO";

export class CreateCenterService {
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
}