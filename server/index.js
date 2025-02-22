const Koa = require("koa");
const bodyParser = require("koa-bodyparser");
const router = require(RESOLVE_PATH("server/routes/page.js"));
const static = require("koa-static");

let app = null;
function start() {
  app = new Koa();

  app.use(static(RESOLVE_PATH(CONFIG.CACHE_PACKAGE)));
  // 使用bodyparser中间件解析POST请求的请求体
  app.use(bodyParser());
  // 错误处理中间件
  app.use(async (ctx, next) => {
    try {
      await next(); // 执行后续中间件
    } catch (err) {
      // 处理错误，例如设置错误状态码和消息
      ctx.status = err.status || 500;
      ctx.body = {
        code: err.status || 500,
        success: false,
        data: null,
        message: err.message || "服务器错误",
      };
      // 打印错误到控制台（或其他日志系统）
    }
  });

  app.use(async (ctx, next)=> {
    ctx.set('Access-Control-Allow-Origin', '*');
    ctx.set('Access-Control-Allow-Headers', 'Content-Type');
    ctx.set('Access-Control-Allow-Methods', '*');
    await next();
  })
  // 使用定义的路由
  app.use(router.routes()).use(router.allowedMethods());

  app.listen(CONFIG.SERVER_PORT, () => {
    console.log(`Server is running on http://localhost:${CONFIG.SERVER_PORT}`);
  });
}

module.exports = {
  start,
};
