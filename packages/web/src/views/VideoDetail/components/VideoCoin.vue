<template>
    <Dialog :show="dialogConfig.show" :buttons="dialogConfig.buttons" width="400px" :showCancel="false" :top="200"
        @close="dialogConfig.show = false">
        <div class="cion-panel">
            <div class="title-info">给UP主投上 <span class="coin-count">{{ coinCount }}</span> 枚硬币</div>
            <div class="coin-list">
                <div :class="['coin-item', coinCount == 1 ? 'acitve' : '']" @click="setCoinCount(1)">
                    <img :src="Local.getLocalImage('coin1.png')">
                    <div class="coin-count-inner">1硬币</div>
                </div>
                <div :class="['coin-item', coinCount == 2 ? 'acitve' : '']" @click="setCoinCount(2)">
                    <img :src="Local.getLocalImage('coin2.png')">
                    <div class="coin-count-inner">2硬币</div>
                </div>
            </div>
            <div class="sub-btn">
                <el-button type="primary" @click="submitCoin">确定</el-button>
            </div>
        </div>

    </Dialog>
</template>

<script lang="ts" setup>
import { doUserAction } from '@/api'
import type { Video } from '@/api/models/response/Video/Video'
import { ACTION_TYPE } from '@/constant/ActionConstants'
import Local from '@/utils/Local'
import Message from '@/utils/Message'
import { inject, ref } from 'vue'
import { useRoute } from 'vue-router'

const route = useRoute()

const dialogConfig = ref({
  show: false,
  title: '投币',
  buttons: [],
})
const coinCount = ref(1)

const setCoinCount = (count: number) => {
  coinCount.value = count
}

const videoInfo = inject<Video>('videoInfo')
const submitCoin = () => {
  doUserAction(
    {
      videoId: route.params.videoId[0],
      actionType: ACTION_TYPE.VIDEO_COIN.value,
      count: coinCount.value,
    },
    () => {
      videoInfo.value.coinCountActive = true
      videoInfo.value.coinCount++
      dialogConfig.value.show = false
      Message.success('投币成功')
    }
  )
}

const show = () => {
  dialogConfig.value.show = true
  coinCount.value = 1
}
defineExpose({
  show,
})
</script>

<style lang="scss" scoped></style>