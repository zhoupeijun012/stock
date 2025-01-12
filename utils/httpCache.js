class HttpCache {
    constructor(){

    }
    async setLastUpdate() {
        STORE.set('HTTP_LAST_UPDATE',DAYJS().format("YYYY-MM-DD HH:mm:ss"));
    }
    getLastUpdate() {
        return STORE.get('HTTP_LAST_UPDATE')
    }
    getZT() {
        return STORE.get('HTTP_ZT') || [];
    }
    async setZT() {
        // 在这里处理数据
        const ztData = STORE.get(DAYJS().format('YYYYMMDD'),CONFIG.ZT_CACHE) || [];
        const zbData = STORE.get(DAYJS().format('YYYYMMDD'),CONFIG.ZB_CACHE) || [];
        const allList = [...ztData,...zbData];

        const history = STORE.get(CONFIG.HISTORY) || {};
        const info = STORE.get(CONFIG.INFO) || {};
        // 接下来，将涨停数据拼接到对应数据上
        allList.forEach((ztItem)=>{
            ztItem['history'] = history[ztItem['代码']];
            ztItem['info'] = info[ztItem['代码']];
        })

        STORE.set('HTTP_ZT',allList);
    }
}
 
global.HTTP_CACHE = new HttpCache();