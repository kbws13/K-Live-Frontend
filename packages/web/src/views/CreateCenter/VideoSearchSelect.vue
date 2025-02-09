<template>
  <div class="search-panel">
    <el-select clearable placeholder="选择视频搜索" v-model="searchForm.videoId" @change="loadData">
      <el-option :value="item.id" :label="item.name" v-for="item in allVideoList"></el-option>
    </el-select>
  </div>
</template>

<script lang="ts" setup>
import { ElSelect, ElOption } from 'element-plus';
import {ref} from "vue";
import {useRoute} from "vue-router";
import type { Video } from "@/api/models/response/Video/Video";
import {CreateCenterService} from "@/api/services/CreateCenterService";

const route = useRoute()
const searchForm = ref({ videoId: route.query.videoId as string })
const allVideoList = ref<Video[]>([])

const loadAllVideo = async () => {
  let result = await CreateCenterService.loadAllVideo();
  if (!result) {
    return
  }
  allVideoList.value = result;
}
loadAllVideo()

const emit = defineEmits(['loadData'])
const loadData = (e: any) => {
  emit('loadData', e)
}
</script>

<style lang="scss" scoped>
</style>