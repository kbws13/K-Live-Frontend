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
import LoadMoreList from '@/components/LoadMoreList.vue';
import VideoItem from '@/components/VideoItem.vue';
import NoData from '@/components/NoData.vue';
import Collapse from '@/components/Collapse.vue';
import ImageCoverSelect from '@/components/ImageCoverSelect.vue';
import DataList from '@/components/DataList.vue';
import DataGripList from './components/DataGripList.vue';
import KTab from '@/components/KTab.vue';

const app = createApp(App)

app.use(createPinia())
app.use(ElementPlus)
app.use(ArcoVue)
app.use(router)
app.component("Dialog", Dialog)
app.component("Cover", Cover)
app.component("Avatar", Avatar)
app.component("LoadMoreList", LoadMoreList)
app.component("VideoItem", VideoItem)
app.component("NoData", NoData)
app.component("Collapse", Collapse)
app.component("ImageCoverSelect", ImageCoverSelect)
app.component("DataList", DataList)
app.component("DataGripList", DataGripList)
app.component("KTab", KTab)
app.config.globalProperties.Confirm = Confirm;
app.config.globalProperties.VueCookies = VueCookies;
//页面最大宽度
app.config.globalProperties.bodyMaxWidth = 2000;
//页面最小宽度
app.config.globalProperties.bodyMinWidth = 1250;
//顶部分类，一行多少个分类
app.config.globalProperties.rowCategoryCount = 10;
//分片大小
app.config.globalProperties.chunkSize = 1024 * 512
//最多同时上传数量
app.config.globalProperties.maxUploading = 3
//视频后缀
app.config.globalProperties.videoAccept = ".mp4,.avi,.rmvb,.mkv,.mov";
//图片后缀
app.config.globalProperties.imageAccept = ".jpg,.png,.gif,.bmp,.webp";
//轮播最多显示的视频数
app.config.globalProperties.carouselMaxCount = 2;
//bodyPaddingWidth
app.config.globalProperties.bodyPadding = 150
app.mount('#app')
