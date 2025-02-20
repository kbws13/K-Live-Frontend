<template>
  <div class="data-list">
    <LoadMoreList :dataSource="dataSource" :loading="loadingData" @loadData="loadDataList">
      <template #default="{ data }">
        <VideoItem :data="data" :marginTop="20" ref="videoItemRef"></VideoItem>
      </template>
    </LoadMoreList>
  </div>
</template>

<script lang="ts" setup>
import {useCategoryStore} from '@/stores/CategoryStore';
import {ref, watch} from 'vue';
import type {Page} from "@/common/Page";
import type {Video} from "@/api/models/response/Video/Video";
import type {VideoQueryRequest} from "@/api/models/request/Video/VideoQueryRequest";
import {VideoService} from "@/api/services/VideoService";
import {useRoute} from "vue-router";

const route = useRoute()
const categoryStore = useCategoryStore();
const categoryMap = categoryStore.categoryMap
const categoryIdInfo = ref({
  parentCategoryId: 0,
  categoryId: 0,
})
const convertCode2Id = (parentCode: number, code: string) => {
  let parentCategoryId;
  let categoryId;
  if (parentCode) {
    parentCategoryId = categoryMap[parentCode]
        ? categoryMap[parentCode].id
        : ''
  }
  if (code) {
    categoryId = categoryMap[code]
        ? categoryMap[code].id
        : ''
  }
  categoryIdInfo.value = {
    parentCategoryId: parentCategoryId as number,
    categoryId: categoryId as number,
  }
}

const loadingData = ref(false)
const dataSource = ref<Page<Video> | null>({
  records: [],
  total: 0,
  size: 10,
  current: 1,
  searchCount: true,
});

const loadDataList = async () => {
  let params = {
    current: dataSource.value?.current ?? 1,
    parentCategoryId: categoryIdInfo.value.parentCategoryId,
    categoryId: categoryIdInfo.value.parentCategoryId,
  } as VideoQueryRequest;
  loadingData.value = true
  let result = await VideoService.getVideoList(params);
  loadingData.value = false
  if (!result) {
    return
  }
  dataSource.value = result
  if (result.current > 1 && dataSource.value.records) {
    const dataList = dataSource.value.records;
    dataSource.value.records = dataList.concat(result.records)
  }
}

const initData = () => {
  // @ts-ignore
  convertCode2Id(route.params.parentCategoryCode, route.params.categoryCode)
  loadDataList()
}

const categoryInit = ref(false)
watch(
    () => route.params,
    (newVal, oldVal) => {
      if (newVal) {
        if (!categoryInit.value) {
          return
        }
        // @ts-ignore
        categoryStore.setCurrentPCategory(route.params.pCategoryCode)
        initData()
      }
    },
    {immediate: true, deep: true}
)

watch(
    () => categoryStore.categoryMap,
    (newVal, oldVal) => {
      if (!newVal || Object.keys(newVal).length == 0) {
        return
      }
      categoryInit.value = true
      // @ts-ignore
      categoryStore.setCurrentPCategory(route.params.pCategoryCode)
      initData()
    },
    {immediate: true, deep: true}
)
</script>

<style scoped></style>