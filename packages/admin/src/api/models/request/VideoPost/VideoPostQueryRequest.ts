import type {PageRequest} from "@/common/PageRequest";

export type VideoPostQueryRequest = {
    categoryId?: number,
    parentCategoryId?: number,
    status?: number,
    videoName?: string,
    queryCount?: boolean,
    queryUserInfo?: boolean,
    excludeStatus?: number[],
} & PageRequest