import type {PageRequest} from "@/common/PageRequest";

export type VideoHistoryQueryRequest = {
    queryVideoInfo: boolean
} & PageRequest