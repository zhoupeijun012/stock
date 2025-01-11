const PATH = require("path");
const dayjs = require("dayjs");
const FS = require("fs");
const CHINESEDAY = require("chinese-days");

global.RESOLVE_PATH = (dir = "") => {
  return PATH.resolve(__dirname, "..", dir);
};

global.FILE_CACHE = (path, data) => {
  path = RESOLVE_PATH(CONFIG.CACHE_PACKAGE + path);
  return new Promise((resolve, reject) => {
    FS.writeFile(path, data, (error) => {
      if (!error) {
        resolve();
      } else {
        reject(error);
      }
    });
  });
};

global.FILE_EXISTS = (path) => {
  path = RESOLVE_PATH(CONFIG.CACHE_PACKAGE + path);
  return FS.existsSync(path);
};

global.FILE_READ = (path) => {
  path = RESOLVE_PATH(CONFIG.CACHE_PACKAGE + path);
  return new Promise((resolve, reject) => {
    FS.readFile(path, "utf-8", (error, data) => {
      if (!error) {
        resolve(JSON.parse(data));
      } else {
        reject(error);
      }
    });
  });
};

global.PACKAGE_CREATE = (path) => {
  path = RESOLVE_PATH(CONFIG.CACHE_PACKAGE + path);
  if (!FILE_EXISTS(path)) {
    FS.mkdirSync(path, { recursive: true });
  }
};

global.PACKAGE_CLEAR = (path) => {
  path = RESOLVE_PATH(CONFIG.CACHE_PACKAGE + path);
  if (!FILE_EXISTS(path)) {
    return new Promise((resolve, reject) => {
      FS.rm(path, { recursive: true }, (error) => {
        if (!error) {
          resolve();
        } else {
          reject(error);
        }
      });
    });
  }
};

global.generateRandomColor = () => {
  //随机生成RGB颜色
  let arr = [];
  for (var i = 0; i < 3; i++) {
    // 暖色
    arr.push(Math.floor(Math.random() * 128 + 64));
    // 亮色
    arr.push(Math.floor(Math.random() * 128 + 128));
  }
  let [r, g, b] = arr;
  // rgb颜色
  var color = `rgb(${r},${g},${b})`;

  return color;
};

global.DAYJS = dayjs;

global.WECHAT_SENG_TEXT = (msg, group = "") => {
  const params = {
    msgtype: "text",
    text: {
      content: msg,
      mentioned_list: [group],
    },
  };
  HTTP.post(CONFIG.WECHAT_SEND_URL, params, {
    headers: {
      "Content-type": "application/json",
    },
  });
};

global.IS_OPEN_DAY = (date) => {
  return CHINESEDAY.isWorkday(date) && !CHINESEDAY.isInLieu(date);
};

global.GET_LAST_OPENDAY = (count) => {
  let i = 0;
  let j = 0;
  let date = '';
  do {
    date = DAYJS().subtract(i, "day").format("YYYY-MM-DD");
    if (IS_OPEN_DAY(date)) {
      j++;
    }
    i++;
  } while (j < count);
  return date;
};
