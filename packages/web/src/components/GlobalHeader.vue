<template>
    <div :class="['header-bar', 'header-bar-' + theme]">
        <div class="menu">
            <el-popover :width="categoryPartCount * (150 + 21) + 24" trigger="hover" :show-arrow="false" :offset="22"
                placement="bottom-start">
                <template #reference>
                    <router-link class="iconfont icon-logo menu-item" to="/">首页</router-link>
                </template>
                <div class="nav-list">
                    <div class="nav-part" v-for="index in categoryPartCount">
                        <router-link class="nav-item" v-for="item in categoryStore.categoryList.slice(
                            (index - 1) * partCount,
                            (index - 1) * partCount + partCount
                        )" :to="`/v/${item.code}`">
                            <span class="icon" v-if="item.icon">
                                <img :src="`${Resource.getResource}${item.icon}`" />
                            </span>
                            <span class="category-name">{{ item.name }}</span>
                        </router-link>
                    </div>
                </div>
            </el-popover>
        </div>
        <div class="search-body">
            <div class="search-panel" @click.stop v-if="route.path !== '/search'">
                <div class="search-panel-inner">
                    <div class="input-panel">
                        <input />
                        <div class="iconfont icon-search"></div>
                    </div>
                </div>
            </div>
        </div>
        <div class="user-panel">
            <div class="user-avatar">
                <template v-if="Object.keys(loginStore.userInfo).length > 0">
                    <Avatar class="avatar" :avatar="loginStore.userInfo.avatar" :userId="loginStore.userInfo.id"
                        :width="35" :lazy="false" @mouseover="getUserCountInfo"></Avatar>
                    <div class="user-info-panel">
                        <div class="nick-name">{{ loginStore.userInfo.nickName }}</div>
                        <div class="count-info">
                            <div class="count-info-item">
                                <div class="count-value">{{ userCountInfo?.fansCount ?? 0 }}</div>
                                <div class="count-title">关注</div>
                            </div>
                            <div class="count-info-item">
                                <div class="count-value">{{ userCountInfo?.fansCount ?? 0 }}</div>
                                <div class="count-title">粉丝</div>
                            </div>
                            <div class="count-info-item">
                                <div class="count-value">{{ userCountInfo?.currentCoinCount ?? 0 }}</div>
                                <div class="count-title">硬币</div>
                            </div>
                        </div>
                        <router-link :to="`/user/${loginStore.userInfo.id}`" class="item iconfont icon-user">
                            <span class="item-name">个人中心</span>
                            <span class="iconfont icon-left"></span>
                        </router-link>
                        <router-link :to="`/createCenter/video`" class="item iconfont icon-play">
                            <span class="item-name">投稿管理</span>
                            <span class="iconfont icon-left"></span>
                        </router-link>
                        <div class="logout item iconfont icon-logout" @click="logout">
                            退出登录
                        </div>
                    </div>
                </template>
                <Avatar v-else :width="35" :lazy="false" @click="login"></Avatar>
            </div>
            <div class="user-panel-item" @click="navJump('/message')">
                <el-badge :value="loginStore.messageNoReadCount" :hidden="loginStore.messageNoReadCount === 0">
                    <div class="iconfont icon-message"></div>
                </el-badge>
                <div>消息</div>
            </div>
            <div class="user-panel-item" @click="navJump(`/user/${loginStore.userInfo.id}/collection`)">
                <div class="iconfont icon-collection"></div>
                <div>收藏</div>
            </div>
            <div class="user-panel-item" @click="navJump('/history')">
                <div class="iconfont icon-history"></div>
                <div>历史</div>
            </div>
            <div class="user-panel-item" @click="navJump('/createCenter/home')">
                <div class="iconfont icon-light"></div>
                <div>创作中心</div>
            </div>
            <div class="btn-upload">
                <el-button type="primary" size="large">
                    <span class="iconfont icon-upload"></span>
                    <span> 投稿</span>
                </el-button>
            </div>
        </div>
    </div>
