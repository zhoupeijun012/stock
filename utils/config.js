const { DataTypes } = require("sequelize");
const { sequelize } = require(RESOLVE_PATH("utils/sql.js"));

const model = {
  key: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
  },
  value: {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  },
};
class Config {
  constructor() {
    this.config = {};
    this.defineModel = null;
  }
  async init() {
    this.defineModel = sequelize.define("config", model);
    await this.defineModel.sync({ force: false });
    const list = await this.defineModel.findAll();
    list.forEach((item) => {
      this.config[item.key] = item.value;
    });
    return this;
  }
  get(key) {
    return this.config[key];
  }
  async set(key, val) {
    this.config[key] = val;
    await this.defineModel.findOrCreate({
      where: { key },
      defaults: {
        value: val,
      },
    });
  }
}

module.exports = new Config();
