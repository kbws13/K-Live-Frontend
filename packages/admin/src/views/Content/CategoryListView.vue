<template>
  <el-row :gutter="10">
    <el-col :span="16">
      <el-card class="table-data-card">
        <template #header>
          <div class="header">
            <div class="title">一级分类</div>
            <div class="btn" @click="showEdit({} as Category, 0)">新增分类</div>
          </div>
        </template>
        <Table
            ref="tableInfoRef"
            :columns="columns"
            :fetch="loadDataList"
            :dataSource="tableData"
            :options="tableOptions"
            :extHeight="tableOptions.extHeight"
            :showPagination="false"
            @rowClick="rowClick"
        >
          <template #icon="{ row }">
            <div class="cover">
              <Cover
                  :source="row.icon"
                  defaultImg="default_image.png.png"
              ></Cover>
            </div>
          </template>
          <template #background="{ row }">
            <div class="category-background">
              <Cover
                  :source="row.background"
                  fit="cover"
                  defaultImg="default_banner.png"
              ></Cover>
            </div>
          </template>

          <template #slotOperation="{ index, row }">
            <div class="row-op-panel">
              <a
                  class="a-link"
                  href="javascript:void(0)"
                  @click="showEdit(row, 0)"
              >修改</a
              >
              <el-divider direction="vertical"/>
              <a
                  class="a-link"
                  href="javascript:void(0)"
                  @click="delCategory(row)"
              >删除</a
              >
              <el-divider direction="vertical"/>
              <a
                  href="javascript:void(0)"
                  @click="changeSort(0, index, 'up')"
                  :class="[index == 0 ? 'disable' : 'a-link']"
              >上移</a
              >
              <el-divider direction="vertical"/>
              <a
                  href="javascript:void(0)"
                  @click="changeSort(0, index, 'down')"
                  :class="[
                  index == tableData.records.length - 1 ? 'disable' : 'a-link',
                ]"
              >下移</a
              >
            </div>
          </template>
        </Table>
      </el-card>
    </el-col>
    <el-col :span="8">
      <el-card class="table-data-card">
        <template #header>
          <div class="header">
            <div class="title">二级分类</div>
            <div class="btn" @click="showEdit({} as Category, 1)">新增二分类</div>
          </div>
        </template>
        <Table
            :columns="columnSub"
            :fetch="loadDataList"
            :dataSource="subCategoryData"
            :options="tableOptions"
            :extHeight="tableOptions.extHeight"
            :showPagination="false"
        >
          <template #icon="{ index, row }">
            <div class="cover">
              <Cover
                  :source="row.icon"
                  defaultImg="default_image.png"
              ></Cover>
            </div>
          </template>
          <template #background="{ index, row }">
            <div class="category-background">
              <Cover
                  :source="row.background"
                  fit="cover"
                  defaultImg="default_banner.png"
              ></Cover>
            </div>
          </template>
          <template #slotOperation="{ index, row }">
            <div class="row-op-panel">
              <a
                  class="a-link"
                  href="javascript:void(0)"
                  @click="showEdit(row, 1)"
              >修改</a
              >
              <el-divider direction="vertical"/>
              <a
                  class="a-link"
                  href="javascript:void(0)"
                  @click="delCategory(row)"
              >删除</a
              >
              <el-divider direction="vertical"/>
              <a
                  href="javascript:void(0)"
                  @click="changeSort(row.pCategoryId, index, 'up')"
                  :class="[index == 0 ? 'disable' : 'a-link']"
              >上移</a
              >
              <el-divider direction="vertical"/>
              <a
                  href="javascript:void(0)"
                  @click="changeSort(row.pCategoryId, index, 'down')"
                  :class="[
                  index == tableData.records.length - 1 ? 'disable' : 'a-link',
                ]"
              >下移</a
              >
            </div>
          </template>
        </Table>
      </el-card>
    </el-col>
  </el-row>
  <CategoryEdit ref="categoryEditRef" @reload="loadDataList"></CategoryEdit>
</template>

