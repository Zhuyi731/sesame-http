sesame提供了便捷的随机数生成方式   

前面我们有提到通过规则形式的请求  
sesame.mock(url,method,data);  

其中data为对象时在返回时会被sesame解析并生成随机数。    
data为函数时可以调用sesame.random来生成各种随机数。

# 随机数规则 
sesame会将带有$type的对象传入$type值的随机数生成器中，$type之外的属性则会作为参数传入生成器中。  
例:
```
sesame.mock("/goform/getMyData","post",{
    randomNumber:{
        $type:"number",
        range:[1,100]
    },
    randomIp:{
        $type:"ip",
        range:"192.168.0-1.1"
    },
    randomBool:{
        $type:"boolean",
        truePercent:80
    },
    array:[{
        $type:"number",
        range:[-100,0]
    },20],
    normal:{
        aa:"aa",
        cc:"bb"
    },
    other:1
});
```

那么当匹配到"/goform/getMyData"这个请求时，会返回一个对象  
```
{
    randomNumber: 11,     //一个1~100的随机数，每次返回值都不一样
    randomIp:192.168.0.1, //192.168.x.1  其中x为0~1
    randomBool:false,     //80%的概率返回true 20%概率返回false  
    array:[-50,20],       //数组中的对象能被正常解析
    normal:{              //对象内没有$type则不会被解析  
        aa:"aa",
        cc:"bb"
    },
    other:1               //不是对象也不会被解析  
}
```