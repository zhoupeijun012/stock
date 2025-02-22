const { sequelize } = require("./model/index.js");
class FetchPage {
  constructor(pageModel, modelKeys, pageFunc) {
    this.pageModel = pageModel;
    this.modelKeys = modelKeys;
    this.pageFunc = pageFunc;
  }

  async fetchList() {
    await this.pageModel.drop();
    await this.pageModel.sync({ force: true });
    let pages = 1;
    let count = 200;
    try {
      for (let index = 1; index <= pages; index++) {
        const { list, total } = await this.pageFunc(index, count);
        await TIME_WAIT(20);
        pages = Math.ceil(total / count);
        const t = await sequelize.transaction();
        try {
          for (let stockItem of list) {
            const sqeObj = {};
            this.modelKeys.forEach((key, index) => {
              sqeObj[key] = stockItem[key];
            });
            await this.pageModel.create(sqeObj, { transaction: t });
          }
          await t.commit();
        } catch (error) {
          await t.rollback();
        }
      }
    } catch(error){
      console.log(error.message);
    }
  }

  async queryPage(params) {
    const {
      pageNum,
      pageSize,
      matchKey = [],
      orders = [],
      filters = [],
    } = params;
    const { count, rows } = await this.pageModel.findAndCountAll({
      distinct: true,
      attributes: matchKey,
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: orders,
      where: filters,
    });
    return {
      total: count,
      list: rows,
      pageNum,
      pageSize,
      pages: Math.ceil(count / pageSize),
    };
  }
}

module.exports = FetchPage;
