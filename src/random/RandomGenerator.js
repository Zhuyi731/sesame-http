class RandomGenerator {

    constructor() {
        this.options = {};
        this.seed = "";
    }
    //随机数生成器的参数

    //设置随机数种子
    setSeed(seed) {
        this.seed = seed;
    }

    getSeed() {
        return this.seed;
    }

    //设置参数
    setOptions(options) {
        this.options = options;
    }

    getOptions(options) {
        return this.options;
    }

    _extendsOptions(opt) {
        for (let prop in opt) {
            if (this.options.hasOwnProperty(prop)) {
                this.options[prop] = opt[prop];
            }
        }
    }

    checkOptions(options) {

    }


    //生成随机数
    random() {
        throw new Error("You must override this method to complete the generator");
    }

    roll(opt) {
        this.ctTime = 0;
        let randomResult = this.random(opt);
        if (this.options.$exclude) {
            while (this.options.$exclude.test(randomResult)) {
                this.ctTime++;
                randomResult = this.random(opt);
                if (this.ctTime > 100) {
                    this.ctTime = 0;
                    console.error(`迭代次数超过${this.ctTime}次，退出迭代`);
                    randomResult = null;
                    break;
                }
            }
        }else if(this.options.$include){
            while (!this.options.$include.test(randomResult)) {
                this.ctTime++;
                randomResult = this.random(opt);
                if (this.ctTime > 100) {
                    this.ctTime = 0;
                    console.error(`迭代次数超过${this.ctTime}次，退出迭代`);
                    randomResult = null;
                    break;
                }
            }
        }
        return randomResult;
    }
}

module.exports = RandomGenerator;