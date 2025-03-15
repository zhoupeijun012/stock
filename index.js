require("./utils/index");
const server = require(RESOLVE_PATH("server/index"));
server.start();

const spider = require(RESOLVE_PATH('spider/index'));
spider.start();