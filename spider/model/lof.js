const { col, Op, cast } = require("sequelize");

const template = [
  { prop: "f2", label: "最新价", type: "REAL" },
  { prop: "f3", label: "涨跌幅", type: "REAL", index: true },
  { prop: "f4", label: "涨跌额", type: "REAL" },
  { prop: "f5", label: "总手", type: "REAL" },
  { prop: "f6", label: "成交额", type: "REAL", index: true },
  { prop: "f7", label: "振幅", type: "REAL" },
  { prop: "f8", label: "换手率", type: "REAL" },
  { prop: "f9", label: "市盈率", type: "REAL" },
  { prop: "f10", label: "量比", type: "REAL" },
  { prop: "f11", label: "5分钟涨跌幅", type: "REAL" },
  { prop: "f12", label: "股票代码", index: true },
  { prop: "f13", label: "市场" },
  { prop: "f14", label: "股票名称", index: true },
  { prop: "f15", label: "最高价", type: "REAL" },
  { prop: "f16", label: "最低价", type: "REAL" },
  { prop: "f17", label: "开盘价", type: "REAL" },
  { prop: "f18", label: "昨收", type: "REAL" },
  { prop: "f20", label: "总市值", type: "REAL" },
  { prop: "f21", label: "流通市值", type: "REAL", filter: "range" },
  { prop: "f22", label: "涨速", type: "REAL" },
  { prop: "f23", label: "市净率", type: "REAL" },
  { prop: "f24", label: "60日涨跌幅", type: "REAL" },
  { prop: "f25", label: "年初至今涨跌幅", type: "REAL" },
  { prop: "c1", label: "交易类型", filter: "eq" },
];
class Lof extends require("./base-query") {
  constructor(params) {
    super(params);
  }
  async getPage(params) {
    const queryParams = {
      np: 1,
      fltt: 1,
      invt: 2,
      cb: "cb",
      fs: "b:MK0404,b:MK0405,b:MK0406,b:MK0407",
      fields: this.modelKeys.join(","),
      fid: "f164",
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
}

module.exports = new Lof({
  name: "lof",
  template,
  chineseName: "LOF",
  updateKey: "f12",
});
