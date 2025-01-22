const STORE_PATH = require("./storePath");
const calZtInfo = (allDayData, jsonData, date) => {
  let dataItem = {};
  if (!allDayData[jsonData["c"]]) {
    dataItem = {
      fd: [],
      zb: [],
      hs: [],
      cj: [],
      last: 0,
      ltsz: 0,
    };
    allDayData[jsonData["c"]] = dataItem;
    dataItem["ltsz"] = jsonData["ltsz"];
  } else {
    dataItem = allDayData[jsonData["c"]];
  }
  // 当日未炸板，并且炸板标识不生效
  if (jsonData["zb"] != 1 && dataItem.last != 1) {
    // 1、计算封单信息
    dataItem.fd.push({
      date,
      val: jsonData["fund"],
    });
    // 3、换手
    dataItem.hs.push({
      date,
      val: jsonData["hs"],
    });
    // 4、成交额
    dataItem.cj.push({
      date,
      val: jsonData["amount"],
    });
  } else {
    // 记录是否炸板
    dataItem.last = 1;
  }
};
class Help {
  constructor() {}
  // 获取最近14天涨跌停数据，并且统计
  async getLast14Zt() {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.ZT_PATH, "stats");
    if (FILE_EXISTS(filePath)) {
      return await FILE_READ(filePath);
    }

    // 首先获取14日之前的涨停数据，东财只保存14天
    const last14Day = GET_LAST_DATE(14);
    last14Day.sort((cur, next) => next - cur);

    const allDayData = {};
    for (let date of last14Day) {
      const ztDataList = await STORE.getZt(date, true);
      for (let jsonData of ztDataList) {
        calZtInfo(allDayData, jsonData, date);
      }
    }
    // 5、以hashMap方式存储，放置于内存stats.json
    for (let stockData of Object.values(allDayData)) {
      delete stockData.last;
    }
    await FILE_CACHE(filePath, JSON.stringify(allDayData));
    return allDayData;
  }
  // 获取当日数据
  async getTodayZt() {
    const filePath = STORE_PATH.getJsonPath(STORE_PATH.ZT_PATH, "stats");
    let statsData = {};
    if (FILE_EXISTS(filePath)) {
      statsData = await FILE_READ(filePath);
    }
    const ztData = await STORE.getZt(DAYJS().format("YYYYMMDD"), false);
    // 在这里，将涨停数据赋值上去
    for (let jsonData of ztData) {
      calZtInfo(statsData, jsonData, DAYJS().format("YYYYMMDD"));
    }
    await FILE_CACHE(
      STORE_PATH.getJsonPath(STORE_PATH.ZT_PATH, "all"),
      JSON.stringify(statsData)
    );
    return statsData;
  }
  // 获取概念信息
  async getGnByDate(date) {
    const lastZtList = await STORE.getZt(date, true);
    for (let stockItem of lastZtList) {
      await STORE.getGn(stockItem["c"], true);
    }
  }
  // 获取K线
  async getKlineCombin(date) {
    const lastZtList = await STORE.getZt(date, true);
    for (let stockItem of lastZtList) {
      await STORE.getJJ(stockItem["c"], true);
      await STORE.getK(stockItem["c"], true);
      await STORE.getKD(stockItem["c"], true);
    }
  }
  async refreshK() {
    const lastZtList = await STORE.getZt(GET_LAST_DATE(1), true);
    for (let stockItem of lastZtList) {
      await STORE.getK(stockItem["c"], true);
    }
    const ztList = await STORE.getZt(DAYJS().format("YYYYMMDD"), true);
    for (let stockItem of ztList) {
      await STORE.getK(stockItem["c"], true);
    }
  }
  async refreshKD() {
    const lastZtList = await STORE.getZt(GET_LAST_DATE(1), true);
    for (let stockItem of lastZtList) {
      await STORE.getKD(stockItem["c"], true);
    }
    const ztList = await STORE.getZt(DAYJS().format("YYYYMMDD"), true);
    for (let stockItem of ztList) {
      await STORE.getKD(stockItem["c"], true);
    }
  }
  
}
module.exports = new Help();