<script lang="ts" setup>
import {ElRow, ElCol, ElCard, ElDivider} from "element-plus";
import {nextTick, ref} from "vue";
import CategoryEdit from "@/views/Content/components/CategoryEdit.vue";
import Message from "@/utils/Message";
import Confirm from "@/utils/Confirm";
import {CategoryService} from "@/api/services/CategoryService";
import type {CategoryQueryRequest} from "@/api/models/request/Category/CategoryQueryRequest";
import type {Category} from "@/api/models/response/Category/Category";

const tableData = ref({
  records: [] as Category[]
});
const tableOptions = ref({
  extHeight: 0,
});
const currentSelectCategory = ref<Category | null>(null);
const subCategoryData = ref({
  records: [] as Category[]
});

const columns = [
  {
    label: "图标",
    prop: "icon",
    scopedSlots: "icon",
    width: 70,
  },
  {
    label: "背景",
    prop: "background",
    scopedSlots: "background",
    width: 180,
  },
  {
    label: "分类编号",
    prop: "code",
    width: 180,
  },
  {
    label: "分类名称",
    prop: "name",
  },
  {
    label: "操作",
    prop: "type",
    scopedSlots: "slotOperation",
    width: 200,
  },
];

const columnSub = columns.slice(columns.length - 3, columns.length);

const tableInfoRef = ref();
const loadDataList = async () => {
  let result = await CategoryService.queryCategory({coverLine2Tree: true} as CategoryQueryRequest);
  if (!result) {
    return;
  }
  tableData.value.records = result;
  if (currentSelectCategory.value == null && result.length > 0) {
    currentSelectCategory.value = result[0];
    subCategoryData.value.records = result[0].children;
  } else {
    currentSelectCategory.value = result.find((item: Category) => {
      return item.id == currentSelectCategory.value!.id;
    })!;
    subCategoryData.value.records = currentSelectCategory.value.children;
  }
  await nextTick(() => {
    tableInfoRef.value.setCurrentRow(
        "id",
        currentSelectCategory.value!.id
    );
  });
};


const rowClick = (row: Category) => {
  subCategoryData.value.records = row.children;
  currentSelectCategory.value = row;
};

//新增分类

//删除
const delCategory = (data: Category) => {
  Confirm({
    message: `确定要删除【${data.name}】吗？`,
    okfun: async () => {
      let result = CategoryService.deleteCategory({
        id: data.id,
      });
      if (!result) {
        return;
      }
      Message.success("操作成功");
      //清空选中
      if (currentSelectCategory.value!.id == data.id) {
        currentSelectCategory.value = {} as Category;
      }
      await loadDataList();
    },
  });
};

const changeSort = async (parentCategoryId: number, index: number, type: string) => {
  let dataList =
      parentCategoryId == 0
          ? tableData.value.records
          : currentSelectCategory.value!.children;
  if (
      (type === "down" && index == dataList.length - 1) ||
      (type == "up" && index == 0)
  ) {
    return;
  }
  let temp = dataList[index];
  let number = type == "down" ? 1 : -1;
  dataList.splice(index, 1);

  dataList.splice(index + number, 0, temp);

  let categoryIds: number[] = [];
  dataList.forEach((element) => {
    categoryIds.push(element.id);
  });
  let result = await CategoryService.changeSortCategory({
    parentCategoryId: parentCategoryId,
    categoryIds: categoryIds.join(","),
  })
  if (!result) {
    return;
  }
  Message.success("重新排序成功");
  await loadDataList();
};

const categoryEditRef = ref();
const showEdit = (data: Category, type: number) => {
  if (type == 1 && !currentSelectCategory.value) {
    Message.warning("请先创建一级分类");
    return;
  }
  if (type == 0) {
    data.parentCategoryId = 0;
  } else if (type == 1 && Object.keys(data).length == 0) {
    data.parentCategoryId = currentSelectCategory.value!.id;
  }
  categoryEditRef.value.showEdit(Object.assign({}, data));
};
</script>

<style lang="scss" scoped>
.table-data-card {
  .header {
    display: flex;
    justify-content: space-between;

    .btn {
      cursor: pointer;
      color: var(--blue2);
    }
  }

  .category-background {
    width: 150px;
    height: 80px;
  }
}
</style>