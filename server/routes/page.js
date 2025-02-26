const Router = require("@koa/router");
const router = new Router({
  prefix: "/api",
});

require(RESOLVE_PATH('spider/stock.js')).useRouter(router);

require(RESOLVE_PATH('spider/etf.js')).useRouter(router);

require(RESOLVE_PATH('spider/lof.js')).useRouter(router);

require(RESOLVE_PATH('spider/concept.js')).useRouter(router);

require(RESOLVE_PATH('spider/industry.js')).useRouter(router);

require(RESOLVE_PATH('spider/region.js')).useRouter(router);

module.exports = router;
