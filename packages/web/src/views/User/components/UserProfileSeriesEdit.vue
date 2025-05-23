<template>
  <Dialog :show="dialogConfig.show" :title="dialogConfig.title" :buttons="dialogConfig.buttons" width="500px"
          :showCancel="false" @close="dialogConfig.show = false">
    <el-form :model="formData" :rules="rules" ref="formDataRef" label-width="80px" @submit.prevent>
      <!--input输入-->
      <template v-if="step == 1">
        <el-form-item label="列表名称" prop="seriesName">
          <el-input clearable placeholder="请填写名称" v-model="formData.name" :maxlength="100"
                    show-word-limit></el-input>
        </el-form-item>
        <!--textarea输入-->
        <el-form-item label="列表简介" prop="">
          <el-input clearable placeholder="请填写简介（选填）" type="textarea" :rows="5" :maxlength="200" show-word-limit
                    resize="none" v-model="formData.description"></el-input>
        </el-form-item>
      </template>
      <template v-if="step == 2">
        <el-scrollbar max-height="400px">
          <el-checkbox-group v-model="formData.videoIds">
            <div class="video-item" v-for="item in videoList">
              <div class="check">
                <el-checkbox :value="item.id"/>
              </div>
              <div class="cover">
                <Cover :src="item.cover"></Cover>
              </div>
              <div class="video-info">
                <div class="video-name">{{ item.name }}</div>
                <div class="play-info">
                  <div class="iconfont icon-play2">{{ item.playCount }}</div>
                  <div class="create-time">
                    {{ Local.formatDate(item.createTime) }}
                  </div>
                </div>
              </div>
            </div>
          </el-checkbox-group>
        </el-scrollbar>
      </template>
      <div class="op-btns">
        <el-button link @click="cancel" v-if="step == 1 || opType == 2">
          取消
        </el-button>
        <el-button type="primary" @click="nextStep" v-if="step == 1 && opType != 1">
          下一步
        </el-button>
        <el-button type="primary" @click="preStep" v-if="step == 2 && opType != 2">
          上一步
        </el-button>
        <el-button type="primary" @click="submit" v-if="step == 2 || opType == 1">
          确定
        </el-button>
      </div>
    </el-form>
  </Dialog>
</template>

<script lang="ts" setup>
import {ElButton, ElForm, ElFormItem, ElInput, ElScrollbar, ElCheckboxGroup, ElCheckbox} from "element-plus"
import Local from "web/src/utils/Local";
import {useRoute} from "vue-router";
import {nextTick, ref} from "vue";
import {SeriesService} from "@/api/services/SeriesService";
import type {Video} from "@/api/models/response/Video/Video";
import Message from "@/utils/Message";

const route = useRoute()
const dialogConfig = ref({
  show: false,
  title: '视频列表',
})

const opType = ref(0)
const step = ref(1)
const formData = ref({
  videoIds: [],
})
const formDataRef = ref()
const rules = {
  name: [{required: true, message: '请输入名称'}],
}

const show = (data = {}, _opType = 0) => {
  loadVideoList();

  opType.value = _opType
  if (_opType === 0 || _opType == 1) {
    //新增系列,修改系列
    step.value = 1
  } else if (_opType == 2) {
    //增加视频
    step.value = 2
  }
  dialogConfig.value.show = true
  nextTick(() => {
    formDataRef.value.resetFields()
    formData.value = Object.assign({}, data)
    formData.value.videoIds = []
  })
}
defineExpose({
  show,
})

const emit = defineEmits(['reload'])

const cancel = () => {
  dialogConfig.value.show = false
}

const nextStep = () => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    step.value = 2
  })
}
const preStep = () => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    step.value = 1
  })
}

const submit = () => {
  formDataRef.value.validate(async (valid: boolean) => {
    if (!valid) {
      return
    }
    const params = Object.assign({}, formData.value)
    if (params.videoIds.length == 0 && step.value == 2) {
      Message.warning('请选择视频')
      return
    }
    params.videoIds = params.videoIds.join(',')
    let res;
    if(opType.value == 2) {
      res = await SeriesService.saveSeriesContent(params.id, params.videoIds);
    } else {
      res = await SeriesService.updateSeries(params)
    }
    if (!res) {
      return
    }
    Message.success('保存成功')
    dialogConfig.value.show = false
    emit('reload')
  })
}

const videoList = ref<Video[]>([])
const loadVideoList = async () => {
  const seriesId = route.params.seriesId as string;
  console.log(seriesId)
  const result = await SeriesService.loadAllVideo(seriesId == undefined ? '' : seriesId)
  if (!result) {
    return
  }
  videoList.value = result
}
</script>

<style lang="scss" scoped>
.op-btns {
  text-align: right;
}

.video-item {
  display: flex;
  margin-bottom: 10px;
  padding-right: 15px;
  align-items: center;

  .check {
    width: 30px;
  }

  .cover {
    width: 100px;
  }

  .video-info {
    flex: 1;
    margin-left: 5px;
    min-width: 0;

    .video-name {
      width: 100%;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .play-info {
      margin-top: 5px;
      font-size: 13px;
      color: var(--text3);
      display: flex;
      justify-content: space-between;

      .iconfont {
        font-size: 13px;

        &::before {
          font-size: 16px;
          margin-right: 3px;
        }
      }
    }
  }
}

:deep(.el-checkbox-group) {
  font-size: 13px;
  line-height: normal;
}
</style>