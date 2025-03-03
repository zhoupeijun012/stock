const FetchPage = require("./fetch-page");
const { RegionModel } = require("./model/index.js");
const { modelKeys, template } = require("./model/concept.js");
const { col, Op, cast } = require("sequelize");

const getPage = async (pageNum, pageSize) => {
  const params = {
    np: 1,
    fltt: 1,
    invt: 2,
    cb: "cb",
    fs: "m:90 t:1",
    fields: modelKeys.join(","),
    fid: "f164",
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
  const { total, diff = [] } = data;
  return {
    total,
    list: diff,
  };
};

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
      filters = {},
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
      if (key == "c1") {
        whereArr.push({
          [key]: {
            [Op.eq]: filters[key],
          },
        });
      } else {
        whereArr.push({
          [key]: {
            [Op.like]: `%${filters[key]}%`,
          },
        });
      }
    }

    const where = {
      [Op.and]: whereArr,
    };
    return super.queryPage({
      pageNum,
      pageSize,
      matchKey,
      orders: tableOrders,
      filters: where,
    });
  }
  async fetchList() {
    await this.clear();
    let pages = 1;
    let count = 200;
    try {
      for (let index = 1; index <= pages; index++) {
        const { list, total } = await getPage(index, count);
        await TIME_WAIT(10);
        pages = Math.ceil(total / count);
        await this.saveList(list);
      }
    } catch (error) {
      console.log(error.message);
    }
  }
}

let instance = null;
if (!instance) {
  Stock["region"] = new Stock(RegionModel, modelKeys);
  instance = Stock["region"];
}

exports.instance = instance;
exports.useRouter = (app) => {
  app.post("/getRegionList", async (ctx, next) => {
    try {
      let {
        pageNum,
        pageSize,
        matchKey,
        orders = [],
        filters = [],
        prompt,
      } = ctx.request.body;
      if (
        !Array.isArray(matchKey) ||
        (Array.isArray(matchKey) && matchKey.length < 0)
      ) {
        matchKey = modelKeys;
      }
      const data = await instance.queryPage({
        pageNum,
        pageSize,
        matchKey,
        orders,
        filters,
      });

      ctx.body = {
        success: true,
        message: "成功",
        data: {
          template: prompt ? template : [],
          ...data,
        },
      };
    } catch (error) {
      ctx.body = {
        success: false,
        message: error.message,
        data: null,
      };
    }
  });
};
