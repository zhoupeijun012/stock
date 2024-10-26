// 引入MySQL客户端库
const mysql = require("mysql2");
const CONFIG = require("./config");
let status = 0;
let DB_INSTANCE = null;
function connect() {
  // 创建与数据库的连接
  const connection = mysql.createConnection({
    host: CONFIG.DB_URL, // 数据库服务器地址
    user: CONFIG.DB_USER, // 数据库用户名
    password: CONFIG.DB_PWD, // 数据库密码
  });
  return new Promise((resolve, reject) => {
    // 连接到数据库
    connection.connect((err) => {
      if (err) {
        reject({
          message: "连接数据库失败",
        });
        console.error("连接数据库失败: " + err.stack);
        return;
      }
      DB_INSTANCE = connection;
      resolve();
      console.log("连接数据库成功");
    });
  });
}
function createDataBase(dbName) {
  return new Promise((resovle, reject) => {
    DB_INSTANCE.query(
      `CREATE DATABASE IF NOT EXISTS ${dbName}`,
      (error, results, fields) => {
        if (error) {
          reject(error.stack);
          return;
        }
        resovle(results, fields);
      }
    );
  });
}  
function useDataBase(dbName) {
    return new Promise((resovle, reject) => {
      DB_INSTANCE.query(
        `USE ${dbName}`,
        (error, results, fields) => {
          if (error) {
            reject(error.stack);
            return;
          }
          resovle(results, fields);
        }
      );
    });
  }

async function query(sql, dbName = CONFIG.DB_NAME) {
  if (status == 0) {
    await connect();
    await createDataBase(dbName);
    await useDataBase(dbName);
    status = 1
  }
  return new Promise((resovle, reject) => {
    DB_INSTANCE.query(sql, (error, results, fields) => {
      if (error) {
        reject(error.stack);
        return;
      }
      resovle(results, fields);
    });
  });
}

module.exports = {
  query,
};
