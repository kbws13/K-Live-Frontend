<template>
  <div class="video-list-panel">
    <div class="video-title">视频列表</div>
    <VueDraggable
      v-model="seriesList"
      @Update="changeSort"
      handle=".move-handler"
      class="video-list"
      draggable=".list-item"
    >
      <template v-for="item in seriesList">
        <div class="video-item-add" @click="showVideoSeries" v-if="item.id == -1">
          <div class="iconfont icon-add"></div>
          <div class="add-info">新建视频列表</div>
        </div>
        <div class="list-item" v-else @click="jump(item)">
          <div class="cover">
            <div class="move-handler iconfont icon-move" v-if="myself"></div>
            <Cover :src="item.videoList[0].cover"></Cover>
          </div>
          <div class="item-name">{{item.name}}</div>
          <div class="create-time">
            {{ Local.formatDate(item.updateTime) }}
          </div>
        </div>
      </template>
    </VueDraggable>
    <NoData v-if="seriesList.length == 0" msg="暂无视频列表"></NoData>
  </div>
  <UserProfileSeriesEdit
      ref="videoSeriesEditRef"
      @reload="loadSeriesList"
  ></UserProfileSeriesEdit>
</template>

<script lang="ts" setup>
import { VueDraggable } from "vue-draggable-plus";
import {userLoginStore} from "@/stores/UserStore";
import {computed, ref} from "vue";
import {useRoute, useRouter} from "vue-router";
import {SeriesService} from "@/api/services/SeriesService";
import type {Series} from "@/api/models/response/Series/Series";
import UserProfileSeriesEdit from "@/views/User/components/UserProfileSeriesEdit.vue";
import Message from "@/utils/Message";
import Cover from "@/components/Cover.vue";
import Local from "web/src/utils/Local";
import NoData from "@/components/NoData.vue";

const loginStore = userLoginStore();
const route = useRoute();
const router = useRouter();
//是否是自己
const myself = computed(() => {
  return loginStore.userInfo.id == route.params.userId;
});
//视频系列
const seriesList = ref<Series[]>([]);
const loadSeriesList = async () => {
  const userId = route.params.userId as string;
  const result = await SeriesService.loadSeriesWithVideo(userId);
  if (!result) {
    return;
  }
  seriesList.value = result;
  if(myself) {
    seriesList.value.unshift({
      id: -1
    } as Series)
  }
};
loadSeriesList();

const videoSeriesEditRef = ref();
const showVideoSeries = () => {
  videoSeriesEditRef.value.show({}, 0);
};

const changeSort = async () => {
  let seriesIds = seriesList.value.map((item) => {
    return item.id;
  });
  seriesIds.splice(0, 1);
  let result = await SeriesService.changeSeriesSort(seriesIds.join(","));
  if (!result) {
    return;
  }
  Message.success("排序成功");
};

const jump = (item: Series) => {
  router.push(`/user/${route.params.userId}/series/${item.id}`);
};
</script>

<style lang="scss" scoped>
.video-list-panel {
  padding: 20px;
  border-radius: 5px;
  background: #fff;
  .video-title {
    font-size: 18px;
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
        margin-top: 5px;
      }
      .create-time {
        margin-top: 5px;
        color: var(--text3);
      }
    }
  }
}

.part-title {
  .title-panel {
    .title {
      font-size: 15px;
    }
  }
}
</style>