<template>
  <div class="setting-form">
    <el-form
        :model="formData"
        :rules="rules"
        ref="formDataRef"
        label-width="160px"
        @submit.prevent
    >
      <!--input输入-->
      <el-form-item label="注册送硬币数量" prop="registerCoinCount">
        <el-input
            placeholder="请输入硬币数量"
            v-model="formData.registerCoinCount"
            type="number"
            :min="1"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="发布视频送硬币数量" prop="postVideoCoinCount">
        <el-input
            placeholder="请输入发布视频送硬币数量"
            v-model="formData.postVideoCoinCount"
            type="number"
            :min="1"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="单个视频大小" prop="videoSize">
        <el-input
            placeholder="单个视频大小"
            v-model="formData.videoSize"
            type="number"
            :min="1"
        >
          <template #suffix> MB </template>
        </el-input>
      </el-form-item>
      <el-form-item label="稿件最大分P数量" prop="videoPCount">
        <el-input
            placeholder="单个视频大小"
            v-model="formData.videoPCount"
            type="number"
            :min="1"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="每天发布视频数" prop="videoCount">
        <el-input
            placeholder="每天发布视频数"
            v-model="formData.videoCount"
            type="number"
            :min="1"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="每天允许评论数" prop="commentCount">
        <el-input
            placeholder="每天允许发布评论数"
            v-model="formData.commentCount"
            type="number"
            :min="1"
        >
        </el-input>
      </el-form-item>
      <el-form-item label="每天允许弹幕数" prop="danmuCount">
        <el-input
            placeholder="每天允许发布弹幕数"
            v-model="formData.danmuCount"
            type="number"
            :min="1"
        >
        </el-input>
      </el-form-item>
      <!--input输入-->
      <el-form-item label="" prop="">
        <el-button type="primary" @click="saveSetting">保存</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {ElForm, ElFormItem, ElInput, ElButton} from "element-plus";
import {ref} from "vue";
import Message from "@/utils/Message";
import {SystemService} from "@/api/services/SystemService";
import type {SystemSetting} from "@/api/models/response/Setting/SystemSetting";

const formData = ref<SystemSetting>({} as SystemSetting);
const formDataRef = ref();
const rules = {
  title: [{ required: true, message: "请输入内容" }],
  videoCount: [{ required: true, message: "请输入视频数量" }],
  videoPCount: [{ required: true, message: "请输入稿件最大分P数量" }],
  commentCount: [{ required: true, message: "请输入评论数量" }],
  danmuCount: [{ required: true, message: "请输入弹幕数量" }],
};

const getSetting = async () => {
  let result = await SystemService.getSystemSetting();
  if (!result) {
    return;
  }
  formData.value = result;
};
getSetting();

const saveSetting = () => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return;
    }
    await SystemService.saveSystemSetting(formData.value);
    Message.success("保存成功");
  });
};
</script>

<style lang="scss" scoped>
.setting-form {
  padding: 20px;
  width: 500px;
}
</style>