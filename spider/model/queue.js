const { col, Op, cast, literal } = require("sequelize");

const template = [
  { prop: "taskName", label: "任务名称" },
  { prop: "modelName", label: "模型名称" },
  { prop: "modelFunc", label: "调用方法" },
  { prop: "taskParams", label: "使用参数" },
  { prop: "taskLevel", label: "任务优先级" },
  { prop: "retryCount", label: "重试次数", default: "1" },
  { prop: "needRetry", label: "是否重试", default: "1" },
  { prop: "message", label: "错误原因" },
];

class Queue extends require("./base-query") {
  constructor(params) {
    super(params);
  }
  queryPage(params) {
    const { pageNum, pageSize, matchKey = [], order = [], where = {},whereNot = {} } = params;

    const tableOrders = this.orderArray(order);

    let whereArr = [];
    if (where["retryCount"]) {
      whereArr.push({
        retryCount: {
          [Op.lt]: where["retryCount"],
        },
      });
      delete where["retryCount"];
    }
    const { andArr, orArr } = this.whereArray(where,whereNot);
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

module.exports = new Queue({
  name: "queue",
  template,
  chineseName: "任务",
  updateKey: "uuid",
});
