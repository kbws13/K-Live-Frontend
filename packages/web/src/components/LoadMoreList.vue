<template>
    <div :class="[layoutType === 'grid' ? 'data-list-grad' : '']"
        :style="{ 'grid-template-columns': `repeat(${gridCount}, 1fr)` }">
        <template v-for="item in dataSource!.records">
            <slot :data="item"></slot>
        </template>
    </div>
    <div class="bottom-loading" v-if="loading">
        <img :src="Local.getLocalImage('playing.gif')"  alt=""/>数据加载中....
    </div>
    <div v-if="
        dataSource!.current >= dataSource!.total &&
        !loading &&
        dataSource!.records.length > 0
    " class="reach-bottom">
        {{ loadEndMsg }}
    </div>
    <NoData v-if="dataSource!.records && dataSource!.records.length === 0"> </NoData>
</template>

<script lang="ts" setup>
import { mitter } from '@/event/eventBus';
import { onMounted, onUnmounted } from 'vue';
import Local from "@/utils/Local";

const props = defineProps({
    layoutType: {
        type: String,
        default: "grid",
    },
    dataSource: {
        type: Object,
    },
    loading: {
        type: Boolean,
    },
    loadEndMsg: {
        type: String,
        default: "已经到底啦~~",
    },
    gridCount: {
        type: Number,
        default: 5,
    },
});

const emit = defineEmits(["loadData"]);
const scrollHandler = (curScrollTop: number) => {
    if (window.innerHeight + curScrollTop < document.body.offsetHeight) {
        return;
    }
    if (props.loading || props.dataSource!.current >= props.dataSource!.total) {
        return;
    }
    props.dataSource!.current++;
    emit("loadData");
};

onMounted(() => {
    // @ts-ignore
    mitter.on("windowScroll", (curScrollTop: number) => {
        scrollHandler(curScrollTop);
    });
});

onUnmounted(() => {
    mitter.off("windowScroll");
});
</script>

<style lang="scss" scoped>
.data-list-grad {
  display: flex;
  grid-gap: 20px;
  padding-bottom: 10px;
}

.reach-bottom {
  text-align: center;
  line-height: 40px;
  color: var(--text3);
  img {
    width: 20px;
    margin-right: 10px;
  }
}
</style>