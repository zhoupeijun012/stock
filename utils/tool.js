const PATH = require("path");
const dayjs = require("dayjs");
const FS = require("fs");
const CHINESEDAY = require("chinese-days");
const requireContext = require("simple-require-context");
const BASENAME = require("path").basename;
const AXIOS = require("axios");
global.RESOLVE_PATH = (dir = "") => {
  return PATH.resolve(__dirname, "../", dir);
};

global.FILE_CACHE = (path, data) => {
  path = RESOLVE_PATH(path);
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
  return HTTP.post(
    "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=4c3f7e6e-2909-4c26-9d6f-02a3d8604cda",
    params,
    {
      headers: {
        "Content-type": "application/json",
      },
    }
  ).catch((error) => {
    throw error;
  });
};

global.IS_OPEN_DAY = (date) => {
  return CHINESEDAY.isWorkday(date) && !CHINESEDAY.isInLieu(date);
};

global.IN_OPEN_TIME = () => {
  return (
    (DAYJS().format("HHmmss") >= "092500" &&
      DAYJS().format("HHmmss") <= "113000") ||
    (DAYJS().format("HHmmss") >= "130000" &&
      DAYJS().format("HHmmss") <= "150000")
  );
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

global.GET_STOCK_PREFIX = (code) => {
  if (["60", "68", "90"].some((item) => code.startsWith(item))) {
    return "1." + code;
  } else if (["00", "30", "20"].some((item) => code.startsWith(item))) {
    return "0." + code;
  } else {
    return "0." + code;
  }
};

global.TIME_WAIT = (time) => {
  return new Promise((resolve, reject) => {
    setTimeout(resolve, time);
  });
};

global.GET_VAL = (params, expres) => {
  return expres.split(".").reduce((data, currentVal) => {
    return data[currentVal];
  }, params);
};

global.PACKAGE_EXCUTE = async (path, excute = [], callback) => {
  const context = requireContext(path, false, /\.js$/);
  const keys = context.keys();
  for (let index = 0; index < keys.length; index++) {
    const key = keys[index];
    const basename = BASENAME(key);
    if (!excute.includes(basename) && typeof callback == "function") {
      await callback(context(key), basename.replace(".js", ""));
    }
  }
};

global.GET_KLT = (val) => {
  const typeMap = {
    day: 101,
    week: 102,
    mon: 103,
    quarter: 104,
  };
  return typeMap[val] ? typeMap[val] : val;
};

global.dashscope = (search) => {
  const apiUrl =
    "https://dashscope.aliyuncs.com/compatible-mode/v1/chat/completions";
  const apiKey = "sk-328b653854ce428798eebd96e590015c";
  const config = {
    headers: {
      Authorization: `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
  };
  const data = {
    model: "qwen-turbo",
    messages: [
      {
        role: "user",
        content: search,
      },
    ],
  };
  return AXIOS.post(apiUrl, data, config);
};

global.stockKMap = (lines = []) => {
  const mapFunc = (item) => {
    const splitArr = item.split(",");
    //  时间/开/收/最高/最低/成交量/成交额/震幅/涨跌幅/涨跌额/换手率/流通股本
    return {
      timestamp: splitArr[0],
      open: parseFloat(splitArr[1]),
      close: parseFloat(splitArr[2]),
      high: parseFloat(splitArr[3]),
      low: parseFloat(splitArr[4]),
      // 成交量
      volume: parseFloat(splitArr[5]),
      // 成交额
      turnover: parseFloat(splitArr[6]),
      // 涨跌额
      change: formatMoney(splitArr[8]),
      capital: parseFloat(splitArr[11]),
    };
  };
  let chartData = {};
  if (Array.isArray(lines)) {
    chartData = lines.map((item) => {
      return mapFunc(item);
    });
  } else {
    chartData = lines ? mapFunc(lines) : [];
  }
  return chartData;
};