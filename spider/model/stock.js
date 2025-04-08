const { col, Op, cast, fn, literal } = require("sequelize");

const template = [
  { prop: "f2", label: "最新价" },
  { prop: "f4", label: "涨跌额" },
  { prop: "f5", label: "总手" },
  { prop: "f6", label: "成交额" },
  { prop: "f7", label: "振幅" },
  { prop: "f8", label: "换手率" },
  { prop: "f9", label: "市盈率" },
  { prop: "f10", label: "量比" },
  { prop: "f11", label: "5分钟涨跌幅" },
  { prop: "f12", label: "股票代码", filter: "in" },
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
  { prop: "f26", label: "上市日期" },
  { prop: "f28", label: "昨日结算价" },
  { prop: "f30", label: "现手" },
  { prop: "f31", label: "买入价" },
  { prop: "f32", label: "卖出价" },
  { prop: "f33", label: "委比" },
  { prop: "f34", label: "外盘" },
  { prop: "f35", label: "内盘" },
  { prop: "f36", label: "人均持股数" },
  { prop: "f37", label: "净资产收益率(加权)" },
  { prop: "f38", label: "总股本" },
  { prop: "f39", label: "流通股" },
  { prop: "f40", label: "营业收入" },
  { prop: "f41", label: "营业收入同比" },
  { prop: "f42", label: "营业利润" },
  { prop: "f43", label: "投资收益" },
  { prop: "f44", label: "利润总额" },
  { prop: "f45", label: "净利润" },
  { prop: "f46", label: "净利润同比" },
  { prop: "f47", label: "未分配利润" },
  { prop: "f48", label: "每股未分配利润" },
  { prop: "f49", label: "毛利率" },
  { prop: "f50", label: "总资产" },
  { prop: "f51", label: "流动资产" },
  { prop: "f52", label: "固定资产" },
  { prop: "f53", label: "无形资产" },
  { prop: "f54", label: "总负债" },
  { prop: "f55", label: "流动负债" },
  { prop: "f56", label: "长期负债" },
  { prop: "f57", label: "资产负债比率" },
  { prop: "f58", label: "股东权益" },
  { prop: "f59", label: "股东权益比" },
  { prop: "f60", label: "公积金" },
  { prop: "f61", label: "每股公积金" },

  { prop: "f3", label: "今日涨跌幅" },
  { prop: "f62", label: "今日主力净流入" },
  { prop: "f184", label: "今日主力净流入占比" },
  { prop: "f66", label: "今日超大单净流入" },
  { prop: "f69", label: "今日超大单净流入占比" },
  { prop: "f72", label: "今日大单净流入" },
  { prop: "f75", label: "今日大单净流入占比" },
  { prop: "f78", label: "今日中单净流入" },
  { prop: "f81", label: "今日中单净流入占比" },
  { prop: "f84", label: "今日小单净流入" },
  { prop: "f87", label: "今日小单净流入占比" },

  { prop: "f127", label: "3日涨跌幅" },
  { prop: "f267", label: "3日主力净流入" },
  { prop: "f268", label: "3日主力净流入占比" },
  { prop: "f269", label: "3日超大单净流入" },
  { prop: "f270", label: "3日超大单净占比" },
  { prop: "f271", label: "3日大单净流入" },
  { prop: "f272", label: "3日大单净占比" },
  { prop: "f273", label: "3日中单净流入" },
  { prop: "f274", label: "3日中单净流入占比" },
  { prop: "f275", label: "3日小单净流入" },
  { prop: "f276", label: "3日小单净流入占比" },

  { prop: "f109", label: "5日涨跌幅" },
  { prop: "f164", label: "5日主力净流入" },
  { prop: "f165", label: "5日主力净流入占比" },
  { prop: "f166", label: "5日超大单净流入" },
  { prop: "f167", label: "5日超大单净占比" },
  { prop: "f168", label: "5日大单净流入" },
  { prop: "f169", label: "5日大单净占比" },
  { prop: "f170", label: "5日中单净流入" },
  { prop: "f171", label: "5日中单净流入占比" },
  { prop: "f172", label: "5日小单净流入" },
  { prop: "f173", label: "5日小单净流入占比" },

  { prop: "f160", label: "10日涨跌幅" },
  { prop: "f174", label: "10日主力净流入" },
  { prop: "f175", label: "10日主力净流入占比" },
  { prop: "f176", label: "10日超大单净流入" },
  { prop: "f177", label: "10日超大单净占比" },
  { prop: "f178", label: "10日大单净流入" },
  { prop: "f179", label: "10日大单净占比" },
  { prop: "f180", label: "10日中单净流入" },
  { prop: "f181", label: "10日中单净流入占比" },
  { prop: "f182", label: "10日小单净流入" },
  { prop: "f183", label: "10日小单净流入占比" },

  { prop: "f63", label: "集合竞价" },
  { prop: "f64", label: "超大单流入" },
  { prop: "f65", label: "超大单流出" },
  { prop: "f70", label: "大单流入" },
  { prop: "f71", label: "大单流出" },
  { prop: "f76", label: "中单流入" },
  { prop: "f77", label: "中单流出" },
  { prop: "f82", label: "小单流入" },
  { prop: "f83", label: "小单流出" },

  { prop: "f88", label: "当日DDX" },
  { prop: "f89", label: "当日DDY" },
  { prop: "f90", label: "当日DDZ" },
  { prop: "f91", label: "5日DDX" },
  { prop: "f92", label: "5日DDY" },
  { prop: "f94", label: "10日DDX" },
  { prop: "f95", label: "10日DDY" },
  { prop: "f97", label: "DDX飘红天数(连续)" },
  { prop: "f98", label: "DDX飘红天数(5日)" },
  { prop: "f99", label: "DDX飘红天数(10日)" },
  { prop: "f100", label: "行业" },
  { prop: "f101", label: "板块领涨股" },
  { prop: "f102", label: "地区板块" },
  { prop: "f103", label: "备注", filter: "strmap" },
  { prop: "f104", label: "上涨家数" },
  { prop: "f105", label: "下跌家数" },
  { prop: "f106", label: "平家家数" },
  { prop: "f112", label: "每股收益" },
  { prop: "f113", label: "每股净资产" },
  { prop: "f114", label: "市盈率（静）" },
  { prop: "f115", label: "市盈率（TTM）" },
  { prop: "f124", label: "当前交易时间" },

  { prop: "f128", label: "板块领涨股" },
  { prop: "f129", label: "净利润" },
  { prop: "f130", label: "市销率TTM" },
  { prop: "f131", label: "市现率TTM" },
  { prop: "f132", label: "总营业收入TTM" },
  { prop: "f133", label: "股息率" },
  { prop: "f134", label: "行业板块的成分股数" },
  { prop: "f135", label: "净资产" },
  { prop: "f138", label: "净利润TTM" },
  { prop: "f221", label: "更新日期" },
];

