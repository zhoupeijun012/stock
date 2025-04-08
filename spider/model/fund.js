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
  async getListByLive(list) {
    list = Array.isArray(list) ? list : [list];
    const newKList = [];
    for (let stockRowItem of list) {
      // 首先先读取出数据，然后删除当天那条
      // 日期/主力净流入/小单净流入/中单净流入/大单净流入/超大单净流入/主力流入净占比/小单净占比/中单净占比/大单净占比/超大单净占比/收盘价/涨跌幅
      const { f12, f62, f84, f78, f72, f66, f184, f87, f81, f75, f69, f2, f3 } = stockRowItem;
      const stockKLineItem = await this.query({
        where: [{ f12 }],
      });
      if (!stockKLineItem) {
        continue;
      }
      let { f50003 } = stockKLineItem;
      let klines = JSON.parse(f50003);
      const currentDay = DAYJS().format("YYYY-MM-DD");
      const timeArr = [currentDay,f62, f84, f78, f72, f66, f184/100, f87/100, f81/100, f75/100, f69/100, f2/100, f3/100,'0.00','0.00'].join(',');
      const lastObj = klines[klines.length - 1];
      if(lastObj.startsWith(currentDay)) {
        klines.pop();
      }
      klines.push(timeArr);
      newKList.push({
        f12,
        f50003: JSON.stringify(klines)
      })
    }
    return newKList;
  }
  async getIndexListByLive(list) {
    let newIndexList = [];
    for(let indexItem of list) {
      newIndexList.push(this.calculateIndex(indexItem));
    }
    return newIndexList;
  }
  calculateIndex({ f12, f50003 }) {
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
