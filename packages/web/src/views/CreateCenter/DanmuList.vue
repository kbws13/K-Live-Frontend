<template>
  <div class="danmu-panel">
    <VideoSearchSelect @loadData="loadData4VideoSelect"></VideoSearchSelect>
    <Table ref="tableInfoRef" :columns="columns" :fetch="loadDataList" :dataSource="tableData" :options="tableOptions"
           :extHeight="tableOptions.extHeight">

      <template #slotNickName="{row}">
        <router-link target="_blank" class="nick-name" :to="`/user/${row.userId}`">{{row.nickName}}</router-link>
      </template>
      <template #time="{ row }">
        {{Local.convertSecondsToHMS(Math.round(row.time))}}
      </template>

      <template #slotOperation="{ row }">
        <a href="javascript:void(0)" class="a-link" @click="delDanmu(row.id)">删除</a>
      </template>

      <template #slotText="{row}">
        <div>{{row.text}}</div>
        <router-link target="_blank" class="video-info" :to="`/video/${row.videoId}`">视频：{{row.videoName}}</router-link>
      </template>
    </Table>
  </div>
</template>

<script lang="ts" setup>
import Table from "@/components/Table.vue";
import VideoSearchSelect from "@/views/CreateCenter/VideoSearchSelect.vue";
import Local from "web/src/utils/Local";
import {ref} from "vue";
import {useRoute} from "vue-router";
import Confirm from "@/utils/Confirm";
import Message from "@/utils/Message";
import {DanmuService} from "@/api/services/DanmuService";
import type {DanmuQuery} from "@/api/models/request/Danmu/DanmuQuery";

const route = useRoute()

const currentVideoId = ref(route.query.videoId as string)
const loadData4VideoSelect = (videoId: string) => {
  currentVideoId.value = videoId
  loadDataList()
}

const columns = [
  {
    label: '发送者',
    prop: 'nickName',
    width: 150,
    scopedSlots: 'slotNickName',
  },
  {
    label: '播放时间',
    prop: 'time',
    scopedSlots: 'time',
    width: 100,
  },
  {
    label: '弹幕内容',
    prop: 'text',
    scopedSlots: 'slotText',
  },
  {
    label: '发送时间',
    prop: 'postTime',
    width: 180,
  },
  {
    label: '操作',
    prop: 'operation',
    width: 80,
    scopedSlots: 'slotOperation',
  },
]

const tableInfoRef = ref()
const tableOptions = ref({
  extHeight: 10,
})

const tableData = ref({
  current: 1,
  pageSize: 20,
});
const loadDataList = async () => {
  let params = {
    pageNo: tableData.value.current,
    pageSize: tableData.value.pageSize,
    videoId: currentVideoId.value,
  }
  let result = await DanmuService.loadAllDanmu(params as DanmuQuery);
  if (!result) {
    return
  }
  Object.assign(tableData.value, result);
}

const delDanmu = (danmuId: number) => {
  Confirm({
    message: '确定要删除吗？',
    okfun: async () => {
      let result = await DanmuService.deleteDanmu(danmuId);
      if (!result) {
        return
      }
      Message.success('删除成功')
      await loadDataList()
    },
  })
}
</script>

<style lang="scss" scoped>
.video-info,
.nick-name {
  margin-top: 5px;
  font-size: 12px;
  color: var(--text3);
  text-decoration: none;
}
.nick-name {
  font-size: 14px;
  color: var(--text2);
}
</style>