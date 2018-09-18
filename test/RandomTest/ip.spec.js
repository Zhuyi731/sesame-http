const expect = require("chai").expect;
const ipGenerator = require("../../src/random/Ip/index");

/**
 * @desc 测试boolean随机数发生器的正确情况
 */

describe("IP random generator test", () => {

    it("should return a string", () => {
        expect(ipGenerator.random({ range: "192.168.1.35-36" })).to.be.a("string");
    });
});