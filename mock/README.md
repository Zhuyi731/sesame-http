sesame-http提供了两种模拟数据的形式。
规则形式（**推荐** ）以及文件形式    
你可以根据项目需要来选择，也可以选择混合使用。  

#规则形式  
类似于mock.js  
首先你需要创建一个sesame.rule.js的文件，在其中写入相应的规则。并且可以在内部require其他的规则文件从而模块化  

语法 ：
```
sesame.mock(url,method,data);
```

###url
@type: String   
@default:null  
@required: 必填  
@description:表示你需要拦截的请求    

###method 
@type: String  
@default: POST   
@required: 非必填，如果不填则第二个参数为data    
@description:表示需要拦截的请求方法，大小写均可。 可能的值 POST || GET || PUT || DELETE ...等  

###data
@type: Object || Array || Function
@default:null  
@require:必填  
@description:表示需要返回的数据    

> 当该值为一个非function时，表示通过sesame解析该对象，并返回对应规则的json数据。 

具体解析规则见[随机数据](../rules/README.md)  
查看[Demo..Todo]()

> 当该值为一个function时，sesame在拦截到对应的请求后会执行这个function，传入参数为请求对象（同express的[request对象](http://www.expressjs.com.cn/4x/api.html#req)）。你可以根据请求对象来返回具体的数值。也可以通过调用sesame内置的函数来生成随机数。    
最后该函数需要返回一个数据，作为该请求的返回值。

查看[Demo..Todo]()


#文件形式 
**不推荐使用此方式进行数据模拟**
1.该方式会进行大量的文件IO读取操作，效率较低    
2.不方便数据修改  
3.可能需要建立许多文件夹及文件来保存数据  
   

如果你在某个项目中需要匹配请求/api/getSomeData  
你可以在当前项目根目录创建api文件夹，在api文件夹下创建  
getSomeData.js  ||  getSomeData.js  ||getSomeData.html || getSomeData/index.json || getSomeData/index.html   

.js后缀的文件 
>通过module.exports返回一个数据（等价于sesame.mock()中的第三个参数），这个数据会通过sesame规则解析后并响应该请求。

[Demo .js文件]() 

非.js文件  
> 不会通过sesame规则解析，会直接返回该文件的内容

[Demo 非.js文件]()  

