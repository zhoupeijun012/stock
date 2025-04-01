const { sequelize } = require(RESOLVE_PATH("utils/sql.js"));
const { DataTypes } = require("sequelize");
const { col, Op, cast, fn, literal } = require("sequelize");
class BaseModel {
  constructor({ name, template, extend = [] }) {
    const modelKeys = template.map((item) => item.alias || item.prop);
    const defineModel = {};
    [...template, ...extend].forEach((templateItem) => {
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
    this.name = name;
    this.modelKeys = modelKeys;
    this.template = template;
    this.extend = extend;
  }
  async query(params) {
    const { where = [] } = params;
    const data = await this.pageModel.findOne({ where });
    return data;
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
  orderArray(order = []) {
    return order.map((item) => {
      return [
        cast(col(item.prop), "SIGNED"),
        item.order == "ascending" ? "ASC" : "DESC",
      ];
    });
  }
  whereArray(where = []) {
    const template = [...this.template, ...this.extend];
    const whereArr = [];
    for (let key of Object.keys(where)) {
      const findObj = template.find((item) => item.prop == key);
      if (findObj) {
        const filterType = findObj.filter || "like";

        // 处理范围筛选
        if (filterType == "range" && where[key].length > 0) {
          if (where[key].length > 1) {
            whereArr.push(
              literal(`CAST(${key} AS INTEGER) >= ${where[key][0]}`)
            );
            whereArr.push(
              literal(`CAST(${key} AS INTEGER) <= ${where[key][1]}`)
            );
          } else {
            whereArr.push(
              literal(`CAST(${key} AS INTEGER) >= ${where[key][0]}`)
            );
          }
        }

        // 处理模糊筛选
        if (filterType == "like") {
          whereArr.push({
            [key]: {
              [Op.like]: `%${where[key]}%`,
            },
          });
        }

        if (filterType == "eq") {
          whereArr.push({
            [key]: {
              [Op.eq]: where[key],
            },
          });
        }
      }
    }

    return whereArr;
  }
  async add(list) {
    if (Array.isArray(list)) {
      const listArr = [];
      for (let stockItem of list) {
        const sqeObj = {};
        this.modelKeys.forEach((key, index) => {
          sqeObj[key] = stockItem[key];
        });
        listArr.push(sqeObj);
      }
      await this.pageModel.bulkCreate(listArr);
    } else {
      await this.pageModel.create(list);
    }
  }
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
