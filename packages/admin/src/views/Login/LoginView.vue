<template>
  <div class="account-panel">
    <el-form
        class="login-panel"
        :model="formData"
        :rules="rules"
        ref="formDataRef"
    >
      <div class="login-title">登录</div>
      <!--input输入-->
      <el-form-item prop="email">
        <el-input
            size="large"
            clearable
            placeholder="请输入账号"
            v-model="formData.email"
            maxLength="150"
        >
          <template #prefix>
            <span class="iconfont icon-account"></span>
          </template>
        </el-input>
      </el-form-item>
      <!--登录密码-->
      <el-form-item prop="password">
        <el-input
            show-password
            size="large"
            placeholder="请输入密码"
            v-model="formData.password"
        >
          <template #prefix>
            <span class="iconfont icon-password"></span>
          </template>
        </el-input>
      </el-form-item>
      <el-form-item prop="checkCode">
        <div class="check-code-panel">
          <el-input
              size="large"
              placeholder="请输入验证码"
              v-model="formData.checkCode"
              @keyup.enter="doSubmit"
          >
            <template #prefix>
              <span class="iconfont icon-checkcode"></span>
            </template>
          </el-input>
          <img
              :src="checkCodeInfo?.checkCode"
              class="check-code"
              @click="changeCheckCode()"
           alt=""/>
        </div>
      </el-form-item>
      <el-button type="primary" size="large" class="op-btn" @click="doSubmit">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {  ElForm, ElFormItem, ElButton, ElInput } from "element-plus"
import { ref, getCurrentInstance } from "vue";
import {useRouter} from "vue-router";
import { md5 } from "js-md5";
import Message from "web/src/utils/Message";
import {userLoginStore} from "web/src/stores/UserStore";
import type {CheckCodeVO} from "@/api/models/response/User/CheckCodeVO";
import type {UserLoginRequest} from "@/api/models/request/User/UserLoginRequest";
import {UserService} from "@/api/services/UserService";

// @ts-ignore
const { proxy } = getCurrentInstance();
const loginStore = userLoginStore();
const router = useRouter();
//验证码
const checkCodeInfo = ref<CheckCodeVO>();
const changeCheckCode = async () => {
  const res = await UserService.checkCode();
  if (!res) {
    return;
  }
  checkCodeInfo.value = res;
}
changeCheckCode();

// 0:注册 1:登录
const formData = ref({
  email: '',
  password: '',
  nickName: '',
  checkCode: '',
  checkPassword: '',
});
const formDataRef = ref();
const rules = {
  account: [{ required: true, message: "请输入账号" }],
  password: [{ required: true, message: "请输入密码" }],
  checkCode: [{ required: true, message: "请输入图片验证码" }],
};

// 登录、注册、重置密码  提交表单
const doSubmit = async () => {
  const data: UserLoginRequest = {
    email: formData.value.email,
    password: md5(formData.value.password)
  }
  const res = await UserService.login(data)
  if (!res) return;
  Message.success('登录成功');
  loginStore.setLogin(false);
  loginStore.saveUserInfo(res);
  proxy.VueCookies.set("token", res.token);
  await router.push("/home");
};
</script>

<style lang="scss" scoped>
.account-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh);
  background: url("../assets/login-bg.png") center, center;
  background-size: 100% 100%;
  .login-panel {
    background-color: rgba(255, 255, 255, 0.8);
    padding: 30px;
    width: 400px;
    border-radius: 5px;
    .login-title {
      text-align: center;
      font-size: 16px;
      line-height: 40px;
    }
    .check-code-panel {
      width: 100%;
      display: flex;
      justify-content: space-between;
      .check-code {
        margin-left: 5px;
        cursor: pointer;
      }
    }
    .op-btn {
      width: 100%;
    }
  }
}
</style>