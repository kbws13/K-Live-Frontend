import type {PageRequest} from "@/common/PageRequest";

export type HomeLoadVideoRequest = {
    userId?: string,
    type?: number,
    videoName?: string,
    orderType?: number
} & PageRequest