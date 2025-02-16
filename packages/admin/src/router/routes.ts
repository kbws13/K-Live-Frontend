import {type RouteRecordRaw} from "vue-router";

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/login', // 登录页
        name: 'login',
        component: () => import('@/views/Login/LoginView.vue'),
    },
    {
        path: '/',
        name: 'layout',
        redirect: '/login',
        component: () => import('@/layout/BasicLayout.vue'),
        children: [
            {
                path: '/home',
                name: '首页',
                component: () => import('@/views/Home/HomeView.vue'),
            },
            {
                path: '/content/category',
                name: '分类管理',
                component: () => import('@/views/Content/CategoryListView.vue'),
            },
            {
                path: '/content/video',
                name: '稿件管理',
                component: () => import('@/views/Content/VideoListView.vue'),
            },
            {
                path: '/interact/comment',
                name: '评论管理',
                component: () => import('@/views/Interact/CommentListView.vue'),
            },
            {
                path: '/interact/danmu',
                name: '弹幕管理',
                component: () => import('@/views/Interact/DanmuListView.vue'),
            },
            {
                path: '/user/userList',
                name: '用户管理',
                component: () => import('@/views/User/UserListView.vue'),
            },
            {
                path: '/setting',
                name: '设置',
                component: () => import('@/views/Setting/SettingView.vue'),
            }
        ]
    },
    {
        path: '/:pathMatch(.*)',
        component: import('@/views/Error/404.vue'),
    },
]