import { type RouteRecordRaw } from "vue-router";
import Index from "@/pages/Index.vue";
import Login from "@/pages/Login.vue";
import BaseLayout from "@/pages/layout/BaseLayout.vue";
import Admin from "@/pages/Admin.vue";
import Category from "@/pages/Category.vue";

export const routes: Array<RouteRecordRaw> = [
    {
        path: '/',
        name: '首页',
        component: Index,
    },
    {
        path: '/login', // 登录页
        component: Login,
        meta: {
            title: '登录'
        }
    },
    {
        path: "/admin", // 后台首页
        component: BaseLayout, // 对应 admin.vue 布局文件
        // 使用到 admin.vue 布局的，都需要放置在其子路由下面
        children: [
            {
                path: "/admin/index",
                component: Admin, // 主内容区域，具体需要渲染的页面
                meta: {
                    title: '后台首页'
                }
            },
            {
                path: '/admin/category/list',
                component: Category,
                meta: {
                    title: '分类列表'
                }
            }
        ]

    }
]