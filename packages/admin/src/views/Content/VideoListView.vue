<template>
  <div class="top-panel">
    <el-card>
      <el-form :model="searchForm" label-width="70px" label-position="right">
        <el-row>
          <el-col :span="5">
            <el-form-item label="视频名称">
              <el-input
                  class="password-input"
                  v-model="searchForm.videoName"
                  clearable
                  placeholder="支持模糊搜索"
                  @keyup.enter="loadDataList"
              >
              </el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="分类">
              <el-cascader
                  style="width: 100%"
                  v-model="searchForm.categoryIdArray"
                  :options="categoryList"
                  :clearable="true"
                  :props="{
                  value: 'categoryId',
                  label: 'categoryName',
                  checkStrictly: true,
                }"
              />
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="推荐">
              <!-- 下拉框 -->
              <el-select
                  clearable
                  placeholder="请选择推荐状态"
                  v-model="searchForm.recommendType"
              >
                <el-option :value="0" label="未推荐"></el-option>
                <el-option :value="1" label="已推荐"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="4" :style="{ paddingLeft: '10px' }">
            <el-button type="success" @click="loadDataList()">查询</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
  <el-card class="table-data-card">
    <Table
        ref="tableInfoRef"
        :columns="columns"
        :fetch="loadDataList"
        :dataSource="tableData"
        :options="tableOptions"
        :extHeight="tableOptions.extHeight"
    >
      <template #cover="{ row }">
        <div class="cover-info">
          <Cover :source="row.cover" :width="160"></Cover>
          <div class="duration">
            {{ Local.convertSecondsToHMS(row.duration) }}
          </div>
        </div>
      </template>

      <template #name="{ row }">
        <div class="video-info">
          <div class="video-name">{{ row.name }}</div>
          <div class="user-name iconfont icon-upzhu">{{ row.nickName }}</div>
          <div class="video-count">
            <span class="iconfont icon-play-solid">{{ row.playCount }}</span>
            <span class="iconfont icon-like-solid">{{ row.likeCount }}</span>
            <span class="iconfont icon-danmu-solid">{{ row.danmuCount }}</span>
            <span class="iconfont icon-comment-solid">{{
                row.commentCount
              }}</span>
            <span class="iconfont icon-toubi">{{ row.coinCount }}</span>
            <span class="iconfont icon-collection-solid">{{
                row.collectCount
              }}</span>
          </div>
        </div>
      </template>

      <template #statusName="{ row }">
        <span :style="{ color: statusMap[row.status] }">{{
            row.statusName
          }}</span>
      </template>

      <template #recommendType="{ row }">
        {{ row.recommendType == 1 ? "已推荐" : "未推荐" }}
      </template>

      <template #slotOperation="{ row }">
        <div class="row-op-panel">
          <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="showDetail(row)"
          >详情</a
          >
          <el-divider direction="vertical"/>
          <template v-if="row.status == 2">
            <a class="a-link" href="javascript:void(0)" @click="audit(row)"
            >审核</a
            >
            <el-divider direction="vertical"/>
          </template>
          <template v-if="row.status == 3">
            <a
                class="a-link"
                href="javascript:void(0)"
                @click="recommend(row)"
            >{{ row.recommendType == 1 ? "取消推荐" : "推荐" }}</a
            >
            <el-divider direction="vertical"/>
          </template>
          <a
              class="a-link"
              href="javascript:void(0)"
              @click.prevent="delVideo(row)"
          >删除</a
          >
        </div>
      </template>
    </Table>
  </el-card>
  <VideoDetail ref="videoDetailRef"></VideoDetail>
  <VideoAudit ref="auditRef" @reload="loadDataList"></VideoAudit>
</template>

<script lang="ts" setup>
import {
  ElCard,
  ElDivider,
  ElForm,
  ElRow,
  ElCol,
  ElFormItem,
  ElInput,
  ElSelect,
  ElOption,
  ElCascader,
  ElButton
} from "element-plus";
import {ref} from "vue";
import VideoDetail from "@/views/Content/components/VideoDetail.vue";
import VideoAudit from "@/views/Content/components/VideoAudit.vue";
import Message from "@/utils/Message";
import Confirm from "@/utils/Confirm";
import Local from "web/src/utils/Local";
import type {VideoPostQueryRequest} from "@/api/models/request/VideoPost/VideoPostQueryRequest";
import {CategoryService} from "@/api/services/CategoryService";
import type {CategoryQueryRequest} from "@/api/models/request/Category/CategoryQueryRequest";
import type {Category} from "@/api/models/response/Category/Category";
import type {VideoPostVO} from "@/api/models/response/VideoPost/VideoPostVO";
import {VideoService} from "@/api/services/VideoService";

