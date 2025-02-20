<template>
  <div class="video-detail">
    <div class="video-header">
      <div class="video-title">
        <div class="title">
          {{ videoInfo.name }}
        </div>
        <div class="video-info">
          <div class="iconfont icon-play2">{{ videoInfo.playCount }}</div>
          <div class="iconfont icon-danmu">{{ videoInfo.danmuCount }}</div>
          <div class="iconfont">{{ videoInfo.createTime }}</div>
        </div>
      </div>
      <div class="video-user-info">
        <Avatar :userId="userInfo.id" :avatar="userInfo.avatar"></Avatar>
        <div class="user-info">
          <router-link class="nick-name" :to="`/user/${userInfo.id}`" target="_blank">{{
              userInfo.nickName
            }}
          </router-link>
          <div class="introduction">
            {{ userInfo.personIntroduction || "这个人没有填简介啊~~~" }}
          </div>
          <div class="op-btns">
            <router-link class="btn-go-home" :to="`/user/${userInfo.id}`"
                         target="_blank">访问主页
            </router-link>
            <div class="focus-btn">
              <el-dropdown v-if="userInfo.haveFocus">
                <el-button class="btn" type="info" :style="{ width: '100%' }"><span
                    class="iconfont icon-list"></span>已关注
                  {{ userInfo.fansCount }}
                </el-button>
                <template #dropdown>
                  <el-dropdown-menu>
                    <el-dropdown-item @click="focusUser(-1)">取消关注</el-dropdown-item>
                  </el-dropdown-menu>
                </template>
              </el-dropdown>
              <el-button class="btn" type="primary" @click="focusUser(1)" v-else>关注 {{
                  userInfo.fansCount
                }}
              </el-button>
            </div>
          </div>
        </div>
      </div>
    </div>
    <div class="video-body">
      <div class="video-left">
        <div class="video-panel" :style="{ position: wideScreen ? 'absolute' : 'static' }">
          <Player ref="playerRef" @changeWideScreen="changeWideScreenHandler">
          </Player>
        </div>
        <div :style="{
                    'margin-top': wideScreen ? playerHeight + 56 + 'px' : '0px',
                }">
          <VideoAction></VideoAction>
          <VideoSummary></VideoSummary>
          <VideoComment v-if="Object.keys(videoInfo).length > 0">
          </VideoComment>
        </div>
      </div>
      <div class="video-right" :style="{ 'margin-top': wideScreen ? playerHeight + 70 + 'px' : '0px' }">
        <VideoDanmu></VideoDanmu>
        <VideoPList></VideoPList>
        <VideoRecommend v-if="Object.keys(videoInfo).length > 0"></VideoRecommend>
      </div>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ElDropdown, ElDropdownItem, ElDropdownMenu, ElButton} from 'element-plus';
import {UserService} from '@/api';
import type {UserVO} from '@/api/models/response/User/UserVO';
import type {Video} from '@/api/models/response/Video/Video';
import {HomeService} from '@/api/services/HomeService';
import {VideoService} from '@/api/services/VideoService';
import Player from '@/components/Player.vue';
import {ACTION_TYPE} from '@/constant/ActionConstants';
import {mitter} from '@/event/eventBus';
import {useNavigatorStore} from '@/stores/NavigatorStore';
import {userLoginStore} from '@/stores/UserStore';
import {nextTick, onMounted, provide, ref} from 'vue';
import {useRoute} from 'vue-router';
import VideoAction from './components/VideoAction.vue';
import VideoSummary from './components/VideoSummary.vue';
import VideoComment from './components/VideoComment.vue';
import VideoDanmu from './components/VideoDanmu.vue';
import VideoPList from './components/VideoPList.vue';
import VideoRecommend from './components/VideoRecommend.vue';


const route = useRoute();
const navigatorStore = useNavigatorStore();
const loginStore = userLoginStore();

const userInfo = ref<UserVO>({} as UserVO);
const getUserInfo = async (userId: string) => {
  const result = await UserService.getUserInfo(userId);
  if (!result) {
    return;
  }
  userInfo.value = result;
};

