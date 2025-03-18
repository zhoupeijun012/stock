require("./utils/index");
const server = require(RESOLVE_PATH("server/index"));
server.start();

const spider = require(RESOLVE_PATH("spider/index"));
spider.start();

// (async () => {
//   await require(RESOLVE_PATH("spider/task-queue.js")).init();
//   // await require(RESOLVE_PATH("spider/model/stock.js")).fetchKList("day");
//   // await require(RESOLVE_PATH("spider/model/stock.js")).fetchKList("mon");
//   await require(RESOLVE_PATH("spider/model/stock.js")).fetchKList("quarter");
  
// })();
