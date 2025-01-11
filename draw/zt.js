const fs = require("fs");
const PImage = require("pureimage");

const w = 60;
const h = 48;
const padding = 28;
const textColor = "#333";
const lineColor = "rgba(255,255,255,0.4)";
const timeArr = [
  "09:15",
  "09:25",
  "09:30",
  "10:00",
  "10:30",
  "11:00",
  "11:30",
  // "13:00",
  "13:30",
  "14:00",
  "14:30",
  "15:00"
];

const saveToImg = (canvas) => {
  PImage.encodePNGToStream(canvas, fs.createWriteStream("out.png"))
    .then(() => {
      console.log("wrote out the png file to out.png");
    })
    .catch((e) => {
      console.log("there was an error writing");
    });
};

const drawBorad = (ctx, row, height) => {
  for (let i = 0; i < row; i++) {
    ctx.fillStyle = textColor;
    ctx.font = "12pt MyFont";
    ctx.fillText(timeArr[i], i * w + padding - 20, padding - 15);
    ctx.fillStyle = lineColor;
    ctx.fillRect(i * w + padding, padding, 1, height - 2 * padding);
  }
};

const calculateLegend = (list) => {
  const groupMap = {};
  list.forEach((item)=>{
    if(groupMap[item['所属行业']]) {
      item['lightColor'] = groupMap[item['所属行业']]['lightColor'];
      item['darkColor'] = groupMap[item['所属行业']]['darkColor'];
      item['count'] ++;
    } else {
      const color = generateRandomColor();
      const lightColor = color.replace(')',',0.1)');
      const darkColor = color.replace(')',',0.4)');
      groupMap[item['所属行业']] = {};
      groupMap[item['所属行业']]['lightColor']= lightColor;
      groupMap[item['所属行业']]['darkColor']= darkColor;
      item['lightColor'] = lightColor;
      item['darkColor'] = darkColor;
      groupMap[item['所属行业']].count = 1;
    }
  })
  return Object.keys(groupMap).map((key)=>{
    return {
      title: key,
      ...groupMap[key]
    }
  })
};
const drawLegend = (list)=>{

}
const calculateTimeLine = (list) => {
  // 先排序
  list = list.sort((item1, item2) => item1 - item2);
  const sortArr = [];
  for (let i = 0; i < timeArr.length - 1; i++) {
    const startTime = timeArr[i].replace(":",'') + "00";
    const endTime = timeArr[i + 1].replace(":",'') + "00";

    const findArr = list.filter((item) => {
      return (
        item["首次封板时间"] >= startTime && item["首次封板时间"] < endTime
      );
    });
    sortArr.push(findArr);
  }
  return sortArr;
};

const drawCard = (ctx, list,width) => {
  let jIndex = 0;
  for (let i = 0; i < list.length; i++) {
    const arr = list[i];
    for (let j = 0; j < arr.length; j++) {
      const jItem = arr[j];
      ctx.fillStyle = jItem['lightColor'];
      ctx.fillRect(padding, jIndex * h + padding, width, h-1);
      ctx.fillStyle = textColor;
      ctx.font = "16px MyFont";
      ctx.fillText( `${jItem['名称']}， 所属行业: ${jItem['所属行业']}，首封:${jItem['首次封板时间']},末封:${jItem['最后封板时间']}`, padding + 10, jIndex * h + padding + 30);
      jIndex++;
    }
  }
};
const startDraw = async (list) => {
  // 注册字体
  const font = PImage.registerFont(
    RESOLVE_PATH("spider/font/微软雅黑.ttf"),
    "MyFont"
  );
  //load font
  await font.load();


  // 分组后的数组
  const timeLineArr = calculateTimeLine(list);

  const row = list.length;
  const col = timeArr.length;
  const width = w * (col - 1) + 2 * padding;
  const height = row * h + 2 * padding;
  const canvas = PImage.make(width, height);
  const ctx = canvas.getContext("2d");
  ctx.fillStyle = "rgba(255,255,255, 1)";
  ctx.fillRect(0, 0, width, height);
  drawBorad(ctx, col, height);

  // 进行颜色分配后的数据
  const lengends = calculateLegend(list);
  // 绘制legend
  drawLegend(lengends,width - 2 * padding);

  // 绘制卡片
  drawCard(ctx, timeLineArr,width - 2 * padding);
  saveToImg(canvas);
};

module.exports = {
  startDraw,
};
