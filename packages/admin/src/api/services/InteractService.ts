import type {CommentLoadRequest} from "@/api/models/request/VideoComment/CommentLoadRequest";
import type {Page} from "@/common/Page";
import type {VideoComment} from "@/api/models/response/VideoComment/VideoComment";
import request from "@/api/core/request";
import {Admin} from "@/api/core/Url";
import type {DanmuLoadRequest} from "@/api/models/request/Danmu/DanmuLoadRequest";
import type {Danmu} from "@/api/models/response/Danmu/Danmu";

export class InteractService {
    public static async loadComment(commentLoadRequest: CommentLoadRequest): Promise<Page<VideoComment>> {
        return await request<Page<VideoComment>>({
            url: Admin.loadComment,
            method: "POST",
            body: commentLoadRequest,
            dataType: "json",
        })
    }

    public static async deleteComment(commentId: number): Promise<boolean> {
        return await request<boolean>({
            url: Admin.deleteComment,
            method: "POST",
            body: {
                "commentId": commentId,
            },
            dataType: "form"
        })
    }

    public static async loadDanmu(danmuLoadRequest: DanmuLoadRequest): Promise<Page<Danmu>> {
        return await request<Page<Danmu>>({
            url: Admin.loadDanmu,
            method: "POST",
            body: danmuLoadRequest,
            dataType: "json"
        })
    }

    public static async deleteDanmu(danmuId: number): Promise<void> {
        return await request<void>({
            url: Admin.deleteDanmu,
            method: "POST",
            body: {
                "danmuId": danmuId,
            },
            dataType: "form"
        })
    }
}