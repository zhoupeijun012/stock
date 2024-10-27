const pinyin = require('pinyin-pro');

function getPinYin(chineseName) {
    // 获取拼音
    const pinyinName = pinyin.pinyin(chineseName,  { toneType: "none", type: "array" });
    return pinyinName.join('').toLocaleUpperCase();
}

module.exports = {
    getPinYin
}