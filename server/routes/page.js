const Router = require("@koa/router");
const router = new Router({
  prefix: "/api",
});

router.post(`/getAi`, async (ctx, next) => {
  try {
    let { search } = ctx.request.body;
    const data = await dashscope(search);
    ctx.body = {
      success: true,
      message: "成功",
      data: data.data.choices,
    };
  } catch (error) {
    ctx.body = {
      success: false,
      message: error.message,
      data: null,
    };
  }
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
