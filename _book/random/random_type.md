左上角有搜索按钮  
右上角有索引的哦~

#公共属性  

\$type:type  表示随机数的类型   

\$pool:[]    当配置有\$pool时，无论\$type为何值,总是会优先从pool中选取一个值。如果想选取多个值，请使用array类型  

\$include:regExp  输出不满足该正则表达式时重新随机。随机超过100次之后会报错。（todo）  

\$exclude:regExp  输出满足该正则表达式时重新随机。如果同时配置了\$include会需要同时满足两者。随机超过100次之后会报错（todo）

#随机数拓展  
如果你想拓展自己的随机数，请看这里[随机数拓展](../api/README.md)

##boolean  
随机生成一个布尔值 true或者false
**参数**  
truePercent:50  
@type: number  可以为浮点数  
@default: 50.00  
@description: 表示随机数中true的概率    
@check:  truePercent必须在[0,100]区间内，闭区间  
```
demo:
{
    boolean1:{
        $type:"boolean",
        truePercent:0         //必定为false
    },
    boolean2:{
        $type:"boolean",
        truePercent:40.223    //40.223%概率为true
    },
    boolean3:{
        $type:"boolean",
        truePercent:100       //100%为true
    }
}
```

##number 
随机生成一个整数  
**参数**:
range:[min,max]  
@type：Array  
@default:[1,100]
@length： 2 数组长度必须为2，否则报错
@description: 表示随机生成整数的范围，
@check:1.min必须小于等于max 2.min和max必须为整数  

```
demo:
{
    randomNumber:{
        $type:"number",
        range:[-100,-80]   
    },
    randomNumber2:{
        $type:"number",
        range:[-290,1399]	
    },
    randomNumber3:{
        $type:"number",
        range:[0,0]	
    }
}
```
##float  
随机生成一个浮点数  
**参数**  todo

##time  
随机生成一个指定格式的时间，或者时间戳  
**参数** todo

#array
随机生成一个数组  
**参数**  
**length**:[min,max] || length  ,表示数组随机的长度  min可以等于max  
@type : Array || Number || String     String会转成Number
@description:表示随机生成的数组的长度 

**generator**:function(){}  
@type:Function   返回一个随机值
@description:数组中的每一个成员都是通过调用该成员产生的

**arrayPool**:[] 
@type:Array  
@description:如果配置了该项，则generator会失效，数组中的成员会从这个数组中随机选取

**poolRepeat**:
@type:boolean  
@default:true   能够重复
@description:表示当arrayPool配置时，选取的元素是否能够重复  
@check: 当poolRepeat为false时，arrayPool的长度必须大于length中的最大值

##ip
随机生成一个IPv4地址  
**参数** 
range:
@type:String    注意IP的range是一个字符串，与其余的range为数组不同  
@default:"0-255.0-255.0-255.0-255"
@description: 表示随机IP生成的范围，通过.分隔，-表示范围。
@check: 每一位ip都必须在[0,255]区间内，左右端点必须为数字。
```
demo:
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
```


##mask
随机生成一个子网掩码  
**参数**
range:[min,max] 
@type:Array  
@default:[1,32]  
@description:表示子网掩码的位数  可选值1-32位例如32位掩码即255.255.255.255
@check:  min不得大于max，min和max必须大于0小于等于32  

```
demo:
{
    mask1:{
        $type:"mask",
        range:[24,25]
    },
    mask2:{
        $type:"mask",
        range:[26,30]
    }
}
```



