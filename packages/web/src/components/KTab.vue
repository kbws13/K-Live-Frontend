<template>
    <div class="tab-list">
        <div :class="['tab-item', index === modelValue ? 'active' : '']" v-for="(item, index) in tags"
            @click="selectTab(index)">
            {{ item.name }}
        </div>
    </div>
</template>

<script lang="ts" setup>
import type { PropType } from "vue";

defineProps({
    tags: {
        type: Array as PropType<{ name: string }[]>,
    },
    modelValue: {
        type: Number,
        default: 0,
    },
});

const emit = defineEmits(["update:modelValue", "clickHandler"]);
const selectTab = (index: number) => {
    emit("update:modelValue", index);
    emit("clickHandler");
};
</script>

<style lang="scss" scoped>
.tab-list {
    margin-left: 20px;
    flex: 1;
    display: flex;

    .tab-item {
        margin-right: 20px;
        position: relative;
        border-bottom: 1px solid #fff;
        line-height: 25px;
        cursor: pointer;
        font-size: 13px;

        &:last-child {
            margin-right: 0;
        }
    }

    .active {
        position: relative;
        color: var(--blue3);
        border-bottom: 1px solid var(--blue3);

        &::after {
            position: absolute;
            content: "";
            left: 50%;
            bottom: 0;
            transform: translateX(-50%);
            margin-left: -3px;
            border-bottom: 3px solid var(--blue3);
            border-top: 0;
            border-left: 3px solid transparent;
            border-right: 3px solid transparent;
        }
    }
}
</style>