const fs = require("fs");
const path = require("path");
const Random = require("../random/Random");

class Parser {
    constructor() {
        this.options = {
            cwd: process.cwd(),
            where: "/"
        };
        this.Random = Random;

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
            ret = {
                type: "json",
                data: ""
            };
        filePath = path.join(this.options.cwd, this.options.where, filePath);
        /**
         * dataType all posibilities
         * json | folder json | html | folder html | js
         */
        switch (dataType) {
            case "json":
            case "folder json":
                {
                    dataType == "folder json" && (filePath += "\index");

                    try {
                        ret.data = require(`${filePath}.json`);
                        this._clearCache(`${filePath}.json`);
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
                    dataType == "folder html" && (filePath = path.join(filePath, "index.html"));
                    try {
                        htmlContent = fs.readFileSync(filePath,"utf-8");
                        ret.data = htmlContent;
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
                        this._clearCache(filePath);
                        //解析数据
                        ret.data = this._jsParser(config, req, res);
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
        if (config.hasOwnProperty("$response")) {
            switch (config.$response) {
                case "file":
                    {

                    }
                    break;
                default:
                    {

                    }
                    break;
            }
        } else {
            //深赋值一份，避免funcion类型的数据被覆盖
            let copyData = this._deepClone(config);
            //如果需要做预处理则进入预处理
            !!config.$beforeParse && config.$beforeParse(req);
            //获取解析后的数据
            copyData = this._parseProp(copyData, req, res);
            return copyData;
        }
    }

    //递归获取prop
    _parseProp(curProp, req, res) {
        let ret;
        switch (Object.prototype.toString.call(curProp)) {
            //如果是function 则传入request参数并采用function返回的结果
            case "[object Function]":
                {
                    ret = curProp(req);
                }
                break;
                //如果是对象类型的话，需要判断一下对象是否有$type属性 ，如果有$type属性则说明该对象是需要随机生成的
            case "[object Object]":
                {
                    if (curProp.hasOwnProperty("$type")) {
                        ret = this.Random[curProp.$type](curProp);
                    } else {
                        let p;
                        ret = {};
                        for (p in curProp) {
                            ret[p] = this._parseProp(curProp[p]);
                        }
                    }
                }
                break;
                //数组类型，同对象类型一样处理
            case "[object Array]":
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


    /**
     * 删除引用模块路径的缓存，使得第二次引用时仍能够得到最新的数据
     * @param {*引用模块路径} modulePath 
     */
    _clearCache(modulePath) {
        let mod = require.resolve(modulePath);

        if (!!mod && require.cache[mod]) {
            require.cache[mod].children.forEach(child => {
                clearRequireCache(child)
            }, this);
            delete require.cache[mod];
        }
    }

    _deepClone(data, cloneFunction) {
        let copy = {};
        for (let prop in data) {
            let type = typeof data[prop],
                item = data[prop];
            switch (type) {
                case "object":
                    {
                        if (Object.prototype.toString.call(item) == "[object Array]") {
                            copy[prop] = item.map(e => this._deepClone(e, cloneFunction));
                        } else {
                            copy[prop] = this._deepClone(item, cloneFunction);
                        }
                    }
                    break;
                case "function":
                    {
                        if (!!cloneFunction && item.constructor) {
                            copy[prop] = new item.constructor();
                        } else {
                            copy[prop] = item;
                        }
                    }
                    break;
                default:
                    {
                        copy[prop] = item;
                    }
            }
        }
        return copy;
    }

}
const parser = new Parser();
module.exports = parser;




/**
 * 模板语言定义 
 * //如果出现$response 则表明需要对request和response做一些处理
 *  {
        $response:"file",
        fileContent:"xxxxx",
        filename:"xxx.js",
        filePath:"xxx",
    }
    {
        $response:"data",
        $data:{

        },
        status:404
    }
 * 
 * 
 * 
 * {
 *  "prop":"123",
 *  "prop1":123,
 *  "prop2":true,
 *  "prop3":function(req){
 *      let params = req.body;
 *      if(params.username == "admin" && params.password =="admin"){
 *            return "login ok"; 
 *      }else{
 *            return "login failed";
 *      }
 *  },
 *  "prop4":{   //随机生成1-3个 ★
 *      $type:"string",
 *      range:"1-3",
 *      template:"★"
 *  },
 *  "prop5":{//随机出现两个数字
 *   $type:"array",
 *   range:"2",
 *   tamplate :["192.168.0.1","192.168.0.3","192.168.2.2"]
 *  },
 *  "prop6":{  //如果不带$type属性，则认为是普通对象
 *      range:"1-3",
 *      tmplate:"1" 
 *  }
 * }
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 * 
 */