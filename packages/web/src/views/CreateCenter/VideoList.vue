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
            :class="['item', status == 2 ? 'active' : '']"
            @click="statusLoad(2)"
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
import type {VideoPostQueryRequest} from "@/api/models/request/VideoPost/VideoPostQueryRequest";

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

const dataSource = ref({} as any);
const loadVideoList = async () => {
  let params = {
    current: dataSource.value.current,
    videoName: videoNameFuzzy.value,
    pageSize: 20,
    status: status.value,
  } as VideoPostQueryRequest;

  let result = await CreateCenterService.loadVideoPost(params);
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
.video-tab {
  border-bottom: 1px solid #ddd;
  display: flex;
  padding: 0 40px;
  justify-content: space-between;
  .tab {
    cursor: pointer;
    font-weight: bold;
    font-size: 16px;
    color: var(--blue);
    padding-bottom: 15px;
    border-bottom: 3px solid var(--blue);
  }
  .search {
    width: 200px;
  }
}
.video-manage {
  margin-top: 10px;
  padding: 0 40px 10px 40px;
  .top-info {
    .count-info {
      padding: 0 5px;
    }
    .all-video-panel {
      display: flex;
      .all-video {
        cursor: pointer;
        font-size: 14px;
        color: var(--blue);
      }
    }
    .video-status {
      margin-top: 10px;
      display: flex;
      align-items: center;
      .item {
        cursor: pointer;
        font-size: 13px;
        margin-right: 0;
        color: var(--text2);
        &:hover {
          color: var(--blue);
        }
      }
      .active {
        color: var(--blue);
      }
    }
  }
}
</style>