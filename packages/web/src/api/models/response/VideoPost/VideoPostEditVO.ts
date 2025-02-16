import type { VideoFilePost } from "../VideoFile/VideoFilePost"
import type { VideoPost } from "./VideoPost"

export type VideoPostEditVO = {
    videoPost: VideoPost,
    videoFilePostList: VideoFilePost[],
}