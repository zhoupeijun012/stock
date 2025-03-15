const { sequelize } = require(RESOLVE_PATH("utils/sql.js"));
const { DataTypes } = require("sequelize");
class BaseModel {
  constructor(name, template) {
    const modelKeys = template.map((item) => item.alias || item.prop);
    const defineModel = {};
    template.forEach((templateItem) => {
      defineModel[templateItem.alias || templateItem.prop] = {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: templateItem.default ? templateItem.default : "",
      };
    });

    defineModel["uuid"] = {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    };
    modelKeys.push("uuid");

    this.pageModel = sequelize.define(name, defineModel);
    this.modelKeys = modelKeys;
  }

  async add(list) {
    if (Array.isArray(list)) {
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
    } else {
      await this.pageModel.create(list);
    }
  }

  async queryPage(params) {
    const { pageNum, pageSize, matchKey = [], order = [], where = [] } = params;
    if (matchKey.length > 0) {
      matchKey.push("uuid");
    }
    const { count, rows } = await this.pageModel.findAndCountAll({
      distinct: true,
      attributes: matchKey,
      offset: (pageNum - 1) * pageSize,
      limit: pageSize,
      order: order,
      where: where,
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

  async update(uniqueKey, list) {
    if (Array.isArray(list)) {
      const t = await sequelize.transaction();
      try {
        for (let stockItem of list) {
          const sqeObj = {};
          this.modelKeys.forEach((key, index) => {
            if (stockItem[key]) {
              sqeObj[key] = stockItem[key];
            }
          });
          await this.pageModel.update(
            sqeObj,
            {
              where: {
                [uniqueKey]: sqeObj[uniqueKey],
              },
            },
            { transaction: t }
          );
        }
        await t.commit();
      } catch (error) {
        await t.rollback();
      }
    } else {
      await this.pageModel.update(list, {
        where: {
          [uniqueKey]: list[uniqueKey],
        },
      });
    }
  }

  async delete(obj) {
    await this.pageModel.destroy({
      where: obj,
    });
  }

  async clear() {
    await this.pageModel.truncate();
  }
  async init() {
    await this.pageModel.sync({ force: true });
  }
}

module.exports = BaseModel;
