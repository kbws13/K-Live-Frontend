import type {SystemSetting} from "@/api/models/response/Setting/SystemSetting";
import request from "@/api/core/request";
import {Admin} from "@/api/core/Url";

export class SystemService {
    public static async getSystemSetting(): Promise<SystemSetting> {
        return await request<SystemSetting>({
            url: Admin.getSystemSetting,
            method: "GET",
            body: null,
            dataType: "url",
        })
    }

    public static async saveSystemSetting(systemSetting: SystemSetting): Promise<void> {
        return await request<void>({
            url: Admin.saveSystemSetting,
            method: "POST",
            body: systemSetting,
            dataType: "json",
        })
    }
}