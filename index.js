require("./utils/index");
const server = require(RESOLVE_PATH('server/index'));
server.start();

// setTimeout(()=>{
//     require(RESOLVE_PATH('spider/./model/stock.js')).init();
// },1000)
// if(!CONFIG.DEVELOPMENT) {
//     require(RESOLVE_PATH('spider/loop')).startLoop();
// } else {
//     require(RESOLVE_PATH('spider/index')).start();
// }

// setTimeout(()=>{
//     const jane = require(RESOLVE_PATH('model/index')).StockModel.build({ "dm":"10086","mc":"10086","zxj":"10086","zdf":"10086","zde":"10086","cjl":"10086","cje":"10086","zf":"10086","zg":"10086","zd":"10086","jk":"10086","zs":"10086","lb":"10086","hsl":"10086","syl":"10086","sjl":"10086" });
// jane.save();
// },1000)

(async ()=>{
    // 获取股票列表
    await require(RESOLVE_PATH("spider/stock")).fetchList();
    // 获取etf列表
    await require(RESOLVE_PATH("spider/etf")).fetchList();
})()
