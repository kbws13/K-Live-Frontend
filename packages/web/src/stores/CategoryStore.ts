import type { Category } from "@/api/models/response/Category/Category";
import { defineStore } from "pinia";

const useCategoryStore = defineStore("categoryStore", {
    state: () => {
        return {
            categoryMap: {} as { [key: string]: Category },
            categoryList: [] as Category[],
            currentCategory: {} as Category,
        }
    },
    actions: {
        saveCategoryMap(data: { [key: string]: Category }) {
            this.categoryMap = data;
        },
        saveCategoryList(data: Category[]) {
            this.categoryList = data;
        },
        setCurrentCategory(data: Category) {
            this.currentCategory = data;
        }
    }
})

export {
    useCategoryStore,
}