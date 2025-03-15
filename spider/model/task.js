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

class Concept extends require("./base") {
  constructor(name, template) {
    super(name, template);
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
  useRouter(app) {
    app.post("/getTaskList", async (ctx, next) => {
      try {
        let {
          pageNum,
          pageSize,
          matchKey,
          order = [],
          where = [],
          prompt,
        } = ctx.request.body;
        if (
          !Array.isArray(matchKey) ||
          (Array.isArray(matchKey) && matchKey.length < 0)
        ) {
          matchKey = this.modelKeys;
        }
        const data = await this.queryPage({
          pageNum,
          pageSize,
          matchKey,
          order,
          where,
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
  }
}

module.exports = new Concept("Task", template);
