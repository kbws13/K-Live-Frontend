import type { PageRequest } from "@/common/PageRequest";

export type VideoCommentQuery = {
    videoId: string,
    videoNameFuzzy: string,
    userId: string,
    parentCommandId: number,
    topType: number,
    loadChildren: boolean,
    queryVideoInfo: boolean,
} & PageRequest