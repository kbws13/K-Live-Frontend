import request from "../core/request";
import { Interact } from "../core/Url";
import type { DanmuLoadRequest } from "../models/request/Danmu/DanmuLoadRequest";
import type { DanmuPostRequest } from "../models/request/Danmu/DanmuPostRequest";
import type { Danmu } from "../models/response/Danmu/Danmu";
import type {DanmuQuery} from "@/api/models/request/Danmu/DanmuQuery";
import type {Page} from "@/common/Page";

export class DanmuService {
  public static async postDanmu(danmuPostRequest: DanmuPostRequest): Promise<boolean> {
    return request<boolean>({
      url: Interact.postDanmu,
      method: 'POST',
      body: danmuPostRequest,
      dataType: 'json'
    })
  }

  /**
   * 加载视频弹幕
   * @param danmuLoadRequest
   */
  public static async loadDanmu(danmuLoadRequest: DanmuLoadRequest): Promise<Danmu[]> {
    return request<Danmu[]>({
      url: Interact.loadDanmu,
      method: 'POST',
      body: danmuLoadRequest,
      dataType: 'json'
    })
  }

  /**
   * 加载所有弹幕
   * @param danmuQuery
   */
  public static async loadAllDanmu(danmuQuery: DanmuQuery): Promise<Page<Danmu>> {
    return request<Page<Danmu>>({
      url: Interact.loadAllDanmu,
      method: 'POST',
      body: danmuQuery,
      dataType: 'json'
    })
  }

  /**
   * 删除弹幕
   * @param danmuId 弹幕 id
   */
  public static async deleteDanmu(danmuId: number): Promise<boolean> {
    return request<boolean>({
      url: Interact.deleteDanmu,
      method: "POST",
      body: {
        "danmuId": danmuId,
      },
      dataType: "url",
    })
  }
}