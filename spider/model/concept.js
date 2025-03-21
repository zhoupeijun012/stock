const { col, Op, cast } = require("sequelize");

const template = [
  { prop: "f2", label: "最新价" },
  { prop: "f3", label: "涨跌幅" },
  { prop: "f4", label: "涨跌额" },
  { prop: "f5", label: "总手" },
  { prop: "f6", label: "成交额" },
  { prop: "f7", label: "振幅" },
  { prop: "f8", label: "换手率" },
  { prop: "f9", label: "市盈率" },
  { prop: "f10", label: "量比" },
  { prop: "f11", label: "5分钟涨跌幅" },
  { prop: "f12", label: "股票代码" },
  { prop: "f13", label: "市场" },
  { prop: "f14", label: "股票名称" },
  { prop: "f15", label: "最高价" },
  { prop: "f16", label: "最低价" },
  { prop: "f17", label: "开盘价" },
  { prop: "f18", label: "昨收" },
  { prop: "f20", label: "总市值" },
  { prop: "f21", label: "流通市值" },
  { prop: "f22", label: "涨速" },
  { prop: "f23", label: "市净率" },
  { prop: "f24", label: "60日涨跌幅" },
  { prop: "f25", label: "年初至今涨跌幅" },
  { prop: "f104", label: "上涨家数" },
  { prop: "f105", label: "下跌家数" },
  { prop: "f128", label: "领涨股票" },
  { prop: "f140", label: "领涨股票代码" },
];
class Concept extends require("./base-query") {
  constructor(params) {
    super(params);
  }
  async getPage(params) {
    const queryParams = {
      np: 1,
      fltt: 1,
      invt: 2,
      cb: "cb",
      fs: "m:90+t:3+f:!50",
      fields: this.modelKeys.join(","),
      fid: "f3",
      pn: params.pageNum,
      pz: params.pageSize,
      po: 1,
      dect: 1,
      ut: "fa5fd1943c7b386f172d6893dbfba10b",
      wbp2u: "|0|0|0|web",
      _: Date.now(),
    };
    const res = await HTTP.get(`https://push2.eastmoney.com/api/qt/clist/get`, {
      params: queryParams,
    });
    let data = res.data;
    data = data.slice(3, -2);
    data = JSON.parse(data).data || {};
    const { total, diff = [] } = data;
    const pages = Math.ceil(total / diff.length);
    return {
      total,
      list: diff,
      pageSize: diff.length,
      pageNum: params.pageNum,
      pages,
    };
  }
  async getKLine(params) {
    const queryParams = {
      secid: `90.${params.code}`,
      ut: "fa5fd1943c7b386f172d6893dbfba10b",
      fields1: "f1,f2,f3,f4,f5,f6",
      fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61",
      klt: GET_KLT(params.type),
      fqt: "1",
      end: DAYJS().format("YYYYMMDD"),
      lmt: "210",
      cb: "cb",
    };
    const res = await HTTP.get(
      `https://push2his.eastmoney.com/api/qt/stock/kline/get`,
      {
        params: queryParams,
      }
    );

    let data = res.data;
    data = data.slice(3, -2);
    data = JSON.parse(data).data || {};
    const { code, name, klines = [] } = data;
    return {
      f12: code,
      f14: name,
      f40001: params.type,
      f40002: JSON.stringify(klines),
    };
  }
  async getFundPage(params) {
    const queryParams = {
      cb: 'cb',
      lmt: '0',
      klt: '101',
      fields1: 'f1,f2,f3,f7',
      fields2: 'f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63,f64,f65',
      ut: 'b2884a393a59ad64002292a3e90d46a5',
      secid: `90.${params.code}`,
      _: Date.now()
    };
    const res = await HTTP.get(
      `https://push2his.eastmoney.com/api/qt/stock/fflow/daykline/get`,
      {
        params: queryParams,
      }
    );

    let data = res.data;
    data = data.slice(3, -2);
    data = JSON.parse(data).data || {};
    const { code, name, klines = [] } = data;
    return {
      f12: code,
      f14: name,
      f40003: JSON.stringify(klines),
    };
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
      if (key == "c1") {
        whereArr.push({
          [key]: {
            [Op.eq]: where[key],
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

module.exports = new Concept({
  name: "concept",
  template,
  chineseName: "概念",
  updateKey: "f12",
});
