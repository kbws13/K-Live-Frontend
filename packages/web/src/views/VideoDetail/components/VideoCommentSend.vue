<template>
    <div class="send-panel">
        <Avatar :avatar="Object.keys(loginStore.userInfo).length === 0
            ? ''
            : loginStore.userInfo.avatar
            "></Avatar>
        <div class="input-panel">
            <template v-if="showSend">
                <el-form :model="formData" :rules="rules" ref="formDataRef" @submit.prevent>
                    <!--input输入-->
                    <el-form-item label="" class="input-area">
                        <el-input id="inputPanel" ref="inputRef" clearable
                            :placeholder="formData.nickName ? '@' + formData.nickName : ''" v-model="formData.content"
                            :rows="1" type="textarea" resize="none" :show-word-limit="true" :maxlength="500"
                            :autosize="{ minRows: 1, maxRows: 5 }"></el-input>
                        <div class="comment-image" v-if="formData.imgPath">
                            <Cover fit="cover" :source="formData.imgPath"></Cover>
                            <span class="del iconfont icon-close" @click="delImage"></span>
                        </div>
                    </el-form-item>
                </el-form>
                <div class="op-panel">
                    <div class="op-btns">
                        <el-popover ref="elPopoverRef" :width="500" trigger="click" :show-arrow="false" :offset="5"
                            placement="bottom-start">
                            <template #reference>
                                <div class="iconfont icon-emoji"></div>
                            </template>
                            <template #default>
                                <el-tabs v-model="activeEmoji" @click.stop>
                                    <el-tab-pane :label="emoji.name" :name="emoji.name" v-for="emoji in emojiList">
                                        <div class="emoji-list">
                                            <div class="emoji-item" v-for="item in emoji.emojiList"
                                                @click="sendEmoji(item)">
                                                {{ item }}
                                            </div>
                                        </div>
                                    </el-tab-pane>
                                </el-tabs>
                            </template>
                        </el-popover>
                        <el-upload ref="uploaderRef" :multiple="false" :show-file-list="false"
                            :http-request="selectFile" :accept="proxy.imageAccept">
                            <div class="iconfont icon-image"></div>
                        </el-upload>
                    </div>
                    <div class="send-btn">
                        <el-button type="primary" @mousedown="submitComment">发布</el-button>
                    </div>
                </div>
            </template>
            <div v-else class="no-send">
                UP主已关闭评论区
            </div>
        </div>
    </div>
</template>

<script lang="ts" setup>
import emojiList from '@/utils/Emoji.js'
import { mitter } from '@/event/eventBus';
import { userLoginStore } from '@/stores/UserStore';
import Message from '@/utils/Message';
import { getCurrentInstance, inject, onMounted, onUnmounted, ref } from 'vue';
import { useRoute } from 'vue-router';
import { CommentService } from '@/api/services/CommentService';
import type { CommentAddRequest } from '@/api/models/request/VideoComment/CommentAddRequest';
import { uploadImage } from '@/api';

const loginStore = userLoginStore();
// @ts-ignore
const { proxy } = getCurrentInstance()
const route = useRoute();
const props = defineProps({
    sendType: {
        type: Number,
    },
    showSend: {
        type: Boolean,
        default: true,
    },
})
const formData = ref({
    imgPath: null,
    content: '',
    replyCommentId: null,
    videoId: '',
})
const formDataRef = ref()

const rules = {
    content: [{ required: true, message: '请输入评论内容' }],
}
//插入图片
const selectFile = (file: any) => {
    formData.value.imgPath = file.file
}

const delImage = () => {
    formData.value.imgPath = null
}
const showReply = inject('showReply')
const submitComment = async (event: any) => {
    event.preventDefault()

    if (Object.keys(loginStore.userInfo).length === 0) {
        loginStore.setLogin(true)
        return
    }

    const params =
        props.sendType === 0
            ? {
                content: formData.value.content,
                imgPath: formData.value.imgPath,
            }
            : Object.assign({}, formData.value)

    if (!params.content) {
        Message.warning('请输入评论')
        return
    }
    params.videoId = route.params.videoId
    //上传图片
    if (params.imgPath) {
        params.imgPath = await uploadImage(params.imgPath, true)
    }
    let result = await CommentService.addComment(params);
    if (!result) {
        return
    }
    formDataRef.value.resetFields()
    formData.value = {}
    Message.success('发布成功')
    showReply()
    mitter.emit('postCommentSuccess', result)
}

//插入表情
const elPopoverRef = ref()
const activeEmoji = ref('笑脸')
const sendEmoji = (emoji: any) => {
    formData.value.content = formData.value.content
        ? formData.value.content + emoji
        : emoji
    elPopoverRef.value.hide()
}

onMounted(() => {
    mitter.on('initCommentData', (data) => {
        if (props.sendType !== 0) {
            formData.value = Object.assign({}, data)
        }
    })
})

onUnmounted(() => {
    mitter.off('initCommentData')
})
</script>

<style lang="scss" scoped>
.send-panel {
    margin-top: 20px;
    display: flex;

    .input-panel {
        flex: 1;
        margin-left: 15px;

        :deep(.el-form-item) {
            margin-bottom: 0;
        }

        .no-send {
            background: #ebebeb;
            text-align: center;
            padding: 15px;
            border-radius: 5px;
            color: var(--text3);
        }

        .input-area {
            border: 1px solid #ddd;
            border-radius: 5px;
            padding: 8px;

            :deep(.el-textarea__inner) {
                box-shadow: none;
                padding: 0;
            }

            .comment-image {
                margin-top: 5px;
                width: 72px;
                height: 72px;
                display: flex;
                align-items: center;
                position: relative;

                .del {
                    position: absolute;
                    top: 0;
                    right: 0;
                    background: #0003;
                    width: 20px;
                    height: 20px;
                    color: #fff;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: 0 5px 0 5px;
                    cursor: pointer;
                }
            }
        }

        .op-panel {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-top: 5px;

            .op-btns {
                display: flex;
                align-items: center;

                .iconfont {
                    cursor: pointer;
                    border: 1px solid #ddd;
                    padding: 3px 8px;
                    margin-right: 5px;
                    border-radius: 5px;
                }
            }
        }
    }
}

.emoji-list {
    .emoji-item {
        float: left;
        font-size: 23px;
        padding: 2px;
        text-align: center;
        border-radius: 3px;
        margin-left: 10px;
        margin-top: 5px;
        cursor: pointer;

        &:hover {
            background: #ddd;
        }
    }
}
</style>