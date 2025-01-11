class Store {
  constructor() {
    this.initCache();
  }
  initCache() {
    this.state = {};

    // 涨停列表
    PACKAGE_CREATE(`/${CONFIG.ZT_CACHE}`);
    this.state[CONFIG.ZT_CACHE] = {};

    // 涨停列表近20日数据
    PACKAGE_CREATE(`/${CONFIG.HISTORY}`);
    this.state[CONFIG.HISTORY] = {};

    // 股票信息
    PACKAGE_CREATE(`/${CONFIG.INFO}`);
    this.state[CONFIG.INFO] = {};
  }
  async clearCache() {
    // 清空涨停列表
    await PACKAGE_CLEAR(`/${CONFIG.ZT_CACHE}`);
    // 清空历史数据
    await PACKAGE_CLEAR(`/${CONFIG.HISTORY}`);

    this.initCache();
  }
  // 获取数据
  async getData(pack, key, requestPromise) {
    if (this.state[pack][key]) {
      return this.state[pack][key];
    }
    const path = `/${pack}/${key}.json`;
    if (FILE_EXISTS(path)) {
      this.state[pack][key] = await FILE_READ(path);
      return this.state[pack][key];
    }
    const res = await requestPromise;
    await FILE_CACHE(path, JSON.stringify(res.data));

    this.state[pack][key] = res.data;
    return this.state[pack][key];
  }
  // 获取涨停
  async getZT(date) {
    const returnData = await this.getData(
      CONFIG.ZT_CACHE,
      date,
      HTTP.get("/api/public/stock_zt_pool_em", {
        params: {
          date,
        },
      })
    );
    return returnData;
  }
  // 获取涨停近20日数据
  async getStockHistory(code, startDate, endDate) {
    const returnData = await this.getData(
      CONFIG.HISTORY,
      code,
      HTTP.get("/api/public/stock_zh_a_hist", {
        params: {
          symbol: code,
          period: "daily",
          start_date: startDate,
          end_date: endDate,
          adjust: "hfq",
        },
      })
    );
    return returnData;
  }
  // 获取股票信息
  async getStockInfo(code) {
    const returnData = await this.getData(
      CONFIG.INFO,
      code,
      HTTP.get("/api/public/stock_individual_info_em", {
        params: {
          symbol: code,
        },
      })
    );
    return returnData;
  }
  // 获取所有涨停股票的K线
  async getZtToday(startDate, endDate, clear) {
    if (clear) {
      await this.clearCache();
    }

    // 获取涨停数据
    const ztData = await this.getZT(DAYJS().format("YYYYMMDD"));
    // 循环获取涨停数据历史数据列表
    for (let index = 0; index < ztData.length; index++) {
      // 获取涨停历史
      const stockCode = ztData[index]["代码"];
      // 获取涨停股票信息,为啥先获取？因为新股上市，时间范围内可能没信息，报错
      try {
        await this.getStockInfo(stockCode);
        await this.getStockHistory(stockCode, startDate, endDate);
      } catch (error) {
        // console.log(error);
      }
    }
  }
}
global.STORE = new Store();
