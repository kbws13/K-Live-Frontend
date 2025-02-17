import type {PageRequest} from "@/common/PageRequest";

export type CommentLoadRequest = {
    videoId?: string,
    videoName?: string,
    orderType?: number,
} & PageRequest