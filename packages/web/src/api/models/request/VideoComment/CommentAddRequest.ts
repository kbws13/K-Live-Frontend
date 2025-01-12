export type CommentAddRequest = {
    videoId: string,
    content: string,
    replyCommentId?: number,
    imgPath?: string,
}