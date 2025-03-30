require("./utils/index");
const server = require(RESOLVE_PATH("server/index"));
server.start();

const spider = require(RESOLVE_PATH("spider/index"));
spider.start();

// setTimeout(() => {
//   (async () => {
//     await PACKAGE_EXCUTE(
//       RESOLVE_PATH("spider/model"),
//       ["base.js", "base-query.js"],
//       async (module, moduleName) => {
//         await module.init();
//       }
//     );
//     // 初始化任务数据库
//     await require(RESOLVE_PATH("spider/model/stock.js")).init();
//     await require(RESOLVE_PATH("spider/task-queue.js")).init();
//     await require(RESOLVE_PATH("spider/model/region.js")).fetchList();
//     await require(RESOLVE_PATH("spider/model/concept.js")).fetchList();
//     await require(RESOLVE_PATH("spider/model/industry.js")).fetchList();
//     await require(RESOLVE_PATH("spider/model/stock.js")).fetchOne({
//       updateKey: "f12",
//       pageNum: 20,
//       pageSize: 2,
//       update: false,
//     });
//     // await require(RESOLVE_PATH("spider/model/stock.js")).fetchKList("day");
//     // await require(RESOLVE_PATH("spider/model/stock.js")).fetchFundList("day");
//   })();
// }, 3000);