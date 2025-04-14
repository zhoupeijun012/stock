const { sequelize } = require(RESOLVE_PATH("utils/sql.js"));
const { DataTypes } = require("sequelize");
const { col, Op, cast, fn, literal } = require("sequelize");
class BaseModel {
  constructor({ name, template, extend = [] }) {
    const modelKeys = template.map((item) => item.alias || item.prop);
    const defineModel = {};
    [...template, ...extend].forEach((templateItem) => {
      const obj = {
        type: templateItem.type ? DataTypes[templateItem.type] : DataTypes.TEXT,
        allowNull: true,
        defaultValue: templateItem.default ? templateItem.default : "",
      };
      if (templateItem.index) {
        obj["indexes"] = [
          {
            unique: true,
            fields: [templateItem.alias || templateItem.prop],
          },
        ];
      }
      defineModel[templateItem.alias || templateItem.prop] = obj;
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
    const { matchKey = [], order = [], where = [] } = params;
    const data = await this.pageModel.findOne({
      raw: true,
      distinct: true,
      attributes: {
        include: matchKey,
      },
      order: order,
      where: where,
    });
    return data;
  }
  async queryPage(params) {
    const { pageNum, pageSize, matchKey = [], order = [], where = [] } = params;
    if (matchKey.length > 0) {
      matchKey.push("uuid");
      matchKey.push("updatedAt");
    }
    const { count, rows } = await this.pageModel.findAndCountAll({
      raw: true,
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
        item.prop,
        item.order == "ascending" ? "ASC" : "DESC",
      ];
    });
  }
  whereArray(where = {}, whereNot = {}) {
    const template = [...this.template, ...this.extend];
    const andArr = [];
    const orArr = [];

    template.forEach((templateItem) => {
      const templateKey = templateItem.alias || templateItem.prop;

      const whereItem = where[templateKey];
      const notWhereItem = whereNot[templateKey];

      const filterType = templateItem.filter || "like";

      // 处理范围筛选
      if (
        filterType == "range" &&
        ((Array.isArray(whereItem) && whereItem.length > 0) ||
          (Array.isArray(notWhereItem) && notWhereItem.length > 0))
      ) {
        if (whereItem) {
          if (whereItem.length > 1) {
            andArr.push(
              literal(`CAST(${templateKey} AS REAL) > ${whereItem[0]}`)
            );
            andArr.push(
              literal(`CAST(${templateKey} AS REAL) <= ${whereItem[1]}`)
            );
          } else {
            andArr.push(
              literal(`CAST(${templateKey} AS REAL) >= ${whereItem[0]}`)
            );
          }
        }
        if (notWhereItem) {
          if (notWhereItem.length > 1) {
            andArr.push(
              literal(`CAST(${templateKey} AS REAL) >= ${notWhereItem[0]}`)
            );
            andArr.push(
              literal(`CAST(${templateKey} AS REAL) <= ${notWhereItem[1]}`)
            );
          } else {
            andArr.push(
              literal(`CAST(${templateKey} AS REAL) >= ${notWhereItem[0]}`)
            );
          }
        }
      }

      if (
        filterType == "like" ||
        (filterType == "in" &&
          !Array.isArray(whereItem) &&
          !Array.isArray(notWhereItem))
      ) {
        const obj = {};
        if (whereItem) {
          obj[Op.like] = `%${whereItem}%`;
        }
        if (notWhereItem) {
          obj[Op.notLike] = `%${notWhereItem}%`;
        }
        if (obj[Op.like] || obj[Op.notLike]) {
          andArr.push({
            [templateKey]: obj,
          });
        }
      }

      if (
        filterType == "in" &&
        (Array.isArray(whereItem) || Array.isArray(notWhereItem))
      ) {
        const obj = {};
        if (whereItem) {
          obj[Op.in] = whereItem;
        }
        if (notWhereItem) {
          obj[Op.notIn] = notWhereItem;
        }
        if (obj[Op.in] || obj[Op.notIn]) {
          andArr.push({
            [templateKey]: obj,
          });
        }
      }

      if (filterType == "eq") {
        const obj = {};
        if (whereItem) {
          obj[Op.eq] = whereItem;
        }
        if (notWhereItem) {
          obj[Op.ne] = notWhereItem;
        }
        if (obj[Op.eq] || obj[Op.ne]) {
          andArr.push({
            [templateKey]: obj,
          });
        }
      }
      if (
        filterType == "strmap" &&
        ((Array.isArray(whereItem) && whereItem.length > 0) ||
          (Array.isArray(notWhereItem) && notWhereItem.length > 0))
      ) {
        if (whereItem) {
          const matchArr = whereItem.map((param) => {
            return {
              [templateKey]: {
                [Op.like]: `%${param}%`,
              },
            };
          });
          if (matchArr.length > 0) {
            orArr.push({
              [Op.and]: matchArr,
            });
          }
        }
        if (notWhereItem) {
          const matchArr = notWhereItem.map((param) => {
            return {
              [templateKey]: {
                [Op.notLike]: `%${param}%`,
              },
            };
          });
          if (matchArr.length > 0) {
            andArr.push({
              [Op.and]: matchArr,
            });
          }
        }
      }
    });

    return {
      andArr,
      orArr,
    };
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
            }
            // { transaction: t }
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
