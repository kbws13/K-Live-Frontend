import type {PageRequest} from "@/common/PageRequest";

export type UserLoadRequest = {
    nickName?: string,
    email?: string,
} & PageRequest