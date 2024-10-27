
const HTTP = require('../utils/http');
const DAYJS = require('dayjs');
function getStockList() {
  return HTTP.get('/api/public/stock_zh_a_spot_em')
}

function getStockHistory(symbol) {
  const endDate = DAYJS().format('YYYYMMDD');
  return HTTP.get(`/api/public/stock_zh_a_hist?period=daily&symbol=${symbol}&start_date=20150101&end_date=${endDate}&adjust=hfq`)
}
module.exports = {
  getStockList,
  getStockHistory
};
