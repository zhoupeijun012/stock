const cron = require("node-cron");
const start = require("./index").start;

const startLoop = () => {
  WECHAT_SENG_TEXT(`${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\n应用已启动`);

  let lastOpenTime = '';
  const loopSchedule = () => {
    // 当日启动过，禁止启动
    if(lastOpenTime == DAYJS().format('YYYYMMDD')) {
      return 
    }
    lastOpenTime = DAYJS().format('YYYYMMDD');
    // 接下来判断是否是工作日
    if (!IS_OPEN_DAY(DAYJS().format("YYYY-MM-DD")) && !CONFIG.OPEN_DAY ) {
      WECHAT_SENG_TEXT(
        `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\nA股今日不开盘`
      );
      return;
    }
    WECHAT_SENG_TEXT(
      `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\nA股今日开盘，机器人已启动`
    );

    // 启动爬虫
    start();
  }
  // 当日没有启动过
  if (!IN_RANGE()) {
    loopSchedule();
  }
  
  cron.schedule(CONFIG.START_TIME, loopSchedule);

};

module.exports = {
  startLoop,
};
