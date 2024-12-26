<template>
  <div class="bg-slate-800 h-screen text-white transition-all" :style="{ width: menuStore.menuWidth }">
    <!-- 顶部 Logo, 指定高度为 64px, 和右边的 Header 头保持一样高 -->
    <div class="flex items-center justify-center h-[64px]">
      <img src="@/assets/logo.svg" class="h-[30px]">
    </div>

    <!-- 下方菜单 -->
    <el-menu :default-active="defaultActive" :collapse="isCollapse" @select="handleSelect">
      <template v-for="(item, index) in menus" :key="index">
        <el-menu-item :index="item.path">
          <el-icon>
            <!-- 动态图标 -->
            <component :is="item.icon"></component>
          </el-icon>
          <span>{{ item.name }}</span>
        </el-menu-item>
      </template>
    </el-menu>


  </div>
</template>

<script setup lang="ts">

import {useRoute, useRouter} from "vue-router";
import {computed, ref} from "vue";
import {useMenuStore} from "@/store/menuStore";

const route = useRoute();
const router = useRouter()
// 根据路由地址判断哪个菜单被选中
const defaultActive = ref(route.path)
const menuStore = useMenuStore();
const isCollapse = computed(() => !(menuStore.menuWidth == '250px'))
const menus = [
  {
    'name': '仪表盘',
    'icon': 'Monitor',
    'path': '/admin/index'
  },
  {
    'name': '文章管理',
    'icon': 'Document',
    'path': '/admin/article/list',
  },
  {
    'name': '分类管理',
    'icon': 'FolderOpened',
    'path': '/admin/category/list',
  },
  {
    'name': '标签管理',
    'icon': 'PriceTag',
    'path': '/admin/tag/list',
  },
  {
    'name': '博客设置',
    'icon': 'Setting',
    'path': '/admin/blog/setting',
  },
]
// 菜单选择事件
const handleSelect = (path: string) => {
  router.push(path);
}
</script>

<style>
.el-menu {
  background-color: rgb(30 41 59 / 1);
  border-right: 0;
}

.el-sub-menu__title {
  color: #fff;
}

.el-sub-menu__title:hover {
  background-color: #ffffff10;
}

.el-menu-item.is-active {
  background-color: var(--el-color-primary);
  color: #fff;
}

.el-menu-item.is-active:hover {
  background-color: var(--el-color-primary);
}

.el-menu-item {
  color: #fff;
}

.el-menu-item:hover {
  background-color: #ffffff10;
}
</style>