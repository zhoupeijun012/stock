const { DataTypes } = require("sequelize");
const template = [
  { prop: "f12", label: "股票代码" },
  { prop: "f20001", label: "日K" },
  { prop: "f20002", label: "5日" },
  { prop: "f20003", label: "10日" },
  { prop: "f20004", label: "20日" },
  { prop: "f20005", label: "30日" },
  { prop: "f20006", label: "60日" },
  { prop: "f20007", label: "年K" },
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
