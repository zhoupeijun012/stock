const start = (clear = false) => {
  // 获取今日涨停数据
  STORE.getZtToday(DAYJS(GET_LAST_OPENDAY(CONFIG.K_COUNT)).format("YYYYMMDD"),DAYJS().format("YYYYMMDD"), clear)
    .then(() => {
      WECHAT_SENG_TEXT(
        `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\n更新完毕！`
      );
    })
    .catch((error) => {
      WECHAT_SENG_TEXT(
        `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\n 错误：${error.message.slice(
          0,
          300
        )}`,
        "@all"
      );
    });
};
module.exports = {
  start,
};
