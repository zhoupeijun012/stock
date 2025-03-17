const { sequelize } = require(RESOLVE_PATH("utils/sql.js"));
const { DataTypes } = require("sequelize");

class BaseModel {
  constructor({ name, template, chineseName = "模板", updateKey = "f12" }) {
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
    this.name = name;
    this.modelKeys = modelKeys;
    this.chineseName = chineseName;
    this.updateKey = updateKey;
  }
  async fetchList(update = false) {
    if (!update) {
      await this.clear();
    }
    try {
      const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));
      await taskQueue.push({
        taskName: `获取${this.chineseName}列表`,
        modelName: this.name,
        modelFunc: "fetchOne",
        taskParams: JSON.stringify({
          type: "list",
          updateKey: this.updateKey,
          pageNum: 1,
          pageSize: 1000,
          update,
          taskLevel: "10",
        }),
        taskLevel: "1",
      });
    } catch (error) {
      throw error;
    }
  }
  async fetchOne(params) {
    const { pageSize, pageNum, pages, total, list } = await this.getPage(
      params
    );
    if (params.update) {
      await this.update(params.updateKey, list);
    } else {
      await this.add(list);
    }
    if (params.type == "list" && params.pageNum <= 1) {
      const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));
      for (let index = pageNum + 1; index <= pages; index++) {
        await taskQueue.push({
          taskName: `获取${this.chineseName}列表`,
          modelName: this.name,
          modelFunc: "fetchOne",
          taskParams: JSON.stringify({
            updateKey: this.updateKey,
            pageNum: index,
            pageSize,
            update: params.update,
          }),
          taskLevel: params.taskLevel,
        });
      }
    }
  }
  async fetchKList(type) {
    const taskQueue = require(RESOLVE_PATH("spider/task-queue.js"));
    const { list } = await this.queryPage({
      pageNum: 1,
      pageSize: 10000,
      matchKey: ["f12", "f14"],
    });
    for (let index = 0; index <= list; index++) {
      const listItem = list[index];
      await taskQueue.push({
        taskName: `获取${listItem.f14}K线`,
        modelName: this.name,
        modelFunc: "fetchOneK",
        taskParams: JSON.stringify({
          code: listItem.f12,
          type,
        }),
        taskLevel: "100",
      });
    }
  }
  async fetchOneK(params) {
    const { f12, f14, f40001, f40002 } = await this.getKLine(params);
    const kInstance = require(RESOLVE_PATH("splider/model/kline"));
    await kInstance.delete({ f12 });
    await kInstance.add({ f12, f14, f40001, f40002 });
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
