const FetchPage = require("./fetch-page");
const { LimitModel } = require("./model/index.js");
const { modelKeys, template } = require("./model/limit.js");
const { col, Op, cast } = require("sequelize");

const getPage = async (index, count, date) => {
  const params = {
    cb: "cb",
    dpt: "wz.ztzt",
    Pageindex: 0,
    pagesize: count,
    sort: "fbt:asc",
    date: date,
    ut: "7eea3edcaed734bea9cbfc24409ed989",
    _: Date.now(),
  };
  const res = await HTTP.get(`https://push2ex.eastmoney.com/getTopicZTPool`, {
    params,
  });
  let data = res.data;
  data = data.slice(3, -2);
  data = JSON.parse(data).data || {};
  const { total, pool = [] } = data;
  return {
    total,
    list: pool,
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
  async fetchTodayList(dataArr) {
    let pages = 1;
    let count = 200;
    try {
      for (let index = 1; index <= pages; index++) {
        const { list, total } = await getPage(index, count);
        await TIME_WAIT(10);
        pages = Math.ceil(total / count);
        await this.saveList(list);
      }
    } catch(error){
      console.log(error.message);
    }
  }
  async fetchList() {
    await this.clear();
    const dateArr = GET_LAST_DATE(20);
    let count = 1000;
    try {
      for (let index = 0; index <= dateArr.length; index++) {
        let { list, total } = await getPage(index, count,dateArr[index]);
        await TIME_WAIT(10);

        list = list.map((item)=>{
          const obj = {};
          template.forEach((templateItem)=>{
            if(templateItem.alias) {
              obj[templateItem.alias] = getVal(item,templateItem.prop);
            } else {
              obj[templateItem.prop] = getVal(item,templateItem.prop);
            }
          })
          obj['date'] = dateArr[index]
          return obj
        })
        await this.saveList(list);
      }
    } catch(error){
      console.log(error.message);
    }
  }
}

let instance = null;
if (!instance) {
  Stock["limit"] = new Stock(LimitModel, modelKeys);
  instance = Stock["limit"];
}

exports.instance = instance;
exports.useRouter = (app) => {
  app.post("/getLimitList", async (ctx, next) => {
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
