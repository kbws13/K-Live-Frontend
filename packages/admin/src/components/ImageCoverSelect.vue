<template>
  <div class="cover" :style="{ height: 200 * props.scale + 'px' }">
    <el-image :src="coverFile" fit="scale-down" width="200" v-if="coverFile">
      <template #error>
        <div class="iconfont icon-image-error"></div>
      </template>
    </el-image>
    <div class="mask" @click="selectImage">{{props.coverImage?"重新上传":"上传"}}</div>
  </div>
  <ImageCoverCut ref="imageCoverCutRef" :cutWidth="props.cutWidth" :scale="props.scale"></ImageCoverCut>
</template>

<script lang="ts" setup>
import {ElImage} from 'element-plus';
import {asyncComputed} from "@vueuse/core";
import {Resource} from "@/api/core/Url";
import {getCurrentInstance, ref} from 'vue'
import ImageCoverCut from "@/components/ImageCoverCut.vue";

// @ts-ignore
const { proxy } = getCurrentInstance()
const props = defineProps({
  coverImage: {
    type: [String, File],
  },
  cutWidth: {
    type: Number,
    default: 150,
  },
  //高宽比例
  scale: {
    type: Number,
    default: 1,
  },
})

const coverFile = asyncComputed(async () => {
  if (!props.coverImage) {
    return null
  }
  if (typeof props.coverImage == 'string') {
    return Resource.getResource + props.coverImage
  } else if (props.coverImage instanceof File) {
    return await convertFile2Base64(proxy.coverImage)
  }
})

const convertFile2Base64 = (file: File) => {
  return new Promise((resolve) => {
    let img = new FileReader()
    img.readAsDataURL(file)
    img.onload = ({ target }) => {
      resolve(target?.result as string)
    }
  })
}

const imageCoverCutRef = ref()
const selectImage = async () => {
  imageCoverCutRef.value.show()
}
</script>

<style lang="scss" scoped>
.cover {
  width: 170px;
  background: #f0f0f0;
  position: relative;
  .mask {
    width: 100%;
    position: absolute;
    left: 0;
    bottom: 0;
    height: 30px;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0.8;
    z-index: 1;
    color: #fff;
    text-align: center;
    cursor: pointer;
  }
}
</style>