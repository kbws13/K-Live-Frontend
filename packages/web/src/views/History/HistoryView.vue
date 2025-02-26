<template>
  <div class="history-list">
    <div class="top-info">
      <div class="iconfont icon-wating">历史记录</div>
      <div>
        <el-button type="primary" @click="cleanAll">清空历史</el-button>
      </div>
    </div>
    <el-timeline>
      <div class="data-list">
        <LoadMoreList :dataSource="dataSource" :loading="loadingData" @loadData="loadDataList" layoutType="line">
          <template #default="{ data }">
            <el-timeline-item :timestamp="Local.formatDate(data.lastUpdateTime)" placement="top">
              <div class="history-item">
                <div class="cover" @click="goDetail(data.videoId)">
                  <Cover :src="data.videoCover"></Cover>
                </div>
                <div class="video-info">
                  <div @click="goDetail(data.videoId)">
                    {{ data.videoName || "已失效视频" }}
                  </div>
                </div>
                <div class="op-btns">
                  <div class="iconfont icon-delete" @click="delHistory(data.videoId)"></div>
                </div>
              </div>
            </el-timeline-item>
          </template>
        </LoadMoreList>
      </div>
    </el-timeline>
  </div>
</template>

<script lang="ts" setup>
import { ElButton, ElTimeline, ElTimelineItem } from "element-plus"
import {getCurrentInstance, onMounted, ref} from "vue";
import {useRouter} from "vue-router";
import {useNavigatorStore} from "@/stores/NavigatorStore";
import Confirm from "@/utils/Confirm";
import Message from "@/utils/Message";
import {VideoPlayHistoryService} from "@/api/services/VideoPlayHistoryService";
import type {VideoPlayHistory} from "@/api/models/response/VideoPlayHistory/VideoPlayHistory";
import type {Page} from "@/common/Page";
import Local from "@/utils/Local";

// @ts-ignore
const { proxy } = getCurrentInstance()
const router = useRouter()
const navActionStore = useNavigatorStore()

const loadingData = ref(false)
const dataSource = ref<Page<VideoPlayHistory>>({} as Page<VideoPlayHistory>)
const loadDataList = async () => {
  loadingData.value = true
  let result = await VideoPlayHistoryService.loadHistory({
    current: dataSource.value.current,
    queryVideoInfo: true,
  });
  loadingData.value = false
  if (!result) {
    return
  }

  const dataList = dataSource.value.records
  dataSource.value = Object.assign({}, result)
  if (result.current > 1) {
    dataSource.value.records = dataList.concat(result.records)
  }
}
loadDataList()

onMounted(() => {
  //初始化store
  navActionStore.setShowHeader(true)
  navActionStore.setFixedHeader(true)
  navActionStore.setFixedCategory(false)
  navActionStore.setShowCategory(false)
})

const cleanAll = () => {
  Confirm({
    message: '确定要清空历史记录吗？',
    okfun: async () => {
      let result = await VideoPlayHistoryService.cleanHistory();
      if (!result) {
        return
      }
      Message.success('删除成功')
      dataSource.value = { records: [] }
    },
  })
}

const delHistory = (videoId: string) => {
  Confirm({
    message: '确定要删除记录吗？',
    okfun: async () => {
      let result = await VideoPlayHistoryService.deleteHistory(videoId);
      if (!result) {
        return
      }
      Message.success('删除成功')
      dataSource.value.records = dataSource.value.records.filter((item: VideoPlayHistory) => {
        return item.videoId != videoId
      })
    },
  })
}

const goDetail = (videoId: string) => {
  router.push(`/video/${videoId}`)
}
</script>

<style lang="scss" scoped>
.history-list {
  margin: 20px auto 0;
  width: 1200px;
  .top-info {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding-left: 40px;
    margin-bottom: 20px;
    .icon-wating {
      font-size: 16px;
      &::before {
        margin-right: 5px;
        font-size: 22px;
        color: #e3936c;
        float: left;
      }
    }
  }
  .data-list {
    .history-item {
      margin-top: 10px;
      display: flex;
      align-items: center;
      .cover {
        width: 200px;
      }
      .video-info {
        flex: 1;
        margin-left: 10px;
        cursor: pointer;
        color: var(--blue3);
      }
      .op-btns {
        .iconfont {
          cursor: pointer;
          color: #e3936c;
        }
      }
    }
  }
}
</style>