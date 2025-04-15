const { Sequelize } = require("sequelize");
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: RESOLVE_PATH("db/sqlite.db"),
  logging: false,
  pool: {
    max: 10, // 连接池最大连接数
    min: 2, // 连接池最小连接数
    acquire: 30000, // 尝试获取连接的最大时间（毫秒）
    idle: 10000 // 连接在连接池中空闲的最大时间（毫秒）
  }
});
sequelize.query('PRAGMA cache_size = 10000;')

// const sequelize = new Sequelize('STOCK','root','Zz7811181', {
//   host: 'mysql.chives.asia',
//   dialect: 'mysql',
//   port: 3306, // MySQL 默认端口
//   logging: false,
//   pool: {
//     max: 10, // 连接池最大连接数
//     min: 5, // 连接池最小连接数
//     acquire: 30000, // 尝试获取连接的最大时间（毫秒）
//     idle: 10000 // 连接在连接池中空闲的最大时间（毫秒）
//   }
// });

exports.sequelize = sequelize;
