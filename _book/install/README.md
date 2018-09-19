# 本地使用

安装：

通过npm进行全局安装，安装一次即可在本地各处使用。

```
$ npm install sesame-http -g
```

开发调试，在项目目录上使用命令

```
$ sesame-http open
```
可选配置项：
- -p或者--port表示监控的端口  
- -w或者--where表示监控的目录相对路径  

例如 
```
$ sesame-http open -p 4000 -w test
```
表示在4000端口上监听当前目录下 test文件夹下的项目

关于模拟数据的具体方式请查看 [模拟数据](../mock/README.md)  
关于setConfig请查看 [接口文档](../api/README.md)

# webpack中使用  
安装: 
通过npm在webpack项目中进行本地安装  

```
$ npm isntall sesame-http --save-dev  
```

在webpack**调试环境配置**中配置devServer中的before(webpack@2.0版本为setup)

```
devServer:{
    before:(app)=>{
        sesame.setConfig({
              rulePath: path.join(__dirname,"./src/sesame.rule.js"), //绝对路径。项目所使用的拦截规则的具体文件，sesame-http会去引用这个文件  
              htmlContentPath:path.join(__dirname,"./src")           //绝对路径。如果使用文件形式的模拟数据形式，需要在此配置文件的根目录位置
        });
        sesame.webpack(app); //表示使用webpack中的app实例来取代sesame-http中的app实例
    }
}
```

关于模拟数据的具体方式请查看 [模拟数据](../mock/README.md)  
关于setConfig请查看 [接口文档](../api/README.md)


