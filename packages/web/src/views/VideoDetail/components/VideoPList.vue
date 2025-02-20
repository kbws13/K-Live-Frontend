<template>
    <div class="video-panel" v-if="videoList.length > 1">
        <div class="video-panel-title">
            <div class="title">
                视频选集<span class="video-count">({{ currentP }}/{{ videoList.length }})</span><span
                    class="iconfont icon-list"></span>
            </div>
            <el-switch v-model="autoPlay" inactive-text="自动连播" />
        </div>
        <el-scrollbar :max-height="600" class="video-list">
            <div :class="['video-item', index === currentP - 1 ? 'active' : '']" v-for="(item, index) in videoList"
                @click="selectVideo(index + 1)">
                <div class="playing" v-if="index === currentP - 1"></div>
                <div class="title" :title="item.title">
                    P{{ index + 1 }} {{ item.fileName }}
                </div>
                <div class="duration">
                    {{ Local.convertSecondsToHMS(item.duration) }}
                </div>
            </div>
        </el-scrollbar>
    </div>
</template>

<script lang="ts" setup>
import { ElSwitch, ElScrollbar } from 'element-plus';
import type { VideoFile } from '@/api/models/response/Video/VideoFile';
import { VideoService } from '@/api/services/VideoService';
import { mitter } from '@/event/eventBus';
import Local from '@/utils/Local';
import { onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const route = useRoute();
const router = useRouter();
const autoPlay = ref(true);
const currentP = ref(route.query.p ? Number.parseInt(route.query.p as string) : 1);
const emit = defineEmits(["selectVideoFile"]);
const videoList = ref<VideoFile[]>([]);
console.log("route.params.videoId", route.params.videoId);

const loadVideoPList = async () => {
    let result = await VideoService.loadVideoPList(route.params.videoId as string);
    if (!result) {
        return;
    }
    videoList.value = result;

    selectVideoFile();
};
loadVideoPList();

const selectVideo = (index: number) => {
    currentP.value = index;
    router.push({
        path: route.path,
        query: {
            p: index,
        },
    });
    selectVideoFile();
};

const selectVideoFile = () => {
    mitter.emit("changeP", videoList.value[currentP.value - 1].fileId);
};

onMounted(() => {
    mitter.on("playEnd", () => {
        if (
            autoPlay.value &&
            videoList.value.length > 1 &&
            currentP.value < videoList.value.length
        ) {
            selectVideo(currentP.value + 1);
        }
    });
});

onUnmounted(() => {
    mitter.off("playEnd");
});
</script>

<style lang="scss" scoped>
.video-panel {
    margin-top: 20px;
    background: #f1f2f3;
    border-radius: 5px;
    padding: 10px;

    .video-panel-title {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .title {
            padding: 10px;
            font-size: 16px;

            .video-count {
                font-size: 14px;
                color: var(--text3);
            }

            .icon-list {
                font-size: 18px;
                cursor: pointer;
                margin-left: 10px;
                color: #757575;

                &:hover {
                    color: var(--blue);
                }
            }
        }
    }

    .video-list {
        .video-item {
            padding: 6px 8px;
            display: flex;
            align-items: center;
            cursor: pointer;
            margin-top: 5px;
            border-radius: 3px;

            .playing {
                width: 14px;
                height: 14px;
                margin-right: 5px;
                background-position: center center;
                background-size: cover;
                background-repeat: no-repeat;
                background-image: url("@/assets/playing.gif");
            }

            .title {
                flex: 1;
                overflow: hidden;
                white-space: nowrap;
                text-overflow: ellipsis;
            }

            .duration {
                margin-left: 5px;
            }

            &:hover {
                background: #fff;
            }
        }

        .active {
            background: #fff;
        }
    }
}
</style>