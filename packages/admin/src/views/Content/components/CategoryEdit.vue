<template>
  <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" :showCancel="true"
          @close="dialogConfig.show = false">
    <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="80px" @submit.prevent>
      <el-form-item label="分类编号" prop="categoryCode">
        <el-input :maxLength="10" v-model="formData.code" :show-word-limit="true" :maxlength="30" />
      </el-form-item>
      <el-form-item label="分类名称" prop="categoryName">
        <el-input :maxLength="10" v-model="formData.name" :show-word-limit="true" :maxlength="30" />
      </el-form-item>
      <template v-if="formData.parentCategoryId === 0">
        <el-form-item label="图标" prop="icon">
          <ImageUpload v-model="formData.icon"></ImageUpload>
        </el-form-item>
        <el-form-item label="背景图" prop="icon">
          <ImageUpload v-model="formData.background" :width="300" :height="150"></ImageUpload>
        </el-form-item>
      </template>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import {ElForm, ElFormItem, ElInput} from "element-plus"
import {nextTick, ref} from "vue"
import Message from "@/utils/Message";
import {uploadImage} from "@/api";
import ImageUpload from "@/components/ImageUpload.vue";
import type {Category} from "@/api/models/response/Category/Category";
import {CategoryService} from "@/api/services/CategoryService";

const dialogConfig = ref({
  show: false,
  title: '新增分类',
  buttons: [
    {
      type: 'primary',
      text: '确定',
      click: () => {
        submitForm()
      },
    },
  ],
})

const formData = ref<Category>({} as Category)
const formDataRef = ref()

const rules = {
  categoryCode: [{ required: true, message: '请输入分类编号' }],
  categoryName: [{ required: true, message: '请输入分类名称' }],
}

const showEdit = (data: Category) => {
  dialogConfig.value.show = true
  nextTick(() => {
    formDataRef.value.resetFields()
    if (data.id == null) {
      dialogConfig.value.title = '新增分类'
    } else {
      dialogConfig.value.title = '修改分类'
    }
    formData.value = Object.assign({}, data)
  })
}

defineExpose({
  showEdit,
})

const emit = defineEmits(['reload'])
const submitForm = async () => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    let params = {} as any
    Object.assign(params, formData.value)

    //上传封面
    if (params.icon instanceof File) {
      params.icon = await uploadImage(params.icon)
    }
    //上传背景图
    if (params.background instanceof File) {
      params.background = await uploadImage(params.background)
    }

    let result = await CategoryService.addCategory(params)
    if (!result) {
      return
    }
    dialogConfig.value.show = false
    Message.success('保存成功')
    emit('reload')
  })
}
</script>

<style lang="scss" scoped>
</style>