interface SearchForm {
  videoName?: string;
  categoryIdArray?: number[];
  recommendType?: number;
}
const searchForm = ref<SearchForm>({});

const tableData = ref({} as any);
const tableOptions = ref({
  extHeight: 0,
});

const statusMap: { [key: number]: string } = {
  0: "#e6a23c", //转码中
  1: "#f56c6c", //转码失败
  2: "#e6a23c", //待审核
  3: "#67c23a", //成功
  4: "#f56c6c", //审核失败
};

const columns = [
  {
    label: "封面",
    prop: "cover",
    width: 220,
    scopedSlots: "cover",
  },
  {
    label: "视频信息",
    prop: "name",
    scopedSlots: "name",
  },
  {
    label: "最后更新时间",
    prop: "lastUpdateTime",
    width: 200,
  },
  {
    label: "状态",
    prop: "statusName",
    width: 100,
    scopedSlots: "statusName",
  },
  {
    label: "推荐",
    prop: "recommendType",
    width: 100,
    scopedSlots: "recommendType",
  },
  {
    label: "操作",
    prop: "operation",
    width: 190,
    scopedSlots: "slotOperation",
  },
];

const tableInfoRef = ref();

const loadDataList = async () => {
  let videoPostQueryRequest: VideoPostQueryRequest = {
    current: tableData.value.current,
    pageSize: tableData.value.pageSize,
    queryCount: true,
    queryUserInfo: true,
  };
  Object.assign(videoPostQueryRequest, searchForm.value);

  if (searchForm.value.categoryIdArray && searchForm.value.categoryIdArray.length == 2) {
    videoPostQueryRequest.categoryId = searchForm.value.categoryIdArray[1];
  } else if (searchForm.value.categoryIdArray && searchForm.value.categoryIdArray.length == 1) {
    videoPostQueryRequest.parentCategoryId = searchForm.value.categoryIdArray[0];
  }
  let result = await VideoService.loadVideoPost(videoPostQueryRequest);
  if (!result) {
    return;
  }
  Object.assign(tableData.value, result);
};

const categoryList = ref<Category[]>([] as Category[]);
const loadCategory = async () => {
  let result = await CategoryService.queryCategory({coverLine2Tree: true} as CategoryQueryRequest);
  if (!result) {
    return;
  }
  categoryList.value = result;
};
loadCategory();

//详情
const videoDetailRef = ref();
const showDetail = (data: VideoPostVO) => {
  videoDetailRef.value.show(data);
};

//审核
const auditRef = ref();
const audit = (row: VideoPostVO) => {
  auditRef.value.show(row.id);
};
//删除
const delVideo = (data: VideoPostVO) => {
  Confirm({
    message: `确定要删除【${data.name}】吗？`,
    okfun: async () => {
      const res = await VideoService.deleteVideo(data.id);
      if(!res) {
        Message.error("操作失败");
      }
      Message.success("操作成功");
      await loadDataList();
    },
  });
};

const recommend = (data: VideoPostVO) => {
  const recommendName = data.recommendType == 0 ? "推荐" : "取消推荐";
  Confirm({
    message: `确定要【${recommendName}】【${data.name}】吗？`,
    okfun: async () => {
      let result = await VideoService.recommendVideo(data.id);
      if (!result) {
        return;
      }
      Message.success("操作成功");
      await loadDataList();
    },
  });
};
</script>

<style lang="scss" scoped>
.detail-tree-panel {
  height: calc(100vh - 273px);
  overflow: auto;
  width: 100%;
}

.cover-info {
  min-width: 0;
  width: 160px;
  position: relative;

  .duration {
    position: absolute;
    right: 0;
    bottom: 0;
    padding: 3px;
    border-radius: 5px 0 5px 0;
    background: rgba(0, 0, 0, 0.7);
    opacity: 0.8;
    color: #fff;
    font-size: 13px;
  }
}

.video-info {
  .user-name {
    margin-top: 5px;
    color: var(--text3);
    font-size: 14px;

    &::before {
      margin-right: 5px;
    }
  }

  .video-count {
    margin-top: 10px;
    color: var(--text3);
    display: flex;
    align-items: center;

    .iconfont {
      font-size: 14px;
      margin-right: 20px;

      &::before {
        font-size: 18px;
        margin-right: 5px;
      }
    }
  }
}
</style>