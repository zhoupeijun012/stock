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
}

module.exports = new Concept({
  name: "concept",
  template,
  chineseName: "概念",
  updateKey: "f12",
});
