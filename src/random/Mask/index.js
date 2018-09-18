const RandomGenerator = require("../RandomGenerator");
const randomNumber = require("../Number");

/**
 * @param 
 * range:"28" 或者 range:"28-30"表示生成28-30位的子网掩码
 */
class IpRandomGenerator extends RandomGenerator {
    constructor() {
        super();
        this.options = {
            range: "1-32"
        };
    }

    setOptions(opt) {
        this.checkOptions(opt);
        this._extendsOptions(opt);
    }

    checkOptions(opt) {
        if (!Array.isArray(opt.range)) {
            throw new TypeError("[mask generator]: The range property must be an array");
        }
        let l = parseInt(opt.range[0]),
            r = parseInt(opt.range[1]);

        if (isNaN(l) || isNaN(r)) {
            throw new TypeError("[mask generator]: The range property of left or right must be number");
        }

        if (l < 1 || l > 32) {
            throw new TypeError("[mask generator]: The left range value must be within 1~32");
        }

        if (r < 1 || r > 32) {
            throw new TypeError("[mask generator]: The right range value must be within 1~32");
        }

        if (l > r) {
            throw new RangeError("[mask generator]: The range property of left value should be greater than the right value");
        }

    }

    random(opt) {
        this.setOptions(opt);

        let i,
            mid = 0,
            result = "",
            l = opt.range[0],
            r = opt.range[1],
            ct = randomNumber.random({ range: [l, r] }),
            fir = ct / 8,
            tail = ct % 8;

        for (i = 0; i < fir; i++) {
            result += (i == 0 ? "" : ".") + "255";
        }

        for (i = 0; i < 8; i++) {
            mid = mid * 2 + i < tail ? 1 : 0;
        }
        result += "." + mid.toString();

        for (i = 1; i < 4 - fir; i++) {
            result += ".0";
        }

        return result;
    }
}

module.exports = new IpRandomGenerator();