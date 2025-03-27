export type CommentAddRequest = {
    videoId: string,
    content: string,
    replyCommentId?: number,
    replyUserId?: string,
    imgPath?: string,
}