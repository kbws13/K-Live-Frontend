import { createRouter, createWebHistory } from 'vue-router'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      redirect: '/',
      component: () => import('@/layout/BasicLayout.vue'),
      children: [
        {
          path: '/',
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
      path: '/404',
      name: '错误页404',
      component: () => import('@/views/Error/404.vue'),
    }
  ],
})

export default router
