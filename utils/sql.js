const { Sequelize } = require("sequelize");
// 方法 2: 分别传递参数 (sqlite)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: RESOLVE_PATH("sqlite.db"),
});

exports.sequelize = sequelize;