const cron = require("node-cron");
const start = require("./store").start;

const startLoop = () => {
  WECHAT_SENG_TEXT(`${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\n应用已启动`);

  cron.schedule(CONFIG.START_TIME, () => {
    // 接下来判断是否是工作日
    if (!IS_OPEN_DAY(DAYJS().format("YYYY-MM-DD"))) {
      WECHAT_SENG_TEXT(
        `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\nA股今日不开盘`,
        "@all"
      );
      return;
    }
    WECHAT_SENG_TEXT(
      `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\nA股今日开盘，机器人已启动`,
      "@all"
    );

    // 第一次启动爬虫
    start(true);

    // 循环获取数据
    cron.schedule(CONFIG.LOOP_TIME, () => {
      start();
    });
  });
};

module.exports = {
  startLoop,
};
