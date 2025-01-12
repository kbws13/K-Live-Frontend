import { createRouter, createWebHistory } from 'vue-router'

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
