<template>
    <div class="header">
        <router-link to="/" class="logo">主站</router-link>
        <div class="user-info">
            <Avatar class="avatar" :avatar="loginStore.userInfo.avatar" :userId="loginStore.userInfo.id"
                :width="35">
            </Avatar>
        </div>
    </div>
    <div class="ucenter-body">
        <div class="left-side">
            <router-link class="upload-btn iconfont icon-upload" to="/createCenter/postVideo">投稿</router-link>
            <div class="menu-list">
                <el-menu :router="true" :default-active="defaultActive" :default-openeds="defaultOpeneds">
                    <template v-for="item in menuList">
                        <el-menu-item :index="item.path" v-if="!item.children">
                            <span :class="['iconfont', 'icon-' + item.icon]"></span>
                            <span class="title">{{ item.name }}</span>
                        </el-menu-item>
                        <el-sub-menu v-else :index="item.path">
                            <template #title>
                                <span :class="['iconfont', 'icon-' + item.icon]"></span>
                                <span class="title">{{ item.name }}</span>
                            </template>
                            <el-menu-item :index="sub.path" v-for="sub in item.children">
                                <span class="sub-menu">{{ sub.name }}</span>
                            </el-menu-item>
                        </el-sub-menu>
                    </template>
                </el-menu>
            </div>
        </div>
        <div class="right-content">
            <div class="right-content-inner">
                <router-view></router-view>
            </div>
        </div>
    </div>
    <LoginView />
</template>

<script lang="ts" setup>
import { ElMenu, ElMenuItem, ElSubMenu } from 'element-plus';
import { userLoginStore } from '@/stores/UserStore';
import LoginView from '@/views/User/LoginView.vue';
import { ref, watch } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();
const loginStore = userLoginStore();
const menuList = [
    {
        name: '首页',
        path: '/createCenter/home',
        icon: 'home',
    },
    {
        name: '内容管理',
        path: '/createCenter/content',
        icon: 'content',
        children: [
            {
                name: '稿件管理',
                path: '/createCenter/video',
            },
        ],
    },
    {
        name: '互动管理',
        path: '/createCenter/hudong',
        icon: 'hudong',
        children: [
            {
                name: '评论管理',
                path: '/createCenter/comment',
            },
            {
                name: '弹幕管理',
                path: '/createCenter/danmu',
            },
        ],
    },
]
const defaultActive = ref()
const defaultOpeneds = ref([])
const init = () => {
    menuList.forEach((item) => {
        defaultOpeneds.value.push(item.path as string)
    })
}
init()

watch(
    () => route,
    () => {
        defaultActive.value = route.path
    },
    { immediate: true, deep: true }
)
</script>

<style lang="scss" scoped>
.header {
    width: 100%;
    background: #fff;
    height: 60px;
    box-shadow: 0 2px 10px 0 rgba(0, 0, 0, 0.05);
    position: fixed;
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 0 20px;
    z-index: 100;

    .logo {
        text-decoration: none;
        color: var(--text);
        font-size: 16px;
    }
}

.ucenter-body {
    padding-top: 60px;
    display: flex;
    min-height: calc(100vh);

    .left-side {
        width: 200px;
        height: calc(100vh - 60px);
        background: #fff;
        border-right: 1px solid #f4f4f4;
        text-align: center;
        overflow: auto;

        .upload-btn {
            background: #00a1d6;
            display: inline-block;
            color: #fff;
            padding: 10px 40px;
            margin: 20px auto;
            text-decoration: none;
            cursor: pointer;

            &::before {
                margin-right: 5px;
            }

            &:hover {
                opacity: 0.8;
            }
        }

        .menu-list {
            :deep(.el-menu) {
                border-right: none;
            }

            .iconfont {
                display: flex;
                align-items: center;
                width: 20px;
                font-size: 18px;
                margin-right: 15px;
            }

            .sub-menu {
                padding-left: 36px;
            }

            :deep(.el-menu-item) {
                height: 46px;
                padding-left: 30px;
            }

            :deep(.el-sub-menu__title) {
                padding-left: 30px;
            }
        }
    }

    .right-content {
        flex: 1;
        height: calc(100vh - 60px);
        overflow: auto;

        .right-content-inner {
            width: 1300px;
            background: #fff;
            margin: 20px auto;
            padding-top: 20px;
            min-height: calc(100vh - 100px);
        }
    }
}
</style>