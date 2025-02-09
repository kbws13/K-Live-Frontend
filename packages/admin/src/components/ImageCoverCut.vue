<template>
  <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" width="1000px"
          @close="dialogConfig.show = false">
    <div class="cut-image-panel">
      <VueCropper ref="cropperRef" class="cropper" :img="sourceImage" outputType="png" :autoCrop="true"
                  :autoCropWidth="props.cutWidth" :autoCropHeight="Math.round(props.cutWidth * props.scale)" :fixed="true"
                  :fixedNumber="[1, props.scale]" :centerBox="true" :full="false" :fixedBox="true" @realTime="preview" mode="100%">
      </VueCropper>
      <div class="preview-panel">
        <div class="preview-image">
          <img :src="previewsImage"  alt=""/>
        </div>
        <el-upload :multiple="false" :show-file-list="false" :http-request="selectFile" :accept="proxy.imageAccept">
          <el-button class="select-btn" type="primary" @click="">选择图片</el-button>
        </el-upload>
      </div>
    </div>
    <div class="info">
      建议上传至少{{ props.cutWidth }}*{{
        Math.round(props.cutWidth * props.scale)
      }}的图片
    </div>
  </Dialog>
</template>

<script lang="ts" setup>
import { ElUpload, ElButton } from 'element-plus';
import Message from '@/utils/Message';
import { getCurrentInstance, inject, nextTick, ref } from 'vue';
import { VueCropper } from 'vue-cropper'
import 'vue-cropper/dist/index.css'

// @ts-ignore
const { proxy } = getCurrentInstance()

const props = defineProps({
  cutWidth: {
    type: Number,
    default: 400,
  },
  //高宽比例
  scale: {
    type: Number,
    default: 0.5,
  },
})

const dialogConfig = ref({
  show: false,
  title: '上传图片',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: () => {
        cutImage()
      },
    },
  ],
})

const cropperRef = ref()
const previewsImage = ref()
const preview = () => {
  cropperRef.value.getCropData((data: any) => {
    previewsImage.value = data
  })
}

const sourceImage = ref()
const selectFile = (file: any) => {
  return new Promise((reject) => {
    console.log(props.cutWidth, props.scale)

    file = file.file
    let img = new FileReader()
    img.readAsDataURL(file)
    img.onload = ({ target }) => {
      sourceImage.value = target?.result
    }
    img.onerror = (error) => {
      reject(error); // 处理错误
    };
  })
}

const show = () => {
  dialogConfig.value.show = true
  sourceImage.value = ''
  nextTick(() => {
    previewsImage.value = ''
  })
}

defineExpose({
  show,
})

const cutImageCallback = inject('cutImageCallback')
//裁剪
const cutImage = () => {
  //截图的高宽
  const cropW = Math.round(cropperRef.value.cropW)
  const cropH = Math.round(cropperRef.value.cropH)
  if (cropW == 0 || cropH == 0) {
    Message.warning(`请选择图片`)
    return
  }
  if (
      cropW < props.cutWidth ||
      cropH < Math.round(props.cutWidth * props.scale)
  ) {
    Message.warning(
        `图片尺寸至少满足(${props.cutWidth}*${Math.round(
            props.cutWidth * props.scale
        )}`
    )
    return
  }
  cropperRef.value.getCropBlob((blob: Blob) => {
    const file = new File(
        [blob],
        'temp.' + blob.type.substring(blob.type.indexOf('/') + 1),
        { type: blob.type }
    )
    dialogConfig.value.show = false

    // @ts-ignore
    cutImageCallback({
      coverImage: file,
    })
  })
}
</script>

<style lang="scss" scoped>
.cut-image-panel {
  display: flex;
  .cropper {
    flex: 1;
    height: 500px;
  }
  .preview-panel {
    width: 200px;
    margin-left: 20px;
    text-align: center;
    .preview-image {
      width: 100%;
      height: 200px;
      background: #f6f6f6;
      display: flex;
      align-items: center;
    }
    img {
      width: 100%;
    }
  }
  .select-btn {
    margin-top: 20px;
  }
}
.info {
  color: #6b6b6b;
}
</style>