const RandomGenerator = require("../RandomGenerator");
const randomNumber = require("../Number");
const util = require("../../utils");
/**
 * @param 
 * range:"",分别输入ip地址四部分的范围以，隔开  @type:String
 * 例如:range:"192.0-255.0-255.0-255"   表示192.xxx.xxx.xxx
 * networkIp:表示是否需要生成末尾为0的ip，默认不生成  false  
 * broadcastIp:表示是否需要生成末尾为255的ip,默认不生成  false  
 */
/*
    @demo
    
    {
        ip1:{
            $type:"ip",
            range:"192.168.1.35-36"
        },
        ip2:{
            $type:"ip",
            range:"192.168.1-12.1-254"
        },
        ip3:{
            $type:"ip3",
            range:"192.0-255.0-255.1-254"
        }
    }
*/
class IpRandomGenerator extends RandomGenerator {
    constructor() {
        super();
        this.options = {
            range: "0-255.0-255.0-255.0-255"
        };
    }

    setOptions(opt) {
        this.checkOptions(opt);
        this._extendsOptions(opt);
    }

    checkOptions(opt) {

        if (util.getObjType(opt) != "string") {
            throw new TypeError("[ip generator]:range must be string");
        }

        let arrs = opt.split(".");

        if (arrs.length != 4) {
            throw new Error("[ip generator]:range must be formated like xxx-xxx.xxx-xxx.xxx-xxx.xxx-xxx");
        }

        arrs.forEach((el, index) => {
            let l = parseInt(el.split("-")[0]),
                r = parseInt(el.split("-").pop());

            if (isNaN(l) || isNaN(r)) {
                throw new Error(`[ip generator]:at ${index} position of range option,a value is not a number`);
            }

            if (l < 0 || l > 255 || r < 0 || r > 255) {
                throw new Error(`[ip generator]:at ${index} position of range option,a value is outof range 0-255`);
            }

            if (l > r) {
                throw new Error(`[ip generator]:At ${el} the left value should be less than the right one`);
            }
        });
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