export type VideoComment = {
    id: number,
    parentCommentId: number,
    videoId: string,
    videoUserId: string,
    content: string,
    imgPath: string,
    userId: string,
    replyUserId: string,
    topType: number,
    postTime: Date,
    likeCount: number,
    hateCount: number,
    avatar: string,
    nickName: string,
    replyAvatar: string,
    replyNickName: string,
    children: VideoComment[],
    cover: string,
    videoName: string,
    showReply?: boolean,
    likeCountActive?: boolean,
    hateCountActive?: boolean,
}