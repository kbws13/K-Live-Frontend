import type {Page} from "@/common/Page";
import type {VideoComment} from "@/api/models/response/VideoComment/VideoComment";
import type {Action} from "@/api/models/response/Action/Action";

export type VideoCommentResultVO = {
    page: Page<VideoComment>,
    actionList: Action[],
}