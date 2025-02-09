<template>
    <div v-if="dataSource?.records != null && dataSource!.records.length == 0">
        <NoData msg="空空如也" />
    </div>
    <div class="data-list" :style="{ 'grid-template-columns': `repeat(${gridCount}, 1fr)` }">
        <template v-for="item in dataSource!.records">
            <slot :data="item"></slot>
        </template>
    </div>
    <div class="pagination" v-if="showPagination && dataSource!.total > 1">
        <el-pagination v-if="dataSource!.total > 1" background :total="dataSource!.total"
            :current-page.sync="dataSource!.current" layout="prev, pager, next" @current-change="handlePageNoChange"
            :page-size="dataSource!.size"></el-pagination>
    </div>
</template>

<script lang="ts" setup>
import { ElPagination } from 'element-plus';
import type {Page} from "@/common/Page";
import type {PropType} from "vue";
const props = defineProps({
  gridCount: {
    type: Number,
    default: 5,
  },
  dataSource: {
    type: Object as PropType<Page<any>>,
  },
  showPagination: {
    type: Boolean,
    default: true,
  },
});

const emit = defineEmits(["loadData"]);
const handlePageNoChange = (pageNo: number) => {
  props.dataSource!.current = pageNo;
  emit("loadData");
};
</script>

<style  lang="scss">
.data-list {
  display: grid;
  grid-gap: 20px;
}
.pagination {
  margin-top: 20px;
  padding: 10px 0 5px 0;
  text-align: center;
  overflow: hidden;
  height: 50px;
  display: flex;
  justify-content: left;
}</style>