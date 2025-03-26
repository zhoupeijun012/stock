class BaseQuery extends require("./base") {
  constructor({ name, template, chineseName = "模板", updateKey = "f12" }) {
    super({
      name,
      template,
    });
    this.chineseName = chineseName;
    this.updateKey = updateKey;
  }
  async fetchList(update = false) {
    if (!update) {
      await this.clear();
    }
    try {
      const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));
      await taskQueue.push({
        taskName: `获取${this.chineseName}列表`,
        modelName: this.name,
        modelFunc: "fetchOne",
        taskParams: JSON.stringify({
          type: "list",
          updateKey: this.updateKey,
          pageNum: 1,
          pageSize: 1000,
          update,
          taskLevel: "10",
        }),
        taskLevel: "1",
      });
    } catch (error) {
      throw error;
    }
  }
  async fetchOne(params) {
    const { pageSize, pageNum, pages, total, list } = await this.getPage(
      params
    );
    if (params.update) {
      await this.update(params.updateKey, list);
    } else {
      await this.add(list);
    }
    if (params.type == "list" && params.pageNum <= 1) {
      const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));
      const taskList = [];
      for (let index = pageNum + 1; index <= pages; index++) {
        taskList.push({
          taskName: `获取${this.chineseName}列表`,
          modelName: this.name,
          modelFunc: "fetchOne",
          taskParams: JSON.stringify({
            updateKey: this.updateKey,
            pageNum: index,
            pageSize,
            update: params.update,
          }),
          taskLevel: params.taskLevel,
        });
      }
      await taskQueue.push(taskList);
    }
  }
  async fetchKList(type) {
    const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));
    await taskQueue.push({
      taskName: `开启K线获取`,
      modelName: this.name,
      modelFunc: "startFetchKTask",
      taskParams: JSON.stringify({
        type,
      }),
      taskLevel: "1000",
    });
  }
  async startFetchKTask(params) {
    const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));
    const { list = [] } = await this.queryPage({
      pageNum: 1,
      pageSize: 10000,
      matchKey: ["f12", "f14"],
    });

    const fetchList = list.map((listItem) => {
      return {
        taskName: `获取${listItem.f14}K线`,
        modelName: this.name,
        modelFunc: "fetchOneK",
        taskParams: JSON.stringify({
          code: listItem.f12,
          type: params.type,
        }),
        taskLevel: "10000",
      };
    });
    taskQueue.push(fetchList);
  }
  async fetchOneK(params) {
    const { f12, f14, f40001, f40002 } = await this.getKLine(params);
    const kInstance = require(RESOLVE_PATH("spider/model/kline"));
    await kInstance.delete({ f12, f40001 });
    await kInstance.add({ f12, f14, f40001, f40002 });
  }
  async fetchFundList() {
    const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));
    await taskQueue.push({
      taskName: `开启获取资金流`,
      modelName: this.name,
      modelFunc: "startFetchFundTask",
      taskParams: JSON.stringify({}),
      taskLevel: "1000",
    });
  }
  async startFetchFundTask() {
    const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));
    const { list = [] } = await this.queryPage({
      pageNum: 1,
      pageSize: 10000,
      matchKey: ["f12", "f14"],
    });

    const fetchList = list.map((listItem) => {
      return {
        taskName: `获取${listItem.f14}资金流`,
        modelName: this.name,
        modelFunc: "fetchOneFund",
        taskParams: JSON.stringify({
          code: listItem.f12,
        }),
        taskLevel: "100",
      };
    });
    taskQueue.push(fetchList);
  }
  async fetchOneFund(params) {
    const { f12, f14, f50003 } = await this.getFundPage(params);
    const kInstance = require(RESOLVE_PATH("spider/model/fund"));
    await kInstance.delete({ f12 });
    await kInstance.add({ f12, f14, f50003 });
  }
  useRouter(app) {
    const upperName = this.name.charAt(0).toUpperCase() + this.name.slice(1);

    app.post(`/get${upperName}List`, async (ctx, next) => {
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
    app.post(`/get${upperName}One`, async (ctx, next) => {
      try {
        let {
          order = [],
          where = [],
          matchKey = [],
          prompt,
        } = ctx.request.body;
        if (
          !Array.isArray(matchKey) ||
          (Array.isArray(matchKey) && matchKey.length < 0)
        ) {
          matchKey = this.modelKeys;
        }
        const data = await this.query({
          matchKey,
          order,
          where,
        });

        ctx.body = {
          success: true,
          message: "成功",
          data: {
            template: prompt ? template : [],
            data,
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

module.exports = BaseQuery;
