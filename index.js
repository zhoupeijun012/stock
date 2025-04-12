require("./utils/index");
const server = require(RESOLVE_PATH("server/index"));
server.start();

const spider = require(RESOLVE_PATH("spider/index"));
spider.start();

process.on("unhandledRejection", (error, promise) => {
  WECHAT_SENG_TEXT(error.message).catch((error) => {
    console.log(error.message);
  });
});

// 捕获未捕获的异常
process.on("uncaughtException", (error) => {
  WECHAT_SENG_TEXT(error.message).catch((error) => {
    console.log(error.message);
  });
});


// setTimeout(() => {
//   (async () => {
//     // await PACKAGE_EXCUTE(
//     //   RESOLVE_PATH("spider/model"),
//     //   ["base.js", "base-query.js"],
//     //   async (module, moduleName) => {
//     //     await module.init();
//     //   }
//     // );
//     // 初始化任务数据库
//     // await require(RESOLVE_PATH("spider/model/stock.js")).init();
//     await require(RESOLVE_PATH("spider/task-queue.js")).init();
//     // await require(RESOLVE_PATH("spider/model/stock.js")).fetchOne({
//     //   updateKey: "f12",
//     //   pageNum: 20,
//     //   pageSize: 2,
//     //   update: false,
//     // });
//     // await require(RESOLVE_PATH("spider/model/stock.js")).fetchKList("day");
//     // await require(RESOLVE_PATH("spider/model/stock.js")).fetchFundList("day");

//     await require(RESOLVE_PATH("spider/model/stock.js")).fetchOne({
//       updateKey: "f12",
//       pageNum: 20,
//       pageSize: 2,
//       update: true,
//     });

//   })();
// }, 3000);

// setTimeout(() => {
//   (async () => {
//     await require(RESOLVE_PATH("utils/sql.js")).copyDatabase();
//     await require(RESOLVE_PATH("spider/model/stock.js")).fetchList(true, true);

//   })();
// }, 3000);
