const { Sequelize } = require("sequelize");
// 方法 2: 分别传递参数 (sqlite)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: RESOLVE_PATH("db/sqlite.db"),
  logging: false,
  pool: {
    max: 10, // 连接池最大连接数
    min: 0, // 连接池最小连接数
    acquire: 30000, // 尝试获取连接的最大时间（毫秒）
    idle: 10000 // 连接在连接池中空闲的最大时间（毫秒）
  }
});

exports.sequelize = sequelize;
