import { createApp } from 'vue'
import { createPinia } from 'pinia'
import ElementPlus from 'element-plus'
import ArcoVue from '@arco-design/web-vue';
import 'element-plus/dist/index.css'
import '@arco-design/web-vue/dist/arco.css';
import VueCookies from 'vue-cookies'
import App from './App.vue'
import router from './router'

import Confirm from '@/utils/Confirm';

import '@/assets/icon/iconfont.css'
import '@/assets/scss/base.scss'
import Dialog from '@/components/Dialog.vue';
import Cover from '@/components/Cover.vue';
import Avatar from '@/components/Avatar.vue';

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(ArcoVue)
app.use(router)
app.component("Dialog", Dialog)
app.component("Cover", Cover)
app.component("Avatar", Avatar)
app.config.globalProperties.Confirm = Confirm;
app.config.globalProperties.VueCookies = VueCookies;
app.config.globalProperties.bodyMaxWidth = 2000;
app.config.globalProperties.bodyMinWidth = 1250;
app.mount('#app')
