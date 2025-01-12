<template>
    <div class="action-panel">
        <div :class="[
            'iconfont icon-like-solid',
            videoInfo.likeCountActive ? 'active' : '',
        ]" @click="userAction('VIDEO_LIKE')">
            {{ videoInfo.likeCount }}
        </div>
        <div :class="[
            'iconfont icon-toubi',
            videoInfo.coinCountActive ? 'active' : '',
        ]" @click="userActionCoin('VIDEO_COIN')">
            {{ videoInfo.coinCount }}
        </div>
        <div :class="[
            'iconfont icon-collection-solid',
            videoInfo.collectCountActive ? 'active' : '',
        ]" @click="userAction('VIDEO_COLLECT')">
            {{ videoInfo.collectCount }}
        </div>
    </div>
    <VideoCoin ref="videoCoinRef"></VideoCoin>
</template>

<script lang="ts" setup>
import { useRoute } from 'vue-router';
import VideoCoin from './VideoCoin.vue';
import { inject } from 'vue';
import { userLoginStore } from '@/stores/UserStore';
import { doUserAction } from '@/api';
import { ACTION_TYPE } from '@/constant/ActionConstants';

const route = useRoute();
const videoInfo = inject("videoInfo");
const loginStore = userLoginStore();


const userAction = (type: string) => {
  if (Object.keys(loginStore.userInfo).length === 0) {
    loginStore.setLogin(true);
    return;
  }
  doUserAction(
    {
      videoId: route.params.videoId[0],
      actionType: ACTION_TYPE[type].value,
    },
    () => {
      if (type === "VIDEO_LIKE") {
        if (videoInfo.value.likeCountActive) {
          videoInfo.value.likeCountActive = false;
          videoInfo.value.likeCount--;
        } else {
          videoInfo.value.likeCountActive = true;
          videoInfo.value.likeCount++;
        }
      } else if (type === "VIDEO_COLLECT") {
        if (videoInfo.value.collectCountActive) {
          videoInfo.value.collectCountActive = false;
          videoInfo.value.collectCount--;
        } else {
          videoInfo.value.collectCountActive = true;
          videoInfo.value.collectCount++;
        }
      }
    }
  );
};
</script>

<style lang="scss" scoped></style>