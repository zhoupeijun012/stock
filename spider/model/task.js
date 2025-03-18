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

class Task extends require("./base-query") {
  constructor(params) {
    super(params);
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
      if (key == "retryCount") {
        whereArr.push({
          [key]: {
            [Op.lt]: where[key],
          },
        });
      } else {
        whereArr.push({
          [key]: {
            [Op.like]: `%${where[key]}%`,
          },
        });
      }
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

module.exports = new Task({
  name: "task",
  template,
  chineseName: "任务",
  updateKey: "uuid",
});
