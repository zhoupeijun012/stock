const { Sequelize } = require("sequelize");
// 方法 2: 分别传递参数 (sqlite)
const sequelize = new Sequelize({
  dialect: "sqlite",
  storage: RESOLVE_PATH("sqlite.db"),
});

// 注册model
exports.StockModel = sequelize.define("Stock", require("./stock").defineModel);
exports.EtfModel = sequelize.define("Etf", require("./etf").defineModel);
exports.ConceptModel = sequelize.define("Concept", require("./concept").defineModel);
exports.IndustryModel = sequelize.define("Industry", require("./industry").defineModel);
exports.RegionModel = sequelize.define("Region", require("./region").defineModel);
exports.LofModel = sequelize.define("Lof", require("./lof").defineModel);
exports.LimitModel = sequelize.define("Limit", require("./limit").defineModel);
exports.KLineModel = sequelize.define("Limit", require("./k-line").defineModel);

exports.init = ()=>{
  return sequelize.sync({ force: true }).catch((error) => {
    WECHAT_SENG_TEXT(
      `${DAYJS().format(
        "YYYY-MM-DD HH:mm:ss"
      )}\n创建数据库失败\n${error.message.slice(0, 150)}`
    );
  });
}

exports.sequelize = sequelize;