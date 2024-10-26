
const HTTP = require('../utils/http');

function getStockList() {
  return HTTP.get('/api/public/stock_zh_a_spot_em')
}
module.exports = {
  getStockList,
};
