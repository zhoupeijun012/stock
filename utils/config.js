const config = {
    GET_URL: 'http://aktools.amdyes.asia:8080',
    SERVER_PORT: 12345,
    CACHE_PACKAGE: 'cache',
    START_TIME: '0 9 * * *',
    WECHAT_SEND_URL: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=4c3f7e6e-2909-4c26-9d6f-02a3d8604cda",
    // 接口重试次数
    HTTP_RETRY_COUNT: 3,
    // 接口重试间隔
    HTTP_RETRY_DELAY: 2000,
    // 下面属于调试开关
    // DEBUG_START_TIME: '35 19 * * *',
    // OPEN_DAY: true,
    // DEVELOPMENT: true
}

global.CONFIG = config;