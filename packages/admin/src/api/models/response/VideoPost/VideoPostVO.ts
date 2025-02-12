import type {VideoPost} from "@/api/models/response/VideoPost/VideoPost";

export type VideoPostVO = {
    playCount: number,
    likeCount: number,
    danmuCount: number,
    commentCount: number,
    coinCount: number,
    collectCount: number,
    recommendType: number,
    nickName: string,
    avatar: string,
    statusName: string,
} & VideoPost