--------------------------------------------------------------------------------
P1. 实现方式
--------------------------------------------------------------------------------
数据渲染
	数据获取
		同步植入：
            php传入json数据到 DOM 里面，js 读取。
            例如：
                window.LOGIN_INFO，里面包含用户信息，用户权限数据
                单策略页面 window.PRODUCT，包含策略详细数据
		异步拉取：
            各种列表数据
		数据拼接：
            列表数据中没有 股票名称、策略名称、用户名称 的，通过异步取得，本地缓存，然后合并到列表数据中
            参见 oms.app.js mergeBriefStocksInfo mergeBriefUserInfo mergeProductsBriefInfo
		定时更新
	渲染数据
        me.render(data);
        自定义属性：
            data-src    格式化数据并填充、部分控件渲染
            if          切换可见状态
            data-class  主要用于红绿颜色显示
            render-once 只渲染一次，reRender 的时候不再会受影响
        数据存取：
            getCoreData 获取渲染填充的数据，主要用于渲染后操作DOM节点，和交互逻辑的数据读取传递
        过滤器：
            | 通道符过滤，格式化数据
            : 分割追加参数列表
        参见 oms.render.js, oms.filters.js
	渲染列表
        me.renderTable(list);
		数据排序
            页内数据排序
                设置属性标记 inner-sort
            异步数据排序
                sort_by:changed 事件
                getMoreParams getRowsHeadSortParams 获取排序参数
            参见 oms.app.js setRowsHeadSortBy getMoreParams getRowsHeadSortParams
		数据分页
            getPageControls 渲染分页组件
            异步数据排序
                me.on('nav') 监听分页变动请求
                参见 oms.filters.js getPageControls
代码拆分
	后端拼接：通过 @include 拼接拆分过后的代码模块
	前端模块：
    <div comment="模块容器">
        <div comment="模块内容"></div>
        <script>
        (function(){
            var me = $(this);
            //模块逻辑代码....
        }).call(document.scripts[document.scripts.length-1].parentNode);
        </script>
    </div>

交互逻辑
	事件广播：模块之间数据通讯，主要通过 trigger 来实现，方便代码解耦
	数据共享：事件广播会带上目标数据，目标数据是Object对象的，按引用传递实现共享数据实例。
	特殊组件：
        通过 data-src 注入
            getRangeInput    百分比拖动条
            getPageControls  分页控件
            getMagicSuggest  股票代码智能建议
            参见 oms.filters.js
        通过 <自定义标签></自定义标签> 注入
            <clearLocalStorage></clearLocalStorage> 本地缓存清理
            <silentCtrl></silentCtrl>               安静模式/正常模式
            <RiskCtrl></RiskCtrl>                   前端风控/后端风控
            <robotStatus></robotStatus>             机器人状态检测[已停用]
            参见 oms.component.js

数据缓存
	界面状态缓存：记忆导航状态、日期选择输入
        前后端风控切换、正常安静模式切换
        侧边导航开闭状态
        股票买入板块的激活导航
	异步数据缓存：方便初次快速展示
        侧边导航策略列表[已经隐藏]
        单策略页面持仓列表数据
    方法
        omsUpdateLocalJsonData 存数据
        omsGetLocalJsonData    取数据
        参见 oms.utilities.js

--------------------------------------------------------------------------------
P2. 重要业务
--------------------------------------------------------------------------------
下单
	表单验证
        pattern 参见 oms.directives.js
        getStuckInputs 参见 new_order.blade.php
	表单提交
        单策略单股票下单：直接提交
        多股票批量下单：参见 submit.blade.php
        多策略下单
            事件 create_order:form:submit 参见 multi/product/order_create/new_order.blade.php
            处理 multiProductsSubmit 参见 is_running.blade.php
    表单数据派发：多策略下单和多股票批量下单，都有表单数据派发，下单数量提前反馈的机制
        多策略 distributeFormDate 参见 is_running.blade.php
        多股票批量下单 distributeTradeData 参见 multi_order/table.blade.php

订单
	状态流转
        订单总状态    statusCH
        下单流转状态  orderStatusCH
        撤单流转状态  cancelStatusCH
        参见 oms.filters.js
	状态变更
        下单 -> 分单 -> 委托 -> 成交
        请求撤单 -> 执行撤单
        订单操作面板
            allocation_index.blade.php   分单单员使用
            allocation_execute.blade.php 下单员使用
            allocation_trader.blade.php 操盘手使用

风控 modified by liuzeyafzy@gmail.com: 风控模块已经采取前端风控的模式。
    单股票：
        单策略：可买可卖数量检测 -> 提交订单前风控
        多策略：提交前风控检测
        数据依赖：风控数据依赖多个异步数据返回
            brief_info_ready        策略信息[一次获取]
            settlement_info_ready   结算数据[5s自动更新]
            position_ready          仓位数据[5s自动更新]
            risk_rules_ready        风控规则[一次获取]
            detail_ready            股票数据[5s自动更新]
            全部 ready 为 true 之后才能完成风控检测，否则会展示风控检测等待状态
            monitorRiskTaskCondition 执行依赖数据填充，和ready检测工作
            参见 oms.risk_check.js modified by liuzeyafzy@gmail.com: 该文件已废弃，采取前端风控模式
    多股票：买入依赖后端接口，卖出依赖持仓可卖数据
    前端风控&后端风控
        单策略单股票的可卖可买数量，前端有输入价格做参考，比后端准确。
        提交订单前风控，结果必须一致，可以相互比对。

更新通知
	Last_update 长连接，周期3s，收到信息后广播事件和时间戳，相关模块自动对比时间戳，触发更新。
        get_updated_info 长轮询
        get_notice_info  获取侧边栏小红点，声音提醒
        注意事项：Last_update 长轮询占用浏览器并发限制额度，同时打开多个页面会导致长轮询失效，请求周期变长，数据更新不及时。
    easemob 环信推送[因无法评估推送到达率，暂时停用]
    参见 tasks.blade.php

权限控制
    个人权限数据伴随个人信息同步植入，存储在 window.LOGIN_INFO 中
    侧边栏入口访问权限
    策略数据、订单状态变更读写权限
    参见 /omsv2/oms/etc/auth 页面，仅超级管理员可访问

--------------------------------------------------------------------------------
P3. 页面结构
--------------------------------------------------------------------------------
顶部导航：
    侧边导航开关
    本地测试开关
        正常/安静模式：安静模式下，last_update 自动更新会关闭
        前端/后端风控：单策略下单，风控方案切换
    RootUser 特权页面入口
        权限管理
        Order异常
    登出

侧边主导航：
    用户信息
    我的任务导航：根据权限展示不同导航入口，负责『last_update更新』和『更新notice』展示，并通告全局
    策略导航：按状态划分的多策略入口，单策略入口[已经隐藏]，获取用户有权查看的 all_products，并通告全局

主面板：
    头部信息：
        页面标题、页内导航
        单策略头部信息：策略详细数据初始化获取，定时更新实时结算数据

    列表界面
        订单列表：
            委托列表：未分单、已分单、已完成
            成交列表

        持仓列表
            单策略持仓
            多策略持仓
                交易快捷操作

        策略列表
            实时结算数据展示
            勾选控制
            下单前反馈
            下单提交

    下单界面
        单策略下单
            单股票下单
                股票智能建议
                五档行情
            多股票下单
                批量买入：
                    自选股增删
                    可用资金及风控
                批量卖出：拉取持仓，实时同步持仓
                下单前反馈
        多策略下单
            导航：单买、单卖、批量买、批量卖
            个股交易历史
            指数行情
