<template>
    <div class="uploader-start-panel">
        <el-upload class="uploader-start" drag :show-file-list="false" :http-request="addFile"
            :before-upload="startUpload" :accept="proxy.videoAccept">
            <div class="upload-handler">
                <div class="iconfont icon-upload"></div>
                <div class="info">拖拽到此处也可上传</div>
                <div class="upload-btn">上传视频</div>
            </div>
        </el-upload>
    </div>

    <div class="upload-explain">
        <el-popover placement="top-end" :width="400" trigger="hover">
            <template #reference>
                <div class="item">视频大小</div>
            </template>
            <div>
                <p>网页端上传的文件大小上限为{{ systemSettingStore.sysSetting.videoSize }}MB</p>
                <p>视频内容时长最大3小时</p>
                <p>过长或过大视频建议拆分后使用分p或合集功能进行投稿～</p>
            </div>
        </el-popover>

        <el-popover placement="top-end" :width="420" trigger="hover">
            <template #reference>
                <div class="item">视频格式</div>
            </template>
            <div>
                <p>推荐上传的格式为：mp4</p>
                <p>（推荐上传的格式在转码过程更有优势，审核过程更快哦！）</p>
                <p>其他允许上传的格式：mp4,avi,rmvb,mkv,mov</p>
            </div>
        </el-popover>

        <el-popover placement="top-end" :width="350" trigger="hover">
            <template #reference>
                <div class="item">视频码率</div>
            </template>
            <div>
                <p>分辨率最大支持 8192*4320</p>
                <p>推荐视频分辨率：1920*1080 或者 3840*2160</p>
            </div>
        </el-popover>
    </div>
</template>

<script setup lang="ts">
import { ElPopover, ElUpload } from 'element-plus';
import { mitter } from '@/event/eventBus';
import { useSystemSettingStore } from '@/stores/SystemSettingStore';
import Local from '@/utils/Local';
import { getCurrentInstance } from 'vue';

// @ts-ignore
const { proxy } = getCurrentInstance();
const systemSettingStore = useSystemSettingStore();
const emit = defineEmits(['addFile'])
const addFile = (file: any) => {
    emit('addFile', file)
}
let fileIndex = 0
const startUpload = (file: any) => {
    if (fileIndex == 0) {
        mitter.emit('startUpload', Local.getFileName(file.name))
    }
    fileIndex++
}
</script>

<style lang="scss" scoped>
.uploader-start-panel {
    margin: 20px 200px;

    .uploader-start {
        border: 2px dashed #ccc;

        :deep(.el-upload-dragger) {
            border: none;
        }

        .upload-handler {
            color: #999;
            padding: 50px 0;

            .icon-upload {
                font-size: 30px;
            }

            .info {
                margin: 20px 0;
            }

            .upload-btn {
                color: #fff;
                margin: 20px auto;
                width: 200px;
                height: 44px;
                cursor: pointer;
                background: #00a1d6;
                border-radius: 4px;
                transition: background-color 0.3s ease;
                text-align: center;
                line-height: 40px;

                &:hover {
                    opacity: 0.8;
                }
            }
        }
    }

    .upload-explain {
        margin-top: 20px;
        display: flex;
        justify-content: center;

        .item {
            color: var(--text3);
            padding: 0 20px;
            cursor: pointer;
        }
    }
}
</style>