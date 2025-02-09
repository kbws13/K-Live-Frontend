<template>
  <div class="my-video-list-title" v-if="seriesList.length > 0">
    <router-link class="title" :to="`/user/${route.params.userId}/series`"
    >我的视频列表</router-link
    >
    <span
        class="iconfont icon-add op-btn new-btn"
        @click="showVideoSeries"
        v-if="myself"
    >新建</span
    >
  </div>
  <div class="part-item" v-for="item in seriesList">
    <div class="part-title">
      <div class="title-panel">
        <router-link
            class="title"
            :to="`/user/${route.params.userId}/series/${item.id}`"
        >{{ item.name }}
        </router-link>
        <div class="count-info">{{ item.videoList.length }}</div>
      </div>
      <router-link
          class="op-btn"
          :to="`/user/${route.params.userId}}/series/${item.id}`"
      >更多&gt;</router-link
      >
    </div>
    <div class="video-list5">
      <VideoItem :data="video" v-for="video in item.videoList"> </VideoItem>
    </div>
  </div>
  <UserProfileSeriesEdit
      ref="videoSeriesEditRef"
      @reload="loadSeriesList"
  ></UserProfileSeriesEdit>
</template>

<script lang="ts" setup>

import {userLoginStore} from "@/stores/UserStore";
import {computed, ref} from "vue";
import {useRoute} from "vue-router";
import {SeriesService} from "@/api/services/SeriesService";
import type {Series} from "@/api/models/response/Series/Series";
import UserProfileSeriesEdit from "@/views/User/components/UserProfileSeriesEdit.vue";

const loginStore = userLoginStore();
const route = useRoute();
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
};
loadSeriesList();

const videoSeriesEditRef = ref();
const showVideoSeries = () => {
  videoSeriesEditRef.value.show();
};
</script>

<style lang="scss" scoped>
.my-video-list-title {
  margin-top: 15px;
  .title {
    text-decoration: none;
    color: var(--text);
    font-size: 16px;
  }
  .new-btn {
    margin-left: 10px;
    padding: 5px 10px;
    cursor: pointer;
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