const fs = require("fs");
const path = require("path");
const Random = require("../random/Random");
const util = require("../utils");

class Parser {
    constructor() {
        this.options = {
            httpRootPath: null
        };
        this.Random = Random;
        this.ignoreProps = ["$before", "$response"];
    }

    setConfig(opt) {
        for (let prop in opt) {
            if (this.options.hasOwnProperty(prop)) {
                this.options[prop] = opt[prop];
            }
        }
    }

    parse(filePath, dataType, req, res) {
        let data,
            ret;
        filePath = path.join(this.options.httpRootPath, filePath);

        switch (dataType) {
            case "json":
            case "folder json":
                {
                    if (dataType == "folder json") {
                        filePath = path.join(filePath, "index.json");
                    }else{
                        filePath = `${filePath}.${dataType}`;
                    }
                    console.log(filePath);
                    try {
                        ret = util.deepClone(require(filePath));
                        console.log(ret);
                        // util.clearCache(filePath);
                    } catch (e) {
                        console.log(e);
                        throw e;
                    }
                }
                break;
            case "txt":
            case "html":
            case "folder html":
                {
                    let htmlContent;
                    if (dataType == "folder html") {
                        filePath = path.join(filePath, "index.html");
                    }else{
                        filePath = `${filePath}.${dataType}`;
                    }

                    try {
                        htmlContent = fs.readFileSync(filePath, "utf-8");
                        ret = JSON.parse(htmlContent);
                    } catch (e) {
                        console.log(e);
                        throw e;
                    }
                }
                break;
            case "js":
                {
                    let config;
                    try {
                        //在node模块中的require会有缓存，当你引入过一次之后会导致你修改了数据文件但是数据不会出现实时的变化
                        //所以需要再引入后，手动删除引入的文件的缓存，并递归的删除引入
                        config = require(filePath);
                        //清除缓存
                        util.clearCache(filePath);
                        //解析数据
                        ret = this._jsParser(config, req, res);
                    } catch (e) {
                        console.log(e);
                        throw e;
                    }
                }
                break;
        }

        return ret;
    }

    /**
     * js解析器，解析出最终数据
     * @param {*js文件export的内容} config 
     */
    _jsParser(config, req, res) {
        /**
         * 检查js配置文件中有没有$type这个属性
         * 有这个属性则说明需要对response进行一些奇特的操作，比如返回文件，修改状态码等等
         */

        //如果需要做预处理则进入预处理
        if (config.hasOwnProperty("$before")) {
            config.$before(req);
        }

        if (config.hasOwnProperty("$response")) {
            switch (config.$response) {
                case "file":
                    {
                        //TODO:需要支持文件类型返回                        
                    }
                    break;
                default:
                    {

                    }
                    break;
            }
        } else {
            //深赋值一份，避免funcion类型的数据被覆盖
            let copyData = util.deepClone(config);
            //获取解析后的数据
            copyData = this._parseProp(copyData);
            return copyData;
        }
    }

    /**
     * 只解析数据，不管$before和$response
     * @param {*需要解析的json数据} json 
     */
    _toJson(json) {
        let copyJson = util.deepClone(json);
        //获取解析后的数据
        copyJson = this._parseProp(copyJson);
        return copyJson;
    }

    //递归获取prop
    _parseProp(curProp) {
        let ret;
        switch (util.getObjType(curProp)) {
            //如果是function 则传入request参数并采用function返回的结果
            case "function":
                {
                    ret = curProp();
                }
                break;
                //如果是对象类型的话，需要判断一下对象是否有$type属性 ，如果有$type属性则说明该对象是需要随机生成的
            case "object":
                {
                    //$pool优先级高于所有
                    if (curProp.hasOwnProperty("$pool") && curProp.$type != "array") {
                        ret = curProp.$pool[this.Random.number({ range: [0, curProp.$pool.length - 1] })];
                    } else if (curProp.hasOwnProperty("$type")) {
                        ret = this.Random[curProp.$type](curProp);
                    } else {
                        let p;
                        ret = {};
                        for (p in curProp) {
                            this.ignoreProps.indexOf(p) == -1 && (ret[p] = this._parseProp(curProp[p]));
                        }
                    }
                }
                break;
                //数组类型，同对象类型一样处理
            case "array":
                {
                    ret = curProp.map(el => this._parseProp(el));
                }
                break;
                //基础数据直接返回
            default:
                {
                    ret = this._parseTemplateString(curProp);
                }
                break;
        }
        return ret;
    }

    _parseTemplateString(curProp) {
        if (Object.prototype.toString.call(curProp) == "[object string]") {
            //只有为string时才需要处理template
        }

        return curProp;
    }
}

module.exports = new Parser();