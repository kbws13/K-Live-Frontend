<template>
    <div class="main-container" :style="{ 'max-width': proxy.bodyMaxWidth + 'px', 'min-width': proxy.bodyMinWidth + 'px' }">
        <div class="header">
          <GlobalHeader />
        </div>
        <div class="header-fixed" v-if="showFixedHeader">
          <GlobalHeader theme="dark" />
        </div>
        <LoginView />
        <div style="height: 2000px;"></div>
        <router-view v-slot="{ Component }">
          <transition name="fade" mode="out-in" appear>
            <keep-alive>
              <component :is="Component" />
            </keep-alive>
          </transition>
        </router-view>
      </div>
</template>

<script lang="ts" setup>
import GlobalHeader from '@/components/GlobalHeader.vue';
import LoginView from '@/views/User/LoginView.vue';
import { getCurrentInstance, onMounted, ref } from 'vue';

const { proxy } = getCurrentInstance();

const showFixedHeader = ref(false);
const windowScrollHandler = () => {
  const curScrollTop = window.scrollY;
  showFixedHeader.value = curScrollTop > 20;
}
onMounted(() => {
    window.addEventListener('scroll', windowScrollHandler);
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
    background-image: url(../assets/banner_bg.png);
    
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