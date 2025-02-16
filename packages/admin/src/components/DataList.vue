<template>
  <div v-if="dataSource?.records != null && dataSource?.records.length == 0">
    <NoData msg="空空如也"/>
  </div>
  <template v-for="item in dataSource?.records">
    <slot :data="item"></slot>
  </template>
  <div class="pagination" v-if="showPagination">
    <el-pagination
        v-if="dataSource!.pageTotal > 1"
        background
        :total="dataSource!.size"
        :current-page.sync="dataSource!.current"
        layout="prev, pager, next"
        @current-change="handlePageNoChange"
        :page-size="dataSource!.size"
    ></el-pagination>
  </div>
</template>

<script lang="ts" setup>
import { ElPagination } from 'element-plus';

const props = defineProps({
  dataSource: {
    type: Object,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(['loadData'])
const handlePageNoChange = (pageNo: number) => {
  props.dataSource!.pageNo = pageNo
  emit('loadData')
}
</script>

<style lang="scss" scoped>
.pagination {
  padding: 10px 0 5px 0;
  text-align: right;
  overflow: hidden;
  height: 50px;

  :deep(.el-pagination) {
    float: right;
  }
}
</style>