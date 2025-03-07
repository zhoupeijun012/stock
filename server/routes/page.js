const Router = require("@koa/router");
const router = new Router({
  prefix: "/api",
});

require(RESOLVE_PATH('spider/model/concept.js')).useRouter(router);
require(RESOLVE_PATH('spider/model/etf.js')).useRouter(router);
require(RESOLVE_PATH('spider/model/lof.js')).useRouter(router);
require(RESOLVE_PATH('spider/model/industry.js')).useRouter(router);
require(RESOLVE_PATH('spider/model/region.js')).useRouter(router);
require(RESOLVE_PATH('spider/model/limit.js')).useRouter(router);
require(RESOLVE_PATH('spider/model/stock.js')).useRouter(router);

module.exports = router;
