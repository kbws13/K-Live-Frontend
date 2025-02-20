<template>
  <div class="player-panel">
    <div
        id="player"
        ref="playerRef"
        class="player-style"
        :style="{ height: playerHeight + 'px' }"
    ></div>
  </div>
</template>

<script lang="ts" setup>
import {Resource} from '@/api/core/Url';
import {onBeforeUnmount, onMounted, onUnmounted, ref} from 'vue';
import Hls from 'hls.js'
import Artplayer from 'artplayer'
import {mitter} from '@/event/eventBus';


//https://artplayer.org/
const props = defineProps({
  fileId: {
    type: String,
    default: "",
  },
  autoplay: {
    type: Boolean,
    default: true,
  },
});

const playerRef = ref();

let player: any = null;

const initPlayer = () => {
  //隐藏右键菜单
  Artplayer.CONTEXTMENU = false;
  //自动回放功能的最大记录数，默认为 10
  Artplayer.AUTO_PLAYBACK_MAX = 20;
  //自动回放功能的最小记录时长，单位为秒，默认为 5
  Artplayer.AUTO_PLAYBACK_MIN = 10;
  player = new Artplayer({
    container: playerRef.value,
    url: ``,
    type: "m3u8",
    customType: {
      m3u8: function (video, url, art) {
        if (Hls.isSupported()) {
          if (art.hls) art.hls.destroy();
          const hls = new Hls();
          hls.loadSource(url);
          hls.attachMedia(video);
          art.hls = hls;
          art.on("destroy", () => hls.destroy());
        } else if (video.canPlayType("application/vnd.apple.mpegurl")) {
          video.src = url;
        } else {
          art.notice.show = "浏览器不支持该播放器";
        }
      },
    },
    theme: "#23ade5", //播放器主题颜色，目前用于 进度条 和 高亮元素 上
    volume: 0.7, //播放器的默认音量
    autoplay: props.autoplay, //是否自动播放 假如希望默认进入页面就能自动播放视频，muted 必需为 true
    autoMini: true, //当播放器滚动到浏览器视口以外时，自动进入 迷你播放 模式
    fullscreen: true, //设置和获取播放器窗口全屏
    fullscreenWeb: true, //设置和获取播放器网页全屏
    setting: true,
    pip: true, //开启画中画
    playbackRate: true, //是否显示视频播放速度功能，会出现在 设置面板 和 右键菜单 里
    flip: true, //是否显示视频翻转功能，目前只出现在 设置面板 和 右键菜单
    aspectRatio: true, //比例
    //miniProgressBar: true, //迷你进度条，只在播放器失去焦点后且正在播放时出现
    screenshot: true, //截图
    autoPlayback: true, //自动回放
    //自定义图标
    icons: {
      // loading: '<img src="/assets/img/ploading.gif">',
      state: '<img src="../../src/assets/play.svg" alt="">',
    },
    controls: [
      {
        name: "wide-screen",
        position: "right",
        html: '<span class="iconfont icon-wide-screen"></span>',
        tooltip: "宽屏模式",
        style: {
          color: "#fff",
          display: "flex",
        },
        click: function (...args) {
          changeWideScreen();
        },
        mounted: function (...args) {
          //console.info('mounted', args)
        },
      },
      {
        name: "narrow-screen",
        position: "right",
        html: '<span class="iconfont icon-narrow-screen"></span>',
        tooltip: "退出宽屏",
        style: {
          color: "#fff",
          display: "none",
        },
        click: function (...args) {
          changeWideScreen();
        },
        mounted: function (...args) {
          //console.info('mounted', args)
        },
      },
    ],
  });
  player.on("ready", () => {
    // player.value.autoSize()
    //自动高度
    //player.value.autoHeight()
    // player.seek = 5
  });
  player.on("resize", () => {
    //自动高度
    //player.value.autoHeight()
  });

  player.on("hover", (state: any) => {
    let display = "none";
    if (state) {
      display = "flex";
    }
    player.template.$bottom.style.display = display;
  });

  //切换URL
  player.on("restart", () => {
    //console.info("restart", url);
  });

  //视频播放完成
  player.on("video:ended", () => {
    mitter.emit("playEnd");
  });
};

const emit = defineEmits(["changeWideScreen"]);
const wideScreen = ref(false);
const changeWideScreen = () => {
  wideScreen.value = !wideScreen.value;
  if (wideScreen.value) {
    player.controls["wide-screen"].style.display = "none";
    player.controls["narrow-screen"].style.display = "flex";
  } else {
    player.controls["wide-screen"].style.display = "flex";
    player.controls["narrow-screen"].style.display = "none";
  }
  emit("changeWideScreen", wideScreen.value);
};

const playerHeight = ref(500);

const showPlayer = (height: any) => {
  playerHeight.value = height;
  initPlayer();
};

const destroyPlayer = () => {
  if (player) {
    player.destroy(false);
  }
};

defineExpose({
  showPlayer,
  destroyPlayer,
});

onMounted(() => {
  mitter.on("changeP", (fileId) => {
    player.switch = `/api/admin${Resource.videoResource}/${fileId}`;
  });
});

onBeforeUnmount(() => {});

onUnmounted(() => {
  mitter.off("changeP");
});
</script>

<style lang="scss" scoped>
.player-panel {
  .player-style {
    width: 100%;
    :deep(.art-video-player.art-mask-show .art-state) {
      //播放按钮
      position: absolute;
      right: 40px;
      bottom: 70px;
      .art-icon-state {
        width: 60px;
        height: 60px;
        img {
          width: 100%;
        }
      }
    }
    //改变播放器的右侧操作按钮
    :deep(.art-controls-right) {
      position: relative;
      display: block;
      width: 280px;
      .art-control {
        position: absolute;
      }
      //截屏
      .art-control-screenshot {
        left: 0;
      }
      //设置按钮
      .art-control-setting {
        left: 46px;
      }
      //画中画
      .art-control-pip {
        left: 92px;
      }
      //宽屏
      .art-control-wide-screen,
      .art-control-narrow-screen {
        left: 138px;
        .iconfont {
          font-size: 20px;
        }
      }
      //网页全屏按钮
      .art-control-fullscreenWeb {
        left: 184px;
      }
      //全屏按钮
      .art-control-fullscreen {
        left: 230px;
      }
    }
  }
  .danmu-panel {
    box-shadow: 0 2px 6px #ddd;
    height: 56px;
    border-top: none;
    background: #fff;
    display: flex;
    align-items: center;
    padding: 0 15px;
    .watcher {
      width: 250px;
      color: var(--text2);
    }
    #danmu {
      flex: 1;
    }
  }

  :deep(.danmu-setting) {
    background: none !important;
    padding: 0;
    border: none;
    .inner-panel {
      width: 300px;
      height: 280px;
      position: relative;
      .inner {
        position: absolute;
        left: 0;
        top: 0;
        z-index: 99999;
        color: #fff;
      }
      .mask {
        position: absolute;
        top: 0;
        right: 0;
        left: 0;
        bottom: 0;
        background: #000;
        opacity: 0.6;
      }
    }
  }
}
</style>