<template>
    <div class="comment-panel">
        <div class="comment-title">
            <div class="title">
                评论<span class="comment-count">{{ dataSource.totalCount }}</span>
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
                        <VideoCommentItem :data="data"></VideoCommentItem>
                    </template>
                </LoadMoreList>
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
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

//判断是否显示弹幕
const videoInfo = inject("videoInfo");
const route = useRoute();
const showComment = computed(() => {
  return (
    videoInfo.value.interaction == null ||
    videoInfo.value.interaction.indexOf("1") === -1
  );
});

const showReplyHandler = (commentId: number) => {
  dataSource.value.list.forEach((item) => {
    item.showReply = item.commentId === commentId;
  });
};
provide("showReply", showReplyHandler);

const loadingData = ref(false);
const dataSource = ref<Page<VideoComment>>({} as Page<VideoComment>);
const orderType = ref(0);

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
  let result = await CommentService.loadAllComment({
      videoId: route.params.videoId[0],
      current: dataSource.value.current,
      orderType: orderType.value,
    });
  loadingData.value = false;
  if (!result) {
    return;
  }
  const userActionMap = {};
  const userActionList = result.data.userActionList;
  userActionList.forEach((item) => {
    userActionMap[item.commentId] = item;
  });
  const commentData = result.data.commentData;
  commentData.list.forEach((item) => {
    setCommentActive(userActionMap, item);
    if (item.children) {
      item.children.forEach((sub) => {
        setCommentActive(userActionMap, sub);
      });
    }
  });
  const dataList = dataSource.value.list;
  dataSource.value = Object.assign({}, commentData);
  if (commentData.pageNo > 1) {
    dataSource.value.list = dataList.concat(commentData.list);
  }
};
loadCommentList();

//设置已点赞
const setCommentActive = (userActionMap, item) => {
  const userActon = userActionMap[item.commentId];
  if (userActon) {
    if (ACTION_TYPE.COMMENT_LIKE.value === userActon.actionType) {
      item.likeCountActive = true;
    } else if (ACTION_TYPE.COMMENT_HATE.value === userActon.actionType) {
      item.hateCountActive = true;
    }
  }
};

//删除评论
const delCommentCallback = () => {};

onMounted(() => {
    // @ts-ignore
  mitter.on("postCommentSuccess", (comment: VideoComment) => {
    if (comment.parentCommentId === 0) {
      dataSource.value.list.unshift(comment);
      if (!dataSource.value.totalCount) {
        dataSource.value.totalCount = 1;
      } else {
        dataSource.value.totalCount++;
      }
      
    } else {
      //二级回复
      const curComment = dataSource.value.list.find((item) => {
        return item.commentId === comment.parentCommentId;
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
      dataSource.value.list = dataSource.value.list.filter((item) => {
        return item.commentId !== commentId;
      });
      dataSource.value.totalCount--;
    } else {
      const pComment = dataSource.value.list.find((item) => {
        return item.commentId === pCommentId;
      });
      pComment.children = pComment.children.filter((item) => {
        return item.commentId !== commentId;
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

<style scoped></style>