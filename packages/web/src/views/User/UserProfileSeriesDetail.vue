<template>
  <div class="video-list-panel">
    <div class="video-title">
      <router-link :to="`/user/${route.params.userId}/series`" class="a-link">视频列表</router-link>
      &gt;
      {{ seriesInfo.name }}
    </div>
    <div class="detail-panel">
      <div class="video-detail">
        <div class="count-info">
          <div>{{ videoList.length }}个视频</div>
          <el-divider direction="vertical" />
          <div>{{ Local.formatDate(seriesInfo.updateTime) }}更新</div>
        </div>
        <div class="description">
          {{ seriesInfo.description }}
        </div>
      </div>
      <template v-if="myself">
        <el-button type="primary" @click="editSeries">编辑</el-button>
        <el-button type="danger" @click="delSeries">删除</el-button>
      </template>
    </div>

    <VueDraggable v-model="videoList" @Update="changeSort" handle=".move-handler" class="video-list"
                  draggable=".list-item">
      <template v-for="(item, index) in videoList" :key="item.seriesId">
        <div class="video-item-add" @click="addVideo" v-if="index === 0 && myself.valueOf()">
          <div class="iconfont icon-add"></div>
          <div class="add-info">添加视频</div>
        </div>
        <div class="list-item" v-else>
          <div class="cover" @click="jump(item)">
            <div class="move-handler iconfont icon-move" v-if="myself"></div>
            <Cover :source="item.cover"></Cover>
          </div>
          <div class="list-name" @click="jump(item)">{{ item.name }}</div>
          <div class="play-count-info">
            <div class="play-count iconfont icon-play2">
              {{ item.playCount }}
            </div>
            <div class="create-time">
              {{ Local.formatDate(item.createTime) }}
            </div>
            <el-dropdown>
              <div class="iconfont icon-more" @click.stop v-show="myself"></div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click.stop="delVideo(item)">删除</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>
    </VueDraggable>
    <NoData v-if="videoList.length == 0" msg="暂无视频"></NoData>

    <UserProfileSeriesEdit ref="videoSeriesEditRef" @reload="getSeriesDetail"></UserProfileSeriesEdit>
  </div>
</template>

<script lang="ts" setup>
import { ElDivider, ElButton, ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus"
import { VueDraggable } from 'vue-draggable-plus'
import Local from "web/src/utils/Local";
import UserProfileSeriesEdit from "@/views/User/components/UserProfileSeriesEdit.vue";
import {useRoute, useRouter} from "vue-router";
import {userLoginStore} from "@/stores/UserStore";
import {computed, ref} from "vue";
import {SeriesService} from "@/api/services/SeriesService";
import type {SeriesContent} from "@/api/models/response/Series/SeriesContent";
import type {Series} from "@/api/models/response/Series/Series";
import Message from "@/utils/Message";
import Confirm from "@/utils/Confirm";

const router = useRouter()
const route = useRoute()
const loginStore = userLoginStore()
//是否是自己
const myself = computed(() => {
  return loginStore.userInfo.id == route.params.userId
})
const seriesInfo = ref<Series>({} as Series)
const videoList = ref<SeriesContent[]>([])

const getSeriesDetail = async () => {
  const seriesId = route.params.seriesId as string
  const result = await SeriesService.getSeriesDetail(Number(seriesId));
  if (!result) {
    return
  }
  seriesInfo.value = result.series
  videoList.value = result.seriesContentList
}
getSeriesDetail()

const changeSort = async () => {
  let videoIds = videoList.value.map((item) => {
    return item.videoId
  })
  videoIds.splice(0, 1)
  const seriesId = route.params.seriesId as string
  const result = await SeriesService.saveSeriesContent(Number(seriesId), videoIds.join(','))
  if (!result) {
    return
  }
  Message.success('排序成功')
}

const jump = (item: SeriesContent) => {
  router.push(`/video/${item.videoId}`)
}

const delVideo = (item: SeriesContent) => {
  const seriesId = route.params.seriesId as string
  Confirm({
    message: `确定要删除【${item.name}】吗？`,
    okfun: async () => {
      const result = await SeriesService.deleteSeriesVideo(Number(seriesId), item.videoId);
      if (!result) {
        return
      }
      Message.success('删除成功')
      await getSeriesDetail()
    },
  })
}

const delSeries = () => {
  const seriesId = route.params.seriesId as string
  Confirm({
    message: `确定要删除【${seriesInfo.value.name}】吗？`,
    okfun: async () => {
      const result = await SeriesService.deleteSeries(Number(seriesId))
      if (!result) {
        return
      }
      Message.success('删除成功')
      await router.push(`/user/${route.params.userId}/series`)
    },
  })
}
//编辑系列
const videoSeriesEditRef = ref()
const editSeries = () => {
  videoSeriesEditRef.value.show(seriesInfo.value, 1)
}

//添加视频
const addVideo = () => {
  videoSeriesEditRef.value.show(seriesInfo.value, 2)
}
</script>

<style lang="scss" scoped>
.video-list-panel {
  padding: 20px;
  border-radius: 5px;
  background: #fff;
  .video-title {
    font-size: 16px;
  }
  .video-list {
    margin-top: 20px;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(6, 1fr);
    .video-item-add {
      border-radius: 5px;
      width: 100%;
      height: 150px;
      border: 2px dashed #ddd;
      text-align: center;
      color: var(--text3);
      cursor: pointer;
      .icon-add {
        font-size: 40px;
        padding-top: 40px;
      }
    }
    .list-item {
      .cover {
        position: relative;
        .move-handler {
          width: 100%;
          height: 30px;
          cursor: move;
          position: absolute;
          left: 0;
          top: 0;
          background: #fff;
          z-index: 100;
          border-radius: 5px 5px 0 0;
          border: 1px solid #ddd;
          align-items: center;
          justify-content: center;
          display: none;
        }
        &:hover {
          .move-handler {
            display: flex;
          }
        }
      }
      .list-name {
        cursor: pointer;
        font-size: 13px;
        height: 35px;
        color: var(--text2);
        margin-top: 10px;
        display: -webkit-box;
        overflow: hidden;
        -webkit-box-orient: vertical;
        text-overflow: -o-ellipsis-lastline;
        text-overflow: ellipsis;
        word-break: break-all;
        line-break: anywhere;
        -webkit-line-clamp: 2;
      }
      .play-count-info {
        margin-top: 5px;
        display: flex;
        color: var(--text3);
        align-items: center;
        font-size: 12px;
        .play-count {
          flex: 1;
          &::before {
            margin-right: 5px;
          }
        }
        .icon-more {
          margin-left: 5px;
          cursor: pointer;
        }
      }
    }
  }
}

.detail-panel {
  padding: 20px 0;
  font-size: 13px;
  color: var(--text3);
  border-bottom: 1px solid #ddd;
  display: flex;
  .video-detail {
    flex: 1;
    .count-info {
      display: flex;
      align-items: center;
    }
    .description {
      margin-top: 10px;
    }
  }
}
</style>