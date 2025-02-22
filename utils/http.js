const axios = require('axios');

axios.interceptors.response.use(null, (err) => {
  let config = err.config;
  if (!config ) return Promise.reject(err);
  const { __retryCount = 0 } = config;
  // 在请求对象上设置重试次数
  config.__retryCount = __retryCount;
  // 判断是否超过了重试次数
  if (__retryCount >= CONFIG.HTTP_RETRY_COUNT) {
    return Promise.reject(err);
  }
  // 增加重试次数
  config.__retryCount++;
  // 延时处理
  const delay = new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, CONFIG.HTTP_RETRY_DELAY);
  });
  // 重新发起请求
  return delay.then(function () {
    return axios(config);
  });
});

// 创建一个具有默认配置的axios实例
const instance = axios.create({
  baseURL: CONFIG.GET_URL,
  timeout: 60 * 1000,
});

global.HTTP = instance;