import type {MessageExtendDTO} from "@/api/models/response/Message/MessageExtendDTO";

export type Message = {
    id: number,
    userId: string,
    videoId: string,
    type: number,
    sendUserId: string,
    readType: number,
    createTime: Date,
    extendJson: string,
    sendUserAvatar: string,
    sendUserName: string,
    videoName: string,
    videoCover: string,
    messageExtendDTO: MessageExtendDTO
}