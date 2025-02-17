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
    for (let index = 1; index <= pages; index++) {
      const { list, total } = await this.pageFunc(1, 2000);
      pages = Math.ceil(total / list.length);
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
  }

  async queryPage(pageNum, pageSize, matchKey = []) {
    const { count, rows } = await this.pageModel.findAndCountAll({
      attributes: matchKey,
      offset: (pageNum - 1) * pageNum,
      limit: pageSize,
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
