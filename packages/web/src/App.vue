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
import { onBeforeMount, onMounted } from "vue";
import { useRoute } from "vue-router";
import VueCookies from 'vue-cookies'
import { UserService } from "./api";
import { userLoginStore } from "./stores/UserStore";

const route = useRoute();
const loginStore = userLoginStore();

/**
 * 全局初始化函数
 */
const doInit = () => {
  console.log("I'm kbws. Welcome to K-Live");
};

const autoLogin = async() => {
  // @ts-ignore
  const token = VueCookies.get("token");
  if(!token) return;
  const res = await UserService.autoLogin();
  if(!res) return;
  loginStore.saveUserInfo(res);
}

onBeforeMount(() => {
  autoLogin();
})

onMounted(() => {
  doInit();
});
</script>
<style scoped>

</style>
