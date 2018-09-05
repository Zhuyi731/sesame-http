const assert = require("assert");
const expect = require("chai").expect;
const numberRandomGenerator = require("../../src/random/Number/index");

/**
 * @desc 测试boolean随机数发生器的正确情况
 */

describe("Number random generator test", () => {

    it("should return a number type value", () => {
        expect(numberRandomGenerator.random()).to.be.a("number");
    });

    it("should return a number between 1 to 100,when no range option passed in", () => {
        expect(numberRandomGenerator.random()).to.within(0, 100);
        expect(numberRandomGenerator.random({ range: "" })).to.within(0, 100);
        expect(numberRandomGenerator.random({ range: null })).to.within(0, 100);
    });

    it("should return a number between range", () => {
        expect(numberRandomGenerator.random({ range: [-21, -9] })).to.within(-21, -9);
        expect(numberRandomGenerator.random({ range: [-99, 0] })).to.within(-99, 0);
        expect(numberRandomGenerator.random({ range: [1, 59660] })).to.within(1, 59660);
        expect(numberRandomGenerator.random({ range: [2, 3] })).to.within(2, 3);
        expect(numberRandomGenerator.random({ range: [-1, 0] })).to.within(-1, 0);
        expect(numberRandomGenerator.random({ range: [123, 321] })).to.within(123, 321);
        expect(numberRandomGenerator.random({ range: [-777, -666] })).to.within(-777, -666);

    });

    it("should return a single number while left range equals right range", () => {
        expect(numberRandomGenerator.random({ range: [1, 1] })).to.equal(1);
        expect(numberRandomGenerator.random({ range: [0, 0] })).to.equal(0);
        expect(numberRandomGenerator.random({ range: [-0, 0] })).to.equal(0);
        expect(numberRandomGenerator.random({ range: [-21, -21] })).to.equal(-21);
        expect(numberRandomGenerator.random({ range: [99, 99] })).to.equal(99);
        expect(numberRandomGenerator.random({ range: [123456789, 123456789] })).to.equal(123456789);
        expect(numberRandomGenerator.random({ range: [-123456789, -123456789] })).to.equal(-123456789);
        expect(numberRandomGenerator.random({ range: [19876248, 19876248] })).to.equal(19876248);
    });

    it("should return a default range value after generator a random number",()=>{
        numberRandomGenerator.random({range:[101,108]});
        expect(numberRandomGenerator.random()).to.within(0,100);
    });

    it("should throw an error when config.range is invalid", () => {

        expect(() => {
            numberRandomGenerator.random({ range: {} })
        }).to.throw(TypeError);

        expect(() => {
            numberRandomGenerator.random({ range: [] })
        }).to.throw(TypeError);

        expect(() => {
            numberRandomGenerator.random({ range: "10" })
        }).to.throw(TypeError);

        expect(() => {
            numberRandomGenerator.random({ range: {} })
        }).to.throw(TypeError);

        expect(() => {
            numberRandomGenerator.random({ range: ["1"] })
        }).to.throw(TypeError);

        expect(() => {
            numberRandomGenerator.random({ range: ["1", "2", "3"] })
        }).to.throw(TypeError);

        expect(() => {
            numberRandomGenerator.random({ range: [20.11, 20.69] })
        }).to.throw(TypeError);

        expect(() => {
            numberRandomGenerator.random({ range: [-1, -20] })
        }).to.throw(RangeError);

        expect(() => {
            numberRandomGenerator.random({ range: [200, 12] })
        }).to.throw(RangeError);

    });

});