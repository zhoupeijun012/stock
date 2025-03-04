const start = async ()=>{
    // 获取全局数据
    const globalConfig = await require(RESOLVE_PATH("config/index.js")).init();

    // 判断项目是否初始化过
    if(!globalConfig.get('lastUpdate')) {
        await require(RESOLVE_PATH("spider/model/index.js")).init();
        await globalConfig.set('lastUpdate',DAYJS().format("YYYY-MM-DD"));
    }
    // 第一次启动应用强制初始化数据库
    // await require(RESOLVE_PATH("spider/model/index")).init();
}

exports.start = start;