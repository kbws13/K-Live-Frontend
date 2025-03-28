export type Video = {
    id: string,
    cover: string,
    name: string,
    userId: string,
    nickName: string,
    avatar: string,
    categoryId: number,
    parentCategoryId: number,
    status: number,
    postType: number,
    originInfo: string,
    tags: any,
    introduction: string,
    interaction: string,
    duration: string,
    playCount: number,
    likeCount: number,
    danmuCount: number,
    commentCount: number,
    coinCount: number,
    collectCount: number,
    recommendType: number,
    lastPlayTime: Date,
    createTime: Date,
    updateTime: Date,
    likeCountActive?: boolean,
    collectCountActive?: boolean,
    coinCountActive?: boolean,
}