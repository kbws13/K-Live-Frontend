<template>
    <div :class="[layoutType === 'grid' ? 'data-list-grad' : '']"
        :style="{ 'grid-template-columns': `repeat(${gridCount}, 1fr)` }">
        <template v-for="item in props.dataSource!.list">
            <slot :data="item"></slot>
        </template>
    </div>
    <div class="bottom-loading" v-if="loading">
        <img :src="Local.getLocalImage('playing.gif')"  alt=""/>数据加载中....
    </div>
    <div v-if="
        props.dataSource!.pageNo >= props.dataSource!.pageTotal &&
        !loading &&
        props.dataSource!.list.length > 0
    " class="reach-bottom">
        {{ loadEndMsg }}
    </div>
    <NoData v-if="props.dataSource!.list && props.dataSource!.list.length === 0"> </NoData>
</template>

<script lang="ts" setup>
import { mitter } from '@/event/eventBus';
import { getCurrentInstance, onMounted, onUnmounted } from 'vue';
import Local from "@/utils/Local";

// @ts-ignore
const { proxy } = getCurrentInstance();

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
    if (props.loading || props.dataSource!.pageNo >= props.dataSource!.pageTotal) {
        return;
    }
    props.dataSource!.pageNo++;
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

<style></style>