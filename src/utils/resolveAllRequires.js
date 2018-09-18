/**
 * 找出modulePath及其子模块的所有引用，并返回一个数组来储存所有的子模块路径
 * @param {*require的模块路径} modulePath 
 */
function resolveAllRequires(modulePath) {
    let ret = [];
    let mod = require.resolve(modulePath);

    ret.push(modulePath);

    if (!!mod && require.cache[mod]) {
        require.cache[mod].children.forEach(child => {
            ret = ret.concat(resolveAllRequires(child.filename));
        });
    }

    return ret;
}
module.exports = resolveAllRequires;