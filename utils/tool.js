const PATH = require("path");
const dayjs = require("dayjs");
const FS = require("fs");
const CHINESEDAY = require("chinese-days");
global.RESOLVE_PATH = (dir = "") => {
  return PATH.resolve(__dirname, "../", dir);
};

global.FILE_CACHE = (path, data) => {
  path = RESOLVE_PATH(path);
  return new Promise((resolve, reject) => {
    FS.writeFile(path, data, (error) => {
      if (!error) {
        const input = FS.createReadStream(path);
        const output = FS.createWriteStream(path + ".gz");
        resolve();
      } else {
        reject(error);
      }
    });
  });
};

global.FILE_EXISTS = (path) => {
  path = RESOLVE_PATH(path);
  try {
    return FS.existsSync(path);
  } catch (error) {
    return false;
  }
};

global.FILE_READ = (path) => {
  path = RESOLVE_PATH(path);
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
  path = RESOLVE_PATH(path);
  if (!FILE_EXISTS(path)) {
    FS.mkdirSync(path, { recursive: true });
  }
};

global.PACKAGE_CLEAR = (path) => {
  path = RESOLVE_PATH(path);
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
  }).catch((error) => {
    console.log(error.message);
  });
};

global.IS_OPEN_DAY = (date) => {
  return CHINESEDAY.isWorkday(date) && !CHINESEDAY.isInLieu(date);
};

global.GET_LAST_OPENDAY = (count) => {
  let i = 1;
  let j = 0;
  let date = "";
  do {
    date = DAYJS().subtract(i, "day").format("YYYY-MM-DD");
    if (IS_OPEN_DAY(date)) {
      j++;
    }
    i++;
  } while (j < count);
  return date.replaceAll("-", "");
};

global.GET_LAST_DATE = (count) => {
  const arr = [];
  for (let i = 1; i <= count; i++) {
    arr.push(global.GET_LAST_OPENDAY(i));
  }
  return arr;
};

global.GET_STOCK_AREA = (code) => {
  return ["00", "30"].some((item) => code.startsWith(item)) ? "SZ" : "SH";
};

global.TIME_WAIT = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
};

global.IN_RANGE = () => {
  return (
    DAYJS().format("HHmmss") >= "092500" && DAYJS().format("HHmmss") <= "133000"
  );
};

// global.DB = require('better-sqlite3')(global.RESOLVE_PATH("db.sqlite"));
