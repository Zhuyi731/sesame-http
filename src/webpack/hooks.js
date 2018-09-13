class WebpackHooks {
    constructor(){
            
    }

    /**
     * 在webpack以及seame的express服务器开启之前
     * 可以通过这个这个函数来添加一些express中间件  
     */
    before(){

    }

    /**
     * 替换webpack dev-server中的before或者setup方法
     * 然后添加相应的中间件解析与拦截请求
     */
    webpack(){

    }
}

module.exports = new WebpackHooks();