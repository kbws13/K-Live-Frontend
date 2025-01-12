import type { SystemSetting } from '@/api/models/response/SystemSetting/SystemSetting';
import { defineStore } from 'pinia'

const useSystemSettingStore = defineStore("systemSetting", {
    state: () => {
        return {
            sysSetting: {} as SystemSetting,
        }
    },
    actions: {

        saveSetting(data: SystemSetting) {
            this.sysSetting = data;
        }

    }
})
export {
    useSystemSettingStore
};
