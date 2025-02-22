const FetchPage = require("./fetch-page");
const { EtfModel } = require("./model/index.js");
const { modelKeys } = require("./model/etf.js");
const { col, Op, cast } = require("sequelize");

class Stock extends FetchPage {
  constructor(pageModel, modelKeys, pageFunc) {
    super(pageModel, modelKeys, pageFunc);
  }
  queryPage(params) {
    const {
      pageNum,
      pageSize,
      matchKey = [],
      orders = [],
      filters = [],
    } = params;
    const tableOrders = orders.map((item) => {
      if (item.prop == "10086") {
      } else {
        return [
          cast(col(item.prop), "SIGNED"),
          item.order == "ascending" ? "ASC" : "DESC",
        ];
      }
    });
    const whereArr = [];
    for (let key of Object.keys(filters)) {
      // 股票名称
      if (key == "10086") {
      } else {
        whereArr.push({
          [key]: {
            [Op.like]: `%${filters[key]}%`,
          },
        });
      }
    }
    return super.queryPage({
      pageNum,
      pageSize,
      matchKey,
      orders: tableOrders,
      filters: whereArr,
    });
  }
}

const getPage = async (pageNum, pageSize) => {
  const params = {
    np: 1,
    fltt: 1,
    invt: 2,
    cb: "cb",
    fs: "m:0+t:6,m:0+t:80,m:1+t:2,m:1+t:23,m:0+t:81+s:2048",
    fields: modelKeys.join(","),
    fid: "f3",
    pn: pageNum,
    pz: pageSize,
    po: 1,
    dect: 1,
    ut: "fa5fd1943c7b386f172d6893dbfba10b",
    wbp2u: "|0|0|0|web",
    _: Date.now(),
  };
  const res = await HTTP.get(`https://push2.eastmoney.com/api/qt/clist/get`, {
    params,
  });
  let data = res.data;
  data = data.slice(3, -2);
  data = JSON.parse(data).data || {};
  const { total, diff } = data;
  return {
    total,
    list: diff,
  };
};

module.exports = new Stock(EtfModel, modelKeys, getPage);
