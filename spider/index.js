const start = async () => {
  // 首先获取14日之前的涨停数据，东财只保存14
  const last14Day = GET_LAST_DATE(14);
  for (let date of last14Day) {
    await STORE.getZt(date, true);
    await STORE.getZb(date, true);

    /*
     * 1、计算封单信息
     * 2、炸板信息
     * 3、换手
     * 4、成交额
     * 5、以hashMap方式存储，放置于内存
     * **/
  }

  // 在这里循环调用获取涨停，炸板列表
  // setInterval(
  // async () => {
  //   try {
      // await STORE.getZt(date, false);
      // await STORE.getZb(date, false);

      /***
       * 1、合并数据
       * 2、提供炸板识别
       * 3、挂载到内存
       */

      // 获取沪深300、国证银行、微盘股、30年国债、人民币汇率、A50股指期货 数据，存储起来
      STORE.getZs('1.000001,0.399001,0.399006,0.899050,90.BK0910',true);
      
      /**
       * 1、竞价集合K线 
       * 2、接下来，循环获取 STORE.getInfo('000689',true)
       * 3、接下来，循环获取 K线，日K、周K，月K
       * 4、接下来，获取当前股票信息，计算 行业/概念，是否亏损
       * 5、合并到一个文件，保证没问题
      */
      STORE.getJJ('000689',false);
      STORE.getK('000689',false);
      STORE.getKD('000689',false);
      STORE.getKM('000689',false);
      STORE.getGn('000689',false);
      // STORE.getKD('000689',false);
      // 接下来拉取K线
    // } catch (error) {
    //   WECHAT_SENG_TEXT(
    //     `${DAYJS().format("YYYY-MM-DD HH:mm:ss")}\n获取涨停列表失败！`
    //   );
    // }
  // };
  // ,5000)

  // 在这里循环调用
};
module.exports = {
  start,
};
