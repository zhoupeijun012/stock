const { sequelize } = require("./index.js");
const { DataTypes } = require("sequelize");
class BaseModel {
  constructor(name, template) {
    const modelKeys = template.map((item) => item.alias || item.prop);
    const defineModel = {};
    modelKeys.forEach((modelItem) => {
      defineModel[modelItem] = {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: "",
      };
    });

    this.pageModel = sequelize.define(name, defineModel);
    this.modelKeys = modelKeys;
  }

  async add(list) {
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

  async query() {}

  async update() {}

  async clear() {
    await this.pageModel.truncate();
  }
  async init() {
    await this.pageModel.sync({ force: true });
  }
}

module.exports = BaseModel;
