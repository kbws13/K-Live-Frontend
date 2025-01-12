import request from "../core/request";
import { Interact } from "../core/Url";
import type { ActionDoRequest } from "../models/request/Action/ActionDoRequest";

export class InteractService {
    public static async doAction(actionDoRequest: ActionDoRequest): Promise<void> {
        return await request({
            url: Interact.doAction,
            method: 'POST',
            body: actionDoRequest,
            dataType: 'json'
        });
    }
}