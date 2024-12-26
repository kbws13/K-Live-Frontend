import '@/assets/main.css'

import { createApp } from 'vue'
import App from './App.vue'
import router from "@/router";
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import {createPinia} from "pinia";
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

const app = createApp(App)

// 引入图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
const pinia = createPinia();
app.use(router)
    .use(ArcoVue)
    .use(pinia)
    .mount('#app')
