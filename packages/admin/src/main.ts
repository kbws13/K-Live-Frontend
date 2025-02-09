import '@/assets/base.scss'

import {createApp} from 'vue'
import {createPinia} from "pinia";
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import '@/assets/icon/iconfont.css'
import App from './App.vue'
import router from "@/router";
import VueCookies from 'vue-cookies'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import ArcoVue from '@arco-design/web-vue';
import '@arco-design/web-vue/dist/arco.css';

import Cover from "@/components/Cover.vue";
import Collapse from "@/components/Collapse.vue";
import Avatar from "@/components/Avatar.vue";
import DataList from "@/components/DataList.vue";
import Dialog from "@/components/Dialog.vue";
import ImageCoverSelect from "@/components/ImageCoverSelect.vue";
import NoData from "@/components/NoData.vue";
import Player from "@/components/Player.vue";
import Table from "@/components/Table.vue";

const app = createApp(App)

// 引入图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
const pinia = createPinia();
app.use(router)
app.use(ArcoVue)
app.use(pinia)
app.use(ElementPlus)
app.component("Collapse", Collapse);
app.component("Avatar", Avatar);
app.component("Cover", Cover);
app.component("Dialog", Dialog);
app.component("ImageCoverSelect", ImageCoverSelect);
app.component("DataList", DataList);
app.component("NoData", NoData);
app.component("Table", Table);
app.component("Player", Player);

app.config.globalProperties.VueCookies = VueCookies;

app.config.globalProperties.bodyMaxWidth = 2000;
app.config.globalProperties.bodyMinWidth = 1080;
app.config.globalProperties.rowCategoryCount = 15;
// 分片大小
app.config.globalProperties.chunkSize = 1024 * 512
// 最多同时上传数量
app.config.globalProperties.maxUploading = 3
app.config.globalProperties.videoAccept = ".mp4,.avi,.rmvb,.mkv,.mov";
app.config.globalProperties.imageAccept = ".jpg,.png,.gif,.bmp,.webp";
// 缩略图后缀
app.config.globalProperties.imageThumbnailSuffix = "_thumbnail.jpg";
// 访客端域名
app.config.globalProperties.webDomain = "http://localhost:3000"
app.mount('#app')
