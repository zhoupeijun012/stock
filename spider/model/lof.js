const { DataTypes } = require("sequelize");
const template = [
  { key: "f2", label: "最新价" },
  { key: "f3", label: "涨跌幅" },
  { key: "f4", label: "涨跌额" },
  { key: "f5", label: "总手" },
  { key: "f6", label: "成交额" },
  { key: "f7", label: "振幅" },
  { key: "f8", label: "换手率" },
  { key: "f9", label: "市盈率" },
  { key: "f10", label: "量比" },
  { key: "f11", label: "5分钟涨跌幅" },
  { key: "f12", label: "股票代码" },
  { key: "f13", label: "市场" },
  { key: "f14", label: "股票名称" },
  { key: "f15", label: "最高价" },
  { key: "f16", label: "最低价" },
  { key: "f17", label: "开盘价" },
  { key: "f18", label: "昨收" },
  { key: "f20", label: "总市值" },
  { key: "f21", label: "流通市值" },
  { key: "f22", label: "涨速" },
  { key: "f23", label: "市净率" },
  { key: "f24", label: "60日涨跌幅" },
  { key: "f25", label: "年初至今涨跌幅" }
];

const modelKeys = template.map((item) => item.key);
const modelLabels = template.map((item) => item.label);

exports.modelKeys = modelKeys;
exports.modelLabels = modelLabels;
exports.template = template;

const defineModel = {};
modelKeys.forEach((modelItem) => {
  defineModel[modelItem] = {
    type: DataTypes.STRING,
    allowNull: true,
    defaultValue: "",
  };
});
exports.defineModel = defineModel;
