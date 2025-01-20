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
  async getZt(date, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.ZT_PATH, date);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getZt(date);
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  async getZb(date, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.ZB_PATH, date);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getZb(date);
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }

  async getJJ(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.JJ_PATH, stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getJJ(stockCode);
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  async getK(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.K_S_PATH, stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getK(stockCode,DAYJS().format('YYYYMMDD'));
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  async getKD(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.K_DAY_PATH, stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getK(stockCode,DAYJS().format('YYYYMMDD'));
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  async getKM(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.K_MON_PATH, stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getKM(stockCode,DAYJS().format('YYYYMMDD'));
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  async getInfo(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.INFO_PATH, stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getJJ(stockCode);
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  async getZs(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.ZS_PATH, 'zs');
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getZs(stockCode);
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
  async getGn(stockCode, readCache = false) {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.GN_PATH,stockCode);
    if (readCache && FILE_EXISTS(filePath)) {
      return;
    }
    const jsonData = await INTERFACE.getGn(stockCode);
    await FILE_CACHE(filePath, JSON.stringify(jsonData));
  }
}
global.STORE = new Store();
