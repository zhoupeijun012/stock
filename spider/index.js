const HELP = require("./help");

const inRange = () => {
  return (
    DAYJS().format("HHmmss") >= "092500" && DAYJS().format("HHmmss") <= "130000"
  );
};

const loopGetZt = async () => {
  try {
    await TIME_WAIT(10000);
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

    if (inRange) {
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
    // 获取日K的刷新时间为 1小时
    if (count >= 30) {
      await HELP.refreshKD();
      count = 0;
    }
    if (inRange) {
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
    await HELP.getGnByDate(GET_LAST_DATE(1));
    // 读取上一个交易日所有炸听/炸板股票，获取K线图 属于启动前优化
    await HELP.getKlineCombin(GET_LAST_DATE(1));
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
