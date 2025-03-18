const { col, Op, cast } = require("sequelize");

const template = [
  { prop: "f2", label: "最新价" },
  { prop: "f3", label: "涨跌幅" },
  { prop: "f4", label: "涨跌额" },
  { prop: "f6", label: "成交额" },
  { prop: "f7", label: "振幅" },
  { prop: "f8", label: "换手率" },
  { prop: "f11", label: "5分钟涨跌幅" },
  { prop: "f12", label: "股票代码" },
  { prop: "f13", label: "市场" },
  { prop: "f14", label: "股票名称" },
];

class Np extends require("./base-query") {
  constructor(params) {
    super(params);
  }
  async getPage(params) {
    const queryParams = {
      ut: "6d2ffaa6a585d612eda28417681d58fb",
      fields: template.map((item) => item.prop).join(","),
      // ,,1.,CN0Y,USDCNH
      secids: "1.000001,0.399001,0.399006,1.000300,0.899050,0.399303,1.511090",
      cb: "cb",
      _: Date.now(),
    };
    const res = await HTTP.get(
      `https://push2.eastmoney.com/api/qt/ulist.np/get`,
      {
        params: queryParams,
      }
    );
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
      whereArr.push({
        [key]: {
          [Op.like]: `%${where[key]}%`,
        },
      });
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

module.exports = new Np({
  name: "np",
  template,
  chineseName: "指数",
  updateKey: "f12",
});
