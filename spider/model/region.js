const { col, Op, cast, fn, literal } = require("sequelize");

const template = [
  { prop: "f2", label: "最新价", type: "REAL" },
  { prop: "f4", label: "涨跌额", type: "REAL" },
  { prop: "f5", label: "总手", type: "REAL" },
  {prop: "f6",label: "成交额", type: "REAL",index:true,  },
  { prop: "f7", label: "振幅", type: "REAL" },
  { prop: "f8", label: "换手率", type: "REAL" },
  { prop: "f9", label: "市盈率", type: "REAL" },
  { prop: "f10", label: "量比", type: "REAL" },
  { prop: "f11", label: "5分钟涨跌幅", type: "REAL" },
  { prop: "f12", label: "股票代码",index:true, filter: "in" },
  { prop: "f13", label: "市场"  },
  { prop: "f14", label: "股票名称",index:true },
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
  { prop: "f26", label: "上市日期", type: "REAL" },
  { prop: "f28", label: "昨日结算价", type: "REAL" },
  { prop: "f30", label: "现手", type: "REAL" },
  { prop: "f31", label: "买入价", type: "REAL" },
  { prop: "f32", label: "卖出价", type: "REAL" },
  { prop: "f33", label: "委比", type: "REAL" },
  { prop: "f34", label: "外盘", type: "REAL" },
  { prop: "f35", label: "内盘", type: "REAL" },
  { prop: "f36", label: "人均持股数", type: "REAL" },
  { prop: "f37", label: "净资产收益率(加权)", type: "REAL" },
  { prop: "f38", label: "总股本", type: "REAL" },
  { prop: "f39", label: "流通股", type: "REAL" },
  { prop: "f40", label: "营业收入", type: "REAL" },
  { prop: "f41", label: "营业收入同比", type: "REAL" },
  { prop: "f42", label: "营业利润", type: "REAL" },
  { prop: "f43", label: "投资收益", type: "REAL" },
  { prop: "f44", label: "利润总额", type: "REAL" },
  { prop: "f45", label: "净利润", type: "REAL" },
  { prop: "f46", label: "净利润同比", type: "REAL" },
  { prop: "f47", label: "未分配利润", type: "REAL" },
  { prop: "f48", label: "每股未分配利润", type: "REAL" },
  { prop: "f49", label: "毛利率", type: "REAL" },
  { prop: "f50", label: "总资产", type: "REAL" },
  { prop: "f51", label: "流动资产", type: "REAL" },
  { prop: "f52", label: "固定资产", type: "REAL" },
  { prop: "f53", label: "无形资产", type: "REAL" },
  { prop: "f54", label: "总负债", type: "REAL" },
  { prop: "f55", label: "流动负债", type: "REAL" },
  { prop: "f56", label: "长期负债", type: "REAL" },
  { prop: "f57", label: "资产负债比率", type: "REAL" },
  { prop: "f58", label: "股东权益", type: "REAL" },
  { prop: "f59", label: "股东权益比", type: "REAL" },
  { prop: "f60", label: "公积金", type: "REAL" },
  { prop: "f61", label: "每股公积金", type: "REAL" },

  { prop: "f3",label: "今日涨跌幅", type: "REAL",index:true },
  { prop: "f62", label: "今日主力净流入", type: "REAL" },
  { prop: "f184", label: "今日主力净流入占比", type: "REAL" },
  { prop: "f66", label: "今日超大单净流入", type: "REAL" },
  { prop: "f69", label: "今日超大单净流入占比", type: "REAL" },
  { prop: "f72", label: "今日大单净流入", type: "REAL" },
  { prop: "f75", label: "今日大单净流入占比", type: "REAL" },
  { prop: "f78", label: "今日中单净流入", type: "REAL" },
  { prop: "f81", label: "今日中单净流入占比", type: "REAL" },
  { prop: "f84", label: "今日小单净流入", type: "REAL" },
  { prop: "f87", label: "今日小单净流入占比", type: "REAL" },

  { prop: "f127", label: "3日涨跌幅", type: "REAL" },
  { prop: "f267", label: "3日主力净流入", type: "REAL" },
  { prop: "f268", label: "3日主力净流入占比", type: "REAL" },
  { prop: "f269", label: "3日超大单净流入" , type: "REAL"},
  { prop: "f270", label: "3日超大单净占比", type: "REAL" },
  { prop: "f271", label: "3日大单净流入", type: "REAL" },
  { prop: "f272", label: "3日大单净占比", type: "REAL" },
  { prop: "f273", label: "3日中单净流入" , type: "REAL"},
  { prop: "f274", label: "3日中单净流入占比", type: "REAL" },
  { prop: "f275", label: "3日小单净流入", type: "REAL" },
  { prop: "f276", label: "3日小单净流入占比", type: "REAL" },

  { prop: "f109", label: "5日涨跌幅", type: "REAL" },
  { prop: "f164", label: "5日主力净流入" , type: "REAL"},
  { prop: "f165", label: "5日主力净流入占比", type: "REAL" },
  { prop: "f166", label: "5日超大单净流入", type: "REAL" },
  { prop: "f167", label: "5日超大单净占比", type: "REAL" },
  { prop: "f168", label: "5日大单净流入", type: "REAL" },
  { prop: "f169", label: "5日大单净占比", type: "REAL" },
  { prop: "f170", label: "5日中单净流入", type: "REAL" },
  { prop: "f171", label: "5日中单净流入占比", type: "REAL" },
  { prop: "f172", label: "5日小单净流入", type: "REAL", type: "REAL" },
  { prop: "f173", label: "5日小单净流入占比" },

  { prop: "f160", label: "10日涨跌幅", type: "REAL" },
  { prop: "f174", label: "10日主力净流入", type: "REAL" },
  { prop: "f175", label: "10日主力净流入占比" , type: "REAL"},
  { prop: "f176", label: "10日超大单净流入", type: "REAL" },
  { prop: "f177", label: "10日超大单净占比", type: "REAL" },
  { prop: "f178", label: "10日大单净流入", type: "REAL" },
  { prop: "f179", label: "10日大单净占比", type: "REAL" },
  { prop: "f180", label: "10日中单净流入" , type: "REAL"},
  { prop: "f181", label: "10日中单净流入占比", type: "REAL" },
  { prop: "f182", label: "10日小单净流入", type: "REAL" },
  { prop: "f183", label: "10日小单净流入占比", type: "REAL" },

  { prop: "f63", label: "集合竞价", type: "REAL" },
  { prop: "f64", label: "超大单流入" , type: "REAL"},
  { prop: "f65", label: "超大单流出", type: "REAL" },
  { prop: "f70", label: "大单流入" , type: "REAL"},
  { prop: "f71", label: "大单流出" , type: "REAL"},
  { prop: "f76", label: "中单流入", type: "REAL" },
  { prop: "f77", label: "中单流出" , type: "REAL"},
  { prop: "f82", label: "小单流入" , type: "REAL"},
  { prop: "f83", label: "小单流出" , type: "REAL"},

  { prop: "f88", label: "当日DDX", type: "REAL" },
  { prop: "f89", label: "当日DDY" , type: "REAL"},
  { prop: "f90", label: "当日DDZ", type: "REAL" },
  { prop: "f91", label: "5日DDX" , type: "REAL"},
  { prop: "f92", label: "5日DDY", type: "REAL" },
  { prop: "f94", label: "10日DDX" , type: "REAL"},
  { prop: "f95", label: "10日DDY" , type: "REAL"},
  { prop: "f97", label: "DDX飘红天数(连续)", type: "REAL" },
  { prop: "f98", label: "DDX飘红天数(5日)" , type: "REAL"},
  { prop: "f99", label: "DDX飘红天数(10日)", type: "REAL" },
  { prop: "f100", label: "行业" },
  { prop: "f101", label: "板块领涨股" },
  { prop: "f102", label: "地区板块" },
  { prop: "f103", label: "备注", filter: "strmap" },
  { prop: "f104", label: "上涨家数", type: "REAL" },
  { prop: "f105", label: "下跌家数", type: "REAL" },
  { prop: "f106", label: "平家家数", type: "REAL" },
  { prop: "f112", label: "每股收益", type: "REAL" },
  { prop: "f113", label: "每股净资产", type: "REAL" },
  { prop: "f114", label: "市盈率（静）", type: "REAL" },
  { prop: "f115", label: "市盈率（TTM）", type: "REAL" },
  { prop: "f124", label: "当前交易时间" },

  { prop: "f128", label: "板块领涨股" },
  { prop: "f129", label: "净利润", type: "REAL" },
  { prop: "f130", label: "市销率TTM", type: "REAL" },
  { prop: "f131", label: "市现率TTM", type: "REAL" },
  { prop: "f132", label: "总营业收入TTM", type: "REAL" },
  { prop: "f133", label: "股息率", type: "REAL" },
  { prop: "f134", label: "行业板块的成分股数", type: "REAL" },
  { prop: "f135", label: "净资产", type: "REAL" },
  { prop: "f138", label: "净利润TTM", type: "REAL" },
  { prop: "f221", label: "更新日期" },
];

