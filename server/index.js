const Koa = require("koa");
const CONFIG = require("../utils/config.js");
const bodyParser = require("koa-bodyparser");
const router = require("./routes/index");

let app = null;
function start() {
  app = new Koa();

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
  // 使用定义的路由
  app.use(router.routes()).use(router.allowedMethods());

  app.listen(CONFIG.SERVER_PORT, () => {
    console.log("Server is running on http://localhost:3000");
  });
}

module.exports = {
  start,
};
