const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const child_process = require("child_process");
const schemeParser = require("./parser/schemeParser");
const chokidar = require("chokidar");
const util = require("../src/utils");

class Sesame {
    constructor() {
        this.server = null; //server entity

        //express实例   当webpack环境下时，指向webpack的express服务器  
        //本地环境下时，指向本地的express服务器
        this.app = null;

        //探测到sesame.rule.js之后 存储其对应的规则
        this.requestRules = {};
        //储存对应规则的所有依赖
        this.ruleRequires = [];


        //sesame-http运行的环境 local || webpack 默认local 
        this.env = "local";

        this.config = {
            engineTemplate: "html",
            port: 8080, //http服务器监听的端口
            debug: true, //是否输出debug信息
            rulePath: null,
            httpRootPath: null //服务器监听的路径
        };

    }

    setConfig(cfg) {
        for (let props in cfg) {
            if (this.config.hasOwnProperty(props)) {
                this.config[props] = cfg[props];
            }
        }
    }

    //模拟数据的主要函数
    mock(url, method, callback) {
        this._debug(`find mock rule:${url}`);
        if (typeof url != "string") {
            throw new TypeError("expect url to be a string");
        }

        if (callback && typeof method != "string") {
            throw new TypeError("expect method to be a string");
        }

        if (!callback) {
            callback = method;
            method = "post";
        }

        method = method.toLowerCase();
        if (url[0] != "/") {
            url = `/${url}`;
        }

        this.requestRules[url] = {
            method,
            callback
        };
    }

    openLocal(port = "8080", httpRootPath) {
        this.app = express();
        this.env = "local";
        this.config.httpRootPath = httpRootPath;
        this.config.port = port;
        this.config.rulePath = this.config.rulePath || path.join(this.config.httpRootPath, "sesame.rule.js");

        //将web_ui设置为静态资源目录
        // this.app.use(express.static(path.join(__)));
        this.app.use(express.static(this.config.httpRootPath));

        //设置解析引擎为config中的模板
        this.app.set("views", this.config.httpRootPath);
        this.app.set("view engine", this.config.engineTemplate);
        this._loadRequestRules();
        //使用中间件来解析cookie等东西
        this._useMiddleware();
        //寻找请求规则,拦截请求
        this._interceptRequest();

        this.server = this.app.listen(~~port, () => {
            let host = this.server.address().address == "::" ? "localhost" : this.server.address().address,
                port = this.server.address().port;

            console.log('Sesame http server is listening at http://%s:%s', host, port);
            child_process.exec(`open http://${host}:${port}`);
        });

        schemeParser.setConfig({ httpRootPath });
    }

    /**
     * 将数据格式转换成json
     * @param {*} json 
     */
    toJson(json) {
        return schemeParser._toJson(json);
    }

    /**
     * 专门给webpack调用的方法
     * @param {*express实例} app
     */
    webpack(app, rulePath) {
        this.env = "webpack";
        this.app = app;
        rulePath && (this.config.rulePath = rulePath);
        this.config.rulePath = this.config.rulePath || path.join(this.config.httpRootPath, "sesame.rule.js");

        this.webpackBefore(app);
        this._loadRequestRules();

        // schemeParser.setConfig({});

        this._useMiddleware();
        this._interceptRequest();
    }

    /**
     * 在webpack环境下，在开启服务器之前需要做的事情
     * 可以在中间添加自己的中间件以及路由
     * @param {*} app 
     */
    webpackBefore(app) {
        //If you want change some behaviors of app.You can override this method
    }

    _loadRequestRules() {
        this.requestRules = {};
        if (fs.existsSync(this.config.rulePath)) {
            require(this.config.rulePath);
            this.ruleRequires = util.resolveAllRequires(this.config.rulePath);
            this._watchRuleRequires();
        } else {
            console.info("");
            console.info("");
            console.info("If you are using file rule case.You can ignore the information blow");
            console.info(`cannot resolve at ${this.config.rulePath}`);
            console.info("");
            console.info("");
        }
    }

