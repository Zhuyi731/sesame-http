const RandomGenerator = require("../RandomGenerator");

class BooleanRandomGenerator extends RandomGenerator {
    constructor() {
        super();
        this.options = {
            truePercent: 50
        };
    }

    setOptions(opt) {
        this._checkOptions(opt);
        this._extendsOptions(opt);
    }

    _checkOptions(opt) {
        let errMes = "";
        if (opt && opt.hasOwnProperty("truePercent")) {
            if (Object.prototype.toString.call(opt.truePercent) != "[object Number]") {
                errMes = "Boolean随机数truePercent字段必须为数字";
                throw new TypeError(errMes);
            }
            opt.truePercent > 100 && (opt.truePercent = 100);
            opt.truePercent <= 0 && (opt.truePercent = 0);
        }

        if (errMes) {
            console.log(errMes);
            throw new Error(errMes);
        }
    }


    random(opt) {
        this.setOptions(opt);
        let point = Math.random() * 100;
        return point < this.options.truePercent;
    }

}

module.exports = new BooleanRandomGenerator();