import request from "@/api/core/request";
import {Admin} from "@/api/core/Url";
import type {StatisticInfo} from "@/api/models/response/Statistic/StatisticInfo";

export class StatisticService {
    /**
     * 获取昨天统计数据
     */
    public static async getActualTime(): Promise<Record<string, any>> {
        return await request<Record<string, any>>({
            url: Admin.getActualTime,
            method: "GET",
            body: null,
            dataType: "url",
        })
    }

    /**
     * 获取本周数据
     * @param dateType
     */
    public static async getWeek(dateType: number): Promise<StatisticInfo[]> {
        return await request<StatisticInfo[]>({
            url: Admin.getWeek,
            method: "GET",
            body: {
                "dateType": dateType,
            },
            dataType: "url",
        })
    }
}