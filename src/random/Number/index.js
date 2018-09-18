const RandomGenerator = require("../RandomGenerator");

class NumberRandomGenerator extends RandomGenerator {
    constructor() {
        super();
        //default options
        this.defaultOptions = {
            range: [0, 100]
        };
        this.options = {
            range: [0, 100]
        };
    }

    setOptions(opt) {
        this._checkOptions(opt);
        //防止输入浮点数
        if (opt && !!opt.range) {
            opt.range = opt.range.map(num => parseInt(num));
        } else {
            //恢复初始状态
            opt = this.defaultOptions;
        }

        this._extendsOptions(opt);
    }

    _checkOptions(opt) {
        let message = "";
        if (opt && !!opt.range) {
            if (!Array.isArray(opt.range)) {
                message = "Number随机数range属性必须为数组";
                throw new TypeError(message);
            } else {
                if (opt.range.length != 2) {
                    message = "Number随机数range属性数组长度必须为2";
                    throw new TypeError(message);
                } else {
                    if (parseInt(opt.range[0]) != opt.range[0] || parseInt(opt.range[1]) != opt.range[1]) {
                        message = "Number随机数range属性左右端点值必须为整数,浮点数请使用Float随机数生成器";
                        throw new TypeError(message);
                    } else if (parseInt(opt.range[0]) > parseInt(opt.range[1])) {
                        message = "Number随机数range属性左端点不能大于右端点";
                        throw new RangeError(message);
                    }
                }
            }
        }


    }

    random(opt) {
        this.setOptions(opt);
        let randomRegionWidth = this.options.range[1] - this.options.range[0],
            offset = parseInt(Math.random() * randomRegionWidth),
            randomNumber = this.options.range[0] + offset;

        return randomNumber;
    }
}

// const numberRandomGenerator = new NumberRandomGenerator();
// numberRandomGenerator.random({range:[200,20]});

module.exports = new NumberRandomGenerator();