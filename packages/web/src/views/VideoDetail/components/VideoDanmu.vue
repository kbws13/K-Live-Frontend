<template>
    <div class="danmu-panel">
        <Collapse>
            <template #title>
                <div class="danmu-panel-title">
                    <div>弹幕列表</div>
                    <div class="iconfont icon-more"></div>
                </div>
            </template>
            <div class="danmu-list">
                <div class="danmu-title danmu-item">
                    <div class="time">时间</div>
                    <div class="content">弹幕内容</div>
                    <div class="send-time">发送时间</div>
                </div>
                <el-scrollbar height="400px" :max-height="playerHeight - 60">
                    <div :class="['danmu-item', item.id === selectDanmu.id ? 'active' : '']"
                        v-for="item in danmuList" @click="danmuSelect(item)">
                        <div class="time">{{ Local.convertSecondsToHMS(Math.round(item.time)) }}</div>
                        <div class="content" :title="item.text">
                            {{ item.text }}
                        </div>
                        <div class="send-time">{{ item.postTime }}</div>
                    </div>
                    <NoData msg="暂无弹幕" v-if="danmuList.length === 0"></NoData>
                </el-scrollbar>
            </div>
        </Collapse>
    </div>
</template>

<script lang="ts" setup>
import { ElScrollbar } from 'element-plus';
import type { Danmu } from '@/api/models/response/Danmu/Danmu'
import { mitter } from '@/event/eventBus'
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue'
import Local from "web/src/utils/Local";

// @ts-ignore
const { proxy } = getCurrentInstance();
const playerHeight = proxy.playerHeight;

const danmuList = ref<Danmu[]>([] as Danmu[]);
const selectDanmu = ref<Danmu>({} as Danmu);
const danmuSelect = (item: Danmu) => {
    selectDanmu.value = item
}

onMounted(() => {
  // @ts-ignore
    mitter.on('loadDanmu', (data: Danmu[]) => {
        data.sort(function (a, b) {
            return a.time - b.time
        })
        danmuList.value = data
    })
})

onUnmounted(() => {
    mitter.off('loadDanmu')
})
</script>

<style lang="scss" scoped>
.danmu-panel {
    .danmu-panel-title {
        display: flex;
        align-items: center;

        .icon-more {
            margin-left: 10px;
        }
    }

    .danmu-list {

        .danmu-item,
        .danmu-title {
            padding: 0 10px;
            cursor: pointer;
            color: var(--text2);
            display: flex;
            font-size: 12px;
            text-align: left;
            line-height: 25px;

            .time {
                width: 50px;
            }

            .content {
                flex: 1;
            }

            .send-time {
                width: 130px;
            }
        }

        .active {
            background: #f4f4f5;
        }
    }
}
</style>