const Router = require("@koa/router");
const router = new Router({
  prefix: "/api",
});

PACKAGE_EXCUTE(RESOLVE_PATH('spider/model'),['base.js'],(module,moduleName)=>{
  module.useRouter(router);
})


module.exports = router;