</template>
<script lang="ts" setup>
import { UserService } from '@/api';
import { Resource } from '@/api/core/Url';
import type { UserVO } from '@/api/models/response/User/UserVO';
import { mitter } from '@/event/eventBus';
import { useCategoryStore } from '@/stores/CategoryStore';
import { userLoginStore } from '@/stores/UserStore';
import Message from '@/utils/Message';
import { computed, getCurrentInstance, onMounted, onUnmounted, ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';


const prop = defineProps({
    theme: {
        type: String,
        default: 'light'
    }
})

// @ts-ignore
const { proxy } = getCurrentInstance();
const route = useRoute();
const router = useRouter();
const loginStore = userLoginStore();
const categoryStore = useCategoryStore();

const login = () => {
    loginStore.setLogin(true);
}

const userCountInfo = ref<UserVO>();
const getUserCountInfo = async () => {
    const res = await UserService.getUserInfo(loginStore.userInfo.id);
    if (!res) return;
    userCountInfo.value = res;
    loginStore.saveUserInfo(res);
}

const navJump = (url: string) => {
    if (Object.keys(loginStore.userInfo).length === 0) {
        loginStore.setLogin(true);
        return;
    }
    window.open(url, "_blank");
};

const logout = async () => {
    proxy.Confirm({
        message: "确定要退出吗？",
        okfun: async () => {
            await UserService.logout();
            proxy.VueCookies.remove("token");
            loginStore.saveUserInfo({} as UserVO);
            Message.success('退出成功');
        }
    })
}

// 分类列表
const partCount = 5;
const categoryPartCount = computed(() => {
    return Math.ceil(categoryStore.categoryList.length / partCount);
});

const showHistory = ref(false);
const onSearchFocus = () => {
    showHistory.value = true;
};

const searchInputRef = ref();

onMounted(() => {
    document.addEventListener("click", () => {
        showHistory.value = false;
    });
    mitter.on("windowScroll", () => {
        if (showHistory.value) {
            //滚动的时候手动blur否则光标没移除，再次点击下拉搜索不弹出
            searchInputRef.value.blur();
            showHistory.value = false;
        }
    });
});

onUnmounted(() => {
    mitter.off("windowScroll");
});
</script>

<style lang="scss" scoped>
.header-bar {
    width: 100%;
    height: 64px;
    padding: 0 25px;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr;

    .menu {
        display: flex;
        align-items: center;

        a {
            text-decoration: none;
        }

        .icon-logo {
            font-size: 16px;

            &::before {
                float: left;
                margin-top: -6px;
                font-size: 25px;
                margin-right: 5px;
            }
        }
    }

    .search-body {
        color: #61666d;

        .search-panel {
            margin: 0 auto;
            position: relative;
            max-width: 80%;

            .search-panel-inner {
                width: 100%;
                position: absolute;
                top: 10px;
                left: 0;
                border: 1px solid #e3e5e7;
                border-radius: 8px;
                overflow: hidden;
                z-index: 1001;

                .input-panel {
                    display: flex;
                    align-items: center;
                    background: #f1f2f3;

                    input {
                        width: 100%;
                        border: none;
                        background: #f1f2f3;
                        border-radius: 5px;
                        padding: 8px 10px;
                        margin: 3px 10px 3px 10px;

                        &:focus {
                            outline: none;
                        }
                    }

                    .iconfont {
                        font-size: 20px;
                        margin-right: 10px;
                        color: #2f3238;
                        width: 35px;
                        height: 30px;
                        display: flex;
                        align-items: center;
                        justify-content: center;
                        border-radius: 5px;
                        cursor: pointer;

                        &:hover {
                            background: #ddd;
                        }
                    }
                }
            }
        }
    }

    .user-panel {
        display: flex;
        justify-content: flex-end;
        align-items: center;

        .user-avatar {
            position: relative;
            margin-right: 13px;
            overflow: hidden;
            width: 35px;
            height: 35px;

            .avatar {
                transition: transform 0.3s;
                position: absolute;
                z-index: 10001;
                left: 0;
                top: 0;
            }

            .user-info-panel {
                padding: 10px 20px 10px;
                background: #fff;
                width: 300px;
                position: absolute;
                top: 60px;
                left: -150px;
                border-radius: 5px;
                box-shadow: 0 0 12px rgba(0, 0, 0, 0.12);
                z-index: 10000;
                opacity: 0;
                transition: opacity 0.3s;

                .nick-name {
                    font-size: 16px;
                    text-align: center;
                    line-height: 40px;
                    color: var(--text3);
                }

                .count-info {
                    margin: 10px 0;
                    display: flex;
                    justify-content: space-around;

                    .count-info-item {
                        text-align: center;

                        .count-title {
                            color: var(--text3);
                            margin-top: 5px;
                        }

                        .count-value {
                            text-align: center;
                            color: var(--text);
                        }
                    }
                }

                .item {
                    font-size: 14px;
                    display: block;
                    text-align: left;
                    line-height: 40px;
                    color: var(--text3);
                    padding: 0 20px;
                    text-decoration: none;
                    display: flex;
                    justify-content: space-between;

                    .item-name {
                        flex: 1;
                    }

                    &::before {
                        margin-right: 15px;
                    }

                    &:hover {
                        background: #e8e8e8;
                        border-radius: 5px;
                    }
                }

                .logout {
                    display: block;
                    margin-top: 10px;
                    border-top: 1px solid #ddd;
                    cursor: pointer;
                }
            }

            &:hover {
                overflow: visible;

                .avatar {
                    transform: scale(2) translateY(10px) translateX(-10px);
                }

                .user-info-panel {
                    opacity: 1;
                }
            }
        }

        .user-panel-item {
            text-align: center;
            cursor: pointer;
            padding: 0 13px;

            .iconfont {
                text-align: center;
                font-size: 20px;
                font-weight: normal;
            }
        }

        .btn-upload {
            margin-left: 10px;

            .el-button {
                background: #fb7299;
                border-color: #fb7299;
                border-radius: 8px;
                padding: 0 20px;

                .iconfont {
                    &::before {
                        margin-right: 5px;
                    }
                }
            }
        }
    }
}

.header-bar-light {
    color: #fff;

    .menu-item {
        color: #fff;
    }

    a {
        color: #fff;
    }
}

.header-bar-dark {
    color: #61666d;

    .menu-item {
        color: #61666d;
    }

    a {
        color: #61666d;
    }
}

.nav-list {
    display: flex;

    .nav-part {
        &:last-child {
            border-right: none;
        }

        padding: 0 10px;
        border-right: 1px solid #ddd;

        .nav-item {
            display: flex;
            padding: 0 10px;
            height: 35px;
            border-radius: 3px;
            cursor: pointer;
            align-items: center;
            width: 150px;
            text-decoration: none;
            color: #2f3238;

            &:hover {
                background: #ddd;
            }

            .icon {
                width: 25px;
                height: 25px;
                overflow: hidden;
                margin-right: 5px;

                img {
                    width: 100%;
                }
            }

            .category-name {
                flex: 1;
            }
        }
    }
}
</style>