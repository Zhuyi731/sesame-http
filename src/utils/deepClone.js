/**
 * 深复制对象
 * @param {*原始数据} @type:any   data 
 * @param {*是否需要复制function}  @type:boolean cloneFunction 
 */
function deepClone(data, cloneFunction) {
    let type = typeof data,
        item = data,
        copy;
    switch (type) {
        case "object":
            {
                if (Object.prototype.toString.call(item) == "[object Array]") {
                    copy = item.map(e => deepClone(e, cloneFunction));
                } else {
                    copy = {};
                    for (let prop in data) {
                        copy[prop] = deepClone(item[prop], cloneFunction);
                    }
                }
            }
            break;
        case "function":
            {
                if (!!cloneFunction && item.constructor) {
                    copy = new item.constructor();
                } else {
                    copy = item;
                }
            }
            break;
        default:
            {
                copy = item;
            }
    }
    return copy;
}

module.exports = deepClone;