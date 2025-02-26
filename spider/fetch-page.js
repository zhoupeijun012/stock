const { sequelize } = require("./model/index.js");
class FetchPage {
  constructor(pageModel, modelKeys) {
    this.pageModel = pageModel;
    this.modelKeys = modelKeys;
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

  async saveList(list = [], clear = false) {
    if (clear) {
      await this.clear();
    } else {
      await this.pageModel.sync({ force: false });
    }
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
  async clearList() {
    await this.pageModel.drop();
    await this.pageModel.sync({ force: false });
  }
}

module.exports = FetchPage;
