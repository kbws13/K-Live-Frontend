import type { ActionDoRequest } from './models/request/Action/ActionDoRequest';
import { InteractService } from './services/InteractService';
import { ResourceService } from './services/ResourceService';

export { UserService } from './services/UserService';

//上传封面
export const uploadImage = async (file: File, createThumbnail = false) => {
    let result = await ResourceService.uploadImage(file, createThumbnail);
    if (!result) {
        return;
    }
    return result;
}

export const doUserAction = async (actionDoRequest: ActionDoRequest, callback: Function) => {
    await InteractService.doAction(actionDoRequest);
    callback()
}