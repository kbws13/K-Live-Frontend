<template>
  <div class="video-tab">
    <div class="tab">视频管理</div>
    <div class="search">
      <el-input
          clearable
          placeholder="搜索稿件"
          size="small"
          v-model="videoNameFuzzy"
          @keyup.enter="loadVideoList"
      >
        <template #suffix>
          <span class="iconfont icon-search"></span>
        </template>
      </el-input>
    </div>
  </div>
  <div class="video-manage">
    <div class="top-info">
      <div class="all-video-panel">
        <div class="all-video" @click="cleanStatusLoad">
          全部稿件<span class="count-info">{{
            countInfo.inProcessCount +
            countInfo.auditPassCount +
            countInfo.auditFailCount
          }}</span>
        </div>
      </div>
      <div class="video-status">
        <span
            :class="['item', status == -1 ? 'active' : '']"
            @click="statusLoad(-1)"
        >进行中<span class="count-info">{{
            countInfo.inProcessCount
          }}</span></span
        >
        <el-divider direction="vertical" />
        <span
            :class="['item', status == 3 ? 'active' : '']"
            @click="statusLoad(3)"
        >已通过<span class="count-info">{{
            countInfo.auditPassCount
          }}</span></span
        >
        <el-divider direction="vertical" />
        <span
            :class="['item', status == 4 ? 'active' : '']"
            @click="statusLoad(4)"
        >未通过<span class="count-info">{{
            countInfo.auditFailCount
          }}</span></span
        >
      </div>
    </div>
    <div class="video-list">
      <DataList :dataSource="dataSource" @loadData="loadVideoList">
        <template #default="{ data }">
          <VideoListItem :data="data" @reload="loadVideoList"></VideoListItem>
        </template>
      </DataList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ElDivider, ElInput } from "element-plus"
import VideoListItem from "@/views/CreateCenter/components/VideoListItem.vue";
import {onMounted, onUnmounted, ref} from "vue";
import {CreateCenterService} from "@/api/services/CreateCenterService";
import type {VideoStatusCountVO} from "@/api/models/response/CreateCenter/VideoStatusCountVO";

const videoNameFuzzy = ref();
const status = ref();
const statusLoad = (_status: number) => {
  status.value = _status;
  loadVideoList();
};
const cleanStatusLoad = () => {
  status.value = null;
  loadVideoList();
};

const dataSource = ref({});
const loadVideoList = async () => {
  // TODO 需要加查询功能
  let params = {
    pageNo: dataSource.value.pageNo,
    videoNameFuzzy: videoNameFuzzy.value,
    status: status.value,
  };

  let result = await CreateCenterService.loadAllVideo();
  if (!result) {
    return;
  }
  dataSource.value = result;
};
loadVideoList();

const countInfo = ref<VideoStatusCountVO>({ inProcessCount: 0, auditPassCount: 0, auditFailCount: 0 });
const loadCountInfo = async () => {
  let result = await CreateCenterService.getVideoStatusCount();
  if (!result) {
    return;
  }
  countInfo.value = result;
};
loadCountInfo();

let timmer = ref<number | null>(null);
const startTimer = () => {
  timmer.value = setInterval(() => {
    loadVideoList();
    loadCountInfo();
  }, 5000);
};

const cleanTimer = () => {
  if (timmer.value !== null) {
    clearInterval(timmer.value);
    timmer.value = null;
  }
};
onMounted(() => {
  startTimer();
});

onUnmounted(() => {
  cleanTimer();
});
</script>

<style lang="scss" scoped>
</style>