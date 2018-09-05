const assert = require("assert");
const expect = require("chai").expect;
const booleanRandomGenerator = require("../../src/random/Boolean/index");

/**
 * @desc 测试boolean随机数发生器的正确情况
 */

describe("Boolean random generator test", () => {

    it("should return a boolean type value", () => {
        expect(booleanRandomGenerator.random()).to.be.a("boolean");
    });

    it("should always return false when truePercent up to 100%", () => {
        expect(booleanRandomGenerator.random({ truePercent: 100 })).to.true;
    });

    it("should always return false when truePercent declined to 0%", () => {
        expect(booleanRandomGenerator.random({ truePercent: 0 })).to.false;
    });

    it("should throw an error when config.truePercent is not a number", () => {
        expect(booleanRandomGenerator.random, { truePercent: true }).to.throw(TypeError);
        expect(booleanRandomGenerator.random, { truePercent: "" }).to.throw(TypeError);
        expect(booleanRandomGenerator.random, { truePercent: null }).to.throw(TypeError);
        expect(booleanRandomGenerator.random, { truePercent: "10" }).to.throw(TypeError);
        expect(booleanRandomGenerator.random, { truePercent: {} }).to.throw(TypeError);
        expect(booleanRandomGenerator.random, { truePercent: ["1", "2"] }).to.throw(TypeError);
    });

});