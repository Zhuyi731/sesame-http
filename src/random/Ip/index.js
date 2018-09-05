const RandomGenerator = require("../RandomGenerator");
const randomNumber = require("../Number");

class IpRandomGenerator extends RandomGenerator {
    constructor() {
        super();
        this.defaultOptions = {
            range: ["0.0.0.0", "255.255.255.255"],
            networkIp: false,
            broadcastIp: false
        };
        this.options = {};
    }

    setOptions(opt) {
        this.checkOptions(opt);
        this._extendsOptions(opt);
    }

    checkOptions() {

    }

    random(opt) {
        this.setOptions(opt);
        let startIpArr = this.options.range[0].split(".").map(el => parseInt(el)),
            endIpArr = this.options.range[1].split(".").map(el => parseInt(el)),
            destIp = [],
            i,
            allFlag = false;

        for (i = 0; i < 4; i++) {

            if (i == 3) {
                if (allFlag) {
                    destIp[i] = randomNumber.random({ range: [0 + parseInt(!this.options.networkIp), 255 - parseInt(!this.options.broadcastIp)] });
                } else {
                    let left = (startIpArr[i] == 0 && !this.options.networkIp) ? 1 : startIpArr[i],
                        right = (endIpArr[i] == 255 && !this.options.broadcastIp) ? 254 : endIpArr[i];

                    destIp[i] = randomNumber.random({ range: [left, right] });
                }
            }

            if (allFlag) {
                destIp[i] = randomNumber.random({ range: [0, 255] });
            } else {
                destIp[i] = randomNumber.random({ range: [startIpArr[i], endIpArr[i]] });
                !allFlag && (allFlag = startIpArr[i] < endIpArr[i]);
            }
        }

        destIp = destIp.join(".");

        return destIp;

    }

}