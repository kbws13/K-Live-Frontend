import type {PageRequest} from "@/common/PageRequest";

export type CommentLoadRequest = {
    videoId: string,
    videoName?: string,
    orderType?: number,
    loadChildren?: boolean,
} & PageRequest