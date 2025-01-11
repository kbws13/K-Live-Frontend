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
import { useCategoryStore } from '@/stores/CategoryStore';
import { ref } from 'vue';


const categoryStore = useCategoryStore();
const categoryMap = categoryStore.categoryMap
const categoryIdInfo = ref({})
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
    parentCategoryId,
    categoryId,
  }
}

const loadingData = ref(false)
const dataSource = ref({})

const loadDataList = async () => {
    
}
</script>

<style scoped></style>