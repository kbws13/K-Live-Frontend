<template>
  <div class="commend-panel" ref="commendPanelRef">
    <div class="carousel-panel" :style="{
      width: carouselWidth + 'px',
      height: carouselWidth * 0.6 + 'px',
    }">
      <el-carousel :height="carouselWidth * 0.6 + 'px'" indicator-position="none" arrow="never" ref="elCarouselRef"
        @change="carouselChange">
        <el-carousel-item v-for="(item, index) in carouselVideoList" :key="item" :name="index + ''">
          <div class="roll-image">
            <router-link :to="`/video/${carouselVideoList[carouselIndex].id}`" target="_blank">
              <img :src="`${Resource.getResource}${item.cover}`"  alt=""/>
            </router-link>
          </div>
        </el-carousel-item>
      </el-carousel>
      <div class="carousel-bottom" v-if="carouselVideoList.length > 0">
        <div class="name-op">
          <router-link class="video-name" :to="`/video/${carouselVideoList[carouselIndex].id}`" target="_blank">{{
            carouselVideoList[carouselIndex].name }}</router-link>
          <div class="change-btn">
            <span class="iconfont icon-right" @click="preCarousel"></span>
            <span class="iconfont icon-left" @click="nextCarousel"></span>
          </div>
        </div>
        <div class="dtos">
          <div :class="['dto-item', carouselIndex == item - 1 ? 'active' : '']" v-for="item in carouselVideoList.length"
            @click="setCarousel(item)"></div>
        </div>
      </div>
    </div>
    <div class="video-list">
      <VideoItem v-for="item in commendVideoList" :data="item"></VideoItem>
    </div>
  </div>
  <VideoList></VideoList>
</template>

<script setup lang="ts">
import { ElCarousel, ElCarouselItem } from 'element-plus';
import { Resource } from '@/api/core/Url';
import type { Video } from '@/api/models/response/Video/Video';
import { VideoService } from '@/api/services/VideoService';
import { mitter } from '@/event/eventBus';
import { useNavigatorStore } from '@/stores/NavigatorStore';
import { getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import VideoList from '../VideoList/VideoList.vue';

// @ts-ignore
const { proxy } = getCurrentInstance()
const navigatorStore = useNavigatorStore();
const commendPanelRef = ref()
const carouselWidth = ref()

const resetCarouselWidth = () => {
  let width =
    (document.documentElement.clientWidth - proxy.bodyPadding * 2 - 8) * 0.4218
  if (width < 400) {
    width = 400
  }
  carouselWidth.value = width
}

onMounted(() => {
  mitter.on('windowResize', () => {
    resetCarouselWidth()
  })

  resetCarouselWidth()
  navigatorStore.setShowHeader(true)
  navigatorStore.setFixedHeader(true)
  navigatorStore.setFixedCategory(true)
  navigatorStore.setShowCategory(true)
  navigatorStore.setForceFixedHeader(false)
})

onUnmounted(() => {
  mitter.off('windowResize')
})

//轮播最多显示的视频数
const carouselMaxCount = proxy.carouselMaxCount
const carouselVideoList = ref<Video[]>([])
const commendVideoList = ref<Video[]>([])
const loadRecommendVideo = async () => {
  const res = await VideoService.getRecommendVideo();
  if (!res) return;
  if (res.length > carouselMaxCount) {
    carouselVideoList.value = res.slice(0, carouselMaxCount)
    commendVideoList.value = res.slice(
      carouselMaxCount,
      carouselMaxCount + 6
    )
  } else {
    carouselVideoList.value = res
  }
}
loadRecommendVideo()

const carouselIndex = ref<number>(0)
const carouselChange = (e: number) => {
  carouselIndex.value = e
}

const elCarouselRef = ref()
const preCarousel = () => {
  elCarouselRef.value.prev()
}

const nextCarousel = () => {
  elCarouselRef.value.next()
}

const setCarousel = (index: number) => {
  elCarouselRef.value.setActiveItem(index - 1 + '')
}

</script>

<style scoped>
.commend-panel {
  display: flex;
  margin-top: 20px;

  .carousel-panel {
    border-radius: 5px;
    overflow: hidden;
    position: relative;

    .roll-image {
      position: relative;
      background: #e9e9e9;
      text-align: center;

      a {
        display: block;
      }

      img {
        max-width: 100%;
      }
    }

    .carousel-bottom {
      position: absolute;
      bottom: 0;
      width: 100%;
      height: 65px;
      background: rgba(0, 0, 0, 0.6);
      padding: 10px;

      .name-op {
        display: flex;
        justify-content: space-between;
        align-items: center;

        .video-name {
          flex: 1;
          color: #ffff;
          text-overflow: ellipsis;
          overflow: hidden;
          white-space: nowrap;
          text-decoration: none;
          display: inline-block;
          font-size: 16px;
        }

        .change-btn {
          margin-left: 10px;
          width: 60px;
          display: flex;
          justify-content: space-between;

          .iconfont {
            cursor: pointer;
            text-align: center;
            width: 25px;
            line-height: 25px;
            font-size: 20px;
            background-color: rgba(255, 255, 255, 0.1);
            border-radius: 5px;
            color: #fff;
          }
        }
      }

      .dtos {
        display: flex;
        margin-top: 5px;
        align-items: center;

        .dto-item {
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: #b0b0b0;
          cursor: pointer;
          margin-right: 10px;
        }

        .active {
          width: 15px;
          height: 15px;
          background: #fff;
        }
      }
    }
  }

  .video-list {
    margin-left: 10px;
    flex: 1;
    display: grid;
    grid-gap: 20px;
    grid-template-columns: repeat(3, 1fr);
  }
}
</style>
