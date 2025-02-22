import type { Page } from "@/common/Page";
import request from "../core/request";
import { Interact } from "../core/Url";
import type { CommentAddRequest } from "../models/request/VideoComment/CommentAddRequest";
import type { VideoComment } from "../models/response/VideoComment/VideoComment";
import type { VideoCommentQuery } from "../models/request/VideoComment/VideoCommentQuery";
import type {CommentLoadRequest} from "@/api/models/request/VideoComment/CommentLoadRequest";
import type {VideoCommentResultVO} from "@/api/models/response/VideoComment/VideoCommentResultVO";

export class CommentService {
    /**
     * 加载所有评论
     * @param videoCommentQuery 查询评论请求参数
     * @returns 评论数据（分页）
     */
    public static async loadAllComment(videoCommentQuery: VideoCommentQuery): Promise<Page<VideoComment>> {
        return await request<Page<VideoComment>>({
            url: Interact.loadAllComment,
            method: "POST",
            body: videoCommentQuery,
            dataType: 'json'
        })
    }

    /**
     * 加载评论
     * @param commentLoadRequest
     */
    public static async loadComment(commentLoadRequest: CommentLoadRequest): Promise<VideoCommentResultVO> {
        return await request<VideoCommentResultVO>({
            url: Interact.loadComment,
            method: "POST",
            body: commentLoadRequest,
            dataType: "json",
        })
    }

    public static async addComment(commentAddRequest: CommentAddRequest): Promise<VideoComment> {
        return await request<VideoComment>({
            url: Interact.addComment,
            method: "POST",
            body: commentAddRequest,
            dataType: 'json'
        })
    }
    public static async cancelTop(commentId: number): Promise<boolean> {
        return await request<boolean>({
            url: Interact.cancelTop,
            method: "POST",
            body: {
                commentId: commentId
            },
            dataType: 'form'
        })
    }
    public static async topComment(commentId: number): Promise<boolean> {
        return await request<boolean>({
            url: Interact.topComment,
            method: "POST",
            body: {
                commentId: commentId
            },
            dataType: 'form'
        })
    }
    public static async deleteComment(commentId: number): Promise<boolean> {
        return await request<boolean>({
            url: Interact.deleteComment,
            method: "POST",
            body: {
                commentId: commentId
            },
            dataType: 'form'
        })
    }
}