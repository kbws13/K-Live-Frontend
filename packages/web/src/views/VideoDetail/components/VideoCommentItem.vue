<template>
    <div class="comment-item">
        <Avatar :width="replyLevel === 1 ? 50 : 30" :avatar="data.avatar" :userId="data.userId"></Avatar>
        <div class="comment-content-panel">
            <div class="nick-name-panel">
                <router-link :to="`/user/${data.userId}`" class="nick-name">{{
                    data.nickName
                }}</router-link>
                <template v-if="data.replyUserId">
                    <div class="reply-title">回复</div>
                    <router-link :to="`/user/${data.replyUserId}`" class="reply-nick-name">
                        @{{ data.replyNickName }}</router-link>
                </template>
            </div>
            <div class="comment-message">
                <Tag :type="0" v-if="data.topType === 1"></Tag>
                <span v-html="convertContent(data.content)"></span>
            </div>
            <div v-if="data.imgPath" class="image-show">
                <Cover :src="data.imgPath + imageThumbnailSuffix" :preview="true" fit="cover"></Cover>
            </div>
            <div class="comment-op">
                <div class="op-left">
                    <div class="comment-time">{{ data.postTime }}</div>
                    <div :class="['iconfont icon-good', data.likeCountActive ? 'active' : '']" @click="doLike(data)">
                        {{ data.likeCount === 0 ? "" : data.likeCount }}
                    </div>
                    <div :class="[
                        'iconfont icon-no-good',
                        data.hateCountActive ? 'active' : '',
                    ]" @click="doHate(data)">
                        {{ data.hateCount === 0 ? "" : data.hateCount }}
                    </div>
                    <div class="reply-btn" @click="showReplyHandler(data, replyLevel)">
                        回复
                    </div>
                </div>
                <el-dropdown
                    v-if="data.userId === loginStore.userInfo.id || videoInfo.userId === loginStore.userInfo.id">
                    <span class="op-right iconfont icon-more">
                    </span>
                    <template #dropdown>
                        <el-dropdown-menu>
                            <el-dropdown-item @click="topComment"
                                v-if="videoInfo.userId === loginStore.userInfo.id && data.parentCommentId === 0">{{
                                    data.topType === 1 ? "取消置顶" : "置顶" }}</el-dropdown-item>
                            <el-dropdown-item @click="delComment"
                                v-if="videoInfo.userId === loginStore.userInfo.id || data.userId === loginStore.userInfo.id">删除</el-dropdown-item>
                        </el-dropdown-menu>
                    </template>
                </el-dropdown>
            </div>
            <div class="reply-list">
                <VideoCommentItem v-for="item in data.children" :data="item" :replyLevel="2" />
            </div>
            <VideoCommentSend v-if="replyLevel === 1 && data.showReply" :sendType="1"></VideoCommentSend>
        </div>
    </div>
</template>

<script lang="ts" setup>
import { ElDropdown, ElDropdownItem, ElDropdownMenu } from 'element-plus';
import { doUserAction } from '@/api';
import Avatar from '@/components/Avatar.vue';
import Cover from '@/components/Cover.vue';
import Tag from '@/components/Tag.vue';
import { ACTION_TYPE } from '@/constant/ActionConstants';
import { mitter } from '@/event/eventBus';
import { userLoginStore } from '@/stores/UserStore';
import { inject, nextTick } from 'vue';
import { useRoute } from 'vue-router';
import { imageThumbnailSuffix } from '@/constant/ResourceConstant';
import Confirm from '@/utils/Confirm';
import { CommentService } from '@/api/services/CommentService';
import VideoCommentSend from './VideoCommentSend.vue';
import type {Video} from "@/api/models/response/Video/Video";
import type {VideoComment} from "@/api/models/response/VideoComment/VideoComment";
import Message from "@/utils/Message";

const props = defineProps<{
  data: VideoComment,
  //1:一级回复 2:二级回复
  replyLevel: number,
}>()

const videoInfo = inject<Video>('videoInfo', {} as Video)
const loginStore = userLoginStore();
const route = useRoute()

const convertContent = (data: string) => {
    data = data.replace(/\r\n/g, '<br>')
    data = data.replace(/\n/g, '<br>')
    return data
}

