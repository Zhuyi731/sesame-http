const numberGenerator = require("./Number/index");
const booleanGenerator = require("./Boolean/index");

class Random {
    constructor() {

    }

    basic() {

    }

    number(options) {
        return numberGenerator.random(options);
    }

    boolean(options) {
        return booleanGenerator.random(options);
    }

}

const random = new Random();

module.exports = random;