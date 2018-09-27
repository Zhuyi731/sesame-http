const util = require("../../utils");
const RandomGenerator = require("../RandomGenerator");
const randomNumber = require("../Number");

class StringRandomGenerator extends RandomGenerator {
    constructor() {
        super();
        //default options
        this.defaultOptions = {
            length: [0, 10],
            charPool: "abcdefghijklnmopqrstuvwxyz" + "0123456789" + "`!@#$%^&*()_+[]{}:\"';,./<>?\\|"
        };
        this.options = {
            range: [0, 10]
        };
    }

    checkOptions(opt) {
        if (!opt.$pool) {
            if (opt.length) {
                if (opt.length.length !== 2) {
                    throw new RangeError("[String Generator]:the length of String generator length property should be 2");
                }
                let l = parseInt(opt.length[0]),
                    r = parseInt(opt.length[1]);

                if (isNaN(l) || isNaN(r)) {
                    throw new TypeError("[String Generator]:the length property should be two numbers");
                }

                if (l > r) {
                    throw new TypeError("[String Generator]:value of max length cannot be less than the min length");
                }
            }else{
                throw new Error("[String Generator]:length is required");
            }

            if (opt.charPool) {
                let charPoolType = util.getObjType(opt.charPool);
                if (charPoolType != "array" && charPoolType != "string") {
                    throw new TypeError("[String Generator]:charPool must be a string or an array");
                }

                if (charPoolType == "string") {
                    opt.charPool = opt.charPool.split("");
                }

            }

        }
    }

    random(opt) {
        this.setOptions(opt);
        this.options.length = this.options.length.map(el => parseInt(el));

        let charPoolLen = this.options.charPool.length,
            strLen = randomNumber.random({ range: [this.options.length[0], this.options.length[1]] }),
            str = "";

        while (strLen--) {
            str += this.options.charPool[randomNumber.random({ range: [0, charPoolLen-1] })];
        }

        return str;
    }
}

// let stringGenerator = new StringRandomGenerator();
// console.log(stringGenerator.random({
//     length:[1,16]
// }));

module.exports = new StringRandomGenerator();