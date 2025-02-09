import {createRouter, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'index',
            redirect: '/home',
            component: () => import('@/layout/BasicLayout.vue'),
            children: [
                {
                    path: '/home',
                    name: 'home',
                    component: () => import('@/views/Home/HomeView.vue'),
                },
                {
                    path: '/video/:videoId',
                    name: 'videoDetail',
                    component: () => import('@/views/VideoDetail/VideoDetail.vue'),
                },
                {
                    path: '/v/:pCategoryCode',
                    name: 'categoryVideo',
                    component: () => import('@/views/VideoList/CategoryVideo.vue'),
                },
                {
                    path: '/v/:pCategoryCode/:categoryCode',
                    name: 'subCategoryVideo',
                    component: () => import('@/views/VideoList/CategoryVideo.vue'),
                },
                {
                    name: "history",
                    path: "/history",
                    component: () => import('@/views/History/HistoryView.vue'),
                },
                {
                    name: "messageHome",
                    path: "/message",
                    component: () => import("@/views/Message/MessageView.vue"),
                },
                {
                    name: "message",
                    path: "/message/:messageType",
                    component: () => import("@/views/Message/MessageView.vue"),
                },
                {
                    name: "search",
                    path: "/search",
                    component: () => import("@/views/Search/SearchView.vue"),
                },
                {
                    name: "hot",
                    path: "/hot",
                    component: () => import("@/views/Hot/HotView.vue"),
                }
            ]
        },
        {
            path: '/createCenter',
            name: "创作中心",
            component: () => import('@/layout/CreateCenterLayout.vue'),
            redirect: '/createCenter/home',
            children: [
                {
                    path: '/createCenter/home',
                    name: '用户中心首页',
                    component: () => import('@/views/CreateCenter/Home.vue'),
                },
                {
                    path: '/createCenter/postVideo',
                    name: '上传视频',
                    component: () => import('@/views/CreateCenter/Post.vue'),
                },
                {
                    name: "editVideo",
                    path: "/createCenter/editVideo",
                    component: () => import("@/views/CreateCenter/Post.vue")
                },
                {
                    name: "videoList",
                    path: "/createCenter/video",
                    component: () => import("@/views/CreateCenter/VideoList.vue"),
                },
                {
                    name: "fans",
                    path: "/createCenter/fans",
                    component: () => import("@/views/CreateCenter/FansList.vue"),
                },
                {
                    name: "comment",
                    path: "/createCenter/comment",
                    component: () => import("@/views/CreateCenter/CommentList.vue"),
                },
                {
                    name: "danmu",
                    path: "/createCenter/danmu",
                    component: () => import("@/views/CreateCenter/DanmuList.vue"),
                },
            ]
        },
        {
            name: "userProfile",
            path: "/user/:userId",
            component: () => import("@/views/User/components/UserProfileLayout.vue"),
            redirect: "/user/:userId",
            children: [
                {
                    path: '/user/:userId',
                    name: 'userProfileHome',
                    component: () => import('@/views/User/UserProfileView.vue'),
                },
                {
                    path: '/user/:userId/video',
                    name: 'userProfileMyVideo',
                    component: () => import('@/views/User/UserProfileVideoList.vue'),
                },
                {
                    path: '/user/:userId/series',
                    name: 'userProfileSeries',
                    component: () => import('@/views/User/UserProfileSeries.vue'),
                },
                {
                    path: '/user/:userId/series/:seriesId',
                    name: 'userProfileSeriesDetail',
                    component: () => import('@/views/User/UserProfileSeriesDetail.vue'),
                },
                {
                    path: '/user/:userId/collection',
                    name: 'collection',
                    component: () => import('@/views/User/UserProfileCollection.vue'),
                },
                {
                    path: '/user/:userId/focus',
                    name: 'userProfileFocus',
                    component: () => import('@/views/User/UserProfileFocusFansList.vue'),
                },
                {
                    path: '/user/:userId/fans',
                    name: 'userProfileFans',
                    component: () => import('@/views/User/UserProfileFocusFansList.vue'),
                }
            ]
        },
        {
            path: '/404',
            name: '错误页404',
            component: () => import('@/views/Error/404.vue'),
        }
    ],
})

export default router
