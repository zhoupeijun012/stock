const Router = require("@koa/router");
const router = new Router({
  // prefix: "/api",
});

router.get("/zt", async (ctx) => {
  ctx.body = "3223";
  ctx.status = 200;
});

module.exports = router;
