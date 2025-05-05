export const Interact = {
    doAction: "/interact/action/doAction",
    loadUserCollection: "/interact/action/loadUserCollection",
    // 弹幕
    postDanmu: "/interact/danmu/postDanmu",
    loadDanmu: "/interact/danmu/loadDanmu",
    loadAllDanmu: "/interact/danmu/loadAllDanmu",
    deleteDanmu: "/interact/danmu/deleteDanmu",
    // 评论
    loadAllComment: "/interact/comment/loadAllComment",
    loadComment: "/interact/comment/loadComment",
    topComment: "/interact/comment/topComment",
    cancelTop: "/interact/comment/cancelTop",
    addComment: "/interact/comment/addComment",
    deleteComment: "/interact/comment/delete",
    // 消息
    getNoReadCount: "/interact/message/getNoReadCount",
    getNoReadCountByGroup: "/interact/message/getNoReadCountByGroup",
    readAll: "/interact/message/readAll",
    loadMessage: "/interact/message/loadMessage",
    deleteMessage: "/interact/message/delete",
}

export const Resource = {
    getResource: "/file/getResource?sourceName=",
    videoResource: "/file/videoResource",
    uploadImage: "/file/uploadImage",
    preUploadVideo: "/file/preUploadVideo",
    uploadVideo: "/file/uploadVideo",
    delUploadVide: "/file/delUploadVide",
}

export const Web = {
    // 用户
    checkCode: "/web/user/checkCode",
    login: "/web/user/login",
    register: "/web/user/register",
    logout: "/web/user/logout",
    autoLogin: "/web/user/autoLogin",
    // 个人中心
    getUserInfo: "/web/home/getUserInfo",
    updateUserInfo: "/web/home/updateUserInfo",
    updateTheme: "/web/home/updateTheme",
    loadFocusList: "/web/home/loadFocusList",
    loadFansList: "/web/home/loadFansList",
    loadVideoList: "/web/home/loadVideoList",
    // 分类
    getAllCategory: "/web/category/getAllCategory",
    // 视频
    getVideoInfo: "/web/video/getVideoInfo",
    getVideoList: "/web/video/loadVideoList",
    getRecommendVideo: "/web/video/getRecommendVideo",
    reportVideoPlayOnline: "/web/video/reportVideoPlayOnline",
    loadVideoPList: "/web/video/loadVideoPList",
    loadHotVideoList: "/web/video/loadHotVideoList",
    searchVideo: "/web/video/searchVideo",
    loadRecommendVideo: "/web/video/loadRecommendVideo",
    // 搜索热词
    getSearchKeywordTop: "/web/video/getSearchKeywordTop",
    // 合集
    loadSeries: "/web/series/loadSeries",
    loadSeriesWithVideo: "/web/series/loadSeriesWithVideo",
    addSeries: "/web/series/addSeries",
    changeSeriesSort: "/web/series/changeSeriesSort",
    deleteSeries: "/web/series/deleteSeries",
    updateSeries: "/web/series/updateSeries",
    loadAllVideoSeries: "/web/series/loadAllVideo",
    getSeriesDetail: "/web/series/getSeriesDetail",
    saveSeriesContent: "/web/series/saveSeriesContent",
    deleteSeriesVideo: "/web/series/deleteSeriesVideo",
    // 互动
    focus: "/web/home/focus",
    cancelFocus: "/web/home/cancelFocus",
    // 基本数据
    getActualTime: "/web/statistic/getActualTime",
    getWeek: "/web/statistic/getWeek",
    // 历史记录
    loadHistory: "/web/history/loadHistory",
    cleanHistory: "/web/history/cleanHistory",
    deleteHistory: "/web/history/deleteHistory",
    // 创作中心
    loadAllVideo: "/web/createCenter/loadAllVideo",
    loadVideoPost: "/web/createCenter/loadVideoPost",
    addPostVideo: "/web/createCenter/addPostVideo",
    getVideoInfoById: "/web/createCenter/getVideoInfoById",
    loadCommentByVideoId: "/web/createCenter/loadComment",
    changeVideoInteraction: "/web/createCenter/changeVideoInteraction",
    getVideoStatusCount: "/web/createCenter/getVideoStatusCount",
    deleteVideo: "/web/createCenter/deleteVideo",
    // 系统设置
    getSystemSetting: "/web/systemSetting/getSystemSetting",

}
