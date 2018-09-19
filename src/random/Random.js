const numberGenerator = require("./Number/index");
const booleanGenerator = require("./Boolean/index");
const ipGenerator = require("./Ip/index");
const maskGenerator = require("./Mask/index");

class Random {
    constructor() {

    }

    extend(type, generator) {
        this[type] = function(options) {
            return generator.random(options);
        };
        console.log(`[sesame extend]：Extend ${type} success`);
    }

    basic() {

    }

    number(options) {
        return numberGenerator.random(options);
    }

    boolean(options) {
        return booleanGenerator.random(options);
    }

    ip(options) {
        return ipGenerator.random(options);
    }

    mask(options) {
        return maskGenerator.random(options);
    }

    random(type, options) {
        return this[type](options);
    }
}

module.exports = new Random();