const showReply = inject<(commentId: number) => void>('showReply')
const showReplyHandler = (item: VideoComment, replyLevel: number) => {
    showReply(replyLevel === 1 ? item.id : item.parentCommentId)
    nextTick(() => {
        const commentData = {
            replyCommentId: replyLevel === 1 ? item.id : item.parentCommentId,
            nickName: item.nickName,
            replyUserId: item.userId,
        }
        mitter.emit('initCommentData', commentData)
    })
}

const doLike = (data: VideoComment) => {
    doUserAction(
        {
            videoId: route.params.videoId as string,
            actionType: ACTION_TYPE.COMMENT_LIKE.value,
            commentId: data.id,
        },
        () => {
            if (data.hateCountActive) {
                data.hateCountActive = false
                data.hateCount--
            }
            if (data.likeCountActive) {
                data.likeCountActive = false
                data.likeCount--
            } else {
                data.likeCount++
                data.likeCountActive = true
            }
        }
    )
}
const doHate = (data: VideoComment) => {
    doUserAction(
        {
            videoId: route.params.videoId as string,
            actionType: ACTION_TYPE.COMMENT_HATE.value,
            commentId: data.id,
        },
        () => {
            if (data.likeCountActive) {
                data.likeCountActive = false
                data.likeCount--
            }
            if (data.hateCountActive) {
                data.hateCountActive = false
                data.hateCount--
            } else {
                data.hateCount++
                data.hateCountActive = true
            }
        }
    )
}

const delComment = () => {
    Confirm({
        message: '确定要删除评论',
        okfun: async () => {
            const result = await CommentService.deleteComment(
                props.data.id
            )
            if (!result) {
                return
            }
            Message.success("删除成功");
            mitter.emit('delCommentCallback', {
                pCommentId: props.data.parentCommentId,
                commentId: props.data.id,
            })
        },
    })
}

const topComment = () => {
    Confirm({
        message: `确定要${props.data.topType === 1 ? '取消置顶' : '置顶'}吗？`,
        okfun: async () => {
            let result
            if (props.data.topType === 1) {
                result = await CommentService.cancelTop(
                    props.data.id
                )
            } else {
                result = await CommentService.topComment(
                    props.data.id
                )
            }
            if (!result) {
                return
            }
            mitter.emit('topCommentCallback')
        },
    })
}
</script>

<style lang="scss" scoped>
.comment-item {
    display: flex;
    border-bottom: 1px solid #ddd;
    padding: 10px 0;

    .comment-content-panel {
        flex: 1;
        margin-left: 15px;
        margin-top: 5px;

        .nick-name-panel {
            font-size: 14px;
            display: flex;
            align-items: center;
            vertical-align: middle;

            .nick-name {
                text-decoration: none;
                color: var(--text2);
            }

            .reply-title {
                margin: 0 3px;
            }

            .reply-nick-name {
                text-decoration: none;
                color: var(--blue3);
            }
        }

        .comment-message {
            font-size: 14px;
            line-height: 20px;
            margin-top: 5px;
        }

        .image-show {
            margin-top: 10px;
            width: 100px;
            height: 100px;
        }

        .comment-op {
            margin-top: 10px;
            display: flex;
            color: var(--text3);
            align-items: center;
            font-size: 13px;
            justify-content: space-between;

            .op-left {
                display: flex;

                .comment-time {
                    margin-right: 20px;
                }

                .iconfont {
                    font-size: 13px;
                    margin-right: 20px;
                    cursor: pointer;

                    &::before {
                        font-size: 15px;
                        margin-right: 5px;
                    }
                }

                .active {
                    &::before {
                        color: var(--blue2);
                    }
                }

                .reply-btn {
                    cursor: pointer;
                }
            }

            .op-right {
                cursor: pointer;
                margin-right: 5px;
            }
        }
    }
}

.reply-list {
    .comment-item {
        border-bottom: none;
    }

    .comment-content-panel {
        .nick-name-panel {
            float: left;
            margin-right: 5px;
        }

        .comment-message {
            margin-top: 0;
        }
    }
}
</style>