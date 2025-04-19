<template>
  <div class="hot-container">
    <div class="hot-part-title-panel">
      <div class="hot-24">
        <div class="iconfont icon-hot"></div>
        <div>24小时热榜</div>
      </div>
    </div>
    <div class="data-list">
      <LoadMoreList :dataSource="dataSource" :loading="loadingData" @loadData="loadDataList" :gridCount="2">
        <template #default="{ data }">
          <VideoItem :data="data" :marginTop="20" :layoutType="1"></VideoItem>
        </template>
      </LoadMoreList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ref} from "vue";
import {VideoService} from "@/api/services/VideoService";
import type {Page} from "@/common/Page";
import type {Video} from "@/api/models/response/Video/Video";

const loadingData = ref(false)
const dataSource = ref<Page<Video>>({} as Page<Video>)
const loadDataList = async () => {
  loadingData.value = true
  let result = await VideoService.loadHotVideoList({
    current: dataSource.value.current,
  })
  loadingData.value = false
  if (!result) {
    return
  }
  const dataList = dataSource.value.records
  dataSource.value = Object.assign({}, result)
  if (result.current > 1) {
    dataSource.value.records = dataList.concat(result.records)
  }
}
loadDataList()
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