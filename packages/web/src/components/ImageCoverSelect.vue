<template>
    <div class="cover" :style="{ width: coverWidth + 'px', height: coverWidth * props.scale + 'px' }">
        <el-image :src="coverFile" fit="scale-down" :width="cutWidth" v-if="coverFile!">
            <template #error>
                <div class="iconfont icon-image-error"></div>
            </template>
        </el-image>
        <div class="mask" @click="selectImage">{{ props.coverImage ? "重新上传" : "上传" }}</div>
    </div>
    <ImageCoverCut ref="imageCoverCutRef" :cutWidth="props.cutWidth" :scale="props.scale"></ImageCoverCut>
</template>

<script lang="ts" setup>
import { Resource } from '@/api/core/Url'
import { getCurrentInstance, ref } from 'vue'

// @ts-ignore
const { proxy } = getCurrentInstance()
const props = defineProps({
  coverImage: {
    type: [String, File],
  },
  coverWidth: {
    type: Number,
    default: 100,
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
    const base64 = await convertFile2Base64(proxy.coverImage)
    return base64
  }
})

const convertFile2Base64 = (file) => {
  return new Promise((resolve, reject) => {
    let img = new FileReader()
    img.readAsDataURL(file)
    img.onload = ({ target }) => {
      resolve(target.result)
    }
  })
}

const imageCoverCutRef = ref()
const selectImage = async () => {
  imageCoverCutRef.value.show()
}

function asyncComputed(arg0: () => Promise<unknown>) {
    throw new Error('Function not implemented.')
}
</script>

<style lang="scss" scoped></style>