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
      <el-button type="primary" size="large" class="op-btn" @click="doSubmit">
        登录
      </el-button>
    </el-form>
  </div>
</template>

<script lang="ts" setup>
import {ElButton, ElForm, ElFormItem, ElInput} from "element-plus"
import {ref} from "vue";
import {useRouter} from "vue-router";
import {md5} from "js-md5";
import Message from "web/src/utils/Message";
import {userLoginStore} from "web/src/stores/UserStore";
import type {UserLoginRequest} from "@/api/models/request/User/UserLoginRequest";
import {UserService} from "@/api/services/UserService";
import VueCookies from "vue-cookies";

const loginStore = userLoginStore();
const router = useRouter();

// 0:注册 1:登录
const formData = ref({
  email: '',
  password: '',
  nickName: '',
  checkPassword: '',
});
const formDataRef = ref();
const rules = {
  account: [{ required: true, message: "请输入账号" }],
  password: [{ required: true, message: "请输入密码" }],
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
  // @ts-ignore
  VueCookies.set("token", res.token);
  await router.push("/home");
};
</script>

<style lang="scss" scoped>
.account-panel {
  display: flex;
  align-items: center;
  justify-content: center;
  height: calc(100vh);
  background: url("../../assets/login-bg.png") center, center;
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