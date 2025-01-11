import { defineStore } from "pinia";

const useNavigatorStore = defineStore('navigatorStor', {
    state: () => {
        return {
            fixedHeader: true,//头部信息定位
            fixedCategory: true,//分类信息定位
            showHeader: true,//头部信息
            showCategory: true,//分类信息
            forceFixedHeader: false,//强制显示 固定头部信息
        }
    },
    actions: {
        setFixedHeader(fixedHeader: boolean) {
            this.fixedHeader = fixedHeader;
        },
        setFixedCategory(fixedCategory: boolean) {
            this.fixedCategory = fixedCategory;
        },
        setShowHeader(showHeader: boolean) {
            this.showHeader = showHeader;
        },
        setShowCategory(showCategory: boolean) {
            this.showCategory = showCategory;
        },
        setForceFixedHeader(forceFixedHeader: boolean) {
            this.forceFixedHeader = forceFixedHeader;
        }

    }
})

export {
    useNavigatorStore,
}