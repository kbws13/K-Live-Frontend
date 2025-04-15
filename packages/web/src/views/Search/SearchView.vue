<template>
  <div class="search-body">
    <div class="search-panel">
      <el-input placeholder="请输入关键字" v-model="keyword" size="large" @keyup.enter="search">
        <template #prefix>
          <span class="iconfont icon-search"></span>
        </template>
        <template #suffix>
          <el-button type="primary" @click="search" class="search-btn">搜索</el-button>
        </template>
      </el-input>
    </div>
    <div class="order-btns">
      <div :class="['btn', order == item.order ? 'active' : '']" v-for="item in orderButtons"
           @click="changeOrder(item)">
        {{ item.name }}
      </div>
    </div>
    <div class="data-list">
      <DataGripList :gridCount="6" :dataSource="dataSource">
        <template #default="{ data }">
          <VideoItem :data="data"></VideoItem>
        </template>
      </DataGripList>
    </div>
  </div>
</template>

<script lang="ts" setup>
import {ElInput, ElButton} from "element-plus"
import {useNavigatorStore} from "@/stores/NavigatorStore";
import {useSearchHistoryStore} from "@/stores/SearchHistoryStore";
import {useRoute, useRouter} from "vue-router";
import {onMounted, ref, watch} from "vue";
import {VideoService} from "@/api/services/VideoService";

const navActionStore = useNavigatorStore()
const searchHistoryStore = useSearchHistoryStore()
const router = useRouter()
const route = useRoute()

const orderButtons = ref([
  {
    name: '综合排序',
    order: null,
    orderType: null,
  },
  {
    name: '最多播放',
    order: 'play',
    orderType: 0,
  },
  {
    name: '最新发布',
    order: 'latest',
    orderType: 1,
  },
  {
    name: '最多弹幕',
    order: 'danmu',
    orderType: 2,
  },
  {
    name: '最多收藏',
    order: 'collection',
    orderType: 3,
  },
])

const keyword = ref(route.query.keyword)
const search = () => {
  if (!keyword.value) {
    return
  }
  router.push({
    path: '/search',
    query: {
      keyword: keyword.value,
      order: order.value,
    },
  })
}
const order = ref(route.query.order)
const changeOrder = (item) => {
  order.value = item.order
  search()
}

const loadingData = ref(false)
const dataSource = ref({})
const loadDataList = async () => {
  const orderTypeBtn = orderButtons.value.find((item) => {
    return route.query.order == item.order
  });

  loadingData.value = true

  const keyword = route.query.keyword as string;
  const orderType = orderTypeBtn?.orderType as number ?? '';
  const current  = dataSource.value?.current ?? 1;
  let result = await VideoService.searchVideo(keyword, orderType, current)
  loadingData.value = false
  if (!result) {
    return
  }
  console.log(result)
  dataSource.value = result
}

onMounted(() => {
  //初始化store
  navActionStore.setShowHeader(false)
  navActionStore.setFixedHeader(false)
  navActionStore.setFixedCategory(false)
  navActionStore.setShowCategory(false)
  navActionStore.setForceFixedHeader(true)
})

const goDetail = (videoId: string) => {
  router.push(`/video/${videoId}`)
}

watch(
    () => route.fullPath,
    (newVal) => {
      if (newVal) {
        console.log("触发加载数据")
        loadDataList()
        searchHistoryStore.addHistory(newVal as string)
      }
    },
    {immediate: true, deep: true}
)
</script>

<style lang="scss" scoped>
.search-body {
  padding-top: 80px;

  .search-panel {
    margin: 20px auto;
    width: 700px;

    :deep(.el-input) {
      height: 55px;
    }

    .icon-search {
      color: var(--blue);
      font-weight: bold;
    }

    .search-btn {
      padding: 20px 35px;
    }
  }

  .order-btns {
    display: flex;
    margin-right: 10px;

    .btn {
      padding: 5px 10px;
      cursor: pointer;
      border-radius: 5px;
      color: var(--text2);
      font-size: 14px;

      &:hover {
        color: var(--blue);
      }
    }

    .active {
      background: #dff6fd;
      color: var(--blue);
    }
  }

  .data-list {
    margin-top: 20px;
  }
}
</style>