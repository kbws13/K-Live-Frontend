<template>
    <template v-for="item in dataList">
        <VideoItem :data="item" :layoutType="1" :marginTop="20"></VideoItem>
    </template>
</template>

<script lang="ts" setup>
import type { Video } from '@/api/models/response/Video/Video';
import { VideoService } from '@/api/services/VideoService';
import { inject, ref } from 'vue';

const dataList = ref<Video[]>([]);

const videoInfo = inject<Video>("videoInfo", {} as Video);

const loadDataList = async () => {
  let result = await VideoService.getRecommendVideo(videoInfo.value.name, videoInfo.value.id,);
  if (!result) {
    return;
  }
  dataList.value = result;
};
loadDataList();
</script>

<style lang="scss" scoped>
</style>