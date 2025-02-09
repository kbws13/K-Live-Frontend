import request from "@/api/core/request";
import {Interact} from "@/api/core/Url";
import type {MessageCountVO} from "@/api/models/response/Message/MessageCountVO";
import type {MessageLoadRequest} from "@/api/models/request/Message/MessageLoadRequest";
import type {Page} from "@/common/Page";
import type {Message} from "@/api/models/response/Message/Message";
import type {DeleteRequest} from "@/common/DeleteRequest";

export class MessageService {
    /**
     * 查询未读消息数量
     */
    public static async getNoReadCount(): Promise<number> {
        return request<number>({
            url: Interact.getNoReadCount,
            method: "GET",
            body: null,
            dataType: "json"
        })
    }

    /**
     * 分组获取未读消息数量
     */
    public static async getNoReadCountByGroup(): Promise<MessageCountVO[]> {
        return request<MessageCountVO[]>({
            url: Interact.getNoReadCountByGroup,
            method: "GET",
            body: null,
            dataType: "url"
        })
    }

    /**
     * 一键已读
     * @param messageType
     */
    public static async readAll(messageType: number): Promise<string> {
        return request<string>({
            url: Interact.readAll,
            method: "POST",
            body: {
                messageType: messageType,
            },
            dataType: "form",
        })
    }

    /**
     * 获取指定类型的消息
     * @param messageLoadRequest
     */
    public static async loadMessage(messageLoadRequest: MessageLoadRequest): Promise<Page<Message>> {
        return request<Page<Message>>({
            url: Interact.loadMessage,
            method: "POST",
            body: messageLoadRequest,
            dataType: "json",
        })
    }

    /**
     * 删除消息
     * @param deleteRequest
     */
    public static async deleteMessage(deleteRequest: DeleteRequest): Promise<boolean> {
        return request<boolean>({
            url: Interact.deleteMessage,
            method: "POST",
            body: deleteRequest,
            dataType: "json"
        })
    }
}