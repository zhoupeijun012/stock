const HELP = require("./help");
const STORE_PATH = require("./storePath");

const calZtInfo = (allDayData, jsonData, date) => {
  if (!allDayData[jsonData["c"]]) {
    return 
  } 
  const dataItem = allDayData[jsonData["c"]];
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

const calculZrSummary = async (today = true) => {
  const date = today ? DAYJS().format('YYYYMMDD'):GET_LAST_OPENDAY(1);
  // // 获取当前列表，然后计算当前数据
  const zrData = await STORE.getZt(date, true);

  // 初始化列表
  const zrHashMap = {};
  for(let ztItem of zrData) {
      const code = ztItem["c"]
      const gnData = await STORE.getGn(code,true);
      // 在这里拼接概念
      zrHashMap[code] = {
        fd: [],
        zb: [],
        hs: [],
        cj: [],
        gn: gnData,
        last: 0,
      }
  }

  const last14Day = GET_LAST_DATE(14);
  if(today) {
    last14Day.unshift(DAYJS().format('YYYYMMDD'));
  }
  last14Day.sort((cur, next) => next - cur);

  for (let date of last14Day) {
    const ztDataList = await STORE.getZt(date, true);
    for (let jsonData of ztDataList) {
      calZtInfo(zrHashMap, jsonData, date);
    }
  }

  // 接下来，将数据拼接到昨日数据
  zrData.forEach((item)=>{
    Object.assign(item,zrHashMap[item['c']]);
  })

  const filePath = STORE_PATH.getJsonPath(STORE_PATH.ZT_PATH, today ? 'jrzt':'zrzt');
  await FILE_CACHE(filePath, JSON.stringify(zrData));
};

const calculZtLine = async () => {};

const loopGetZt = async () => {
  try {
    // 轮训中-分为两个部分
    // 1、循环获取今日涨停与今日炸板数据，缓存，但不读取缓存
    await HELP.getTodayZt();
    // 2、获取沪深300、国证银行、微盘股、30年国债、人民币汇率、A50股指期货 数据，存储起来，不读取缓存
    await STORE.getZs("1.000001,0.399001,0.399006,0.899050,90.BK0910", false);

    // 3、获取涨停数据的概念信息，缓存，读取缓存
    await HELP.getGnByDate(DAYJS().format("YYYYMMDD"));
    
    // 4、获取昨日涨停与今日涨停的竞价集合数据，缓存读取缓存
    // 5、获取K线，缓存读取缓存
    // 6、获取日K，缓存读取缓存
    await HELP.getKlineCombin(DAYJS().format("YYYYMMDD"));

    // 在这里，计算涨停jrzt.json
    await calculZrSummary(true);

    if (IN_RANGE()) {
      loopGetZt();
    }
  } catch (error) {
    WECHAT_SENG_TEXT(
      `${DAYJS().format(
        "YYYY-MM-DD HH:mm:ss"
      )}\n循环获取涨停数据失败\n${error.message.slice(0, 150)}`
    );
  }
};

const loopRefresh = async (count = 0) => {
  try {
    await TIME_WAIT(120 * 1000);
    // 在这里，需要刷新数据
    // 获取K线的刷新频率为 120S
    await HELP.refreshK();

    // 计算K线的涨停数据
    await calculZtLine(DAYJS().format("YYYYMMDD"));

    // 获取日K的刷新时间为 30分钟
    if (count >= 15) {
      await HELP.refreshKD();
      count = 0;
    }
    if (IN_RANGE()) {
      loopRefresh(count + 1);
    }
  } catch (error) {
    WECHAT_SENG_TEXT(
      `${DAYJS().format(
        "YYYY-MM-DD HH:mm:ss"
      )}\n循环获取刷新数据失败\n${error.message.slice(0, 150)}`
    );
  }
};

const start = async () => {
  try {
    // 轮训前，
    // 获取14天数据,并且计算所有历史信息，存入stats.json 属于启动前优化
    await HELP.getLast14Zt();
    // 读取上一个交日易所有涨停/炸板股票，获取概念信息 属于启动前优化
    await HELP.getGnByDate(GET_LAST_OPENDAY(1));
    // 读取上一个交易日所有炸听/炸板股票，获取K线图 属于启动前优化
    await HELP.getKlineCombin(GET_LAST_OPENDAY(1));

    // 在这里计算K线涨停段落
    await calculZtLine();

    // 在这里，计算涨停zrzt.json
    await calculZrSummary(false);

  } catch (error) {
    WECHAT_SENG_TEXT(
      `${DAYJS().format(
        "YYYY-MM-DD HH:mm:ss"
      )}\n盘前获取历史数据失败\n${error.message.slice(0, 150)}`
    );
  }

  // 循环获取
  loopGetZt();

  // 循环刷新
  loopRefresh();
};

module.exports = {
  start,
};
