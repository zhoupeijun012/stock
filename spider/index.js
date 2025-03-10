const taskManage = require("./task-manager");

// 初始化数据库
taskManage.register({
  type: "init",
  async: false,
  func: async () => {
    await require(RESOLVE_PATH("spider/model/concept.js")).init();
    await require(RESOLVE_PATH("spider/model/etf.js")).init();
    await require(RESOLVE_PATH("spider/model/industry.js")).init();
    await require(RESOLVE_PATH("spider/model/region.js")).init();
    await require(RESOLVE_PATH("spider/model/lof.js")).init();
    await require(RESOLVE_PATH("spider/model/limit.js")).init();
    await require(RESOLVE_PATH("spider/model/stock.js")).init();
  },
});

// 初始化爬取数据
taskManage.register({
  type: "init",
  async: false,
  func: async () => {
    await require(RESOLVE_PATH("spider/model/concept.js")).fetchList();
    await require(RESOLVE_PATH("spider/model/etf.js")).fetchList();
    await require(RESOLVE_PATH("spider/model/industry.js")).fetchList();
    await require(RESOLVE_PATH("spider/model/region.js")).fetchList();
    await require(RESOLVE_PATH("spider/model/lof.js")).fetchList();
    await require(RESOLVE_PATH("spider/model/limit.js")).fetchList();
    await require(RESOLVE_PATH("spider/model/stock.js")).fetchList();
  },
});

taskManage.register({
  type: "mid",
  func: async () => {
    //   await require(RESOLVE_PATH("spider/model/concept.js")).init();
    //   await require(RESOLVE_PATH("spider/model/concept.js")).fetchList();
    //   await require(RESOLVE_PATH("spider/model/etf.js")).init();
    //   await require(RESOLVE_PATH("spider/model/etf.js")).fetchList();
    //     await require(RESOLVE_PATH("spider/model/industry.js")).init();
    //     await require(RESOLVE_PATH("spider/model/industry.js")).fetchList();
    //   await require(RESOLVE_PATH("spider/model/region.js")).init();
    //   await require(RESOLVE_PATH("spider/model/region.js")).fetchList();
    //   await require(RESOLVE_PATH("spider/model/lof.js")).init();
    //   await require(RESOLVE_PATH("spider/model/lof.js")).fetchList();
    // await require(RESOLVE_PATH("spider/model/limit.js")).init();
    // await require(RESOLVE_PATH("spider/model/limit.js")).fetchList();
    // await require(RESOLVE_PATH("spider/model/stock.js")).init();
    // await require(RESOLVE_PATH("spider/model/stock.js")).fetchList();
  },
});

taskManage.register({
  type: "quick",
  func: async () => {
    // 在这里，主要调用updateList
    // 在这里判断是否开盘
    // 资金异动
    // 监控的指数
  },
});

taskManage.register({
  type: "close",
  func: async () => {
    //     // 板块数据
    //     // await require(RESOLVE_PATH("spider/industry")).instance.fetchList();
    //     // 概念数据
    //     // await require(RESOLVE_PATH("spider/concept")).instance.fetchList();
    //     // 地区数据
    //     // await require(RESOLVE_PATH("spider/region")).instance.fetchList();
    //     // ETF数据
    //     // await require(RESOLVE_PATH("spider/etf")).instance.fetchList();
    //     // LOF数据
    //     // await require(RESOLVE_PATH("spider/lof")).instance.fetchList();
    //     // 获取股票列表
    //     // await require(RESOLVE_PATH("spider/stock")).instance.fetchList();
    //     // 获取涨停列表，前20天
    //     // await require(RESOLVE_PATH("spider/limit")).instance.fetchList();
    //     // 获取当天涨停
    //     // 获取K线
    //     // 5分钟K
    //     // 30分钟K
    //     // 日K
    //     // 5日K
    //     // 10日K
    //     // 20日K
    //     // 30日K
    //     // 60日K
    //     // 年K
    //     // 资金异动
    //     // 监控的指数
  },
});

exports.start = () => {
  return taskManage.start().catch((error)=>{
    WECHAT_SENG_TEXT(error.message).catch((error)=>{
      console.log(error.message);
    });
  })
};
