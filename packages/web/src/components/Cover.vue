<template>
    <div class="image-panel" ref="coverRef" :style="{
        'border-radius': borderRadius,
        width: width ? width + 'px' : '100%',
        height: width ? width * scale + 'px' : '100%',
    }">
        <el-image :lazy="lazy" :src="fileSource || fileImage" v-if="fileSource || fileImage" :fit="fit"
            @click="showViewerHandler">
            <template v-slot:placeholder>
                <img :src="Local.getLocalImage('playing.gif')"  alt=""/>
            </template>
            <template v-slot:error>
                <img :src="Local.getLocalImage(img404)" class="el-image__inner" :style="{ 'object-fit': fit }" />
            </template>
        </el-image>
        <div v-else class="no-image">请选择图片</div>
        <el-image-viewer :hide-on-click-modal="true" @close="() => {
            showViewer = false
        }" v-if="showViewer" :url-list="imageList" :teleported="true"></el-image-viewer>
    </div>
</template>

<script lang="ts" setup>
import { ElImage, ElImageViewer } from 'element-plus';
import { Resource } from '@/api/core/Url';
import { imgaeThumbnailSuffix } from '@/constant/ResourceConstant';
import Local from '@/utils/Local';
import { computed, onMounted, ref } from 'vue';

const props = defineProps({
    src: {
        type: [String, File],
    },
    width: {
        type: Number,
    },
    fit: {
      type: String as () => 'fill' | 'contain' | 'cover' | 'none' | 'scale-down' | '',
      default: 'scale-down'
    },
    preview: {
        type: Boolean,
        default: false,
    },
    defaultImage: {
        type: String,
    },
    img404: {
        type: String,
        default: '404_cover.png'
    },
    borderRadius: {
        type: String,
        default: "5px",
    },
    // 顶部头像使用懒加载，页面不跳转路由不跳转不加载图片
    lazy: {
        type: Boolean,
        default: true
    },
    scale: {
        type: Number,
        default: 0.6,
    }
})

const fileImage = ref();
const fileSource = computed(() => {
    if (!props.src && !props.defaultImage) {
        fileImage.value = null;
        return null;
    }
    if (!props.src && props.defaultImage) {
        return Local.getLocalImage(props.defaultImage);
    }
    if (props.src instanceof File) {
        let img = new FileReader();
        img.readAsDataURL(props.src);
        img.onload = ({ target }) => {
            fileImage.value = target?.result;
        };
        return;
    } else if (typeof props.src === 'string') {
        return `${Resource.getResource}${props.src}`;
    } else {
        return;
    }
})

const imageList = computed(() => {
    if (!props.preview) {
        return [];
    }
    if (props.src instanceof File) {
        return;
    }
    const sourceImage = Resource.getResource + props.src!.replace(imgaeThumbnailSuffix, '');
    return [sourceImage];
})

const showViewer = ref(false);
const showViewerHandler = () => {
    if(!props.preview) {
        return;
    }
    showViewer.value = true;
}

const coverRef = ref();
const loadingHeight = ref();
onMounted(() => {
    loadingHeight.value = coverRef.value.clientWidth * props.scale;
})

</script>

<style lang="scss">
.image-panel {
    position: relative;
    overflow: hidden;
    cursor: pointer;
    background: #f8f8f8;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 100%;
    width: 100%;

    :deep(.el-image) {
        width: 100%;
        height: 100%;
    }

    :deep(.is-loading) {
        display: none;
    }

    :deep(.el-image__wrapper) {
        position: relative;
        vertical-align: top;
        width: 100%;
        height: 100%;
        display: flex;
    }

    .icon-image-error {
        margin: 0 auto;
        font-size: 20px;
        color: #838383;
        height: 100%;
    }

    .loading {
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: center;

        img {
            width: 20px;
        }
    }

    .no-image {
        text-align: center;
        color: #9f9f9f;
    }
}
</style>