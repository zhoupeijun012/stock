const { DataTypes } = require("sequelize");
const template = [
  { prop: "n", alias: "f14", label: "股票名称" },
  { prop: "c", alias: "f12", label: "股票代码" },
  { prop: "p", alias: "f2", label: "最新价" },
  { prop: "zdp", alias: "f3", label: "涨跌幅" },
  { prop: "ltsz", alias: "f21", label: "流通市值" },
  { prop: "tshare", alias: "f20", label: "总市值" },
  { prop: "hs", alias: "f8", label: "换手率" },
  { prop: "fund", alias: "f10001", label: "封板资金" },
  { prop: "fbt", alias: "f10002", label: "首次封板时间" },
  { prop: "lbt", alias: "f10003", label: "最后封板时间" },
  { prop: "zbc", alias: "f10004", label: "炸板次数" },
  { prop: "lbc", alias: "f10005", label: "连板数" },
  { prop: "hybk", alias: "f100", label: "所属行业" },
  { prop: "zttj.days", alias: "f10006", label: "涨停区间" },
  { prop: "zttj.ct", alias: "f10007", label: "区间涨停次数" },
  { prop: "date",label: "日期" },
];

const modelKeys = template.map((item) => item.alias || item.prop);
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
