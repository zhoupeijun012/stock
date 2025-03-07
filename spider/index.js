// const start = async () => {
//   const close = async () => {
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
//   };
//   // 每天收盘后，更新数据
//   cron.schedule("0 15 * * *", close);

//   const open = async () => {
//     // 在这里，主要调用updateList
//     //  在这里判断是否开盘
//     // 股票数据
//     // 板块数据
//     // await require(RESOLVE_PATH("spider/industry")).instance.updateList();
//     // 概念数据
//     // await require(RESOLVE_PATH("spider/concept")).instance.updateList();
//     // 地区数据
//     // await require(RESOLVE_PATH("spider/region")).instance.updateList();
//     // ETF数据
//     // await require(RESOLVE_PATH("spider/etf")).instance.updateList();
//     // LOF数据
//     // await require(RESOLVE_PATH("spider/lof")).instance.updateList();
//     // 涨跌停板数据
//   };
//   cron.schedule("*/5 9-15 * * *", open);

//   const quickly = () => {
//     // 在这里，主要调用updateList
//     // 在这里判断是否开盘
//     // 资金异动
//     // 监控的指数
//   };
//   cron.schedule("*/1 9-15 * * *", quickly);

//   // 获取全局数据
//   const globalConfig = await require(RESOLVE_PATH("config/index.js")).init();
//   // 判断项目是否初始化过
//   if (!globalConfig.get("init")) {
//     // 第一次启动应用强制初始化数据库
// await require(RESOLVE_PATH("spider/model/index.js")).init();
//     await globalConfig.set("init", true);

//     // 在这里触发第一次更新所有数据
//     await globalConfig.set("updating", true);
//     await close();
//     await globalConfig.set("updating", false);
//   }
// };

// exports.init = ()=>{
//   return sequelize.sync({ force: true }).catch((error) => {
//     WECHAT_SENG_TEXT(
//       `${DAYJS().format(
//         "YYYY-MM-DD HH:mm:ss"
//       )}\n创建数据库失败\n${error.message.slice(0, 150)}`
//     );
//   });
// }

const start = async () => {
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

};

exports.start = start;
