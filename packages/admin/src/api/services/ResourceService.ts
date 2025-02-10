import request from "../core/request";
import { Resource } from "../core/Url";

export class ResourceService {
    public static async uploadImage(file: File, createThumbnail: boolean): Promise<string> {
        return await request<string>({
            url: Resource.uploadImage,
            method: 'POST',
            body: {
                file,
                createThumbnail
            },
            dataType: 'form'
        })
    }
}