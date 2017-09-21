#说明
之前旧的处理逻辑是oms.less通过import引用了所有的组件，使得oms.less过于庞大且包含了不需要的东西
现在逐步把公共部分样式剥离出来，放到这个文件夹内。

兄弟文件夹有bms和oms_v2也是为了同样的功能而创建的。

注意，由于历史遗留，最先使用的四个公共less文件并没有移入此文件夹(正在逐步移入，会同时存在两份)，他们是：
@import url(../reset.import.less);
@import url(../oms/main.import.less);
@import url(../oms/navbar.import.less);
@import url(../oms/base.import.less);
