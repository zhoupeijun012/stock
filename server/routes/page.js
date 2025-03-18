const Router = require("@koa/router");
const router = new Router({
  prefix: "/api",
});

PACKAGE_EXCUTE(
  RESOLVE_PATH("spider/model"),
  ["base.js", "base-query.js"],
  (module, moduleName) => {
    module.useRouter(router);
  }
);

require(RESOLVE_PATH("spider/task-queue")).useRouter(router);

module.exports = router;
