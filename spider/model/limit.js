const { col, Op, cast } = require("sequelize");
const StockModel = require(RESOLVE_PATH("spider/model/stock.js"));
const template = [
  { prop: "n", alias: "f14", label: "股票名称" },
  { prop: "c", alias: "f12", label: "股票代码" },
  { prop: "p", alias: "f2", label: "最新价" },
  { prop: "zdp", alias: "f3", label: "涨跌幅" },
  { prop: "ltsz", alias: "f21", label: "流通市值" },
  { prop: "tshare", alias: "f20", label: "总市值" },
  { prop: "hs", alias: "f8", label: "换手率" },
  { prop: "fund", alias: "f10001", label: "封板资金" },
  { prop: "fbt", alias: "f10002", label: "首次封板时间" },
  { prop: "lbt", alias: "f10003", label: "最后封板时间" },
  { prop: "zbc", alias: "f10004", label: "炸板次数" },
  { prop: "lbc", alias: "f10005", label: "连板数" },
  { prop: "hybk", alias: "f100", label: "所属行业" },
  { prop: "zttj.days", alias: "f10006", label: "涨停区间" },
  { prop: "zttj.ct", alias: "f10007", label: "区间涨停次数" },
  { prop: "date", label: "日期", filter: "eq" },
];

class Limit extends require("./base-query") {
  constructor(params) {
    super(params);
  }
  async getPage(params) {
    const queryParams = {
      cb: "cb",
      dpt: "wz.ztzt",
      Pageindex: 0,
      pagesize: params.pageSize,
      sort: "fbt:asc",
      date: params.date,
      ut: "7eea3edcaed734bea9cbfc24409ed989",
      _: Date.now(),
    };
    const res = await HTTP.get(`https://push2ex.eastmoney.com/getTopicZTPool`, {
      params: queryParams,
    });
    let data = res.data;
    data = data.slice(3, -2);
    data = JSON.parse(data).data || {};
    let { pool = [] } = data;

    pool = pool.map((item) => {
      const obj = {};
      template.forEach((templateItem) => {
        if (templateItem.alias) {
          obj[templateItem.alias] = GET_VAL(item, templateItem.prop);
        } else {
          obj[templateItem.prop] = GET_VAL(item, templateItem.prop);
        }
      });
      obj["date"] = params.date;
      return obj;
    });
    return pool;
  }
  async fetchList() {
    const dateArr = GET_LAST_DATE(20);
    try {
      const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));
      for (let index = 0; index < dateArr.length; index++) {
        await taskQueue.push({
          taskName: `获取${this.chineseName}列表`,
          modelName: this.name,
          modelFunc: "fetchOne",
          taskParams: JSON.stringify({
            pageNum: 1,
            pageSize: 1000,
            date: dateArr[index],
          }),
          taskLevel: "10",
        });
      }
    } catch (error) {
      throw error;
    }
  }
  async fetchTodayList() {
    if (!IS_OPEN_DAY(DAYJS().format("YYYY-MM-DD"))) {
      return "";
    }

    const currentDay = DAYJS().format("YYYYMMDD");

    try {
      const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));
      await taskQueue.push({
        taskName: "获取今日涨停列表",
        modelName: "limit",
        modelFunc: "fetchOne",
        needRetry: "0",
        taskParams: JSON.stringify({
          pageNum: 0,
          pageSize: 1000,
          date: currentDay,
        }),
        taskLevel: "1",
      });
    } catch (error) {
      throw error;
    }
  }
  async fetchOne(params) {
    const pool = await this.getPage(params);
    await this.delete({
      date: params.date,
    });
    await this.add(pool);
  }
  async queryPage(params) {
    const { pageNum, pageSize, matchKey = [], order = [], where = {} } = params;
    const tableOrders = this.orderArray(order);

    let whereArr = [];
    whereArr = whereArr.concat(this.whereArray(where));

    const whereMap = {
      [Op.and]: whereArr,
    };

    const limitMaths = matchKey.filter(
      (keyItem) => this.modelKeys.includes(keyItem)
    );
    const { total, list, pages } = await super.queryPage({
      pageNum,
      pageSize,
      matchKey: limitMaths,
      order: tableOrders,
      where: whereMap,
    });

    const stockIds = list.map((item) => item.f12);
    const stockMatchs = matchKey.filter(
      (keyItem) => !this.modelKeys.includes(keyItem)
    );

    const stockList = (
      await StockModel.queryPage({
        pageNum: 1,
        pageSize: 10000,
        matchKey: stockMatchs,
        where: {
          f12: stockIds,
        },
      })
    ).list;

    const f12Map = {};
    list.forEach((stockItem) => {
      f12Map[stockItem.f12] = stockItem;
    });

    stockList.forEach((indexItem) => {
      if (f12Map[indexItem["f12"]]) {
        Object.assign(f12Map[indexItem["f12"]],indexItem);
      }
    });

    return {
      total,
      list,
      pageNum,
      pageSize,
      pages,
    };
  }
}

module.exports = new Limit({
  name: "limit",
  template,
  chineseName: "涨停",
  updateKey: "f12",
});
