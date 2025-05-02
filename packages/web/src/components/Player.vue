<template>
    <div class="player-panel">
        <div ref="playerRef" class="player-style" :style="{ height: playerHeight + 'px' }"></div>
        <div class="danmu-panel">
            <div class="watcher">
                {{ onLineCount }} 人正在看，已装填 {{ danmuCount }} 条弹幕
            </div>
            <div id="danmu" v-show="showDanmu"></div>
            <div v-show="!showDanmu" class="close-danmu">已关闭弹幕</div>
        </div>
        <div id="play"><img :src="Local.getLocalImage('play.png')"  alt=""/></div>
    </div>
</template>

<script lang="ts" setup>
import { Resource } from '@/api/core/Url';
import { userLoginStore } from '@/stores/UserStore';
import { computed, inject, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';
import Hls from 'hls.js'
import Artplayer from 'artplayer'
import artplayerPluginDanmuku from 'artplayer-plugin-danmuku'
import { mitter } from '@/event/eventBus';
import Message from '@/utils/Message';
import { useRoute } from 'vue-router';
import { DanmuService } from '@/api/services/DanmuService';
import type { Danmu } from '@/api/models/response/Danmu/Danmu';
import Local from '@/utils/Local';
import { VideoService } from '@/api/services/VideoService';
import type {Video} from "@/api/models/response/Video/Video";


const loginStore = userLoginStore();
const route = useRoute()
defineProps({
    fileId: {
        type: String,
        default: '',
    },
})

const playerRef = ref()

let player: any = null

const initPlayer = () => {
    //隐藏右键菜单
    Artplayer.CONTEXTMENU = false
    //自动回放功能的最大记录数，默认为 10
    Artplayer.AUTO_PLAYBACK_MAX = 20
    //自动回放功能的最小记录时长，单位为秒，默认为 5
    Artplayer.AUTO_PLAYBACK_MIN = 10
    player = new Artplayer({
        container: playerRef.value,
        url: ``,
        type: 'm3u8',
        customType: {
            m3u8: function (video, url, art) {
                if (Hls.isSupported()) {
                    if (art.hls) art.hls.destroy()
                    const hls = new Hls()
                    hls.loadSource(url)
                    hls.attachMedia(video)
                    art.hls = hls
                    art.on('destroy', () => hls.destroy())
                } else if (video.canPlayType('application/vnd.apple.mpegurl')) {
                    video.src = url
                } else {
                    art.notice.show = '浏览器不支持该播放器'
                }
            },
        },
        theme: '#23ade5', //播放器主题颜色，目前用于 进度条 和 高亮元素 上
        volume: 0.7, //播放器的默认音量
        autoplay: true, //是否自动播放 假如希望默认进入页面就能自动播放视频，muted 必需为 true
        autoMini: false, //当播放器滚动到浏览器视口以外时，自动进入 迷你播放 模式
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
            // @ts-ignore
            state: document.querySelector('#play'),
        },
        controls: [
            {
                name: 'wide-screen',
                position: 'right',
                html: '<span class="iconfont icon-wide-screen"></span>',
                tooltip: '宽屏模式',
                style: {
                    color: '#fff',
                    display: 'flex',
                },
                click: function () {
                    changeWideScreen()
                },
            },
            {
                name: 'narrow-screen',
                position: 'right',
                html: '<span class="iconfont icon-narrow-screen"></span>',
                tooltip: '退出宽屏',
                style: {
                    color: '#fff',
                    display: 'none',
                },
                click: function () {
                    changeWideScreen()
                },
            },
        ],
        plugins: [
            artplayerPluginDanmuku({
                // @ts-ignore
                mount: document.querySelector('#danmu'),
                theme: 'light',
                emitter: true,
                danmuku: function () {
                    return new Promise(async (resovle) => {
                        //是否展示弹幕
                        const danmuList = await loadDanmuList()
                        const danmuku = danmuList.map(danmu => ({
                          text: danmu.text, // 弹幕文本
                          time: danmu.time || 0, // 弹幕时间，默认为 0 或当前时间
                          color: danmu.color || '#FFFFFF', // 弹幕颜色，默认为白色
                        }))
                        return resovle(danmuku)
                    })
                },
                beforeEmit: async (danmu) => {
                    await postDanmu(danmu as Danmu)
                    //重新获取一下弹幕列表
                    await loadDanmuList()
                    mitter.emit('danmuSend')
                    Message.success('发布成功')
                    return true;
                },
            }),
        ],
    })
    player.on('hover', (state: any) => {
        let display = 'none'
        if (state) {
            display = 'flex'
        }
        // @ts-ignore
        player.template.$bottom.style.display = display
    })
    //视频播放完成
    player.on('video:ended', () => {
        mitter.emit('playEnd')
    })
}

