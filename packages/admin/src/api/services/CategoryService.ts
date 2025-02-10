import type {CategoryQueryRequest} from "@/api/models/request/Category/CategoryQueryRequest";
import request from "@/api/core/request";
import {Admin} from "@/api/core/Url";
import type {CategoryAddRequest} from "@/api/models/request/Category/CategoryAddRequest";
import type {CategoryUpdateRequest} from "@/api/models/request/Category/CategoryUpdateRequest";
import type {DeleteRequest} from "@/common/DeleteRequest";
import type {CategoryChangeSortRequest} from "@/api/models/request/Category/CategoryChangeSortRequest";

export class CategoryService {
    /**
     * 查询分类
     * @param categoryQueryRequest
     */
    public static async queryCategory(categoryQueryRequest: CategoryQueryRequest) {
        return await request({
            url: Admin.queryCategory,
            method: "POST",
            body: categoryQueryRequest,
            dataType: "json"
        })
    }

    /**
     * 添加分类
     * @param categoryAddRequest
     */
    public static async addCategory(categoryAddRequest: CategoryAddRequest): Promise<boolean> {
        return await request<boolean>({
            url: Admin.addCategory,
            method: "POST",
            body: categoryAddRequest,
            dataType: "json"
        })
    }

    public static async updateCategory(categoryUpdateRequest: CategoryUpdateRequest): Promise<boolean> {
        return await request<boolean>({
            url: Admin.updateCategory,
            method: "POST",
            body: categoryUpdateRequest,
            dataType: "json"
        })
    }

    public static async deleteCategory(deleteRequest: DeleteRequest): Promise<boolean> {
        return await request<boolean>({
            url: Admin.deleteCategory,
            method: "POST",
            body: deleteRequest,
            dataType: "json"
        })
    }

    public static async changeSortCategory(categoryChangeSortRequest: CategoryChangeSortRequest): Promise<boolean> {
        return await request<boolean>({
            url: Admin.changeSortCategory,
            method: "POST",
            body: categoryChangeSortRequest,
            dataType: "json"
        })
    }
}