<template>
    <Dialog :show="dialogConfig.show" :buttons="dialogConfig.buttons" width="400px" :showCancel="false" :top="200"
        @close="dialogConfig.show = false">
        <div class="coin-panel">
            <div class="title-info">给UP主投上 <span class="coin-count">{{ coinCount }}</span> 枚硬币</div>
            <div class="coin-list">
                <div :class="['coin-item', coinCount == 1 ? 'active' : '']" @click="setCoinCount(1)">
                    <img :src="Local.getLocalImage('coin1.png')" alt="">
                    <div class="coin-count-inner">1硬币</div>
                </div>
                <div :class="['coin-item', coinCount == 2 ? 'active' : '']" @click="setCoinCount(2)">
                    <img :src="Local.getLocalImage('coin2.png')" alt="">
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
import { ElButton } from 'element-plus';
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

const videoInfo = inject<Video>('videoInfo', {} as Video)
const submitCoin = () => {
  doUserAction(
    {
      videoId: route.params.videoId as string,
      actionType: ACTION_TYPE.VIDEO_COIN.value,
      count: coinCount.value,
    },
    () => {
      videoInfo.coinCountActive = true
      videoInfo.coinCount++
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

<style lang="scss" scoped>
.coin-panel {
  .title-info {
    text-align: center;
    font-size: 16px;
    .coin-count {
      font-size: 18px;
      padding: 0 3px;
      color: var(--blue2);
    }
  }
  .coin-list {
    margin-top: 30px;
    display: flex;
    justify-content: space-around;
    .coin-item {
      width: 150px;
      border: 2px dashed #ddd;
      border-radius: 5px;
      overflow: hidden;
      position: relative;
      cursor: pointer;
      &:hover {
        border: 2px solid var(--blue);
        .coin-count-inner {
          color: var(--blue);
        }
      }
      img {
        width: 100%;
      }
      .coin-count-inner {
        position: absolute;
        left: 10px;
        top: 10px;
        color: var(--text3);
      }
    }
    .active {
      border: 2px solid var(--blue);
      .coin-count-inner {
        color: var(--blue);
      }
    }
  }
  .sub-btn {
    text-align: center;
    margin: 30px 0 5px 0;
  }
}
</style>