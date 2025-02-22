const { DataTypes } = require("sequelize");
const template = [
  { prop: "f2", label: "最新价" },
  { prop: "f3", label: "涨跌幅" },
  { prop: "f4", label: "涨跌额" },
  { prop: "f5", label: "总手" },
  { prop: "f6", label: "成交额" },
  { prop: "f7", label: "振幅" },
  { prop: "f8", label: "换手率" },
  { prop: "f9", label: "市盈率" },
  { prop: "f10", label: "量比" },
  { prop: "f11", label: "5分钟涨跌幅" },
  { prop: "f12", label: "股票代码" },
  { prop: "f13", label: "市场" },
  { prop: "f14", label: "股票名称" },
  { prop: "f15", label: "最高价" },
  { prop: "f16", label: "最低价" },
  { prop: "f17", label: "开盘价" },
  { prop: "f18", label: "昨收" },
  { prop: "f20", label: "总市值" },
  { prop: "f21", label: "流通市值" },
  { prop: "f22", label: "涨速" },
  { prop: "f23", label: "市净率" },
  { prop: "f24", label: "60日涨跌幅" },
  { prop: "f25", label: "年初至今涨跌幅" },
  { prop: "c1", label: "交易类型" },
];

const modelKeys = template.map((item) => item.prop);
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