const emit = defineEmits(['changeWideScreen'])
const wideScreen = ref(false)
const changeWideScreen = () => {
    wideScreen.value = !wideScreen.value
    if (wideScreen.value) {
        player.controls['wide-screen'].style.display = 'none'
        player.controls['narrow-screen'].style.display = 'flex'
    } else {
        player.controls['wide-screen'].style.display = 'flex'
        player.controls['narrow-screen'].style.display = 'none'
    }
    emit('changeWideScreen', wideScreen.value)
}

const fileId = ref()
const postDanmu = async (danmu: Danmu) => {
    if (Object.keys(loginStore.userInfo).length === 0) {
        loginStore.setLogin(true)
        return
    }
    danmu.fileId = fileId.value
    danmu.videoId = route.params.videoId as string
    danmu.time = Math.round(danmu.time)
    const res = await DanmuService.postDanmu({
        videoId: danmu.videoId,
        fileId: fileId.value,
        text: danmu.text,
        model: danmu.mode,
        color: danmu.color,
        time: danmu.time,
    });
    if(res) {
      Message.success("发送弹幕成功");
    } else {
      Message.error("发送弹幕失败");
    }
}

//弹幕数量
const danmuCount = ref(0)
const loadDanmuList = async () => {
    if (!fileId.value) {
        return []
    }
    let result = await DanmuService.loadDanmu({
        fileId: fileId.value,
        videoId: route.params.videoId as string,
    })
    if (!result) {
        return []
    }
    mitter.emit('loadDanmu', result)
    danmuCount.value = result.length
    return result
}

const playerHeight = ref(500)
const setPlayerHeight = inject('playerHeight')

onMounted(() => {
    nextTick(() => {
        initPlayer()
        //滚动条的宽度是8，页面未全部加载完获取不到滚动条的宽度，所以这里提前减去滚动条的宽度
        const height = Math.round((playerRef.value.clientWidth - 8) * 0.5625)
        playerHeight.value = height
        // @ts-ignore
        setPlayerHeight(height)
    })

    mitter.on('changeP', (_fileId) => {
        fileId.value = _fileId
        //获取在线人数
        reportVideoPlayOnline()
        player.switch = `/api${Resource.videoResource}/${_fileId}/`
        //切换弹幕
        player.plugins.artplayerPluginDanmuku.load()
    })
    //轮训获取
    startTimer()
})

onBeforeUnmount(() => {
    if (player) {
        player.destroy(false)
    }
    mitter.off('changeP')
    cleanTimer()
})

//获取在线人数轮训上报，类似上报心跳
let timmer = ref()
const startTimer = () => {
    timmer.value = setInterval(() => {
        reportVideoPlayOnline()
    }, 5000)
}

const onLineCount = ref(1)
const reportVideoPlayOnline = async () => {
    if (!fileId.value) {
        return
    }
    let result = await VideoService.reportVideoPlayOnline({
            fileId: fileId.value,
            deviceId: loginStore.deviceId,
        })
    if (!result) {
        return
    }
    onLineCount.value = result
}

const cleanTimer = () => {
    if (timmer.value !== null) {
        clearInterval(timmer.value)
        timmer.value = null
    }
}

//判断是否显示弹幕
const videoInfo = inject<Video>('videoInfo')
const showDanmu = computed(() => {
    return (
        videoInfo!.interaction == null ||
        videoInfo!.interaction.indexOf('0') === -1
    )
})
</script>

<style lang="scss" scoped>
.player-panel {
    .player-style {
        width: 100%;

        :deep(.art-video-player.art-mask-show .art-state) {
            //播放按钮
            position: absolute;
            right: 40px;
            bottom: 50px;

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

        .close-danmu {
            flex: 1;
            color: var(--text2);
            text-align: center;
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