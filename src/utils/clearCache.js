/**
 * 删除nodejs中require.cache中缓存的模块
 * 并且删除该模块下子模块的缓存
 * 使得第二次引用时仍能够得到最新的数据
 * @param {*引用模块路径} modulePath 
 */
function clearCache(modulePath) {
    let mod = require.resolve(modulePath);

    if (!!mod && require.cache[mod]) {
        require.cache[mod].children.forEach(child => {
            clearCache(child.filename);
        });
        delete require.cache[mod];
    }
}

module.exports = clearCache;