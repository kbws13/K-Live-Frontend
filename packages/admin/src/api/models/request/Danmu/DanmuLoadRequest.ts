import type {PageRequest} from "@/common/PageRequest";

export type DanmuLoadRequest = {
    videoId?: string,
    fileId?: string,
    queryVideoInfo?: boolean,
    videoNameFuzzy?: string
} & PageRequest