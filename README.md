mmDialog
========

一个基于jQuery的弹出层
<table>
    <thead>
        <tr><th>参数</th><th>类型</th><th>说明</th></tr>
    </thead>
    <tbody>
        <tr><td>skin</td><td>String</td><td>default|aero|mac|blue|green|orange</td></tr>
        <tr><td>title</td><td>String</td><td>"标题"</td></tr>
        <tr><td>content</td><td>String</td><td>"",窗口的内容</td></tr>
        <tr><td>open</td><td>function</td><td>弹出窗口时执行的回调</td></tr>
        <tr><td>close</td><td>function</td><td>关闭窗口时执行的回调</td></tr>
        <tr><td>isDrag</td><td>boolean</td><td>是否拖动，默认能</td></tr>
        <tr><td>isMask</td><td>boolean</td><td>是否使用遮罩层，默认使用</td></tr>
        <tr><td>isFull</td><td>boolean</td><td>是否全屏，默认否</td></tr>
        <tr><td>top</td><td>number</td><td>窗口的左上角的Y坐标</td></tr>
        <tr><td>left</td><td>number</td><td>窗口的左上角的X坐标，如果它们都没有指定，则全屏居中垂直</td></tr>
        <tr><td>width</td><td>number</td><td>窗口的宽</td></tr>
        <tr><td>height</td><td>number</td><td>窗口的高</td></tr>
        <tr><td>closeTime</td><td>number</td><td>延迟关闭时间</td></tr>
    </tbody>

</table>
一个mmDialog实例拥有如下属性: head(放置标题的h1的jQuery对象), body(放置内容的div的jQuery对象),
foot(放置分页栏,按钮等杂物的位于下方的div的jQuery对象), el(最外的div的jQuery对象)

它最重要的实例方法就是teardown,用于销毁自身