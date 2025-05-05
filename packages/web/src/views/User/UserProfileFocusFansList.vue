<template>
  <div class="body-container">
    <div class="body-title">
      {{ route.name == "userProfileFocus" ? "我的关注" : "我的粉丝" }}
    </div>
    <DataList :dataSource="dataSource" @loadData="loadDataList">
      <template #default="{ data }">
        <div class="data-item">
          <Avatar
              :avatar="data.otherAvatar"
              :userId="data.otherUserId"
          ></Avatar>
          <div class="user-info">
            <div class="nick-name">
              <router-link
                  :to="`/user/${data.otherUserId}`"
                  target="_blank"
                  class="a-link"
              >
                {{ data.otherNickName }}
              </router-link>
            </div>
            <div class="introduction">
              {{ data.otherPersonIntroduction || "这个人没有填简介啊~~~" }}
            </div>
          </div>
          <div class="op-btns">
            <div v-if="data.focusType == 1" class="focus-eachother">已互粉</div>
            <el-button
                link
                type="primary"
                @click="cancelFocus(data.otherUserId)"
                v-if="route.name == 'userProfileFocus' || data.focusType == 1"
            >取消关注</el-button
            >

            <el-button
                type="primary"
                v-if="route.name == 'userProfileFans' && data.focusType == 0"
                @click="focus(data.otherUserId)"
            >关注</el-button
            >
          </div>
        </div>
      </template>
    </DataList>
  </div>
</template>

<script lang="ts" setup>
import { ElButton } from "element-plus"
import {useRoute} from "vue-router";
import {inject, ref, watch} from "vue";
import {HomeService} from "@/api/services/HomeService";
import type {Page} from "@/common/Page";
import type {FocusVO} from "@/api/models/response/Focus/FocusVO";

const route = useRoute();
const dataSource = ref<Page<FocusVO>>({
  current: 1,
  size: 10,
  total: 0,
  records: [],
  pageTotal: 1,
  searchCount: false,
} as Page<FocusVO>);
const isFocus = route.name == "userProfileFocus";
const loadDataList = async () => {
  if(isFocus) {
    const result = await HomeService.loadFocusList(dataSource.value.current);
    if (!result) {
      return;
    }
    dataSource.value = result;
  } else {
    const result = await HomeService.loadFansList(dataSource.value.current);
    if (!result) {
      return;
    }
    dataSource.value = result;
  }
};
loadDataList();
const cancelFocusUser = inject("cancelFocusUser");
const cancelFocus = (otherUserId: string) => {
  // @ts-ignore
  cancelFocusUser(otherUserId, () => {
    loadDataList();
  });
};

const focusUser = inject("focusUser");
const focus = (otherUserId: string) => {
  // @ts-ignore
  focusUser(otherUserId, () => {
    loadDataList();
  });
};

watch(
    () => route.name,
    (newVal) => {
      console.log(newVal);
      if (newVal == "uhomeFocus" || newVal == "uhomeFans") {
        loadDataList();
      }
    },
    { immediate: true, deep: true }
);
</script>

<style lang="scss" scoped>
.body-container {
  background: #ffff;
  padding: 20px;
  border-radius: 5px;
  .body-title {
    font-size: 18px;
    color: #6d757a;
    border-bottom: 1px solid #e5e9ef;
    padding: 0 0 10px 0;
  }
  .data-item {
    display: flex;
    align-items: center;
    padding: 10px;
    .user-info {
      flex: 1;
      margin: 0 10px;
      .introduction {
        margin-top: 10px;
        font-size: 13px;
        color: #6d757a;
        overflow: hidden;
        white-space: nowrap;
        width: 100%;
        text-overflow: ellipsis;
        padding-right: 10px;
      }
    }
    .op-btns {
      display: flex;
      align-items: center;
      .focus-eachother {
        margin-right: 10px;
        color: var(--text3);
      }
    }
  }
}
</style>