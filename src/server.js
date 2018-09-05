const express = require("express");
const http = require("http");
const path = require("path");
const fs = require("fs");
const morgan = require("morgan");
const cookieParser = require('cookie-parser');
const bodyParser = require("body-parser");
const child_process = require("child_process");

const schemeParser = require("./parser/schemeParser");


class Sesame {
    constructor() {
        this.server = null; //server entity
        this.app = express();
        this.requestRematchRules = {};
        this.config = {
            engineTemplate: "html"
        };
    }

    setConfig(inputConfig) {
        for (let prop in inputConfig) {
            if (inputConfig.hasOwnProperty(prop) && this.config[prop]) {
                this.config[prop] = inputConfig[prop];
            }
        }
    }

    rules() {

    }

    open(port = "8080", where = "/", cwd) {
        this._useMiddleware(cwd, where);
        this._interceptRequest();
        this.cwd = cwd;
        this.port = port;
        this.where = where;
        schemeParser.setConfig({
            cwd,
            where
        });

        this.server = this.app.listen(~~port, () => {
            let host = this.server.address().address,
                port = this.server.address().port;
            console.log('Sesame http server is listening at http://%s:%s', host, port);
            child_process.exec(`open http://${host}:${port}`);
        });
    }

    /**
     * 专门给webpack调用的方法
     * @param {*express实例} app
     */
    webpack(app) {
        this.app = app;
        this.webpackBeforeOpen(app);
        this.open();
    }

    /**
     * 在webpack环境下，在开启服务器之前需要做的事情
     * 可以在中间添加自己的中间件以及路由
     * @param {*} app 
     */
    webpackBeforeOpen(app) {
        //If you want change some behaviors of app.You can override this method
    }

    /**
     * 使用express中间件
     * @param {*当前工作路径} cwd 
     * @param {*需要开启http服务器的路径} where 
     */
    _useMiddleware(cwd, where) {
        let workingDir = path.join(cwd, where),
            app = this.app;

        //设置解析引擎为config中的模板
        app.set("views", workingDir);
        app.set("view engine", this.config.engineTemplate);

        //使用bodyPaser解析请求的参数
        app.use(bodyParser.json());
        app.use(bodyParser.urlencoded({
            extended: false
        }));

        //使用cookiePaser解析请求cookie
        app.use(cookieParser());

        //将web_ui设置为静态资源目录
        app.use(express.static(workingDir));

        //使用morgan的日志功能
        app.use(morgan('dev'));
    }

    /**
     * 拦截请求，并返回对应的解析后的数据
     */
    _interceptRequest() {
        this.app.use((req, res, next) => {
            try {
                let fileName = req.originalUrl.split("?")[0],
                    dataType = this._findDataType(fileName),
                    parsedData = "";

                if (dataType == "not defined") {
                    console.log(`[${req.method}] : ${fileName}  没有找到对应的请求文件或请求规则`);
                } else {
                    parsedData = schemeParser.parse(fileName, dataType, req, res)
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
            next();
        });
    }

    //查找请求的路径下是否有对应的数据文件  没有则返回 not defined
    _findDataType(fileName) {
        let prefix = path.join(this.cwd, this.where, fileName);


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

};
let sesame = new Sesame();


//DEBUG:Start
sesame.open(8080, "/examples", path.join(__dirname, "../"));


//DEBUG:End
// module.exports = new Sesame();