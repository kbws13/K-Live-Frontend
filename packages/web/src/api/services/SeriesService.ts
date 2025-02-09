import type {Series} from "@/api/models/response/Series/Series";
import request from "@/api/core/request";
import {Web} from "@/api/core/Url";
import type {SeriesAddRequest} from "@/api/models/request/Series/SeriesAddRequest";
import type {SeriesUpdateRequest} from "@/api/models/request/Series/SeriesUpdateRequest";
import type {Video} from "@/api/models/response/Video/Video";
import type {SeriesDetailVO} from "@/api/models/response/Series/SeriesDetailVO";

export class SeriesService {
    /**
     * 获取用户所有视频合集
     * @param userId
     */
    public static async loadSeries(userId: string): Promise<Series[]> {
        return await request<Series[]>({
            url: Web.loadSeries,
            method: "GET",
            body: {
                userId: userId,
            },
            dataType: "url",
        })
    }

    /**
     * 查询主页集合视频
     * @param userId
     */
    public static async loadSeriesWithVideo(userId: string): Promise<Series[]> {
        return await request<Series[]>({
            url: Web.loadSeriesWithVideo,
            method: "GET",
            body: {
                userId: userId,
            },
            dataType: "url",
        })
    }

    /**
     * 添加视频合集
     * @param seriesAddRequest
     */
    public static async addSeries(seriesAddRequest: SeriesAddRequest): Promise<string> {
        return await request<string>({
            url: Web.addSeries,
            method: "POST",
            body: seriesAddRequest,
            dataType: "json"
        })
    }

    /**
     * 更改合集排序
     * @param seriesIds
     */
    public static async changeSeriesSort(seriesIds: string): Promise<string> {
        return await request<string>({
            url: Web.addSeries,
            method: "POST",
            body: {
                seriesIds: seriesIds
            },
            dataType: "url"
        })
    }

    /**
     * 删除视频合集
     * @param seriesId
     */
    public static async deleteSeries(seriesId: number): Promise<string> {
        return await request<string>({
            url: Web.deleteSeries,
            method: "POST",
            body: {
                seriesId: seriesId,
            },
            dataType: "form"
        })
    }

    /**
     * 更新视频合集
     * @param seriesUpdateRequest
     */
    public static async updateSeries(seriesUpdateRequest: SeriesUpdateRequest): Promise<string> {
        return await request<string>({
            url: Web.updateSeries,
            method: "POST",
            body: seriesUpdateRequest,
            dataType: "json",
        })
    }

    /**
     * 获取所有视频
     * @param seriesId
     */
    public static async loadAllVideo(seriesId: number): Promise<Video[]> {
        return await request<Video[]>({
            url: Web.loadAllVideoSeries,
            method: "GET",
            body: {
                seriesId: seriesId,
            },
            dataType: "url",
        })
    }

    /**
     * 获取合集详情
     * @param seriesId
     */
    public static async getSeriesDetail(seriesId: number): Promise<SeriesDetailVO> {
        return await request<SeriesDetailVO>({
            url: Web.getSeriesDetail,
            method: "GET",
            body: {
                seriesId: seriesId,
            },
            dataType: "url"
        })
    }

    /**
     * 合集添加视频
     * @param seriesId
     * @param videoId
     */
    public static async saveSeriesContent(seriesId: number, videoId: string): Promise<string> {
        return await request<string>({
            url: Web.saveSeriesContent,
            method: "POST",
            body: {
                seriesId: seriesId,
                videoId: videoId,
            },
            dataType: "form"
        })
    }

    /**
     * 删除合集中视频
     * @param seriesId
     * @param videoId
     */
    public static async deleteSeriesVideo(seriesId: number, videoId: string): Promise<string> {
        return await request<string>({
            url: Web.deleteSeriesVideo,
            method: "POST",
            body: {
                seriesId: seriesId,
                videoId: videoId,
            },
            dataType: "form"
        })
    }
}