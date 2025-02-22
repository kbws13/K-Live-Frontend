<template>
    <div class="comment-panel">
        <div class="comment-title">
            <div class="title">
                评论<span class="comment-count">{{ dataSource.total }}</span>
            </div>
            <div :class="['order-type-item', orderType === 0 ? 'active' : '']" @click="changeOrder(0)">
                最热
            </div>
            <el-divider direction="vertical" />
            <div :class="['order-type-item', orderType === 1 ? 'active' : '']" @click="changeOrder(1)">
                最新
            </div>
        </div>
        <div class="comment-content-panel">
            <VideoCommentSend :sendType="0" :showSend="showComment"></VideoCommentSend>
            <div class="comment-list">
                <LoadMoreList :dataSource="dataSource" :loading="loadingData" @loadData="loadCommentList"
                    layoutType="list" loadEndMsg="没有更多评论">
                    <template #default="{ data }">
                        <VideoCommentItem :data="data" :replyLevel="data.parentCommentId === 0 ? 1 : 2"></VideoCommentItem>
                    </template>
                </LoadMoreList>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import {ElDivider} from "element-plus";
import { ACTION_TYPE } from '@/constant/ActionConstants';
import { mitter } from '@/event/eventBus';
import { computed, inject, onMounted, onUnmounted, provide, ref } from 'vue';
import VideoCommentSend from './VideoCommentSend.vue';
import LoadMoreList from '@/components/LoadMoreList.vue';
import VideoCommentItem from './VideoCommentItem.vue';
import { CommentService } from '@/api/services/CommentService';
import { useRoute } from 'vue-router';
import type { VideoComment } from '@/api/models/response/VideoComment/VideoComment';
import type { Page } from '@/common/Page';
import type {Video} from "@/api/models/response/Video/Video";

const loadingData = ref(false);
const dataSource = ref<Page<VideoComment>>({} as Page<VideoComment>);
const orderType = ref(0);
//判断是否显示弹幕
const videoInfo = inject<Video>("videoInfo", {} as Video);
const route = useRoute();
const showComment = computed(() => {
  return (
    videoInfo.interaction == null ||
    videoInfo.interaction.indexOf("1") === -1
  );
});

const showReplyHandler = (commentId: number) => {
  dataSource.value.records.forEach((item) => {
    item.showReply = item.id === commentId;
  });
};
provide("showReply", showReplyHandler);

const changeOrder = (_orderType: number) => {
  orderType.value = _orderType;
  dataSource.value.current = 1
  loadCommentList();
};

const loadCommentList = async () => {
  if (!showComment.value) {
    return;
  }
  loadingData.value = true;
  let result = await CommentService.loadComment({
      videoId: route.params.videoId as string,
      current: dataSource.value.current,
      orderType: orderType.value,
    });
  loadingData.value = false;
  if (!result) {
    return;
  }
  const userActionMap: Record<number, any> = {};
  const userActionList = result.actionList;
  userActionList.forEach((item) => {
    userActionMap[item.id] = item;
  });
  const commentData = result.page;
  commentData.records.forEach((item) => {
    setCommentActive(userActionMap, item);
    if (item.children) {
      item.children.forEach((sub) => {
        setCommentActive(userActionMap, sub);
      });
    }
  });
  const dataList = dataSource.value.records;
  dataSource.value = commentData;
  if (commentData.current > 1) {
    dataSource.value.records = dataList.concat(commentData.records);
  }
};
loadCommentList();

//设置已点赞
const setCommentActive = (userActionMap: Record<number, any>, item: VideoComment) => {
  const userActon = userActionMap[item.id];
  if (userActon) {
    if (ACTION_TYPE.COMMENT_LIKE.value === userActon.actionType) {
      item.likeCountActive = true;
    } else if (ACTION_TYPE.COMMENT_HATE.value === userActon.actionType) {
      item.hateCountActive = true;
    }
  }
};

onMounted(() => {
    // @ts-ignore
  mitter.on("postCommentSuccess", (comment: VideoComment) => {
    if (comment.parentCommentId === 0) {
      dataSource.value.records.unshift(comment);
      if (!dataSource.value.total) {
        dataSource.value.total = 1;
      } else {
        dataSource.value.total++;
      }

    } else {
      //二级回复
      const curComment = dataSource.value.records.find((item) => {
        return item.id === comment.parentCommentId;
      });
      if (!curComment) {
        return;
      }
      if (!curComment.children) {
        curComment.children = [];
      }
      curComment.children.push(comment);
    }
  });

  //删除评论
  // @ts-ignore
  mitter.on("delCommentCallback", ({ pCommentId, commentId }) => {
    if (pCommentId === 0) {
      dataSource.value.records = dataSource.value.records.filter((item) => {
        return item.id!== commentId;
      });
      dataSource.value.total--;
    } else {
      const pComment = dataSource.value.records.find((item) => {
        return item.id === pCommentId;
      });
      if(!pComment) return;
      pComment.children = pComment.children.filter((item) => {
        return item.id !== commentId;
      });
    }
  });

  //置顶
  mitter.on("topCommentCallback", () => {
    loadCommentList();
  });
});

onUnmounted(() => {
  mitter.off("postCommentSuccess");
  mitter.off("delCommentCallback");
});
</script>

<style scoped>
.comment-panel {
  margin-top: 20px;
  .comment-title {
    display: flex;
    align-items: center;
    font-size: 15px;
    .title {
      font-size: 20px;
      font-weight: 500;
      .comment-count {
        margin-left: 5px;
        font-size: 14px;
        margin-right: 30px;
        color: var(--text2);
      }
    }
    .order-type-item {
      cursor: pointer;
    }
    .active {
      color: var(--blue);
    }
  }
  .comment-content-panel {
    padding-left: 10px;
    position: relative;
    .comment-list {
      padding-bottom: 20px;
    }
  }
}
</style>