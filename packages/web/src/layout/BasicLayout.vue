<template>
  <div class="main-container"
    :style="{ 'max-width': proxy.bodyMaxWidth + 'px', 'min-width': proxy.bodyMinWidth + 'px' }">
    <div class="header" v-show="navigatorStore.showHeader" :style="{
      'background-image': `url(${backgroundImage
        ? backgroundImage
        : Local.getLocalImage('banner_bg.png')
        })`,
    }">
      <GlobalHeader theme="light" />
    </div>
    <div class="header-fixed" v-show="(navigatorStore.fixedHeader && showFixedHeader) ||
      navigatorStore.forceFixedHeader
      " :style="{
        'max-width': proxy.bodyMaxWidth + 'px',
        'min-width': proxy.bodyMinWidth + 'px',
      }">
      <GlobalHeader theme="dark" />
    </div>
    <div class="category-fixed" v-show="navigatorStore.fixedCategory && showFixedCategory" :style="{
      'max-width': proxy.bodyMaxWidth + 'px',
      'min-width': proxy.bodyMinWidth + 'px',
    }" @mouseover="lineCategoryMouseHandler(1)" @mouseout="lineCategoryMouseHandler(0)">
      <div class="category-fixed-content">
        <CategoryWidget :showType="1" :mouseOver="mouseOver" />
      </div>
    </div>
    <div class="body-container" :style="{
      'max-width': proxy.bodyMaxWidth + 'px',
      'min-width': proxy.bodyMinWidth + 'px',
    }">
      <div class="category" v-show="navigatorStore.showCategory">
        <CategoryWidget :showType="0"></CategoryWidget>
      </div>
      <div class="body-main">
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in" appear>
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
    </div>
    <LoginView />
  </div>
</template>

<script lang="ts" setup>
import GlobalHeader from '@/components/GlobalHeader.vue';
import LoginView from '@/views/User/LoginView.vue';
import { computed, getCurrentInstance, onBeforeMount, onMounted, onUnmounted, ref } from 'vue';
import { CategoryService } from '@/api/services/CategoryService';
import { useCategoryStore } from '@/stores/CategoryStore';
import type { Category } from '@/api/models/response/Category/Category';
import CategoryWidget from './CategoryWidget.vue';
import { useNavigatorStore } from '@/stores/NavigatorStore';
import { mitter } from '@/event/eventBus';
import { Resource } from '@/api/core/Url';
import Local from '@/utils/Local';

// @ts-ignore
const { proxy } = getCurrentInstance();
const navigatorStore = useNavigatorStore();

const showFixedHeader = ref(false);
const showFixedCategory = ref(false)
const windowScrollHandler = () => {
  const curScrollTop = window.scrollY;
  showFixedHeader.value = curScrollTop > 20;
  showFixedCategory.value = curScrollTop > 250;
}

const windowResizeHandler = () => {
  mitter.emit('windowResize')
}

const categoryStore = useCategoryStore();
let categoryList: Category[] = [];
let categoryMap: { [key: string]: Category } = {};

const loadCategory = async () => {
  const res = await CategoryService.getAllCategory();
  categoryList = res;
  res.forEach((item) => {
    categoryMap[item.code] = item;
    item.children.forEach((child) => {
      categoryMap[child.code] = child;
    });
  });
  categoryStore.saveCategoryList(categoryList);
  categoryStore.saveCategoryMap(categoryMap);
}

const mouseOver = ref(false)
const lineCategoryMouseHandler = (type: number) => {
  mouseOver.value = type === 1;
}

const backgroundImage = computed(() => {
  const background = categoryStore.currentCategory
    ? categoryStore.currentCategory.background
    : null
  if (background) {
    return Resource.getResource + background
  } else {
    return null
  }
})

onBeforeMount(() => {
  loadCategory();
})

onMounted(() => {
  window.addEventListener('scroll', windowScrollHandler);
  window.addEventListener('resize', windowResizeHandler)
})

onUnmounted(() => {
  window.removeEventListener('scroll', windowScrollHandler)
  window.removeEventListener('resize', windowResizeHandler)
})
</script>

<style>
body {
  background: #ededed !important;
}

.header {
  position: relative;
  width: 100%;
  margin: 0 auto;
  background-color: #7c9ce1;
  background-position: center;
  background-repeat: no-repeat;
  height: 180px;
}

.header-fixed {
  position: fixed;
  width: 100%;
  top: 0;
  background: #fff;
}

.main-container {
  background: #fff;
  margin: 0 auto;
  min-height: calc(100vh);

  .category-fixed {
    position: fixed;
    z-index: 1000;
    top: 64px;
    width: 100%;
    background: #fff;
    padding: 10px 150px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.08);

    .category-fixed-content {
      margin: 0 auto;
    }
  }

  .body-container {
    padding: 0 var(--bodyPadding);

    .category {
      margin-top: 20px;
    }
  }
}

@media screen and (max-width: 1500px) {
  .main-container {
    .body-container {
      padding: 0 60px;
    }
  }
}

/* 内容区域过渡动画：淡入淡出效果 */
/* 刚开始进入时 */
.fade-enter-from {
  /* 透明度 */
  opacity: 0;
}

/* 刚开始结束 */
.fade-enter-to {
  opacity: 1;
}

/* 刚开始离开 */
.fade-leave-from {
  opacity: 1;
}

/* 离开已结束 */
.fade-leave-to {
  opacity: 0;
}

/* 离开进行中 */
.fade-leave-active {
  transition: all 0.3s;
}

/* 进入进行中 */
.fade-enter-active {
  transition: all 0.3s;
  transition-delay: 0.3s;
}
</style>