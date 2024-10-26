const TOOL = require("./tool");
const SQL = require("./sql");
const CONFIG = require('./config');
function createTable(tableName, column) {
  const keys = Object.keys(column);
  const pinKeys = keys.map((item) =>
    TOOL.getPinYin(item).replace(/[^0-9A-Za-z]/g, "")
  );
  const sqlArr = keys.map(
    (key, index) => `${pinKeys[index]} TEXT COMMENT '${key}'`
  );
  const sqlStr = `
    CREATE TABLE IF NOT EXISTS ${CONFIG.TABLE_PREFIX}${tableName} (
    id INT AUTO_INCREMENT PRIMARY KEY COMMENT '主键',
    ${sqlArr.join(",")}
    )
   `;
  return SQL.query(sqlStr);
}

function dropTable(tableName) {
  return SQL.query(`DROP TABLE IF EXISTS ${CONFIG.TABLE_PREFIX}${tableName}`);
}

function insertTable(tableName, columns) {
  if (!Array.isArray(columns) || columns.length <= 0) {
    return Promise.resolve();
  }
  const firstObj = columns[0];
  const keys = Object.keys(firstObj);
  const pinKeys = keys.map((item) =>
    TOOL.getPinYin(item).replace(/[^0-9A-Za-z]/g, "")
  );

  const keySql = pinKeys.join(",");
  const valArr = columns.map((column) => {
    const valItemArr = keys.map((key) => column[key] ? '"' + (column[key] + '') + '"' : "''");
    return `(${valItemArr.join(",")})`;
  });
  const valStr = valArr.join(",");
  const sqlStr = `INSERT INTO ${CONFIG.TABLE_PREFIX}${tableName} (${keySql}) VALUES ${valStr}`;
  return SQL.query(sqlStr);
}

function pageTable(sqlStr) {
  return SQL.query(sqlStr);
}

function queryTable(sqlStr) {
  return SQL.query(sqlStr);
}
module.exports = {
  createTable,
  dropTable,
  insertTable,
  pageTable,
  queryTable
};
