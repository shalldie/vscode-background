## ver1.1.17 (2017/11/12)
    fix bug: 在vscode更新的时候，遗漏了 非初次加载插件&&css文件未hack 的情况。
    产生原因：用ts重写的时候遗漏。
    fix bug: while vscode updated,extension can't work well.
    why it happens: My fault,i forgot it when rewrite it by typescript.Sorry...

## ver1.1.16 (2017/10/30)
    用 typescript 重写了一下，因为旧代码太恶心了。
    rewrite by typescript,because the old code is so rubish. :D
    修复了旧版本的一个bug：插件卸载之后，注册的事件并没有dispose掉。
    fix bug: After extension has been uninstalled,the event doesn't dispose currently.
    

## ver1.1.14 (2017/7/3)
    Fix the bug,which "z-index" caught.
    修复背景图后置的 z-index 导致样式影响问题

## ver1.1.13 (2017/6/29)
    "background.useFront":boolean
    add config to on the top of code,or behind the code.
    添加图片前置，后置功能。

### ver1.1.12 (2017/6/27)
    Config opacity. 添加自定义透明度功能。
    remove background to the css3 [::after],so u can config opacity now!
    把background的背景移植到css3属性[::after]上，所以现在可以配置透明度。    

### ver1.1.10 ver1.1.11 (2017/3/27)
    添加 minimap 透明度
    增加自定义样式功能

### ver1.1.9 (2016/12/15)
    ver.1.1.8
    修复vscode升级到1.8，导致插件不能用的问题
    ver.1.1.9
    修复背景重影的问题

### ver1.1.7 (2016/9/27) 
    将 cunstomImages 修改为 customImages
    Please use customImages in your settings.json

### ver1.1.6 (2016/9/26  11:57)
    vscode升级会覆盖原css，添加处理，再次覆盖回去。。。

### ver1.1.5 (2016/9/26)
    1.将输入框改成配置文件 setting.json
    2.图片路径注入对时候，进行 encodeURI 编码，并用引号扩起来
    3.其它部分代码优化和更改

### ver1.1.4 (2016/8/30)
    之前文件名写错了...导致在linux下出错。 Sorry ... 该版本已修复.

### ver1.1.3 (2016/8/27)
    重写了所有代码。  可以自动获取vscode安装目录，去除注入js的方式，改为直接修改css。
    windows 跟 mac 已经完全支持。  Linux 相信也没问题，，，但是这个我无法测试，ahaha。

#### ver1.1.2 (2016/8/21)
    买了一台mac...于是把mac支持了。感谢 [@asteryk](https://github.com/shalldie/vscode-background/issues/2)  :D


#### ver1.1.1 (2016/8/11)
    修复vscode1.4下不能使用的问题。