<template>
  <div class="comment-panel">
    <VideoSearchSelect @loadData="loadData4VideoSelect"></VideoSearchSelect>
    <Table
        ref="tableInfoRef"
        :columns="columns"
        :fetch="loadDataList"
        :dataSource="tableData"
        :options="tableOptions"
        :extHeight="tableOptions.extHeight"
    >
      <template #slotComment="{ row }">
        <div class="comment-info">
          <Avatar :avatar="row.avatar" :userId="row.userId"></Avatar>
          <div class="comment">
            <div>
              <router-link
                  target="_blank"
                  class="a-link nick-name"
                  :to="`/user/${row.userId}`"
              >{{ row.nickName }}
              </router-link>
              <template v-if="row.replyUserId">
                回复@
                <router-link
                    target="_blank"
                    class="a-link nick-name"
                    :to="`/user/${row.replyUserId}`"
                >{{ row.replyNickName }} </router-link
                >的评论
              </template>
            </div>

            <div class="content">{{ row.content }}</div>
            <div v-if="row.imgPath" class="image-show">
              <Cover
                  :src="row.imgPath + imageThumbnailSuffix"
                  :preview="true"
                  fit="cover"
              ></Cover>
            </div>
            <div class="time-info">
              <div class="time">{{ row.postTime }}</div>
              <div
                  class="iconfont icon-delete"
                  @click="delComment(row.id)"
              ></div>
            </div>
          </div>
        </div>
      </template>

      <template #slotVideo="{ row }">
        <router-link
            :to="`/video/${row.videoId}`"
            target="_blank"
            class="a-link"
        >
          <Cover :src="row.cover"></Cover>
          <div class="video-name">{{ row.videoName }}</div>
        </router-link>
      </template>
    </Table>
  </div>
</template>
<script setup lang="ts">
import Table from "@/components/Table.vue";
import VideoSearchSelect from "@/views/CreateCenter/VideoSearchSelect.vue";
import {imageThumbnailSuffix} from "@/constant/ResourceConstant";
import {ref} from "vue";
import {useRoute} from "vue-router";
import {CommentService} from "@/api/services/CommentService";
import type {CommentLoadRequest} from "@/api/models/request/VideoComment/CommentLoadRequest";
import Confirm from "@/utils/Confirm";
import Message from "@/utils/Message";

const route = useRoute();
const currentVideoId = ref(route.query.videoId as string);
const loadData4VideoSelect = (videoId: string) => {
  currentVideoId.value = videoId;
  loadDataList();
};

const columns = [
  {
    label: "评论信息",
    scopedSlots: "slotComment",
  },
  {
    label: "视频信息",
    scopedSlots: "slotVideo",
    width: 150,
  },
];

const tableInfoRef = ref();
const tableOptions = ref({
  extHeight: 10,
});
const tableData = ref({
  current: 1,
  pageSize: 20,
});
// TODO
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.current,
    pageSize: tableData.value.pageSize,
    videoId: currentVideoId.value,
    loadChildren: false,
  };
  let result = await CommentService.loadComment(params as CommentLoadRequest);
  if (!result) {
    return;
  }
  Object.assign(tableData.value, result.page);
};

const delComment = (commentId: number) => {
  Confirm({
    message: "确定要删除吗？",
    okfun: async () => {
      let result = await CommentService.deleteComment(commentId);
      if (!result) {
        return;
      }
      Message.success("删除成功");
      await loadDataList();
    },
  });
};
</script>
<style scoped lang="scss">
.comment-panel {
  .comment-info {
    display: flex;
    .comment {
      margin-left: 10px;
    }
    .time-info {
      display: flex;
      font-size: 12px;
      .iconfont {
        margin-left: 5px;
        font-size: 13px;
        cursor: pointer;
      }
    }
  }
  .video-name {
    text-decoration: none;
    color: var(--text3);
    font-size: 13px;
    margin-top: 5px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
.image-show {
  width: 100px;
  height: 100px;
  overflow: hidden;
  margin: 5px 0;
}
</style>