const taskManage = require("./task-manager");
const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));

// 初始化模型
taskManage.register({
  type: "config",
  async: false,
  func: async () => {
    // 初始化模型
    await PACKAGE_EXCUTE(
      RESOLVE_PATH("spider/model"),
      ["base.js"],
      async (module, moduleName) => {
        taskQueue.registerModel(moduleName, module);
      }
    );
  },
});

// 初始化数据库
taskManage.register({
  type: "init",
  async: false,
  func: async () => {
    // 初始化数据库
    await PACKAGE_EXCUTE(
      RESOLVE_PATH("spider/model"),
      ["base.js","base-query.js"],
      async (module, moduleName) => {
        await module.init();
      }
    );

    // 初始化任务数据库
    await require(RESOLVE_PATH("spider/task-queue.js")).init();
  },
});

// 初始化爬取数据
taskManage.register({
  type: "init",
  async: false,
  func: async () => {
    // 先获取概念/行业/地区数据
    await require(RESOLVE_PATH("spider/model/concept.js")).fetchList();
    await require(RESOLVE_PATH("spider/model/industry.js")).fetchList();
    await require(RESOLVE_PATH("spider/model/region.js")).fetchList();

    // 获取etf与lof数据
    await require(RESOLVE_PATH("spider/model/etf.js")).fetchList();
    await require(RESOLVE_PATH("spider/model/lof.js")).fetchList();

    // 获取涨停板数据前20日
    await require(RESOLVE_PATH("spider/model/limit.js")).fetchList();
    // 当日涨停数据
    await require(RESOLVE_PATH("spider/model/limit.js")).fetchTodayList();

    // 获取股票数据
    await require(RESOLVE_PATH("spider/model/stock.js")).fetchList();
    await require(RESOLVE_PATH("spider/model/np.js")).fetchList();


    await TIME_WAIT(5000);

    await require(RESOLVE_PATH("spider/model/concept.js")).fetchKList('day');
    await require(RESOLVE_PATH("spider/model/concept.js")).fetchFundList('day');

    await require(RESOLVE_PATH("spider/model/stock.js")).fetchKList('day');
    await require(RESOLVE_PATH("spider/model/stock.js")).fetchFundList('day');

    await require(RESOLVE_PATH("spider/model/industry.js")).fetchKList('day');
    // await require(RESOLVE_PATH("spider/model/industry.js")).fetchFundList('day');

    await require(RESOLVE_PATH("spider/model/region.js")).fetchKList('day');
    // await require(RESOLVE_PATH("spider/model/region.js")).fetchFundList('day');

  },
});

taskManage.register({
  type: "mid",
  func: async () => {
    // 先获取概念/行业/地区数据
    await require(RESOLVE_PATH("spider/model/concept.js")).fetchList(true);
    await require(RESOLVE_PATH("spider/model/industry.js")).fetchList(true);
    await require(RESOLVE_PATH("spider/model/region.js")).fetchList(true);

    // 获取etf与lof数据
    await require(RESOLVE_PATH("spider/model/etf.js")).fetchList(true);
    await require(RESOLVE_PATH("spider/model/lof.js")).fetchList(true);

    // 获取股票数据
    await require(RESOLVE_PATH("spider/model/stock.js")).fetchList(true);
  },
});

taskManage.register({
  type: "quick",
  func: async () => {
    // 资金异动
    // todo

    // 获取当日涨停数据
    await require(RESOLVE_PATH("spider/model/limit.js")).fetchTodayList();

    // 监控的指数
    await require(RESOLVE_PATH("spider/model/np.js")).fetchList();
  },
});

// taskManage.register({
//   type: "close",
//   func: async () => {
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
//     // 先获取概念/行业/地区数据
//     // await require(RESOLVE_PATH("spider/model/concept.js")).fetchList();
//     // await require(RESOLVE_PATH("spider/model/industry.js")).fetchList();
//     // await require(RESOLVE_PATH("spider/model/region.js")).fetchList();

//     // // 获取etf与lof数据
//     // await require(RESOLVE_PATH("spider/model/etf.js")).fetchList();
//     // await require(RESOLVE_PATH("spider/model/lof.js")).fetchList();

//     // // 获取涨停板数据前20日/当日涨停数据
//     // await require(RESOLVE_PATH("spider/model/limit.js")).fetchList();
//     // await require(RESOLVE_PATH("spider/model/limit.js")).fetchTodayList();

//     // // 获取股票数据
//     // await require(RESOLVE_PATH("spider/model/stock.js")).fetchList();

//     // 监控的指数
//   },
// });

exports.start = () => {
  return taskManage.start().catch((error) => {
    WECHAT_SENG_TEXT(error.message).catch((error) => {
      console.log(error.message);
    });
  });
};
