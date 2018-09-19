#sesame  


#sesame.random

##sesame.random.extend(type,generator)  todo
该方法主要用于拓展新的随机数  

@type :  随机数的名称  例如取名为myRandom  
之后便可以通过sesame.random("myRandom",options)来生成对应的随机数。  
或者在数据中通过
```
{
    $type:"myRandom",
    ...options
}
```
来解析自定义随机数

@generator:随机数生成器  

