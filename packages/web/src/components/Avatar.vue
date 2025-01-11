<template>
    <div>
        <router-link v-if="userId" :to="`/user/${userId}`" target="_blank">
            <Cover :lazy="lazy" :width="width" :src="avatar" :deaultImage="defaultAvatar" borderRadius="50%" :scale="1">
            </Cover>
        </router-link>
        <Cover v-else :lazy="lazy" :width="width" :src="avatar" :deaultImage="defaultAvatar" borderRadius="50%"
            :scale="1"></Cover>
    </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';

const defaultAvatar = ref("user.png");
const props = defineProps({
    userId: {
        type: String,
        default: ''
    },
    avatar: {
        type: String,
    },
    width: {
        type: Number,
        default: 50
    },
    lazy: {
        type: Boolean,
        default: true
    }
})
</script>

<style lang="scss"></style>