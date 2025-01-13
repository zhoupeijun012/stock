class Store {
  constructor() {
    this.initCache();
  }
  initCache() {
    this.state = {};

    // 涨停列表
    PACKAGE_CREATE(`/${CONFIG.ZT_CACHE}`);
    this.set(CONFIG.ZT_CACHE,{})

    // 炸板列表
    PACKAGE_CREATE(`/${CONFIG.ZB_CACHE}`);
    this.set(CONFIG.ZB_CACHE,{})

    // 涨停列表近20日数据
    PACKAGE_CREATE(`/${CONFIG.HISTORY}`);
    this.set(CONFIG.HISTORY,{})

    // 股票信息
    PACKAGE_CREATE(`/${CONFIG.INFO}`);
    this.set(CONFIG.INFO,{})
  }
  async clearCache() {
    // 清空涨停列表
    await PACKAGE_CLEAR(`/${CONFIG.ZT_CACHE}`);
    // 清空炸板列表
    await PACKAGE_CLEAR(`/${CONFIG.ZB_CACHE}`);
    // 清空历史数据
    await PACKAGE_CLEAR(`/${CONFIG.HISTORY}`);

    this.initCache();
  }
  set(key,value,path) {
    if(path) {
      this.state[path][key] = value;
    }else {
      this.state[key] = value;
    }
  }
  get(key,path) {
    if(path) {
      return this.state[path][key];
    }else {
      return this.state[key];
    }
  }
  // 获取数据
  async getData(pack, key, requestFunc,readCache=true) {
    if (readCache && this.get(key,pack)) {
      return this.get(key,pack);
    }
    const path = `/${pack}/${key}.json`;
    if (readCache && FILE_EXISTS(path)) {
      const readData = await FILE_READ(path);
      this.set(key,readData,pack)
      return this.get(key,pack);
    }
    const res = await requestFunc()
    await FILE_CACHE(path, JSON.stringify(res.data));

    this.set(key,res.data,pack)
    return this.get(key,pack);
  }
  // 获取涨停
  async getZT(date) {
    const returnData = await this.getData(CONFIG.ZT_CACHE, date, () => {
      return HTTP.get("/api/public/stock_zt_pool_em", {
        params: {
          date,
        },
      }).catch((error)=>{
        WECHAT_SENG_TEXT(
          `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\n获取${date}涨停数据失败\n${
            error.message.slice(0,300)
          }`
        );
      })
    },false);
    return returnData;
  }
  // 获取炸板
  async getZB(date) {
    const returnData = await this.getData(CONFIG.ZB_CACHE, date, () => {
      return HTTP.get("/api/public/stock_zt_pool_zbgc_em", {
        params: {
          date,
        },
      }).catch((error)=>{
        WECHAT_SENG_TEXT(
          `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\n获取${date}炸板数据失败\n${
            error.message.slice(0,300)
          }`
        );
      })
    },false);
    return returnData;
  }
  // 获取涨停近20日数据
  async getStockHistory(code, startDate, endDate) {
    const returnData = await this.getData(CONFIG.HISTORY, code, () => {
      return HTTP.get("/api/public/stock_zh_a_hist", {
        params: {
          symbol: code,
          period: "daily",
          start_date: startDate,
          end_date: endDate,
          adjust: "hfq",
        },
      }).catch((error)=>{
        WECHAT_SENG_TEXT(
          `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\n获取${code}${CONFIG.K_COUNT}日K线数据失败\n${
            error.message.slice(0,300)
          }`
        );
      });
    });
    return returnData;
  }
  // 获取股票信息
  async getStockInfo(code) {
    const returnData = await this.getData(CONFIG.INFO, code, () => {
      return HTTP.get("/api/public/stock_individual_info_em", {
        params: {
          symbol: code,
        },
      }).catch((error)=>{
        WECHAT_SENG_TEXT(
          `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\n获取${code}股票信息失败\n${
            error.message.slice(0,300)
          }`
        );
      })
    });
    return returnData;
  }
  // 获取所有涨停股票的K线
  async getZtToday(startDate, endDate, clear) {
    if (clear) {
      await this.clearCache();
    }

    // 获取涨停数据
    const ztData = await this.getZT(DAYJS().format("YYYYMMDD"));
    // 获取炸板数据
    const zbData = await this.getZB(DAYJS().format("YYYYMMDD"));
    const allData = [...ztData,...zbData];
    // 循环获取涨停数据历史数据列表
    for (let index = 0; index < allData.length; index++) {
      // 获取涨停历史
      const stockCode = allData[index]["代码"];
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
