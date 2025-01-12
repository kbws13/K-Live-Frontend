export const Interact = {
    postDanmu: "/interact/danmu/postDanmu",
    loadDanmu: "/interact/danmu/loadDanmu",
    doAction: "/interact/action/doAction",

    loadAllComment: "/interact/comment/loadAllComment",
    topComment: "/interact/comment/topComment",
    cancelTop: "/interact/comment/cancelTop",
    addComment: "/interact/comment/addComment",
    deleteComment: "/interact/comment/delete",
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
    checkCode: "/web/user/checkCode",
    login: "/web/user/login",
    logout: "/web/user/logout",
    autoLogin: "/web/user/autoLogin",
    getUserInfo: "/web/home/getUserInfo",

    getAllCategory: "/web/category/getAllCategory",

    getVideoInfo: "/web/video/getVideoInfo",
    getRecommendVideo: "/web/video/getRecommendVideo",
    reportVideoPlayOnline: "/web/video/reportVideoPlayOnline",
    loadVideoPList: "/web/video/loadVideoPList",

    focus: "/web/home/focus",
    cancelFocus: "/web/home/cancelFocus",

    getActualTime: "/web/statistic/getActualTime",
    getWeek: "/web/statistic/getWeek",

    addPostVideo: "/web/createCenter/addPostVideo",
    getVideoInfoById: "/web/createCenter/getVideoInfoById",

    getSystemSetting: "/web/systemSetting/getSystemSetting",

}
