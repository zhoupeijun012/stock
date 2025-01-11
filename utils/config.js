const config = {
    GET_URL: 'http://aktools.amdyes.asia:8080',
    SERVER_PORT: 12345,
    CACHE_PACKAGE: 'cache',
    ZT_CACHE: 'zt',
    HISTORY: 'history',
    INFO: 'info',
    START_TIME: '0 9 * * *',
    LOOP_TIME: '0 0/10 9-14 * * ?',
    WECHAT_SEND_URL: "https://qyapi.weixin.qq.com/cgi-bin/webhook/send?key=4c3f7e6e-2909-4c26-9d6f-02a3d8604cda",
}

global.CONFIG = config;