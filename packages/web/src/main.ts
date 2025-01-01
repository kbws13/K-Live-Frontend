import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import ArcoVue from '@arco-design/web-vue';
import 'element-plus/dist/index.css'
import '@arco-design/web-vue/dist/arco.css';
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'

import '@/assets/icon/iconfont.css'

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(ArcoVue)
app.use(router)
app.config.globalProperties.VueCookies = VueCookies;
app.mount('#app')
