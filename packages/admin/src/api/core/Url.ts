export const Interact = {
    doAction: "/interact/action/doAction",
    loadUserCollection: "/interact/action/loadUserCollection",
    // 弹幕
    postDanmu: "/interact/danmu/postDanmu",
    loadDanmu: "/interact/danmu/loadDanmu",
    // 评论
    loadAllComment: "/interact/comment/loadAllComment",
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
    getRecommendVideo: "/web/video/getRecommendVideo",
    reportVideoPlayOnline: "/web/video/reportVideoPlayOnline",
    loadVideoPList: "/web/video/loadVideoPList",
    loadHotVideoList: "/web/video/loadHotVideoList",
    searchVideo: "/web/video/searchVideo",
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
    addPostVideo: "/web/createCenter/addPostVideo",
    getVideoInfoById: "/web/createCenter/getVideoInfoById",
    loadCommentByVideoId: "/web/createCenter/loadCommentByVideoId",
    changeVideoInteraction: "/web/createCenter/changeVideoInteraction",
    getVideoStatusCount: "/web/createCenter/getVideoStatusCount",
    // 系统设置
    getSystemSetting: "/web/systemSetting/getSystemSetting",
}

export const Admin = {
    // 分类
    queryCategory: "/admin/category/queryCategory",
    addCategory: "/admin/category/addCategory",
    updateCategory: "/admin/category/updateCategory",
    deleteCategory: "/admin/category/deleteCategory",
    changeSortCategory: "/admin/category/changeSortCategory",
    // 视频
    loadVideoPost: "/admin/video/loadVideoPost",
    auditVideoPost: "/admin/video/auditVideoPost",
    recommendVideo: "/admin/video/recommendVideo",
    deleteVideo: "/admin/video/deleteVideo",
    loadVideoPList: "/admin/video/loadVideoPList",
}
