import {defineStore} from "pinia";
import VueCookies from "vue-cookies";

const useSearchHistoryStore = defineStore("searchHistoryState", {
    state: () => {
        return {
            searchHistory: [] as string[],
        }
    },
    actions: {
        initHistory() {
            // @ts-ignore
            this.searchHistory = VueCookies.get('searchHistory') || [];
        },
        addHistory(data: string) {
            if (this.searchHistory.includes(data)) {
                return;
            }
            if (this.searchHistory.length >= 10) {
                this.searchHistory.pop();
            }
            this.searchHistory.unshift(data);
            // @ts-ignore
            VueCookies.set('searchHistory', this.searchHistory);
        },
        delHistory(data: string) {
            this.searchHistory = this.searchHistory.filter(item => {
                return item != data;
            })
            // @ts-ignore
            VueCookies.set('searchHistory', this.searchHistory);
        },
        cleanHistory() {
            this.searchHistory = []
            // @ts-ignore
            VueCookies.set('searchHistory', []);
        },
    }
})

export {
    useSearchHistoryStore
};