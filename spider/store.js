const STORE_PATH = require("./storePath");
const INTERFACE = require("./interface");
class Store {
  constructor() {
    // 初始化文件夹
    this.initCache();
  }
  initCache() {
    for (let key of Object.keys(STORE_PATH)) {
      PACKAGE_CREATE(STORE_PATH[key]);
    }
  }
  // 获取涨停
  async getZt(date, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.ZT_PATH, date);
    if (readCache && FILE_EXISTS(filePath)) {
      return await FILE_READ(filePath);
    }
    const ztData = await INTERFACE.getZt(date);
    ztData.forEach((item) => {
      item["zb"] = 0;
    });
    const zbData = await INTERFACE.getZb(date);
    zbData.forEach((item) => {
      item["zb"] = 1;
    });
    const jsonData = [...ztData, ...zbData];
    jsonData.sort((cur, next) => cur.fbt - next.fbt);
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
    return jsonData;
  }

  // 获取竞价集合
  async getJJ(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.JJ_PATH, stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getJJ(stockCode);
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  // 获取K线
  async getK(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.K_S_PATH, stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getK(
      stockCode,
      DAYJS().format("YYYYMMDD")
    );
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  // 获取日线
  async getKD(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.K_DAY_PATH, stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getK(
      stockCode,
      DAYJS().format("YYYYMMDD")
    );
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  // 获取月线
  async getKM(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.K_MON_PATH, stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getKM(
      stockCode,
      DAYJS().format("YYYYMMDD")
    );
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  // 获取消息
  async getInfo(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.INFO_PATH, stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getJJ(stockCode);
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  // 获取指数
  async getZs(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.ZS_PATH, "all");
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getZs(stockCode);
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  // 获取概念
  async getGn(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.GN_PATH, stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getGn(stockCode);
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
}
global.STORE = new Store();
