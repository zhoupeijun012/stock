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
    const globalConfig = await require(RESOLVE_PATH("config/index.js")).init();
    // 判断项目是否初始化过
    if (!globalConfig.get("init")) {
      const initTasks = this.tasks.filter((item) => item.type == "init");
      await this._execTask(initTasks);
      await globalConfig.set("init", true);
    }

    // 盘中任务
    const midTasks = this.tasks.filter((item) => item.type == "mid");
    cron.schedule("*/5 9-15 * * *", () => {
      this._execTask(midTasks);
    });

    // 盘中任务
    const quickTasks = this.tasks.filter((item) => item.type == "quick");
    cron.schedule("*/1 9-15 * * *", () => {
      this._execTask(quickTasks);
    });

    // 收盘结束任务
    const closeTasks = this.tasks.filter((item) => item.type == "close");
    cron.schedule("0 15 * * *", () => {
      this._execTask(closeTasks);
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
