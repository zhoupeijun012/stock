const start = (clear = false) => {
  const startTime = DAYJS().format("YYYY-MM-DD HH:mm:ss");
  // 获取今日涨停数据
  STORE.getZtToday(DAYJS(GET_LAST_OPENDAY(CONFIG.K_COUNT)).format("YYYYMMDD"),DAYJS().format("YYYYMMDD"), clear)
    .then(() => {
      WECHAT_SENG_TEXT(
        `开始时间:${startTime}\n结束时间:${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\n更新完毕！`
      );
      HTTP_CACHE.setLastUpdate();
      HTTP_CACHE.setZT();
    })
    .catch((error) => {
      WECHAT_SENG_TEXT(
        `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\n 错误：${error.message.slice(
          0,
          300
        )}`
      );
    });
};
module.exports = {
  start,
};
