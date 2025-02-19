const Stock = require(RESOLVE_PATH("spider/stock"));
const StockTemplate = require(RESOLVE_PATH("spider/model/stock")).template;
const StockModelKeys = require(RESOLVE_PATH("spider/model/stock")).modelKeys;
const Router = require("@koa/router");
const router = new Router({
  prefix: "/api",
});

router.post("/getStockList", async (ctx, next) => {
  try {
    let { pageNum, pageSize, matchKey,orders=[], prompt } = ctx.request.body;
    if(!Array.isArray(matchKey) || (Array.isArray(matchKey) && matchKey.length < 0) ) {
      matchKey = StockModelKeys;
    }
    const data = await Stock.queryPage(pageNum, pageSize,matchKey,orders);

    ctx.body = {
      success: true,
      message: "成功",
      data: {
        template: prompt ? StockTemplate: [],
        ...data,
      },
    };
  } catch (error) {
    ctx.body = {
      success: false,
      message: error.message,
      data: null,
    };
  }
});

router.post("/getEtfList", async (ctx, next) => {
  try {
    let { pageNum, pageSize, matchKey, orders = [],prompt } = ctx.request.body;
    if(!Array.isArray(matchKey) || (Array.isArray(matchKey) && matchKey.length < 0) ) {
      matchKey = StockModelKeys;
    }
    const data = await Stock.queryPage(pageNum, pageSize,matchKey,orders);

    ctx.body = {
      success: true,
      message: "成功",
      data: {
        template: prompt ? StockTemplate: [],
        ...data,
      },
    };
  } catch (error) {
    ctx.body = {
      success: false,
      message: error.message,
      data: null,
    };
  }
});

module.exports = router;