    /**
     * 使用express中间件
     */
    _useMiddleware() {
        // let workingDir = this.config.httpRootPath,
        let app = this.app;

        //使用bodyPaser解析请求的参数
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));

        //使用cookiePaser解析请求cookie
        app.use(cookieParser());

        //使用morgan的日志功能
        app.use(morgan('dev'));
    }

    /**
     * 拦截请求，并返回对应的解析后的数据
     */
    _interceptRequest() {
        let that = this;
        this.app.use((req, res, next) => {
            //先让webpack的中间件以及自定义的中间件先执行
            next();

            //执行完之后再冒泡到这里，如果到这里了就说明之前的所有请求都是没有被匹配的
            this._debug(`匹配到请求 ${req.originalUrl}`);

            if (req.originalUrl in this.requestRules) {
                let data = this._returnData(req.originalUrl, req);
                res.json(data);
            } else {

                try {
                    let fileName = req.originalUrl.split("?")[0],
                        dataType = this._findDataType(fileName),
                        parsedData = "";

                    if (dataType == "not defined") {
                        console.log(`[${req.method}] : ${fileName}  没有找到对应的请求文件或请求规则`);
                    } else {
                        parsedData = schemeParser.parse(fileName, dataType, req, res);
                    }

                    if (parsedData) {
                        //TODO:支持文件返回
                        if (parsedData.type == "file") {
                            res.sendFile("xxx");
                        }

                        if (parsedData.type == "json") {
                            res.json(parsedData.data);
                        }
                    }
                } catch (e) {
                    console.log(e);
                    throw e;
                }

            }
        });
    }

    _returnData(url, req) {
        if (typeof this.requestRules[url].callback == "function") {
            return this.requestRules[url].callback(req);
        } else {
            if (this.requestRules[url].callback.hasOwnProperty("$before")) {
                this.requestRules[url].callback.$before(req);
            }
            return this.toJson(this.requestRules[url].callback);
        }
    }

    //查找请求的路径下是否有对应的数据文件  没有则返回 not defined
    _findDataType(fileName) {
        if (!fileName || !this.httpRootPath) return "not defined";
        this._debug(fileName);
        let prefix = path.join(this.config.httpRootPath, fileName);

        //如果请求路径是文件夹,则检查文件夹下是否有index.*类型文件，有则使用下面的文件作为数据源
        if (fs.existsSync(prefix) && fs.statSync(prefix).isDirectory()) {
            if (fs.existsSync(path.join(prefix, "index.html"))) {
                return "folder html";
            } else if (fs.existsSync(path.join(prefix, "index.json"))) {
                return "folder json";
            } else {
                console.log(`${prefix}目录下不存在index.html或index.json文件,请检查！`);
                return "not defined";
            }
        }

        //否则  检查是否存在数据源文件   文件优先级   js>json>html>txt
        //建议只放置一个文件
        if (fs.existsSync(`${prefix}.js`)) {
            return "js";
        } else if (fs.existsSync(`${prefix}.json`)) {
            return "json";
        } else if (fs.existsSync(`${prefix}.html`)) {
            return "html";
        } else if (fs.existsSync(`${prefix}.txt`)) {
            return "txt";
        } else {
            return "not defined";
        }
    }

    _debug(message, noWrap) {
        if (!this.config.debug) return;
        if (noWrap) {
            console.log(message);
            return;
        }
        console.log("");
        console.log("");
        console.log(`[DEBUG]: ${message}`);
        console.log("");
        console.log("");
    }

    /**
     * 监听所有规则依赖的文件夹
     */
    _watchRuleRequires() {
        this.watcher = chokidar.watch(this.ruleRequires);
        this.watcher.on("change", path => {
            //如果规则有变更，则清除缓存后重新加载
            util.clearCache(this.config.rulePath);
            this._loadRequestRules();
            this._debug("数据变动，清空缓存并重新加载");
        });
    }

}
let sesame = new Sesame();
global.sesame = sesame;

//DEBUG:Start

sesame.openLocal(8080, path.join(__dirname, "../example1/src"));

//DEBUG:End

module.exports = sesame;