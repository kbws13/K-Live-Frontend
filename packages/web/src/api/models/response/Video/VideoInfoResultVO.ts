import type { Action } from "../Action/Action"
import type { Video } from "./Video"

export type VideoInfoResultVO = {
    video: Video,
    userActionList: Action[],
}