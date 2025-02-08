<template>
    <div class="category" v-show="showType === 0">
        <router-link class="hot" to="/hot" target="_blank">
            <div class="iconfont icon-hot"></div>
            <div class="info">热门</div>
        </router-link>
        <div class="category-list" :style="{
            'grid-template-columns': `repeat(${proxy.rowCategoryCount}, 1fr)`,
        }">
            <template v-for="index in showItemCount">
                <!-- 行数大于等于分类数-->
                <el-popover :width="187" trigger="hover" :show-arrow="false" :offset="5"
                    :placement="index <= proxy.rowCategoryCount ? 'top' : 'bottom'" v-if="
                        categoryStore.categoryList[index - 1].children &&
                        categoryStore.categoryList[index - 1].children.length > 0
                    ">
                    <template #reference>
                        <router-link :class="[
                            'category-item',
                            categoryStore.categoryList[index - 1].code ==
                                route.params.pCategoryCode
                                ? 'active'
                                : '',
                        ]" :to="`/v/${categoryStore.categoryList[index - 1].code}`">
                            {{ categoryStore.categoryList[index - 1].name }}
                        </router-link>
                    </template>
                    <div class="child-list">
                        <router-link class="child" v-for="sub in categoryStore.categoryList[index - 1].children"
                            :title="sub.name" :to="`/v/${categoryStore.categoryList[index - 1].code}/${sub.code
                                }`">
                            {{ sub.name }}
                        </router-link>
                    </div>
                </el-popover>
                <router-link :class="[
                    'category-item',
                    categoryStore.categoryList[index - 1].code ==
                        route.params.pCategoryCode
                        ? 'active'
                        : '',
                ]" v-else :to="`/v/${categoryStore.categoryList[index - 1].code}`">
                    {{ categoryStore.categoryList[index - 1].name }}
                </router-link>
            </template>
            <!--行数 小于分类数，余数量展示更多-->
            <template v-if="categoryStore.categoryList.length > proxy.rowCategoryCount * 2">
                <el-popover :width="187" trigger="hover" :show-arrow="false" :offset="5" placement="bottom-end">
                    <template #reference>
                        <div class="category-item btn-category-more">
                            更多
                            <span class="iconfont icon-more"></span>
                        </div>
                    </template>
                    <div class="child-list">
                        <router-link class="child" v-for="item in categoryStore.categoryList.slice(
                            proxy.rowCategoryCount * 2 - 1,
                            categoryStore.categoryList.length
                        )" :to="`/v/${item.code}`" target="_blank">
                            {{ item.name }}
                        </router-link>
                    </div>
                </el-popover>
            </template>
        </div>
    </div>
    <!--滚动固定在顶部-->
    <div :class="['category', mouseOver ? '' : 'category-out']" v-show="showType == 1">
        <router-link class="hot hot-out" to="/hot" target="_blank">
            <div class="iconfont icon-hot"></div>
            <div class="info">热门</div>
        </router-link>
        <div class="category-list" :style="{
            'grid-template-columns': `repeat(${proxy.rowCategoryCount}, 1fr)`,
        }">
            <template v-for="item in categoryStore.categoryList">
                <router-link class="category-item" :to="`/v/${item.code}`">
                    {{ item.name }}
                </router-link>
            </template>
        </div>
        <div :class="['category-op iconfont', mouseOver ? 'icon-up' : 'icon-down']"
            v-show="categoryStore.categoryList.length > proxy.rowCategoryCount"></div>
    </div>
</template>

<script lang="ts" setup>
import { ElPopover } from 'element-plus';
import { useCategoryStore } from '@/stores/CategoryStore';
import { computed, getCurrentInstance } from 'vue';
import { useRoute } from 'vue-router';

defineProps({
    showType: {
        type: Number,
        default: 0,
    },
    mouseOver: {
        type: Boolean,
        default: false,
    },
});

const categoryStore = useCategoryStore();
// @ts-ignore
const { proxy } = getCurrentInstance();
const route = useRoute();

const showItemCount = computed(() => {
    //总数量大于 行数*2 就去行数-1，增加更多按钮
    let count = categoryStore.categoryList.length;
    if (categoryStore.categoryList.length > proxy.rowCategoryCount * 2) {
        count = proxy.rowCategoryCount * 2 - 1;
    }
    return count;
});
</script>

<style>
.category {
    display: flex;
    align-items: flex-start;

    .hot {
        text-align: center;
        margin-right: 40px;
        text-decoration: none;
        color: var(--text);

        .icon-hot {
            width: 46px;
            height: 46px;
            background: #f07775;
            color: #fff;
            font-size: 20px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
        }

        .info {
            margin-top: 8px;
        }
    }

    .category-list {
        width: 100%;
        display: grid;
        grid-gap: 8px;

        .category-item {
            line-height: 30px;
            padding: 0 5px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
            letter-spacing: 2px;
            border: 1px solid #f1f2f3;
            border-radius: 6px;
            background-color: #f6f7f8;
            color: #61666d;
            text-align: center;
            font-weight: 400;
            text-decoration: none;

            &:hover {
                background: #e1e3e5;
            }
        }

        .active {
            color: var(--blue);
        }

        .btn-category-more {
            .iconfont {
                font-size: 12px;
            }

            .icon-up {
                display: none;
            }
        }

        /* 展示更多 */
        .category-more {
            margin-left: 5px;
        }
    }

    .category-op {
        float: right;
        margin-left: 5px;
        margin-top: 7px;
    }

    /* 鼠标移除只展示一行 */
    .hot-out {
        width: 80px;
        height: 30px;
        display: flex;
        align-items: center;

        .icon-hot {
            width: 30px;
            font-size: 25px;
            height: auto;
            background: none;
            color: #61666d;
        }

        .info {
            margin-top: 0px;
            font-size: 15px;
            color: #61666d;
        }
    }
}

.category-out {
    overflow: hidden;
    height: 32px;
}

.child-list {
    display: flex;
    flex-wrap: wrap;

    .child {
        text-decoration: none;
        color: #61666d;
        padding: 5px;
        width: 80px;
        white-space: nowrap;
        overflow: hidden;
        text-overflow: ellipsis;

        &:hover {
            background: #e5e5e5;
            border-radius: 3px;
        }
    }
}
</style>