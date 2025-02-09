import type {PageRequest} from "@/common/PageRequest";

export type VideoQueryRequest = {
    parentCategoryId?: number,
    categoryId?: number,
    queryUserInfo?: boolean,
    recommendType?: number,
    lastPlayHour?: number,
} & PageRequest