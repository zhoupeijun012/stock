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
    // 判断项目是否初始化过
    if (!globalConfig.get("init")) {
      const initTasks = this.tasks.filter((item) => item.type == "init");
      await this._execTask(initTasks);
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
      } else {
        WECHAT_SENG_TEXT(
          `${DAYJS().format("YYYY-MM-DD")}\nA股今日不开盘`
        ).catch((error) => {
          console.log(error.message);
        });
      }
    });

    // 盘中任务
    const midTasks = this.tasks.filter((item) => item.type == "mid");
    cron.schedule("*/5 9-15 * * *", () => {
      if (IS_OPEN_DAY(DAYJS().format("YYYY-MM-DD")) && IN_OPEN_TIME()) {
        this._execTask(midTasks);
      } else {
        console.log('当前非开盘时间');
      }
    });

    // 盘中快速任务
    const quickTasks = this.tasks.filter((item) => item.type == "quick");
    cron.schedule("*/1 9-15 * * *", () => {
      if (IS_OPEN_DAY(DAYJS().format("YYYY-MM-DD")) && IN_OPEN_TIME()) {
        this._execTask(quickTasks);
      }else {
        console.log('当前非开盘时间');
      }
    });

    // 收盘结束任务
    const closeTasks = this.tasks.filter((item) => item.type == "close");
    cron.schedule("0 15 * * *", () => {
      if (IS_OPEN_DAY(DAYJS().format("YYYY-MM-DD"))) {
        this._execTask(closeTasks);
      } else {
        console.log('今日不开盘');
      }
    });
  }

  async _execTask(tasks) {
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
