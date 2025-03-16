const taskInstance = require(RESOLVE_PATH("spider/model/task.js"));
let excuting = false;
class TaskQueue {
  constructor() {
    this.modelList = {};
    this.asyncCount = 2;
  }
  async init() {
    // 初始化任务列表数据库
    await taskInstance.init();
  }
  registerModel(modelName, model) {
    this.modelList[modelName] = model;
  }
  async push(taskInfo) {
    await taskInstance.add(taskInfo);
    this._execTask();
  }

  async _execTask() {
    if (excuting) {
      return;
    }
    excuting = true;

    const data = await taskInstance.queryPage({
      pageNum: 1,
      pageSize: this.asyncCount,
      matchKey: [
        "taskName",
        "modelName",
        "modelFunc",
        "taskParams",
        "taskLevel",
        "retryCount",
        "message",
        "needRetry",
      ],
      order: [{ order: "ascending", prop: "taskLevel" }],
      where: {
        retryCount: 3,
      },
    });

    const { list, total } = data;
    const promiseArr = [];
    const promiseResult = [];
    for (let index = 0; index < list.length; index++) {
      const taskItem = list[index];
      const modelItem = this.modelList[taskItem.modelName];
      if (modelItem) {
        const taskParams = JSON.parse(taskItem["taskParams"]);
        const promise = modelItem[taskItem["modelFunc"]](taskParams);
        promiseArr.push(promise);
        promise
          .then(() => {
            promiseResult.push({
              success: true,
              uuid: taskItem.uuid,
            });
          })
          .catch((error) => {
            promiseResult.push({
              success: false,
              uuid: taskItem.uuid,
              needRetry: taskItem.needRetry,
              retryCount: parseInt(taskItem.retryCount) + 1 + "",
              message: error.message,
            });
          });
      }
    }

    try {
      await Promise.allSettled(promiseArr);
    } catch (error) {
      console.log(error.message);
    }

    // 在这里删除所有成功的的数据
    const deleteList = promiseResult.filter(
      (item) => item.success || item.needRetry == "0"
    );
    const failList = promiseResult.filter(
      (item) => !item.success && item.needRetry == "1"
    );
    failList.forEach((item) => {
      delete item.success;
    });

    await taskInstance.delete({
      uuid: deleteList.map((item) => item.uuid),
    });

    // 在这里给所有的错误的数据 + 1
    await taskInstance.update("uuid", failList);

    if (total > 0) {
      await TIME_WAIT(200);
      excuting = false;
      this._execTask();
    } else {
      excuting = false;
    }
  }
  async taskRetry(uuid) {
    let updateList = [];
    if (Array.isArray(uuid)) {
      updateList = uuid.map((item) => {
        return {
          uuid: item,
          retryCount: 1,
        };
      });
    } else {
      updateList.push({
        uuid,
        retryCount: 1,
      });
    }
    await taskInstance.update("uuid", updateList);
    this._execTask();
  }
  useRouter(app) {
    app.post("/taskRetry", async (ctx, next) => {
      try {
        let { uuid } = ctx.request.body;

        await this.taskRetry(uuid);

        ctx.body = {
          success: true,
          message: "成功",
          data: 1,
        };
      } catch (error) {
        ctx.body = {
          success: false,
          message: error.message,
          data: 0,
        };
      }
    });
  }
}

module.exports = new TaskQueue();
