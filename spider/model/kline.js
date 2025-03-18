const { col, Op, cast } = require("sequelize");

const template = [
    { prop: "f12", label: "股票代码" },
    { prop: "f14", label: "股票名称" },
    { prop: "f40001", label: "K线类型" },
    { prop: "f40002", label: "K线数据" }
];

class Kline extends require("./base-query") {
  constructor(params) {
    super(params);
  }
  queryPage(params) {
    const { pageNum, pageSize, matchKey = [], order = [], where = {} } = params;

    const tableOrders = order.map((item) => {
      if (item.prop == "10086") {
      } else {
        return [
          cast(col(item.prop), "SIGNED"),
          item.order == "ascending" ? "ASC" : "DESC",
        ];
      }
    });

    const whereArr = [];
    for (let key of Object.keys(where)) {
      // 股票名称
      if (key == "retryCount") {
        whereArr.push({
          [key]: {
            [Op.lt]: where[key],
          },
        });
      } else {
        whereArr.push({
          [key]: {
            [Op.like]: `%${where[key]}%`,
          },
        });
      }
    }

    const whereMap = {
      [Op.and]: whereArr,
    };

    return super.queryPage({
      pageNum,
      pageSize,
      matchKey,
      order: tableOrders,
      where: whereMap,
    });
  }
}

module.exports = new Kline({
  name: "kline",
  template,
  chineseName: "K线",
  updateKey: "uuid",
});
