<template>
  <div id="app">
    <template v-if="route.path.startsWith('/user')">
      <router-view />
    </template>
    <template v-else>
      <BasicLayout />
    </template>
  </div>
</template>
<script setup lang="ts">
import BasicLayout from "@/layout/BasicLayout.vue";
import { onMounted } from "vue";
import { useRoute } from "vue-router";

const route = useRoute();

/**
 * 全局初始化函数
 */
const doInit = () => {
  console.log("Welcome to my Online Judge");
};

onMounted(() => {
  doInit();
});
</script>
<style scoped>

</style>
