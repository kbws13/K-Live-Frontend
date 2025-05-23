<template>
  <div class="top-panel">
    <el-card>
      <el-form :model="searchForm" @submit.prevent>
        <el-row :gutter="10">
          <el-col :span="5">
            <el-form-item label="用户昵称">
              <el-input clearable placeholder="输入用户昵称" v-model="searchForm.nickName"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-form-item label="状态" prop="">
              <el-select clearable placeholder="请选择状态" v-model="searchForm.status">
                <el-option :value="0" label="禁用"></el-option>
                <el-option :value="1" label="启用"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="5">
            <el-button type="primary" @click="loadDataList">搜索</el-button>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
  </div>
  <el-card class="table-data-card">
    <Table ref="tableInfoRef" :columns="columns" :fetch="loadDataList" :dataSource="tableData" :options="tableOptions"
           :extHeight="tableOptions.extHeight">
      <template #slotAvatar="{ index, row }">
        <Avatar :avatar="row.avatar"></Avatar>
      </template>

      <template #slotNickName="{ index, row }">
        <a class="nick-name" :href="`${proxy.webDomain}/user/${row.userId}`">{{
            row.nickName
          }}</a>
        <span v-if="row.sex">({{ SEX_MAP[row.sex] }})</span>
      </template>

      <template #slotJoinTime="{ index, row }">
        <div>加入时间：{{ row.createTime }}</div>
        <div>最后登录时间：{{ row.lastLoginTime }}</div>
      </template>

      <template #slotCoin="{ index, row }">
        <div>当前:{{ row.currentCoinCount }}</div>
        <div>总数:{{ row.totalCoinCount }}</div>
      </template>

      <template #slotStatus="{ index, row }">
        {{ row.status == 0 ? "禁用" : "启用" }}
      </template>

      <template #slotOperation="{ index, row }">
        <a href="javascript:void(0)" class="a-link" @click="changeStatus(row)">{{ row.status == 0 ? "启用" : "禁用" }}</a>
      </template>
    </Table>
  </el-card>
</template>

<script lang="ts" setup>
import {ElCard, ElForm, ElRow, ElCol, ElButton, ElInput, ElFormItem, ElSelect, ElOption} from "element-plus";
import {getCurrentInstance, ref} from "vue";
import Message from "@/utils/Message";
import Confirm from "@/utils/Confirm";
import type {UserLoadRequest} from "@/api/models/request/User/UserLoadRequest";
import type {Page} from "@/common/Page";
import type {User} from "@/api/models/response/User/User";
import {UserService} from "@/api/services/UserService";

// @ts-ignore
const {proxy} = getCurrentInstance();
const SEX_MAP = {
  0: '女',
  1: '男',
  2: '保密',
}

const columns = [
  {
    label: '头像',
    prop: 'avatar',
    width: 100,
    scopedSlots: 'slotAvatar',
  },
  {
    label: '昵称',
    prop: 'nickName',
    width: 150,
    scopedSlots: 'slotNickName',
  },
  {
    label: '邮箱',
    prop: 'email',
    width: 150,
  },
  {
    label: '出生日期',
    prop: 'birthday',
    width: 150,
  },
  {
    label: '加入时间',
    prop: 'joinTime',
    scopedSlots: 'slotJoinTime',
    width: 300,
  },
  {
    label: '最后登录IP',
    prop: 'lastLoginIp',
    width: 150,
  },
  {
    label: '简介',
    prop: 'personIntroduction',
  },
  {
    label: '硬币数量',
    prop: 'coin',
    scopedSlots: 'slotCoin',
  },
  {
    label: '状态',
    prop: 'status',
    scopedSlots: 'slotStatus',
  },
  {
    label: '操作',
    prop: 'operation',
    width: 80,
    scopedSlots: 'slotOperation',
  },
]

const tableInfoRef = ref()
const tableOptions = ref({
  extHeight: 0,
})

const searchForm = ref({} as any)
const tableData = ref<Page<User>>({} as Page<User>);
const loadDataList = async () => {
  let userLoadRequest: UserLoadRequest = {
    current: tableData.value.current,
    pageSize: tableData.value.pageSize,
    nickName: searchForm.value.nickName,
    email: searchForm.value.email,
  };
  let result = await UserService.loadUser(userLoadRequest);
  if (!result) {
    return
  }
  Object.assign(tableData.value, result)
}

const changeStatus = (row: User) => {
  Confirm({
    message: `确定要${row.userRole == "ban" ? '启用' : '禁用'}吗？`,
    okfun: async () => {
      let result = await UserService.changeStatus({
        userId: row.id,
        userRole: row.userRole == "ban" ? "user" : "ban",
      })
      if (!result) {
        return
      }
      Message.success('操作成功')
      await loadDataList()
    },
  })
}
</script>

<style lang="scss" scoped>
.nick-name {
  margin-top: 5px;
  text-decoration: none;
  font-size: 14px;
  color: var(--text2);
}
</style>