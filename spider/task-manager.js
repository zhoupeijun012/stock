const cron = require("node-cron");
class TaskManager {
  constructor() {
    this.tasks = [];
  }
  register(task) {
    this.tasks.push(task);
  }
  async start() {
    // 获取全局数据
    const globalConfig = await require(RESOLVE_PATH("utils/config.js")).init();

    await this._execTask("config");

    // 判断项目是否初始化过
    if (!globalConfig.get("init")) {
      await this._execTask("init");
      await globalConfig.set("init", "1");
    }

    // 盘前任务
    cron.schedule("0 9 * * *", () => {
      if (IS_OPEN_DAY(DAYJS().format("YYYY-MM-DD"))) {
        WECHAT_SENG_TEXT(`${DAYJS().format("YYYY-MM-DD")}\nA股今日开盘`).catch(
          (error) => {
            console.log(error.message);
          }
        );
        require(RESOLVE_PATH("spider/task-queue.js")).init();
      } else {
        WECHAT_SENG_TEXT(
          `${DAYJS().format("YYYY-MM-DD")}\nA股今日不开盘`
        ).catch((error) => {
          console.log(error.message);
        });
      }
    });

    // // 盘中任务
    // cron.schedule("*/5 9-15 * * *", () => {
    //   if (IS_OPEN_DAY(DAYJS().format("YYYY-MM-DD")) && IN_OPEN_TIME()) {
    //     this._execTask("mid");
    //   } else {
    //     console.log("当前非开盘时间");
    //   }
    // });

      // 盘中任务
      cron.schedule("1 1-15 * * *", () => {
        this._execTask("mid");
      });

    // 盘中快速任务
    cron.schedule("*/1 9-15 * * *", () => {
      if (IS_OPEN_DAY(DAYJS().format("YYYY-MM-DD")) && IN_OPEN_TIME()) {
        this._execTask("quick");
      } else {
        console.log("当前非开盘时间");
      }
    });

    // 收盘结束任务
    cron.schedule("0 17 * * *", () => {
      if (IS_OPEN_DAY(DAYJS().format("YYYY-MM-DD"))) {
        this._execTask("close");
      } else {
        console.log("今日不开盘");
      }
    });
  }

  async _execTask(taskType) {
    const tasks = this.tasks.filter((item) => item.type == taskType);

    const asyncTasks = tasks.filter((item) => item.async);
    for (let i = 0; i < asyncTasks.length; i++) {
      asyncTasks[i].func();
    }

    const syncTasks = tasks.filter((item) => !item.async);
    for (let i = 0; i < syncTasks.length; i++) {
      await syncTasks[i].func();
    }
  }
}

module.exports = new TaskManager();
