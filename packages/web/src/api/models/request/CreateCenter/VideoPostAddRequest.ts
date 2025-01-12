import type { VideoFilePost } from "../../response/VideoFile/VideoFilePost"

export type VideoPostAddRequest = {
    cover: string,
    name: string,
    parentCategoryId: number,
    categoryId: number,
    postType: number,
    tags: string,
    introduction: string,
    interaction: string,
    videoFilePosts: VideoFilePost[],
}