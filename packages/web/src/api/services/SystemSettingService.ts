import request from "../core/request";
import { Web } from "../core/Url";
import type { SystemSetting } from "../models/response/SystemSetting/SystemSetting";

export class SystemSettingService {
    public static async getSystemSetting(): Promise<SystemSetting> {
        return await request<SystemSetting>({
            url: Web.getSystemSetting,
            method: 'GET',
            body: null,
            dataType: 'url'
        })
    }
}