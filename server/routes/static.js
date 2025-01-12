const Router = require("@koa/router");
const router = new Router({
  prefix: "/api",
});

router.get("/zt", async (ctx) => {
  ctx.body = {
    success: true,
    message: '',
    data: {
      lastUpdate: HTTP_CACHE.getLastUpdate(),
      list: HTTP_CACHE.getZT()
    }
  };
  ctx.status = 200;
});

module.exports = router;
