const { col, Op, cast } = require("sequelize");

const template = [
  { prop: "f12", label: "股票代码" },
  { prop: "f14", label: "股票名称" },
  { prop: "f50003", label: "资金数据" },
];

class Fund extends require("./base-query") {
  constructor(params) {
    super(params);
    this.extend = [
      { prop: "f50004", label: "资金净流入天数", filter: 'range' },
      { prop: "f50005", label: "资金净流入数额", filter: 'range' }
    ]
  }
  queryPage(params) {
    const { pageNum, pageSize, matchKey = [], order = [], where = {} } = params;

    const tableOrders = this.orderArray(order);

    let whereArr = [];
    whereArr = whereArr.concat(this.whereArray(where));

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
  calculateIndex({ f12, f14, f50003 }) {
    // 日期/主力净流入/小单净流入/中单净流入/大单净流入/超大单净流入/主力流入净占比/小单净占比/中单净占比/大单净占比/超大单净占比/收盘价/涨跌幅
    f50003 = JSON.parse(f50003);
    let f50004 = 0;
    let f50005 = 0;
    for(let index = f50003.length - 1; index >=0;index --) {
      const splitArr = f50003[index].split(',');
      const cash = parseFloat(splitArr[1]);
      if(cash > 0) {
        f50004 ++;
        f50005 += cash;
      } else {
        break;
      }
    }
    return {
      f12,
      f50004,
      f50005
    }
  }
}

module.exports = new Fund({
  name: "fund",
  template,
  chineseName: "现金流",
  updateKey: "uuid",
});
