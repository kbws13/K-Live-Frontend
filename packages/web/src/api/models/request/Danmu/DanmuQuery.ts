import type {PageRequest} from "@/common/PageRequest";

export type DanmuQuery = {
    videoId: string,
    userId?: string,
    queryVideoInfo?: boolean,
    videoNameFuzzy?: string,
} & PageRequest;