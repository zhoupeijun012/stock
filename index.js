require("./utils/index");
const server = require(RESOLVE_PATH("server/index"));
server.start();

const spider = require(RESOLVE_PATH("spider/index"));
spider.start();

// setTimeout(() => {
//   (async () => {
//     // 初始化数据库
//     await PACKAGE_EXCUTE(
//       RESOLVE_PATH("spider/model"),
//       ["base.js", "base-query.js"],
//       async (module, moduleName) => {
//         await module.init();
//       }
//     );

//     // 初始化任务数据库
//     await require(RESOLVE_PATH("spider/task-queue.js")).init();
//     await require(RESOLVE_PATH("spider/model/stock.js")).fetchOne({
//       updateKey: "f12",
//       pageNum: 2,
//       pageSize: 1,
//       update: false,
//     });
//     await require(RESOLVE_PATH("spider/model/stock.js")).fetchKList("day");
//   })();
// }, 3000);