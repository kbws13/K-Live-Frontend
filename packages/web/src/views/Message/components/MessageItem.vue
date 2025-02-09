<template>
  <div class="message-item">
    <Avatar :avatar="data.sendUserAvatar" :userId="data.sendUserId"></Avatar>
    <div class="user-info-panel">
      <div class="user-info">
        <router-link
            :to="`/user/${data.sendUserId}`"
            class="user-name"
            target="_blank"
        >
          {{ data.sendUserName }}
        </router-link>
        <span class="title-info">{{ convertTitle() }}</span>
      </div>
      <template v-if="data.messageType == 4">
        <div class="comment">{{ data.extendDto.messageContent }}</div>
        <div class="reply" v-if="data.extendDto.messageContentReply">
          {{ data.extendDto.messageContentReply }}
        </div>
      </template>
      <div class="send-time">
        {{ Local.formatDate(data.createTime) }}
        <span
            class="iconfont icon-delete"
            @click="delMessage(data.messageId)"
        ></span>
      </div>
    </div>
    <div class="video-cover">
      <router-link :to="`/video/${data.videoId}`" target="_blank">
        <Cover :source="data.videoCover"></Cover>
      </router-link>
    </div>
  </div>
</template>

<script lang="ts" setup>

import Local from "web/src/utils/Local";

const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});

const MESSAGE_TYPE = {
  1: "系统消息",
  2: "点赞",
  3: "收藏",
  4: "评论",
};

const convertTitle = () => {
  if (props.data.messageType == 4) {
    if (props.data.extendDto.messageContentReply) {
      return `在视频中回复了你的评论`;
    }
    return `在视频中发表了评论`;
  } else {
    return `${MESSAGE_TYPE[props.data.messageType]}了视频`;
  }
};

const emit = defineEmits(["delMessage"]);
const delMessage = (messageId: number) => {
  emit("delMessage", messageId);
};
</script>

<style lang="scss" scoped>
.hot-container {
  margin: 20px auto 0;
  min-width: 1070px;
  max-width: 1286px;
  .hot-part-title-panel {
    border-bottom: 1px solid #ddd;
    padding: 10px 0 20px 0;
    display: flex;
    .hot-24 {
      font-size: 20px;
      display: flex;
      align-items: center;
      position: relative;
      &::after {
        content: '';
        position: absolute;
        border-bottom: 2px solid var(--blue);
        width: 100%;
        bottom: -20px;
      }
      .icon-hot {
        width: 46px;
        height: 46px;
        background: #f07775;
        color: #fff;
        font-size: 20px;
        border-radius: 50%;
        display: flex;
        align-items: center;
        justify-content: center;
        margin-right: 10px;
      }
    }
  }
  .data-list {
    margin-top: 10px;
  }
}
</style>