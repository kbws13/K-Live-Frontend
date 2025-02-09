import type {Video} from "@/api/models/response/Video/Video";

export type Series = {
    id: number,
    name: string,
    description: string,
    userId: number,
    sort: number,
    updateTime: Date,
    cover: string,
    videoList: Video[],
}