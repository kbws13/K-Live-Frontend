import type {VideoPostQueryRequest} from "@/api/models/request/VideoPost/VideoPostQueryRequest";
import type {Page} from "@/common/Page";
import type {VideoPostVO} from "@/api/models/response/VideoPost/VideoPostVO";
import request from "@/api/core/request";
import {Admin} from "@/api/core/Url";
import type {VideoPostAuditRequest} from "@/api/models/request/VideoPost/VideoPostAuditRequest";
import type {VideoFilePost} from "@/api/models/response/VideoFilePost/VideoFilePost";

export class VideoService {
    /**
     * 查询稿件接口
     * @param videoPostQueryRequest
     */
    public static async loadVideoPost(videoPostQueryRequest: VideoPostQueryRequest): Promise<Page<VideoPostVO>> {
        return await request<Page<VideoPostVO>>({
            url: Admin.loadVideoPost,
            method: "POST",
            body: videoPostQueryRequest,
            dataType: "json",
        })
    }

    /**
     * 视频审核接口
     * @param videoPostAuditRequest
     */
    public static async auditVideoPost(videoPostAuditRequest: VideoPostAuditRequest): Promise<void> {
        return await request<void>({
            url: Admin.auditVideoPost,
            method: "POST",
            body: videoPostAuditRequest,
            dataType: "json",
        })
    }

    /**
     * 设置推荐视频接口
     * @param videoId
     */
    public static async recommendVideo(videoId: string): Promise<boolean> {
        return await request<boolean>({
            url: Admin.recommendVideo,
            method: "POST",
            body: {
                videoId: videoId,
            },
            dataType: "form",
        })
    }

    /**
     * 删除视频接口
     * @param videoId
     */
    public static async deleteVideo(videoId: string): Promise<boolean> {
        return await request<boolean>({
            url: Admin.deleteVideo,
            method: "POST",
            body: {
                videoId: videoId,
            },
            dataType: "form",
        })
    }

    /**
     * 查询视频分 p 接口
     * @param videoId
     */
    public static async loadVideoPList(videoId: string): Promise<VideoFilePost[]> {
        return await request<VideoFilePost[]>({
            url: Admin.loadVideoPList,
            method: "POST",
            body: {
                videoId: videoId,
            },
            dataType: "form",
        })
    }
}