import moment from "moment";
moment.locale('zh-cn', {
    months: '一月_二月_三月_四月_五月_六月_七月_八月_九月_十月_十一月_十二月'.split('_'),
    monthsShort: '1月_2月_3月_4月_5月_6月_7月_8月_9月_10月_11月_12月'.split('_'),
    weekdays: '星期日_星期一_星期二_星期三_星期四_星期五_星期六'.split('_'),
    longDateFormat: {
        LT: 'HH:mm',
        LTS: 'HH:mm:ss',
        L: 'YYYY-MM-DD',
        LL: 'YYYY年MM月DD日',
        LLL: 'YYYY年MM月DD日Ah点mm分',
        LLLL: 'YYYY年MM月DD日ddddAh点mm分',
        l: 'YYYY-M-D',
        ll: 'YYYY年M月D日',
        lll: 'YYYY年M月D日 HH:mm',
        llll: 'YYYY年M月D日dddd HH:mm'
    }
});

const getLocalImage = (image: string) => {
    return new URL(`../assets/${image}`, import.meta.url).href;
}

const formatDate = (timestamp: any) => {
    const timestampTime = moment(timestamp);
    const days = Number.parseInt(moment().format("YYYYMMDD")) - Number.parseInt(timestampTime.format("YYYYMMDD"));
    if (days === 0) {
        return timestampTime.format("HH:mm")
    } else if (days === 1) {
        return "昨天"
    } else if (days >= 2 && days < 7) {//大于1天小于7天显示星期几
        return timestampTime.format("dddd")
    } else if (days >= 7) {//显示年月日
        return timestampTime.format("YYYY-MM-DD")
    }
}

const size2Str = (limit: number) => {
    let size = "";
    if (limit < 0.1 * 1024) {                            //小于0.1KB，则转化成B
        size = limit.toFixed(2) + "B"
    } else if (limit < 1024 * 1024) {            //小于0.1MB，则转化成KB
        size = (limit / 1024).toFixed(2) + "KB"
    } else if (limit < 1024 * 1024 * 1024) {        //小于1GB，则转化成MB
        size = (limit / (1024 * 1024)).toFixed(2) + "MB"
    } else {                                            //其他转化成GB
        size = (limit / (1024 * 1024 * 1024)).toFixed(2) + "GB"
    }
    const sizeStr = size + "";                        //转成字符串
    const index = sizeStr.indexOf(".");                    //获取小数点处的索引
    const dou = sizeStr.substring(index + 1, 2);            //获取小数点后两位的值
    if (dou === "00") {                                //判断后两位是否为00，如果是则删除00               
        return sizeStr.substring(0, index) + sizeStr.substr(index + 3, 2)
    }
    return size;
}

const convertSecondsToHMS = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const remainingSeconds = seconds % 60;

    return (hours === 0 ? "" : hours.toString().padStart(2, '0') + ":") + minutes.toString().padStart(2, '0') + ":" + remainingSeconds.toString().padStart(2, '0');
}

const getFileName = (fileName: string) => {
    if (!fileName) {
        return fileName;
    }
    return fileName.lastIndexOf(".") === -1 ? fileName : fileName.substring(0, fileName.lastIndexOf("."));
}

export default{
    getLocalImage,
    formatDate,
    size2Str,
    convertSecondsToHMS,
    getFileName,
}