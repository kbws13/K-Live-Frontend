<template>
    <Dialog :show="loginStore.showLogin" width="1000px" :buttons="dialogConfig.buttons" :showCancel="false"
        @close="loginStore.showLogin = false">
        <div class="dialog-panel">
            <div class="bg">
                <img src="@/assets/login_bg.png" alt="登录背景图">
            </div>
            <el-form class="login-register" :model="formData" :rules="rules" ref="formDataRef" label-width="80px"
                @submit.event>
                <div class="tab-panel">
                    <div :class="[opType == 0 ? 'active' : '']" @click="showPanle(0)">登录</div>
                    <el-divider direction="vertical"></el-divider>
                    <div :class="[opType == 1 ? 'active' : '']" @click="showPanle(1)">注册</div>
                </div>
                <el-form-item prop="email">
                    <el-input clearable placeholder="请输入邮箱" v-model.trim="formData.email" size="large">
                        <template #prefix>
                            <span class="iconfont icon-account"></span>
                        </template>
                    </el-input>
                </el-form-item>
                <el-form-item prop="password">
                    <el-input show-password placeholder="请输入密码" v-model.trim="formData.password" size="large">
                        <template #prefix>
                            <span class="iconfont icon-password"></span>
                        </template>
                    </el-input>
                </el-form-item>
                <div v-if="opType == 1">
                    <el-form-item prop="nickName">
                        <el-input clearable placeholder="请输入昵称" v-model.trim="formData.nickName" size="large">
                            <template #prefix>
                                <span class="iconfont icon-account"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="checkPassword">
                        <el-input show-password placeholder="请再次输入密码" v-model.trim="formData.checkPassword"
                            size="large">
                            <template #prefix>
                                <span class="iconfont icon-password"></span>
                            </template>
                        </el-input>
                    </el-form-item>
                    <el-form-item prop="checkCode">
                        <div class="check-code-panel">
                            <div class="input">
                                <el-input placeholder="请输入验证码" v-model.trim="formData.password" size="large">
                                    <template #prefix>
                                        <span class="iconfont icon-checkcode"></span>
                                    </template>
                                </el-input>
                            </div>
                            <img :src="checkCodeInfo?.checkCode" @click="changeCheckCode" alt="">
                        </div>
                    </el-form-item>
                </div>

                <el-form-item>
                    <el-button type="primary" @click="submit" class="login-btn" size="large">
                        <span v-if="opType == 0">登录</span>
                        <span v-if="opType == 1">注册</span>
                    </el-button>
                </el-form-item>
            </el-form>
        </div>
    </Dialog>
</template>

<script lang="ts" setup>
import { ElForm, ElFormItem, ElButton, ElInput, ElDivider } from 'element-plus';
import { UserService } from '@/api';
import type { UserLoginRequest } from '@/api/models/request/User/UserLoginRequest';
import type { CheckCodeVO } from '@/api/models/response/User/CheckCodeVO';
import { userLoginStore } from '@/stores/UserStore';
import { getCurrentInstance, nextTick, onMounted, onUpdated, ref } from 'vue';
import { md5 } from "js-md5";
import Message from '@/utils/Message';

// @ts-ignore
const { proxy } = getCurrentInstance();
const loginStore = userLoginStore();

const checkCodeInfo = ref<CheckCodeVO>();
const changeCheckCode = async () => {
    const res = await UserService.checkCode();
    if (!res) {
        return;
    }
    checkCodeInfo.value = res;
}
const dialogConfig = ref({
    buttons: []
});

const formData = ref({
    email: '',
    password: '',
    nickName: '',
    checkCode: '',
    checkPassword: '',
})
const formDataRef = ref()

// TODO 完善校验规则
const rules = {
    title: [{ required: true, message: '请输入标题' }]
}

const opType = ref(0)

const showPanle = (type: number) => {
    opType.value = type;
    if (loginStore.showLogin) {
        resetForm();
    }
}

const resetForm = () => {
    changeCheckCode();
    nextTick(() => {
        formDataRef.value.resetFields();
        formData.value = {
            email: '',
            password: '',
            nickName: '',
            checkCode: '',
            checkPassword: '',
        };
    })
}

onMounted(() => {
    showPanle(0);
})

onUpdated(() => {
    showPanle(0);
})

const submit = async () => {
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
}

</script>

<style lang="scss">
.dialog-panel {
    display: flex;
    align-items: center;
    justify-content: space-around;

    .bg {
        width: 450px;
        height: 500px;
        overflow: hidden;

        img {
            width: 100%;
        }
    }

    .login-register {
        width: 350px;

        .tab-panel {
            margin: 10px auto;
            display: flex;
            width: 130px;
            font-size: 18px;
            align-items: center;
            justify-content: space-around;
            cursor: pointer;

            .active {
                color: var(--blue2);
            }
        }

        .no-account {
            width: 100%;
            display: flex;
            justify-content: space-between;
        }

        .login-btn {
            width: 100%;
        }

        .bottom-btn {
            margin-bottom: 0;
        }
    }
}

.check-code-panel {
    display: flex;
    align-items: center;
    width: 100%;

    .input {
        flex: 1;
    }

    .right-panel {
        margin-left: 5px;
        cursor: pointer;
    }

    img {
        cursor: pointer;
    }
}

.el-form-item__content {
    margin-left: 0 !important;
}
</style>