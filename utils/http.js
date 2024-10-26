const CONFIG = require('./config');
const axios = require('axios');
// 创建一个具有默认配置的axios实例
const instance = axios.create({
  baseURL: CONFIG.GET_URL,
  timeout: 60 * 1000,
});

module.exports = instance;