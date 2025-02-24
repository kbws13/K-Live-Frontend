<template>
  <div v-if="dataSource.records && dataSource.records.length == 0">
    <NoData msg="空间主人还没有投过视频哦~~"></NoData>
  </div>
  <div class="part-item" v-else>
    <div class="part-title">
      <div class="title-panel">
        <router-link class="title" :to="`/user/${route.params.userId}}/video`"
        >TA的视频
        </router-link>
        <div class="count-info">{{ dataSource.total }}</div>
      </div>
      <router-link class="op-btn" :to="`/user/${route.params.userId}/video`"
      >更多&gt;</router-link
      >
    </div>
    <div class="video-list5">
      <UserProfileVideoListItem :data="item" v-for="item in dataSource.records"> </UserProfileVideoListItem>
    </div>
  </div>
</template>

<script lang="ts" setup>
import "@/assets/scss/uhome.scss";
import {ref} from "vue";
import {useRoute} from "vue-router";
import {HomeService} from "@/api/services/HomeService";
import type {Page} from "@/common/Page";
import type {Video} from "@/api/models/response/Video/Video";
import UserProfileVideoListItem from "@/views/User/components/UserProfileVideoListItem.vue";

const route = useRoute();
const dataSource = ref<Page<Video>>({} as Page<Video>);
const loadVideoList = async () => {
  const result = await HomeService.loadVideoList({
    userId: route.params.userId as string,
    type: 0,
    videoName: '',
  })
  if (!result) {
    return;
  }
  dataSource.value = result;
};
loadVideoList();
</script>

<style lang="scss" scoped>
</style>