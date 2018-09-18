const RandomGenerator = require("../RandomGenerator");
const randomNumber = require("../Number");
const util = require("../../utils");
/**
 * @param 
 * range:"",分别输入ip地址四部分的范围以，隔开  @type:String
 * 例如:range:"192.0-255.0-255.0-255"   表示192.xxx.xxx.xxx
 * networkIp:表示是否需要生成末尾为0的ip，默认不生成  false  
 * broadcastIp:表示是否需要生成末尾为255的ip,默认不生成  false  
 */
class IpRandomGenerator extends RandomGenerator {
    constructor() {
        super();
        this.options = {
            length: [0, 10],
            generator: {},
            $pool: []
        };
    }

    setOptions(opt) {
        this.checkOptions(opt);
        this._extendsOptions(opt);
    }

    checkOptions(opt) {
        if (!Array.isArray(opt.length) || opt.length.length != 2) {
            throw new Error("[Array Generator]: length must be an array with length of 2");
        }

        if (isNaN(parseInt(opt.length[0])) || isNaN(parseInt(opt.length[1]))) {
            throw new TypeError("[Array Generator]: The value of length is not a number");
        }

        if (opt.length[0] > opt.length[1]) {
            throw new RangeError("[Array Generator]: The left value must be less than the right value");
        }

        if (!opt.generator || !opt.$pool) {
            throw new Error("[Array Generator]:generator or $pool must be configed");
        }

        if (opt.generator && util.getObjType(opt.generator) != "function") {
            throw new TypeError("[Array Generator]:generator must be a function");
        }
    }

    random(opt) {
        let result = [],
            length = randomNumber({ range: this.options.length });

        if (this.options.$pool) {
            let poolLength = this.options.$pool.length,
                picked;
            while (length--) {
                picked = randomNumber({ range: [0, poolLength - 1] });
                result.push(this.options.$pool[picked]);
            }
        } else {
            while (length--) {
                result.push(this.options.generator());
            }
        }
    }
}

module.exports = new IpRandomGenerator();