const { col, Op, cast, where, TIME } = require("sequelize");

const template = [
  { prop: "f12", label: "股票代码",filter: "in" },
  { prop: "f14", label: "股票名称" },
  { prop: "f40001", label: "K线类型" },
  { prop: "f40002", label: "K线数据" },
];

class Kline extends require("./base-query") {
  constructor(params) {
    super(params);
    this.extend = [
      { prop: "f40003", label: "历史最低价" },
      { prop: "f40004", label: "历史最高价" },
      { prop: "f40005", label: "至今涨跌幅倍数", filter: "range" },
      { prop: "f40006", label: "2024年9月20日至今涨幅", filter: "range" },
      { prop: "f40007", label: "2025年2月05日至今涨幅", filter: "range" },
      { prop: "f40008", label: "均线多头排列天数", filter: "range" },
      { prop: "f40009", label: "均线多头排列涨幅", filter: "range" },
      { prop: "f40010", label: "站上60日均线天数", filter: "range" },
      { prop: "f40011", label: "站上60日均线涨幅", filter: "range" },
    ];
  }
  queryPage(params) {
    const { pageNum, pageSize, matchKey = [], order = [], where = {},whereNot = {} } = params;

    const tableOrders = this.orderArray(order);

    let whereArr = [];
    const { andArr, orArr } = this.whereArray(where,whereNot);
    whereArr = whereArr.concat(andArr);
    whereArr = whereArr.concat(orArr);
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
  async getListByLive(list,type) {
    list = Array.isArray(list) ? list : [list];
    const newKList = [];
    for (let stockRowItem of list) {
      // 首先先读取出数据，然后删除当天那条
      // 2024-05-21,840.58,839.62,843.56,837.63,4094051,1940203777.00,0.71,0.27,2.26,0.56\
      // 日期/开/收/高/低/成交量/成交额/震幅/涨跌幅/涨跌额/换手率
      const { f12, f17,f2,f15,f16,f5,f6,f7,f3,f4,f8 } = stockRowItem;
      const stockKLineItem = await this.query({
        where: [{ f12,f40001: type }],
      });
      if (!stockKLineItem) {
        continue;
      }
      let { f40002 } = stockKLineItem;
      let klines = JSON.parse(f40002);
      const currentDay = DAYJS().format("YYYY-MM-DD");
      const timeArr = [currentDay,f17/100,f2/100,f15/100,f16/100,f5,f6,f7/100,f3/100,f4/100,f8/100].join(',');
      const lastObj = klines[klines.length - 1];
      if(lastObj.startsWith(currentDay)) {
        klines.pop();
      }
      klines.push(timeArr);
      newKList.push({
        f12,
        f40001: type,
        f40002: JSON.stringify(klines)
      })
    }
    return newKList;
  }
  async getIndexListByLive(list) {
    let newIndexList = [];
    for(const indexItem of list) {
      newIndexList.push(this.calculateIndex(indexItem));
    }
    return newIndexList;
  }
  // 在这里计算数据
  calculateIndex(stockKLineItem) {
    const { f12, f40002 } = stockKLineItem;
    let klines = JSON.parse(f40002);
    klines = klines.map((kItem) => {
      const dates = kItem.split(",");
      return dates;
    });
    const closePrices = klines.map((dates) => {
      return parseFloat(dates[2]);
    });

    const indexObj = {
      f12,
    };
    // 1、先计算ma
    const maArray = this.MA(closePrices);
    // 2、再计算 f40003 历史最低价
    const f40003 = this.MAX(closePrices);
    indexObj["f40003"] = f40003;
    // 3、再计算 f40004 历史最高价
    const f40004 = this.MIN(closePrices);
    indexObj["f40004"] = f40004;
    // 4、再计算 f40005 涨跌幅倍数
    const f40005 =
      parseInt((f40003 / closePrices[closePrices.length - 1]) * 100) / 100;
    indexObj["f40005"] = f40005;
    // 5、再计算 f40006 2024年9月20日至今涨幅
    const f40006 = this.destDate(
      JSON.parse(JSON.stringify(klines)),
      "20240920"
    );
    indexObj["f40006"] = f40006;
    // 6、再计算 f40007 2025年2月05日至今涨幅
    const f40007 = this.destDate(
      JSON.parse(JSON.stringify(klines)),
      "20250205"
    );
    indexObj["f40007"] = f40007;
    // 7、再计算 f40008 f40009 是否均线多头排列/均线多头排列天数
    const { f40008, f40009 } = this.UP(maArray, closePrices);
    indexObj["f40008"] = f40008;
    indexObj["f40009"] = f40009;
    // 8、再计算 f40010 f40011 是否站上60日均线/站上60日均线天数
    const { f40010, f40011 } = this.UP60(maArray, closePrices);

    indexObj["f40010"] = f40010;
    indexObj["f40011"] = f40011;

    return indexObj;
  }
  MA(closePrices) {
    const periods = [5, 10, 20, 30, 60];
    const movingAverages = {};

    periods.forEach((period) => {
      movingAverages[`${period}日`] = [];
      for (let i = 0; i < closePrices.length; i++) {
        if (i < period - 1) {
          movingAverages[`${period}日`].push(0);
        } else {
          let sum = 0;
          for (let j = i - period + 1; j <= i; j++) {
            sum += closePrices[j];
          }
          const average = parseFloat((sum / period).toFixed(2));
          movingAverages[`${period}日`].push(average);
        }
      }
    });

    return movingAverages;
  }
  MAX(closePrices) {
    return Math.max(...closePrices);
  }
  MIN(closePrices) {
    return Math.min(...closePrices);
  }
  UP(maArray, closePrices) {
    let f40008 = 0;
    let f40009 = 0;
    const MA5 = maArray["5日"];
    const MA10 = maArray["10日"];
    const MA20 = maArray["20日"];
    const MA30 = maArray["30日"];

    for (let index = MA5.length - 1; index >= 0; index--) {
      if (
        parseFloat(MA5[index]) >= parseFloat(MA10[index]) &&
        parseFloat(MA10[index]) >= parseFloat(MA20[index]) &&
        parseFloat(MA20[index]) >= parseFloat(MA30[index])
      ) {
        f40008++;
      } else {
        const lastPrice = closePrices[closePrices.length - 1];
        const curPrice = closePrices[index];
        f40009 = parseInt(((lastPrice - curPrice) / curPrice) * 10000);
        break;
      }
    }
    return {
      f40008,
      f40009,
    };
  }
  UP60(maArray, closePrices) {
    let f40010 = 0;
    let f40011 = 0;
    const MA60 = maArray["60日"];

    for (let index = MA60.length - 1; index >= 0; index--) {
      if (parseFloat(closePrices[index]) >= parseFloat(MA60[index])) {
        f40010++;
      } else {
        const lastPrice = closePrices[closePrices.length - 1];
        const curPrice = closePrices[index];
        f40011 = parseInt(((lastPrice - curPrice) / curPrice) * 10000);
        break;
      }
    }
    return {
      f40010,
      f40011,
    };
  }
  destDate(klines, desDate) {
    let prevObj = klines.pop();
    const lastPrice = prevObj[2];
    let desPrice = lastPrice;
    while ((prevObj = klines.pop())) {
      const date = prevObj[0].replaceAll("-", "");
      if (date <= desDate) {
        desPrice = prevObj[2];
        break;
      }
    }
    return parseInt(
      ((parseFloat(lastPrice) - parseFloat(desPrice)) / parseFloat(desPrice)) *
        10000
    );
  }
}

module.exports = new Kline({
  name: "kline",
  template,
  chineseName: "K线",
  updateKey: "uuid",
});
