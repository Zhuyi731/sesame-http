const RandomGenerator = require("../RandomGenerator");

class NumberRandomGenerator extends RandomGenerator {
    constructor() {
        super();
        //default options
        this.defaultOptions = {
            range: [0, 100],
            toString: false
        };
        this.options = {
            range: [0, 100],
            toString: false
        };
    }

    checkOptions(opt) {
        let message = "";
        if (opt && !!opt.range) {
            // console.log(opt.range);
            // console.log(!Array.isArray(opt.range));
            if (!Array.isArray(opt.range)) {
                message = "Number随机数range属性必须为数组";
                throw new TypeError(message);
            } else {
                if (opt.range.length != 2) {
                    message = "Number随机数range属性数组长度必须为2";
                    throw new TypeError(message);
                } else {
                    if (parseInt(opt.range[0]) > parseInt(opt.range[1])) {
                        message = "Number随机数range属性左端点不能大于右端点";
                        throw new RangeError(message);
                    }
                }
            }
        } else if (opt && opt.hasOwnProperty("range")) {
            message = "Number随机数range属性必须为数组";
            throw new TypeError(message);
        }
    }

    random(opt) {
        opt && opt.range && (opt.range = opt.range.map(num => parseInt(num)));
        this.setOptions(opt);
        let randomRegionWidth = this.options.range[1] - this.options.range[0] + 1,
            offset = parseInt(Math.random() * randomRegionWidth),
            randomNumber = this.options.range[0] + offset;

        // console.log(this.options);
        // console.log(randomRegionWidth);
        // console.log(offset);
        // console.log(randomNumber);
        // console.log("\n\n\n");

        this.options.toString && (randomNumber = randomNumber.toString());

        return randomNumber;
    }
}

// const numberRandomGenerator = new NumberRandomGenerator();
// numberRandomGenerator.random({ range: "" });

module.exports = new NumberRandomGenerator();