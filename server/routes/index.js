const Router = require("@koa/router");
const TABLE = require("../../utils/table");

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
  const tableName = params.TABLE_NAME || "stock";

  const pageStr = `SELECT * FROM ${tableName} ${WHERE} ${ORDERBY} LIMIT ${pageSize} OFFSET ${
    (pageNum - 1) * pageSize
  }`;
  const countSql = `SELECT COUNT(*) count FROM ${tableName}${WHERE}${ORDERBY}`;
  const keyMapSql = `SELECT COLUMN_NAME, COLUMN_COMMENT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'stock'
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
  const tableName = params.TABLE_NAME || "stock";

  const keyMapSql = `SELECT COLUMN_NAME, COLUMN_COMMENT
FROM information_schema.COLUMNS
WHERE TABLE_SCHEMA = 'stock'
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


module.exports = router;
