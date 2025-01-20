class StorePath {
    constructor() {
        const CURRENT_DAY = `${CONFIG.CACHE_PACKAGE}/${DAYJS().format('YYYYMMDD')}`;
        // 涨停路径
        this.ZT_PATH = `${CURRENT_DAY}/zt`;
        // 炸板路径
        this.ZB_PATH = `${CURRENT_DAY}/zb`;

        // K线路径
        this.JJ_PATH = `${CURRENT_DAY}/k/j`;
        this.K_S_PATH = `${CURRENT_DAY}/k/s`;
        this.K_DAY_PATH = `${CURRENT_DAY}/k/d`;
        this.K_MON_PATH = `${CURRENT_DAY}/k/m`

        // 当前股票信息
        this.INFO_PATH = `${CURRENT_DAY}/info`
        this.GN_PATH = `${CURRENT_DAY}/gn`
        // 指数信息
        this.ZS_PATH = `${CURRENT_DAY}/zs`

    }
    getJsonPath(path,name) {
        return `${path}/${name}.json`
    }
}

module.exports = new StorePath();
