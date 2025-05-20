<template>
    <div class="category-video-body">
        <div :class="['category-list', categoryFxied ? 'category-fixed' : '']" id="category-list">
            <div class="category-title">
                {{ categoryStore.currentCategory.name }}
            </div>
            <div :class="['category-item', !route.params.categoryCode ? 'active' : '']" @click="jump()">
                首页
            </div>
            <div :class="[
                'category-item',
                route.params.categoryCode == item.code ? 'active' : '',
            ]" v-for="item in categoryStore.currentCategory.children" @click="jump(item)">
                {{ item.name }}
            </div>
        </div>
        <VideoList></VideoList>
    </div>
</template>

<script lang="ts" setup>
import { useNavigatorStore } from '@/stores/NavigatorStore';
import VideoList from './VideoList.vue';
import { useRoute, useRouter } from 'vue-router';
import { useCategoryStore } from '@/stores/CategoryStore';
import { onMounted, onUnmounted, ref } from 'vue';
import { mitter } from '@/event/eventBus';

const navigatorStore = useNavigatorStore();
const categoryStore = useCategoryStore();
const route = useRoute()
const router = useRouter()

const jump = (item = { code: '' }) => {
  if (!item.code) {
    router.push({
      name: 'categoryVideo',
    })
    return
  }
  router.push({
    name: 'subCategoryVideo',
    params: {
      categoryCode: item.code,
    },
  })
}

//分类距离顶部距离
const categoryTopDistance = ref(200)
//分类是否固定
const categoryFxied = ref(false)

//初始化距离顶部距离
let initScrollTop = 0
//是否向下关东
let scrollDown = true
const scrollHandler = (curScrollTop: number) => {
  scrollDown = curScrollTop - initScrollTop > 0;
  initScrollTop = curScrollTop

  if (curScrollTop >= categoryTopDistance.value) {
    categoryFxied.value = true
    //超过分类固定向上滚动就展示顶部导航否则不展示
    if (scrollDown) {
        navigatorStore.setFixedHeader(false)
    } else {
        navigatorStore.setFixedHeader(true)
    }
  } else {
    categoryFxied.value = false
    //如果低于分类固定高度 顶部导航不展示
    navigatorStore.setFixedHeader(false)
  }
}

onMounted(() => {
  //获取分类距离顶部的距离
  categoryTopDistance.value = document
    .querySelector('#category-list')!
    .getBoundingClientRect().top
  //初始化store
  navigatorStore.setShowHeader(true)
  navigatorStore.setFixedHeader(false)
  navigatorStore.setFixedCategory(false)
  navigatorStore.setShowCategory(true)
  navigatorStore.setForceFixedHeader(false)

  // @ts-ignore
  mitter.on('windowScroll', (curScrollTop: number) => {
    scrollHandler(curScrollTop)
  })
})

onUnmounted(() => {
  mitter.off('windowScroll')
})
</script>

<style lang="scss" scoped>
.category-video-body {
  margin-top: 30px;
  .category-list {
    display: flex;
    align-items: center;
    line-height: 30px;
    position: sticky;
    top: 0px;
    height: 60px;
    background: #fff;
    z-index: 2;
    .category-title {
      font-size: 24px;
      margin-right: 40px;
      cursor: pointer;
    }
    .category-item {
      margin-right: 40px;
      font-size: 15px;
      cursor: pointer;
      border-bottom: 3px solid #fff;
      &:hover {
        color: var(--blue);
        border-color: var(--blue);
      }
    }
    .active {
      color: var(--blue);
      border-color: var(--blue);
    }
  }
  .category-fixed {
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);
  }
}
</style>