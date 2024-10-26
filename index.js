// const STOCK = require('./utils/stock');
const data = require('./a.js');
const TABLE = require('./utils/table');
TABLE.dropTable('stock').then(()=>{
    TABLE.createTable('stock',data[0]).then(()=>{
        TABLE.insertTable('stock',data)
    });
});

// STOCK.getStockList().then((res)=>{
//     console.log(res);
// }).catch((error)=>{
//     console.log(error);
// });