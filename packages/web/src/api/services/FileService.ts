import request from "../core/request";
import { Resource } from "../core/Url";
import type { PreUploadVideoRequest } from "../models/request/File/PreUploadVideoRequest";

export class FileService {
    /**
     * 预上传视频
     * @param preUploadVideoRequest 预上传视频请求参数
     * @param errorCallback 错误回调函数
     * @returns 返回预上传视频的响应字符串
     */
    public static async preUploadVideo(preUploadVideoRequest: PreUploadVideoRequest, errorCallback: (error: any) => void): Promise<string> {
        try {
            const response = await request<string>({
                url: Resource.preUploadVideo,
                method: 'POST',
                body: preUploadVideoRequest,
                dataType: 'json'
            });
            return response;
        } catch (error) {
            errorCallback(error);
            return "";
        }
    }

    public static async uploadVideo(chunkFile: Blob, chunkIndex: number, uploadId: string,
        errorCallback: Function, uploadProgressCallback: Function): Promise<boolean> {
        try {
            const response = await request<boolean>({
                url: Resource.uploadVideo,
                method: 'POST',
                body: {
                    chunkFile,
                    chunkIndex,
                    uploadId
                },
                dataType: 'form',
                uploadProgressCallback: uploadProgressCallback,
            });
            return response;
        } catch (error) {
            errorCallback(error);
            return false;
        }
    }

    public static async delUploadVide(uploadId: string): Promise<string> {
        return await request<string>({
            url: Resource.delUploadVide,
            method: 'POST',
            body: {
                uploadId: uploadId
            },
            dataType: 'form'
        });
    }
}