class Region extends require("./base-query") {
  constructor(params) {
    super(params);
  }
  async getPage(params) {
    const queryParams = {
      np: 1,
      fltt: 1,
      invt: 2,
      cb: "cb",
      fs: "m:90 t:1",
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
      list: diff.filter((item) => item.f2 != "-" && item.f2!="" && item.f3 != "-" && item.f3!=''),
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
    let { code, name, klines = [] } = data;
    if(params.concatParams) {
      klines = klines.map((item)=>{
        return item + ',' + params.concatParams
      })
    }
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
      secid: `90.${params.code}`,
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
    const { pageNum, pageSize, matchKey = [], order = [], where = {},whereNot = {} } = params;
    const tableOrders = this.orderArray(order);

    let whereArr = [];
    const { andArr, orArr } = this.whereArray(where,whereNot);
    whereArr = whereArr.concat(andArr);
    whereArr = whereArr.concat(orArr);

    matchKey.push([
      literal(
        `( SELECT COUNT(*) FROM stocks WHERE f102 LIKE CONCAT('%', region.f14, '%') AND f40014 > 0 )`
      ),
      "goldenCrossCount",
    ]);
    matchKey.push([
      literal(
        `( SELECT COUNT(*) FROM stocks WHERE f102 LIKE CONCAT('%', region.f14, '%') AND f40014 <= 0 )`
      ),
      "deathCrossCount",
    ]);
    
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
  query(params) {
    const { matchKey = [], order = [], where = [] } = params;
    matchKey.push([
      literal(
        `( SELECT COUNT(*) FROM stocks WHERE f102 LIKE CONCAT('%', region.f14, '%') AND f40014 > 0 )`
      ),
      "goldenCrossCount",
    ]);
    matchKey.push([
      literal(
        `( SELECT COUNT(*) FROM stocks WHERE f102 LIKE CONCAT('%', region.f14, '%') AND f40014 <= 0 )`
      ),
      "deathCrossCount",
    ]);
    return super.query({
      matchKey,
      order,
      where,
    });
  }
}

module.exports = new Region({
  name: "region",
  template,
  chineseName: "地区",
  updateKey: "f12",
  extend: [
    ...require(RESOLVE_PATH("spider/model/kline")).extend,
    ...require(RESOLVE_PATH("spider/model/fund")).extend
  ]
});
