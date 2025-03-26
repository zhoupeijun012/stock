const { col, Op, cast } = require("sequelize");

const template = [
  { prop: "f12", label: "股票代码" },
  { prop: "f14", label: "股票名称" },
  { prop: "f50003", label: "资金数据" },
];

class Fund extends require("./base-query") {
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

module.exports = new Fund({
  name: "fund",
  template,
  chineseName: "现金流",
  updateKey: "uuid",
});
