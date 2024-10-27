const Router = require("@koa/router");
const TABLE = require("../../utils/table");
const STOCK = require('../../spider/stock');
const CONFIG = require('../../utils/config');
const router = new Router({
  prefix: "/api",
});
// 定义一个POST请求的路由
router.post("/getPage", async (ctx) => {
  const params = ctx.request.body;
  const pageSize = params.pageSize || 10;
  const pageNum = params.pageNum || 1;
  const ORDERBY = params.ORDERBY || "";
  const WHERE = params.WHERE || "";
  const tableName = params.TABLE_NAME || 'T_' + CONFIG.DB_NAME;

  const pageStr = `SELECT * FROM ${tableName} ${WHERE} ${ORDERBY} LIMIT ${pageSize} OFFSET ${
    (pageNum - 1) * pageSize
  }`;
  const countSql = `SELECT COUNT(*) count FROM ${tableName}${WHERE}${ORDERBY}`;
  const keyMapSql = `SELECT COLUMN_NAME, COLUMN_COMMENT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = '${CONFIG.DB_NAME}'
  AND TABLE_NAME = '${tableName}' `;
  // 获取请求体中的数据
  const res = await TABLE.pageTable(pageStr);
  const count = (await TABLE.pageTable(countSql))[0].count;
  const keyMap = await TABLE.pageTable(keyMapSql);
  ctx.body = {
    success: true,
    message: "成功",
    code: 200,
    data: {
      total: count,
      pages: Math.ceil(count / pageSize),
      pageNum,
      pageSize,
      list: res,
      keyMap,
    },
  };
});

router.post("/queryTable", async (ctx) => {
  const params = ctx.request.body;
  const QUERY_SQL = params.QUERY_SQL || "";
  const tableName = params.TABLE_NAME || 'T_' + CONFIG.DB_NAME;

  const keyMapSql = `SELECT COLUMN_NAME, COLUMN_COMMENT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = '${CONFIG.DB_NAME}'
  AND TABLE_NAME = '${tableName}' `;
  // 获取请求体中的数据
  const res = await TABLE.pageTable(QUERY_SQL);
  const keyMap = await TABLE.pageTable(keyMapSql);
  ctx.body = {
    success: true,
    message: "成功",
    code: 200,
    data: {
      list: res,
      keyMap,
    },
  };
});

let inStockUpdate = false;
router.get("/updateStockList", async (ctx) => {
  if(inStockUpdate) {
    ctx.body = {
      success: false,
      message: "更新中...",
      code: 200
    };
    return 
  }
  inStockUpdate = true;
  try {
    const stockList = (await STOCK.getStockList()).data || [];
    await TABLE.dropTable(CONFIG.DB_NAME);
    await TABLE.createTable(CONFIG.DB_NAME,stockList[0]);
    await TABLE.insertTable(CONFIG.DB_NAME,stockList)
    ctx.body = {
      success: true,
      message: "成功",
      code: 200
    };
    inStockUpdate = false
  } catch(error){
    ctx.body = {
      code: 200,
      success: false,
      message: '更新失败！'
    }
    inStockUpdate = false
  }  
});

module.exports = router;
