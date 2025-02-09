<template>
  <div class="cover-upload">
    <div class="cover">
      <Cover :source="modelValue"></Cover>
      <div
          class="iconfont icon-close"
          @click="cleanImg"
          v-if="modelValue"
      ></div>
    </div>
    <el-upload
        :multiple="false"
        :show-file-list="false"
        :http-request="selectFile"
        :accept="proxy.imageAccept"
    >
      <el-button class="select-btn" type="primary">选择</el-button>
    </el-upload>
  </div>
</template>

<script lang="ts" setup>
import { ElUpload, ElButton } from "element-plus"
import {getCurrentInstance} from 'vue'
// @ts-ignore
const { proxy } = getCurrentInstance();
defineProps({
  modelValue: {
    type: [String, File],
  },
});

const emit = defineEmits(["update:modelValue"]);
const selectFile = (file: any) => {
  emit("update:modelValue", file.file);
};

const cleanImg = () => {
  emit("update:modelValue", "");
};
</script>

<style lang="scss" scoped>
.cover-upload {
  display: flex;
  align-items: flex-end;
  .cover {
    width: 80px;
    height: 80px;
    position: relative;
    margin-right: 10px;
    .icon-close {
      position: absolute;
      top: -8px;
      right: 0;
      cursor: pointer;
    }
  }
}
</style>