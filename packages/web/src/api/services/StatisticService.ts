import request from "../core/request";
import { Web } from "../core/Url";
import type { StatisticInfo } from "../models/response/StatisticInfo/StatisticInfo";

export class StatisticService {
    public static async getActualTime(): Promise<Map<string, Object>> {
        return await request<Map<string, Object>>({
            url: Web.getActualTime,
            method: 'GET',
            body: null,
            dataType: 'json'
        });
    }

    public static async getWeek(dataType: number): Promise<StatisticInfo[]> {
        return await request<StatisticInfo[]>({
            url: Web.getWeek,
            method: 'GET',
            body: {
                dataType: dataType
            },
            dataType: 'url'
        });
    }
}