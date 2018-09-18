const numberGenerator = require("./Number/index");
const booleanGenerator = require("./Boolean/index");
const ipGenerator = require("./Ip/index");
const maskGenerator = require("./Mask/index");

class Random {
    constructor() {

    }

    extend() {
        
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
}

module.exports = new Random();