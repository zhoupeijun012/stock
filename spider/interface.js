const { fetchEventData } = require("fetch-sse");
class Interface {
  constructor() {}
  async getZt(date) {
    const res = await HTTP.get(
      `https://push2ex.eastmoney.com/getTopicZTPool?cb=cb&ut=7eea3edcaed734bea9cbfc24409ed989&dpt=wz.ztzt&Pageindex=0&pagesize=20&sort=fbt%3Aasc&date=${date}&_=1736816412391`
    );
    let data = res.data;
    data = data.slice(3, -2);
    data = JSON.parse(data);
    data = data.data.pool || [];
    return data;
  }
  async getZb(date) {
    const res = await HTTP.get(
      `https://push2ex.eastmoney.com/getTopicZBPool?cb=cb&ut=7eea3edcaed734bea9cbfc24409ed989&dpt=wz.ztzt&Pageindex=0&pagesize=20&sort=fbt%3Aasc&date=${date}&_=1736816412395`
    );
    let data = res.data;
    data = data.slice(3, -2);
    data = JSON.parse(data);
    data = data.data.pool || [];
    return data;
  }
  async getJJ(stockCode) {
    const ctrl = new AbortController();
    const p = await new Promise((resolve, reject) => {
      fetchEventData(
        `https://20.push2.eastmoney.com/api/qt/stock/trends2/sse?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f17&fields2=f51,f52,f53,f54,f55,f56,f57,f58&mpi=1000&ut=fa5fd1943c7b386f172d6893dbfba10b&secid=0.${stockCode}&ndays=1&iscr=1&iscca=0&wbp2u=1849325530509956|0|1|0|web`,
        {
          signal: ctrl.signal,
          headers: {
            "Content-Type": "application/json",
          },
          onMessage: (event) => {
            resolve(event);
            ctrl.abort();
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
    return JSON.parse(p.data).data;
  }
  async getK(stockCode) {
    const ctrl = new AbortController();
    const p = await new Promise((resolve, reject) => {
      fetchEventData(`https://95.push2.eastmoney.com/api/qt/stock/trends2/sse?fields1=f1,f2,f3,f4,f5,f6,f7,f8,f9,f10,f11,f12,f13,f14,f17&fields2=f51,f52,f53,f54,f55,f56,f57,f58&mpi=1000&ut=fa5fd1943c7b386f172d6893dbfba10b&secid=0.${stockCode}&ndays=1&iscr=0&iscca=0&wbp2u=1849325530509956|0|1|0|web`,
        {
          signal: ctrl.signal,
          headers: {
            "Content-Type": "application/json",
          },
          onMessage: (event) => {
            resolve(event);
            ctrl.abort();
          },
          onError: (error) => {
            reject(error);
          },
        }
      );
    });
    return JSON.parse(p.data).data;
  }
  async getKD(stockCode,endDate) {
    const res = await HTTP.get(
      `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=0.${stockCode}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61&klt=101&fqt=1&end=${endDate}&lmt=210&cb=cb`
    );
    let data = res.data;
    data = data.slice(3, -2);
    data = JSON.parse(data);
    data = data.data || {};
    return data;
  } 
  async getKM(stockCode,endDate) {
    const res = await HTTP.get(
      `https://push2his.eastmoney.com/api/qt/stock/kline/get?secid=0.${stockCode}&ut=fa5fd1943c7b386f172d6893dbfba10b&fields1=f1%2Cf2%2Cf3%2Cf4%2Cf5%2Cf6&fields2=f51%2Cf52%2Cf53%2Cf54%2Cf55%2Cf56%2Cf57%2Cf58%2Cf59%2Cf60%2Cf61&klt=102&fqt=1&end=${endDate}&lmt=210&cb=cb`
    );
    let data = res.data;
    data = data.slice(3, -2);
    data = JSON.parse(data);
    data = data.data || {};
    return data;
  } 
  async getInfo(stockCode) {
    const res = await HTTP.get(
      `https://push2ex.eastmoney.com/getTopicZBPool?cb=cb&ut=7eea3edcaed734bea9cbfc24409ed989&dpt=wz.ztzt&Pageindex=0&pagesize=20&sort=fbt%3Aasc&date=${date}&_=1736816412395`
    );
    let data = res.data;
    data = data.slice(3, -2);
    data = JSON.parse(data);
    data = data.data.pool || [];
    return data;
  }
  async getZs(stockCode) {
    const res = await HTTP.get(
      `https://push2.eastmoney.com/api/qt/ulist/get?fltt=1&invt=2&cb=cb&fields=f12%2Cf13%2Cf14%2Cf1%2Cf2%2Cf4%2Cf3%2Cf152&secids=${stockCode}&ut=fa5fd1943c7b386f172d6893dbfba10b&pn=1&np=1&pz=20&dect=1&wbp2u=%7C0%7C0%7C0%7Cweb&_=1737381879985`
    );
    let data = res.data;
    data = data.slice(3, -2);
    data = JSON.parse(data);
    data = data.data.diff || [];
    return data;
  }
  async getGn(stockCode) {
    stockCode = '002209.SZ'
    const res = await HTTP.get(
      `https://datacenter.eastmoney.com/securities/api/data/v1/get?reportName=RPT_F10_CORETHEME_BOARDTYPE&columns=SECUCODE%2CSECURITY_CODE%2CSECURITY_NAME_ABBR%2CNEW_BOARD_CODE%2CBOARD_NAME%2CSELECTED_BOARD_REASON%2CIS_PRECISE%2CBOARD_RANK%2CBOARD_YIELD%2CDERIVE_BOARD_CODE&quoteColumns=f3~05~NEW_BOARD_CODE~BOARD_YIELD&filter=(SECUCODE%3D%22${stockCode}%22)(IS_PRECISE%3D%221%22)&pageNumber=1&pageSize=&sortTypes=1&sortColumns=BOARD_RANK&source=HSF10&client=PC&v=011088872515423231`
    );
    let data = res.data;
    data = data.result;
    data = data.data || [];
    return data;
  }
}

module.exports = new Interface();
