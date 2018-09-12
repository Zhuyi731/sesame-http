# open-sesame
一个可以拦截Ajax请求并模拟数据的迷你服务器  
Current Version:@0.0.1Beta

# 需求背景  
在开发新项目时，发现公司已有的模拟假数据的http服务器已经不能满足项目的需求。并且Mock.js等模拟数据的库也不能够兼容公司已有的模拟数据方案。只好自己动手造轮子。  
Inspired by [Mock.js](http://mockjs.com/)  

1.项目中的模拟数据在调试时需要频繁的修改，需要能够便捷生成随机数据的方法。  
2.需要能够在webpack中便捷的使用，也要能够在非webpack中便捷的调试  
3.需要能够更具请求的全部信息(header、cookie)等，来返回对应的数值  
4.支持不同response status值的返回，例如404，301等  
5.支持返回文件   
6.提供便捷的钩子函数，易于扩展   
7.支持规则式的拦截假数据 如sesame.mock("http://xxx.xxx.xxx/getData","POST",function(){return data})  
8.支持文件式的拦截数据 如请求 /api/getUsers ，可以在项目根目录建立api/getUsers.js然后在该文件内部书写逻辑返回数据  
9.支持RESTful类型的数据便捷的进行模拟(Todo later)  
10.支持在页面快捷修改模拟数据(Todo later)  
11.支持文档转模拟数据(Todo later)  

# 设计方案  

设计思路 : 

- sesame-http使用express作为服务器来拦截请求，可以外挂在webpack上，也可以单独使用。  
- 采用websocket实现页面通信，从而实现再页面快捷修改假数据  
- 建立随机数生成机制，附加在sesame-http上，可以快捷的生成和拓展随机数。  


#文档  
TODO：  
V1.0版本推出  
