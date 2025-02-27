<template>
  <div class="video-panel">
    <div class="video-title-panel">
      <div class="video-title">我的收藏</div>
    </div>
    <div v-if="dataSource.records && dataSource.records.length == 0">
      <NoData msg="空间主人还没有收藏视频哦~~"></NoData>
    </div>
    <DataGripList :dataSource="dataSource" v-else @loadData="loadVideoList">
      <template #default="{ data }">
        <div class="data-item">
          <div class="cover" @click="jump(data)">
            <Cover :src="data.videoCover"></Cover>
          </div>
          <div class="video-name" @click="jump(data)">{{ data.videoName||"已失效视频" }}</div>
          <div class="collection-info">
            <div class="collection-time">
              收藏于： {{ Local.formatDate(data.actionTime) }}
            </div>
            <el-dropdown>
              <div class="iconfont icon-more" @click.stop v-show="myself"></div>
              <template #dropdown>
                <el-dropdown-menu>
                  <el-dropdown-item @click.stop="cancelCollection(data)">取消收藏</el-dropdown-item>
                </el-dropdown-menu>
              </template>
            </el-dropdown>
          </div>
        </div>
      </template>
    </DataGripList>
  </div>
</template>

<script lang="ts" setup>
import { ElDropdown, ElDropdownMenu, ElDropdownItem } from "element-plus"
import Local from "web/src/utils/Local";
import {useRoute, useRouter} from "vue-router";
import {userLoginStore} from "@/stores/UserStore";
import {ref} from "vue";
import Confirm from "@/utils/Confirm";
import type {Video} from "@/api/models/response/Video/Video";
import {InteractService} from "@/api/services/InteractService";
import type {Page} from "@/common/Page";
import type {Action} from "@/api/models/response/Action/Action";

const route = useRoute()
const router = useRouter()
const loginStore = userLoginStore()

//是否是自己
const myself = ref(loginStore.userInfo.id == route.params.userId)

const dataSource = ref<Page<Action>>({
  current: 1,
} as Page<Action>)
const loadVideoList = async () => {
  const pageNo = dataSource.value.current;
  const userId = route.params.userId as string
  const result = await InteractService.loadUserCollection(userId, pageNo);
  if (!result) {
    return
  }
  dataSource.value = result
}
loadVideoList()

const cancelCollection = (data: Action) => {
  Confirm({
    message: '确定要取消收藏吗？',
    okfun: async () => {
      await InteractService.doAction({
        videoId: data.videoId,
        actionType: 3,
      })
      await loadVideoList()
    },
  })
}

const jump = (item: Video) => {
  if (!item.name) {
    return
  }
  router.push(`/video/${item.id}`)
}
</script>

<style lang="scss" scoped>
.video-panel {
  padding: 20px;
  background: #fff;
  border-radius: 5px;
  .video-title-panel {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .video-title {
      font-size: 18px;
    }
  }
  .data-item {
    .video-name {
      height: 35px;
      font-size: 13px;
      color: var(--text2);
      margin-top: 10px;
      display: -webkit-box;
      overflow: hidden;
      -webkit-box-orient: vertical;
      text-overflow: -o-ellipsis-lastline;
      text-overflow: ellipsis;
      word-break: break-all;
      line-break: anywhere;
      -webkit-line-clamp: 2;
      cursor: pointer;
    }
    .collection-info {
      color: var(--text3);
      margin-top: 5px;
      display: flex;
      justify-content: space-between;
      font-size: 13px;
      .icon-more {
        cursor: pointer;
      }
    }
  }
}
</style>