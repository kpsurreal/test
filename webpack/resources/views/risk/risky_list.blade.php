<section class="order-list risk risky" inner-sort>
    <div class="hd">
        <span class="section-title">触警中策略</span>
        <a refresh-btn class="oms-btn gray refresh-btn loading-loading right" href="javascript:;"><i class="oms-icon refresh"></i>刷新</a>
        <span class="right">数据更新时间：<str data-src="product_new_list.update_time">--</str> &nbsp; </span>
        <span list-ctrls class="order-list-ctrls right" style="display:none;">
            {{-- <a data-uri="/risk/risky_list" class="active" href="javascript:;"></a> --}}
            <a data-uri="/rms/home?format=json" class="active" href="javascript:;"></a>
        </span>
    </div>

    @include('risk.list_table')

    <script>
    (function(){
        var me = $(this);
        var product_list = [];

        // 风控页面刷新按钮事件 第一次进来也是通过调用updateList再触发click事件来实现的
        me.find('[list-ctrls]').on('click','a',function(){
            $(this).addClass('active').siblings().removeClass('active');
            // 加载 items 数据
            var dataSrc = $(this).data('uri');
            loadList(dataSrc, renderList);
        });

        me.find('[refresh-btn]').on('click',updateList);

        $(window).on('risk_list_update_please',updateList);

        $(window).on('risk_list_updated',function(event){
            var risk_list_info = event.risk_list_info;
            me.children('.hd').render(risk_list_info);
        }).on('side_nav_product_list:updated:fresh',function(event){
            product_list = $.pullValue(event,'product_list.products',[]);
            updateList();
            //每半分钟自动刷新
            setInterval(updateList,30000);
        });

        function updateList(){
            me.find('[list-ctrls] a.active').click();
        }

        function loadList(uri, callback){
            me.parent().find('.loading-loading').addClass('loading');
            me.parent().find('.nothing-nothing').removeClass('nothing');

            var last_loading_timestamp = new Date().valueOf()
            me.find('[rows-body]').attr('last_loading_timestamp',last_loading_timestamp);

            var url = (window.REQUEST_PREFIX||'') + uri;

            $.getJSON( url ).then(function(res){
                if( me.find('[rows-body]').attr('last_loading_timestamp')!=last_loading_timestamp ){
                    return false;//过期结果直接抛弃
                }
                //填充委托单列表数据
                if (0 == res.code) {
                    var product_ids = [];
                    $.pullValue(res.data,'product_new_list.data',[]).forEach(function(e){
                        product_ids.push(e.id);
                    });
                    riskCheck.getRulesData(product_ids, function(){
                        callback(res.data);
                        me.find('[rows-body]').attr('last_updated_timestamp',(res.timestamp||0));
                    });
                }else{
                    $.omsAlert(res.code + ' : ' + (res.msg || '未知错误') + '，请稍候重试！',false);
                }
            }).always(function(){
                me.parent().find('.loading-loading').removeClass('loading');
            });
        }

        function renderList(risk_list_info){
            var products = risk_list_info.products = $.pullValue(risk_list_info,'product_new_list.data',[]);

            products.forEach(function(product){
                $.extend(product,getProductById(product.id));
            });

            var sad_products = risk_list_info.sad_products = [];
            var bad_products = risk_list_info.bad_products = [];
            var warn_products = risk_list_info.warn_products = [];
            var risky_products = risk_list_info.risky_products = [];
            var normal_products = risk_list_info.normal_products = [];

            //首先预处理 risk_list_info
            // 旧处理流程中，头部使用了sad_products（净值小于1）、bad_products（达到平仓线）、warn_products（达到告警线）
            // 但是下方内容的显示只分成了两个部分，正常或者非正常
            products.forEach(function(product){
                product.risk_status = getRiskStatus(product);
                product.settlement.net_value<1 && sad_products.push(product);
                product.risk_status.degree<1 && bad_products.push(product);
                product.risk_status.degree<2 && warn_products.push(product);
                product.risk_status.degree<2 ? risky_products.push(product) : normal_products.push(product);
            });

            for(var i in risk_list_info){
                risk_list_info.hasOwnProperty(i) && $.type(risk_list_info[i])=='array' && risk_list_info[i].sort(function(p1,p2){
                    var diff_degree = $.pullValue(p1,'risk_status.degree',0)-$.pullValue(p2,'risk_status.degree',0);
                    if( diff_degree<0 ) return -1;
                    if( diff_degree>0 ) return 1;

                    var diff_fund_type = $.pullValue(p1,'fund_inner_type',0)-$.pullValue(p2,'fund_inner_type',0);
                    if( diff_fund_type<0 ) return -1;
                    if( diff_fund_type>0 ) return 1;

                    var diff_net_value = $.pullValue(p1,'settlement.net_value',0)-$.pullValue(p2,'settlement.net_value',0);
                    if( diff_net_value<0 ) return -1;
                    if( diff_net_value>0 ) return 1;

                    return 0;
                });
            }

            $(window).trigger({type:'risk_list_updated',risk_list_info:risk_list_info});

            me.renderTable(risky_products);
            !risky_products.length && me.find('.nothing-nothing').addClass('nothing');
        }

        // 新的获取风控状态函数，返回状态：0止损、1预警、2正常、3-－
        function getRiskStatus(product){
            // 获取该组合的净值仓位限制
            var obj = riskCheck.getPositionInfo({
                total_assets: Infinity,
                net_value: Infinity,
                product_id: product.id
            });
            var risk_arr = [];
            obj.forEach(function(e){
                risk_arr.push({
                    net_value: Number(e.net_value),
                    position: e.position / 100
                })
            });
            var risk_line_data = risk_arr.sort(function(a, b){
                return a.net_value < b.net_value;// 排序取出净值最大的数据
            })[0];//预警线
            var closing_line_data = risk_arr.filter(function(e){
                return e.position == 0; //取出清仓的数据
            })[0];//止损线

            var result = {degree: 3, words: '--', risk_line: '--', closing_line: '--'};
            var net_value = +product.settlement.net_value||0;

            if (risk_line_data && closing_line_data) {
                var risk_net_value = risk_line_data.net_value;
                var closing_net_value = closing_line_data.net_value;
                if (risk_net_value < net_value) {
                    result = {degree: 2, words: '正常'};
                }
                if (net_value <= closing_net_value) {
                    result = {degree: 0, words: '止损'};
                }
                if (closing_net_value < net_value && net_value <= risk_net_value) {
                    result = {degree: 1, words: '预警'};
                }
                result.risk_line = risk_net_value;
                result.closing_line = closing_net_value;
            }else{
                if (risk_line_data) {
                    var risk_net_value = risk_line_data.net_value;
                    if (risk_net_value < net_value) {
                        result = {degree: 2, words: '正常'};
                    }else{
                        result = {degree: 1, words: '预警'};
                    }
                    result.risk_line = risk_net_value;
                    result.closing_line = '--';
                }else if (closing_line_data) {
                    var closing_net_value = closing_line_data.net_value;
                    if (net_value <= closing_net_value) {
                        result = {degree: 0, words: '止损'};
                    }else{
                        result = {degree: 3, words: '正常'};
                    }
                    result.risk_line = '--';
                    result.closing_line = closing_net_value;
                }else{
                    result = {degree: 3, words: '正常'};
                    result.risk_line = '--';
                    result.closing_line = '--';
                }
            }

            return result;
        }

        function getProductSettlementTypeCH(product){
            // const SETTLEMENT_TYPE_A          = 1; // A类策略
            // const SETTLEMENT_TYPE_BONUS_NRNG = 2; // 分红乐 牛人牛股
            // const SETTLEMENT_TYPE_BONUS_YDDD = 3; // 分红乐 盈多点点
            // const SETTLEMENT_TYPE_CHARITABLE = 4; // 公益乐
            // const SETTLEMENT_TYPE_MIRRORING  = 5; // 镜像策略
            // const SETTLEMENT_TYPE_CAREFREE 	 = 6; // 无忧型
            // const SETTLEMENT_TYPE_STEADY   	 = 7; // 稳赢型

            switch( +product.settlement_type ){
                case 1:
                    return 'caopanle';
                    break;
                case 2:
                    return 'fenhongle';
                    break;
                case 3:
                    return 'fenhongle';
                    break;
                case 4:
                    return 'caopanle';//公益乐当操盘乐
                    break;
                case 5:
                    return 'mirroring';
                    break;
                case 6:
                    return 'carefree';
                    break;
                case 7:
                    return 'steady';
                    break;
                default:
                    return NaN;
            }
        }

        function getProductById(id){
            return product_list.filter && product_list.filter(function(x){
                return x.id == id;
            })[0];
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</section>
