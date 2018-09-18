const deepClone = require("../../src/utils").deepClone;
const expect = require("chai").expect;

describe("Test for deepClone function", () => {

    it("should deep equal to the object itself after excute deepClone function", () => {
        let testData1 = {
            prop1: {
                $type: "number",
                range: [0, 100]
            },
            prop2: "hahha"
        };
        expect(deepClone(testData1)).to.eql(testData1);

        let testData2 = {
            randomNum: {
                $type: "number",
                range: ["1", "32aasdasd"]
            }
        };
        expect(deepClone(testData2)).to.eql(testData2);

    });

    it("should return the origin value when parse origin data", () => {
        expect(deepClone(1)).to.equal(1);

        expect(deepClone("123")).to.equal("123");

        expect(deepClone(true)).to.equal(true);

        expect(deepClone("true")).to.equal("true");
    });



});