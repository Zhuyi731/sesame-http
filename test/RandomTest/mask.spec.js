const expect = require("chai").expect;
const maskGenerator = require("../../src/random/Mask/index");

/**
 * @desc 测试mask随机数发生器的正确情况
 */
describe("IP random generator test", () => {

    it("should return a string", () => {
        expect(maskGenerator.random({ range: ["24","24"] })).to.be.equal("255.255.255.0");
    });

});