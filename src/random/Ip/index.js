const RandomGenerator = require("../RandomGenerator");
const randomNumber = require("../Number");

/**
 * @param 
 * range:"",分别输入ip地址四部分的范围以，隔开  @type:String
 * 例如:range:"192.0-255.0-255.0-255"   表示192.xxx.xxx.xxx
 * networkIp:表示是否需要生成末尾为0的ip，默认不生成  false  
 * broadcastIp:表示是否需要生成末尾为255的ip,默认不生成  false  
 */
class IpRandomGenerator extends RandomGenerator {
    constructor() {
        super();
        this.options = {
            range: "1-255.0-255.0-255.0-255"
        };
    }

    setOptions(opt) {
        this.checkOptions(opt);
        this._extendsOptions(opt);
    }

    checkOptions() {

    }

    random(opt) {
        this.setOptions(opt);
        let ipArr = this.options.range.split("."),
            allFlag = false,
            result = "",
            i;

        for (i = 0; i < 4; i++) {
            let l, r;
            l = ipArr[i].split("-")[0];
            r = ipArr[i].split("-").pop();
            result += (i == 0 ? "" : ".") + randomNumber.random({ range: [l, r] });
        }
        return result;
    }
}

module.exports = new IpRandomGenerator();