const focusUser = async (changeCount: number) => {
  if (Object.keys(loginStore.userInfo).length === 0) {
    loginStore.setLogin(true);
    return;
  }
  if (changeCount === 1) {
    const res = await HomeService.focus(userInfo.value.id);
    if (!res) return;
  } else {
    const res = await HomeService.cancelFocus(userInfo.value.id);
    if (!res) return;
  }
  if (changeCount === 1) {
    userInfo.value.haveFocus = true;
    userInfo.value.fansCount++;
  } else {
    userInfo.value.fansCount--;
    userInfo.value.haveFocus = false;
  }
};

const videoInfo = ref<Video>({} as Video);
const getVideoInfo = async () => {
  let result = await VideoService.getVideoInfo(route.params.videoId as string);
  if (!result) {
    return;
  }
  //获取用户信息
  await getUserInfo(result.video.userId);

  //处理详情数据
  const resultData = result.video;
  let introduction = resultData.introduction || "";
  introduction = introduction.replace(/\r\n/g, "<br>");
  introduction = introduction.replace(/\n/g, "<br>");
  const tags = resultData.tags ? resultData.tags.split(",") : [];
  resultData.introduction = introduction;
  resultData.tags = tags;
  videoInfo.value = resultData;
  //获取用户行为
  const userActionList = result.userActionList;
  userActionList.forEach((item) => {
    if (item.actionType === ACTION_TYPE.VIDEO_LIKE.value) {
      videoInfo.value.likeCountActive = true;
    } else if (item.actionType === ACTION_TYPE.VIDEO_COLLECT.value) {
      videoInfo.value.collectCountActive = true;
    } else if (item.actionType === ACTION_TYPE.VIDEO_COIN.value) {
      videoInfo.value.coinCountActive = true;
    }
  });
};
getVideoInfo();

provide("videoInfo", videoInfo);

//播放器高度
const playerHeight = ref(0);
provide("playerHeight", (height: number) => {
  playerHeight.value = height;
});

const wideScreen = ref(false);
const changeWideScreenHandler = (result: boolean) => {
  wideScreen.value = result;
};

onMounted(() => {
  nextTick(() => {
    navigatorStore.setShowHeader(false);
    navigatorStore.setFixedHeader(true);
    navigatorStore.setFixedCategory(false);
    navigatorStore.setShowCategory(false);
    navigatorStore.setForceFixedHeader(true);
  });

  mitter.on("danmuSend", () => {
    videoInfo.value.danmuCount++;
  });
});
</script>

<style lang="scss" scoped>
.video-detail {
  margin-top: 64px;
  min-height: calc(100vh - 64px);

  .video-header {
    padding-top: 20px;
    display: flex;

    .video-title {
      flex: 1;

      .title {
        font-size: 22px;
      }

      .video-info {
        margin-top: 10px;
        display: flex;
        color: #9499a0;

        .iconfont {
          margin-right: 20px;
          font-size: 14px;

          &::before {
            font-size: 18px;
            margin-right: 3px;
          }
        }
      }
    }

    .video-user-info {
      margin-left: 20px;
      width: 410px;
      display: flex;
      align-items: center;

      .user-info {
        flex: 1;
        margin-left: 10px;

        .nick-name {
          font-size: 16px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          color: var(--text);
          text-decoration: none;
        }

        .introduction {
          color: var(--text2);
          font-size: 13px;
          text-overflow: ellipsis;
          white-space: nowrap;
          overflow: hidden;
          margin: 3px 0;
        }

        .op-btns {
          display: flex;

          .btn-go-home {
            margin-right: 10px;
            text-decoration: none;
            color: #fb7299;
            border: 1px solid #fb7299;
            line-height: 28px;
            border-radius: 5px;
            padding: 0 20px;

            &:hover {
              background: #ffecf1;
            }
          }

          .focus-btn {
            flex: 1;
            width: 230px;

            .el-dropdown {
              width: 100%;
            }

            .btn {
              width: 100%;

              .iconfont {
                margin-right: 5px;
              }
            }
          }
        }
      }
    }
  }

  .video-body {
    margin-top: 20px;
    position: relative;
    display: flex;

    .video-left {
      flex: 1;
    }

    .video-panel {
      position: static;
      width: 100%;
    }

    .video-right {
      margin-left: 30px;
      width: 410px;
      padding-bottom: 20px;
    }
  }
}
</style>