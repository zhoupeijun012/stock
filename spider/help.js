const STORE_PATH = require("./storePath");
class Help {
  constructor() {}
  // 获取最近14天涨跌停数据，并且统计
  async getLast14Zt() {
    // 首先获取14日之前的涨停数据，东财只保存14天
    const last14Day = GET_LAST_DATE(14);
    last14Day.sort((cur, next) => next - cur);
    for (let date of last14Day) {
      await STORE.getZt(date, true);
      await TIME_WAIT(100);
    }
  }
  // 获取当日数据
  async getTodayZt() {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.ZT_PATH, DAYJS().format('YYYYMMDD'));
    if (FILE_EXISTS(filePath)) {
      return await FILE_READ(filePath);
    }
    const ztData = await STORE.getZt(DAYJS().format("YYYYMMDD"), false);
    return ztData;
  }
  // 获取概念信息
  async getGnByDate(date) {
    const lastZtList = await STORE.getZt(date, true);
    for (let stockItem of lastZtList) {
      await STORE.getGn(stockItem["c"], true);
      await TIME_WAIT(100);
    }
  }
  // 获取K线
  async getKlineCombin(date) {
    const lastZtList = await STORE.getZt(date, true);
    for (let stockItem of lastZtList) {
      await STORE.getJJ(stockItem["c"], true);
      await STORE.getK(stockItem["c"], true);
      await STORE.getKD(stockItem["c"], true);
      await TIME_WAIT(100);
    }
  }
  async refreshK() {
    const lastZtList = await STORE.getZt(GET_LAST_DATE(1), true);
    for (let stockItem of lastZtList) {
      await STORE.getK(stockItem["c"], true);
      await TIME_WAIT(100);
    }
    const ztList = await STORE.getZt(DAYJS().format("YYYYMMDD"), true);
    for (let stockItem of ztList) {
      await STORE.getK(stockItem["c"], true);
      await TIME_WAIT(100);
    }
  }
  async refreshKD() {
    const lastZtList = await STORE.getZt(GET_LAST_DATE(1), true);
    for (let stockItem of lastZtList) {
      await STORE.getKD(stockItem["c"], true);
      await TIME_WAIT(100);
    }
    const ztList = await STORE.getZt(DAYJS().format("YYYYMMDD"), true);
    for (let stockItem of ztList) {
      await STORE.getKD(stockItem["c"], true);
      await TIME_WAIT(100);
    }
  }
  
}
module.exports = new Help();