class Stock extends require("./base-query") {
  constructor(params) {
    super(params);
  }
  async getPage(params) {
    const queryParams = {
      np: 1,
      fltt: 1,
      invt: 2,
      cb: "cb",
      fs: "m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23,m:0+t:81+s:2048",
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
      list: diff.filter((item) => item.f2 != "-"),
      pageSize: diff.length,
      pageNum: params.pageNum,
      pages,
    };
  }
  async getKLine(params) {
    const queryParams = {
      secid: GET_STOCK_PREFIX(params.code),
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
      cb: "cb",
      lmt: "0",
      klt: "101",
      fields1: "f1,f2,f3,f7",
      fields2: "f51,f52,f53,f54,f55,f56,f57,f58,f59,f60,f61,f62,f63,f64,f65",
      ut: "b2884a393a59ad64002292a3e90d46a5",
      secid: GET_STOCK_PREFIX(params.code),
      _: Date.now(),
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
      f50003: JSON.stringify(klines),
    };
  }
  queryPage(params) {
    const { pageNum, pageSize, matchKey = [], order = [], where = [] } = params;

    const tableOrders = this.orderArray(order);

    let whereArr = [];
    if (where["f6666"] && Array.isArray(where["f6666"])) {
      const arr = where["f6666"].map((item) => {
        return {
          [Op.startsWith]: item,
        };
      });
      whereArr.push({
        [Op.and]: {
          ["f12"]: {
            [Op.or]: arr,
          },
        },
      });
      delete where["f6666"];
    }
    if (where["f9"]) {
      if (where["f9"] > 0) {
        whereArr.push({ [Op.and]: literal(`CAST( f9 AS INTEGER) < 0`) });
      } else {
        whereArr.push({ [Op.and]: literal(`CAST(f9 AS INTEGER) >= 0`) });
      }
      delete where["f9"];
    }
    if (where["f23"]) {
      if (where["f23"] > 0) {
        whereArr.push({ [Op.and]: literal(`CAST(f23 AS INTEGER) < 1`) });
      } else {
        whereArr.push({ [Op.and]: literal(`CAST(f23 AS INTEGER) >= 1`) });
      }
      delete where["f23"];
    }

    const { andArr, orArr } = this.whereArray(where);
    whereArr = whereArr.concat(andArr);
    whereArr = whereArr.concat(orArr);
    const whereMap = {
      [Op.and]: whereArr,
    };

    matchKey.push([
      literal(
        `(SELECT json_group_array(json_object('f14',region.f14,'f12',region.f12,'f3',region.f3)) FROM regions AS region WHERE region.f14 = stock.f102)`
      ),
      "c_f102",
    ]);
    matchKey.push([
      literal(
        `(SELECT json_group_array(json_object('f14',industry.f14,'f12',industry.f12,'f3',industry.f3)) FROM industries AS industry WHERE industry.f14 = stock.f100)`
      ),
      "c_f100",
    ]);
    matchKey.push([
      literal(
        `(SELECT json_group_array(json_object('f14',concept.f14,'f12',concept.f12,'f3',concept.f3)) FROM concepts AS concept WHERE INSTR(stock.f103,concept.f14) > 0)`
      ),
      "c_f103",
    ]);
    return super.queryPage({
      pageNum,
      pageSize,
      matchKey,
      order: tableOrders,
      where: whereMap,
    });
  }
  query(params) {
    const { matchKey = [], order = [], where = [] } = params;
    matchKey.push([
      literal(
        `(SELECT json_group_array(json_object('f14',region.f14,'f12',region.f12,'f3',region.f3)) FROM regions AS region WHERE region.f14 = stock.f102)`
      ),
      "c_f102",
    ]);
    matchKey.push([
      literal(
        `(SELECT json_group_array(json_object('f14',industry.f14,'f12',industry.f12,'f3',industry.f3)) FROM industries AS industry WHERE industry.f14 = stock.f100)`
      ),
      "c_f100",
    ]);
    matchKey.push([
      literal(
        `(SELECT json_group_array(json_object('f14',concept.f14,'f12',concept.f12,'f3',concept.f3)) FROM concepts AS concept WHERE INSTR(stock.f103,concept.f14) > 0)`
      ),
      "c_f103",
    ]);
    return super.query({
      matchKey,
      order,
      where,
    });
  }
}

module.exports = new Stock({
  name: "stock",
  template,
  chineseName: "股票",
  updateKey: "f12",
  extend: [
    ...require(RESOLVE_PATH("spider/model/kline")).extend,
    ...require(RESOLVE_PATH("spider/model/fund")).extend,
  ],
});
