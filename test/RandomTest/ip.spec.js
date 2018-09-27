const expect = require("chai").expect;
const ipGenerator = require("../../src/random/Ip/index");

/**
 * @desc 测试boolean随机数发生器的正确情况
 */

describe("IP random generator test", () => {

    it("should return a string", () => {
        expect(ipGenerator.random({ range: "192.168.1.35-36" })).to.be.a("string");
    });

    it("should return the right range ip", () => {
        let ip = ipGenerator.random({ range: "192.0-168.0-254.1-2" }).split(".").map(el=>~~el);
        expect(ip[0]).to.be.equal(192);
        expect(ip[1]).to.be.within(0,168);
        expect(ip[2]).to.be.within(0,254);
        expect(ip[3]).to.be.within(1,2);
    });

});