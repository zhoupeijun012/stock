const { col, Op, cast, where, TIME } = require("sequelize");
const { MajorIndicator } = require(RESOLVE_PATH("utils/stock-tdx.js"));
const template = [
  { prop: "f12", label: "股票代码", filter: "in", index: true },
  { prop: "f14", label: "股票名称", index: true },
  { prop: "f40001", label: "K线类型" },
  { prop: "f40002", label: "K线数据" },
];

class Kline extends require("./base-query") {
  constructor(params) {
    super(params);
    this.extend = [
      { prop: "f40003", label: "历史最低价", type: "REAL" },
      { prop: "f40004", label: "历史最高价", type: "REAL" },
      {
        prop: "f40005",
        label: "至今涨跌幅倍数",
        type: "REAL",
        index: true,
        filter: "range",
      },
      {
        prop: "f40006",
        label: "2024年9月20日至今涨幅",
        type: "REAL",
        index: true,
        filter: "range",
      },
      {
        prop: "f40007",
        label: "2025年2月05日至今涨幅",
        type: "REAL",
        index: true,
        filter: "range",
      },
      {
        prop: "f40008",
        label: "均线多头排列天数",
        type: "REAL",
        index: true,
        filter: "range",
      },
      {
        prop: "f40009",
        label: "均线多头排列涨幅",
        type: "REAL",
        index: true,
        filter: "range",
      },
      {
        prop: "f40010",
        label: "站上60日均线天数",
        type: "REAL",
        index: true,
        filter: "range",
      },
      {
        prop: "f40011",
        label: "站上60日均线涨幅",
        type: "REAL",
        index: true,
        filter: "range",
      },
      {
        prop: "f40012",
        label: "趋势天数",
        type: "REAL",
        index: true,
        filter: "range",
      },
      {
        prop: "f40013",
        label: "趋势涨幅",
        type: "REAL",
        index: true,
        filter: "range",
      },
      {
        prop: "f40014",
        label: "金叉天数",
        type: "REAL",
        index: true,
        filter: "range",
      },
      {
        prop: "f40015",
        label: "连涨天数",
        type: "REAL",
        index: true,
        filter: "range",
      },
      {
        prop: "f40016",
        label: "主力控盘程度",
        type: "REAL",
        index: true,
        filter: "range",
      },
    ];
  }
  queryPage(params) {
    const {
      pageNum,
      pageSize,
      matchKey = [],
      order = [],
      where = {},
      whereNot = {},
    } = params;

    const tableOrders = this.orderArray(order);

    let whereArr = [];
    const { andArr, orArr } = this.whereArray(where, whereNot);
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
  async getListByLive(list, type) {
    list = Array.isArray(list) ? list : [list];
    const kDataList = (
      await this.queryPage({
        pageNum: 1,
        pageSize: list.length,
        matchKey: ["f12", "f14", "f40002"],
        where: { f12: list.map((item) => item.f12), f40001: type },
      })
    ).list;
    const newKList = [];
    for (let stockRowItem of list) {
      // 首先先读取出数据，然后删除当天那条
      // 2024-05-21,840.58,839.62,843.56,837.63,4094051,1940203777.00,0.71,0.27,2.26,0.56\
      // 日期/开/收/高/低/成交量/成交额/震幅/涨跌幅/涨跌额/换手率
      const { f12, f17, f2, f15, f16, f5, f6, f7, f3, f4, f8 } = stockRowItem;
      const stockKLineItem = kDataList.find((item) => item["f12"] == f12);
      if (!stockKLineItem) {
        continue;
      }
      let { f40002 } = stockKLineItem;
      let klines = JSON.parse(f40002);
      const currentDay = DAYJS().format("YYYY-MM-DD");
      const timeArr = [
        currentDay,
        f17 / 100,
        f2 / 100,
        f15 / 100,
        f16 / 100,
        f5,
        f6,
        f7 / 100,
        f3 / 100,
        f4 / 100,
        f8 / 100,
      ].join(",");
      const lastObj = klines[klines.length - 1];
      if (lastObj.startsWith(currentDay)) {
        klines.pop();
      }
      klines.push(timeArr);
      newKList.push({
        f12,
        f40001: type,
        f40002: JSON.stringify(klines),
      });
    }
    return newKList;
  }
  async getIndexListByLive(list) {
    let newIndexList = [];
    for (const indexItem of list) {
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

    //  9 计算趋势股
    const { f40012, f40013 } = this.UPQS(maArray, closePrices);
    indexObj["f40012"] = f40012;
    indexObj["f40013"] = f40013;

    // 10 计算金叉天数
    const majorCrossCount = MajorIndicator.result(stockKMap(klines));
    indexObj["f40014"] = majorCrossCount;

    // 11 计算连阳天数
    const f40015 = this.UPPRICE(closePrices);
    indexObj["f40015"] = f40015;

    // 12 计算控盘程度
    const f40016 = this.controlDegree(stockKMap(klines));
    indexObj["f40016"] = f40016;

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
  UPQS(maArray, closePrices) {
    let f40012 = 0;
    let f40013 = 0;
    let ma5Count = 0;
    const MA5 = maArray["5日"];
    const MA10 = maArray["10日"];
    const MA20 = maArray["20日"];
    const MA30 = maArray["30日"];
    const MA60 = maArray["60日"];

    for (let index = MA5.length - 1; index >= 0; index--) {
      if (
        parseFloat(MA10[index]) >= parseFloat(MA20[index]) &&
        parseFloat(MA20[index]) >= parseFloat(MA30[index]) &&
        parseFloat(MA30[index]) >= parseFloat(MA60[index])
      ) {
        if (parseFloat(MA5[index]) >= parseFloat(MA10[index])) {
          ma5Count++;
        }
        f40012++;
      } else {
        const lastPrice = closePrices[closePrices.length - 1];
        const curPrice = closePrices[index];
        f40013 = parseInt(((lastPrice - curPrice) / curPrice) * 10000);
        break;
      }
    }
    if (ma5Count / f40012 < 0.88) {
      f40012 = 0;
      f40013 = 0;
    }
    return {
      f40012,
      f40013,
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
  UPPRICE(closePrices) {
    let upDays = 0;
    let lastPrice = closePrices[closePrices.length - 1];
    for (let i = closePrices.length - 2; i >= 0; i--) {
      if (lastPrice >= closePrices[i]) {
        upDays++;
        lastPrice = closePrices[i];
      } else {
        break;
      }
    }
    return upDays;
  }
  /**
   * 计算股票控盘程度指标（高性能版本）
   * @param {Array<Object>} data - 股票数据数组，每个元素包含 high, low, close 三个属性
   * @returns {number} 控盘程度指标值，保留两位小数
   */
  controlDegree(data) {
    const N = 35;
    const M = 35;
    const N1 = 3;
    const len = data.length;

    // 数据不足时返回0
    if (len < N) return 0;

    // 预计算HHV和LLV数组（滑动窗口最大值/最小值）
    const hhvArray = new Array(len);
    const llvArray = new Array(len);

    for (let i = 0; i < len; i++) {
      const startIdx = Math.max(0, i - N + 1);
      let hhv = -Infinity;
      let llv = Infinity;

      for (let j = startIdx; j <= i; j++) {
        hhv = Math.max(hhv, data[j].high);
        llv = Math.min(llv, data[j].low);
      }

      hhvArray[i] = hhv;
      llvArray[i] = llv;
    }

    // 计算B1数组
    const b1Array = new Array(len);
    for (let i = 0; i < len; i++) {
      const denominator = hhvArray[i] - llvArray[i];
      b1Array[i] =
        denominator !== 0
          ? ((hhvArray[i] - data[i].close) / denominator) * 100 - M
          : 0;
    }

    // 计算B3数组
    const b3Array = new Array(len);
    for (let i = 0; i < len; i++) {
      const denominator = hhvArray[i] - llvArray[i];
      b3Array[i] =
        denominator !== 0
          ? ((data[i].close - llvArray[i]) / denominator) * 100
          : 0;
    }

    // 计算B2（SMA(B1,N,1)+100）
    let sumB1 = 0;
    for (let i = len - N; i < len; i++) {
      sumB1 += b1Array[i];
    }
    const b2 = sumB1 / N + 100;

    // 计算B4（SMA(B3,3,1)）
    const b4Array = new Array(len);
    for (let i = 0; i < len; i++) {
      const windowStart = Math.max(0, i - 2);
      const windowSize = i - windowStart + 1;
      let sum = 0;

      for (let j = windowStart; j <= i; j++) {
        sum += b3Array[j];
      }

      b4Array[i] = sum / windowSize;
    }

    // 计算B5（SMA(B4,3,1)+100）
    const b5Array = new Array(len);
    for (let i = 0; i < len; i++) {
      const windowStart = Math.max(0, i - 2);
      const windowSize = i - windowStart + 1;
      let sum = 0;

      for (let j = windowStart; j <= i; j++) {
        sum += b4Array[j];
      }

      b5Array[i] = sum / windowSize + 100;
    }

    // 计算最后一天的B6和控盘程度
    const b6 = b5Array[len - 1] - b2;
    const degree = b6 > N1 ? (b6 - N1) * 2.5 : 0;

    // 保留两位小数
    return Math.round(degree * 100) / 100;
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
  queryPage(params) {
    const {
      pageNum,
      pageSize,
      matchKey = [],
      order = [],
      where = {},
      whereNot = {},
    } = params;
    const tableOrders = this.orderArray(order);

    let whereArr = [];
    const { andArr, orArr } = super.whereArray(where, whereNot);
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
}

module.exports = new Kline({
  name: "kline",
  template,
  chineseName: "K线",
  updateKey: "uuid",
});
