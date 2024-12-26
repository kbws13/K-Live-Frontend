import {defineStore} from "pinia";
import {ref} from "vue";

export const useMenuStore = defineStore('menu', () => {
    // 左边栏菜单默认宽度
    const menuWidth = ref<string>("250px")

    // 展开或伸缩左边栏菜单
    function handleMenuWidth() {
        menuWidth.value = menuWidth.value == '250px' ? '64px' : '250px'
    }

    return { menuWidth, handleMenuWidth }
})