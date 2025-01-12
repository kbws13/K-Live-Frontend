<template>
  <div id="app">
    <router-view></router-view>
  </div>
</template>
<script setup lang="ts">
import BasicLayout from "@/layout/BasicLayout.vue";
import { onBeforeMount, onMounted } from "vue";
import { useRoute } from "vue-router";
import VueCookies from 'vue-cookies'
import { UserService } from "./api";
import { userLoginStore } from "./stores/UserStore";
import { SystemSettingService } from "./api/services/SystemSettingService";
import { useSystemSettingStore } from "./stores/SystemSettingStore";
import { useCategoryStore } from "./stores/CategoryStore";
import type { Category } from "./api/models/response/Category/Category";
import { CategoryService } from "./api/services/CategoryService";
import FingerprintJS from "@fingerprintjs/fingerprintjs";

const route = useRoute();
const loginStore = userLoginStore();
const systemSettingStore = useSystemSettingStore();
const categoryStore = useCategoryStore();

let categoryList: Category[] = [];
let categoryMap: { [key: string]: Category } = {};

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

const loadSystemSetting = async () => {
  const res = await SystemSettingService.getSystemSetting();
  systemSettingStore.saveSetting(res);
}

const loadCategory = async() => {
  const res = await CategoryService.getAllCategory();
  categoryList = res;
  res.forEach((element) => {
    categoryMap[element.code] = element;
    element.children.forEach((sub) => {
      categoryMap[sub.code] = sub;
    });
  });
  categoryStore.saveCategoryMap(categoryMap);
  categoryStore.saveCategoryList(categoryList);
}

const loadDeviceId = async () => {
  // @ts-ignore
  let deviceId = VueCookies.get("deviceId");
  if (!deviceId) {
    const fpPromise = await FingerprintJS.load();
    const result = await fpPromise.get();
    deviceId = result.visitorId;
    // @ts-ignore
    VueCookies.set("deviceId", deviceId, -1);
  }
  loginStore.saveDeviceId(deviceId);
};

onBeforeMount(() => {
  loadDeviceId();
  autoLogin();
  loadSystemSetting();
  loadCategory();
})

onMounted(() => {
  doInit();
});
</script>
<style scoped>

</style>
