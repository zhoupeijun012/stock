require("./utils/index");
const server = require(RESOLVE_PATH('server/index'));
server.start();

if(!CONFIG.DEVELOPMENT) {
    require(RESOLVE_PATH('spider/loop')).startLoop();
} else {
    require(RESOLVE_PATH('spider/index')).start();
}
