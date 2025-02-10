import {ResourceService} from "@/api/services/ResourceService";

//上传封面
export const uploadImage = async (file: File, createThumbnail = false) => {
    let result = await ResourceService.uploadImage(file, createThumbnail);
    if (!result) {
        return;
    }
    return result;
}