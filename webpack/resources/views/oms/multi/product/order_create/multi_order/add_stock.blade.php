<!--
单产品多股票购买页面 添加股票按钮
trigger:
create_order:multi_stocks:add_stock //添加自选股之后，更新股票列表

on:
stock:add_follow //加自选事件触发后，添加到自选中

 -->

<div class="add-item">
    <div class="input-field">
        <input id="add_stock_code" placeholder="输入股票代码 ..." pattern="^(\d{6}\.(SZ|SH)|\d{5}\.(HK))$" focus-class="active" active-slide="#magic-suggest">
        <div class="magic-suggest-wrap" data-src="|getMagicSuggest"></div>
    </div>
    <span>添加股票</span>

    <script>
    (function(){
        var me = $(this);
        $(function(){
            me.find('.magic-suggest-wrap').render();
            me.find('span').on('click',addStock);

            me.on('stock_code:suggest',function(event){
                var stock = event.stock;
                me.find('input').attr('stock_id', stock.stock_id);
                me.find('input').val(stock.stock_code + '.' + stock.exchange.slice(0,2)).change();
            });
        });

        $(window).on('stock:add_follow',function(event){
            var stock = event.stock;
            me.find('input').attr('stock_id', stock.stock_id);
            me.find('input').val(stock.stock_code + '.' + stock.exchange.slice(0,2)).change();
            me.find('span').click();
        });

        function addStock(){
            if(me.find('input.stuck').focus().length){$.omsAlert('股票代码不正确！',false);return;}
            if(me.find('.loading-loading').is('.loading')){return;}

            var url = (window.REQUEST_PREFIX||'')+'/user/stock-follow/add';
            var stock_id = me.find('input').val();
            var stock_id_long = me.find('input').attr('stock_id');
            me.find('.loading-loading').addClass('loading');
            $.post(url,{stock_id: stock_id_long}).done(function(res){
                if(res.code==0){
                    $.omsAlert('添加自选股 '+stock_id+' 成功！');
                    var tmpLi = me.find('.magic-suggest>li');
                    var stock_name = '';
                    tmpLi.each(function(){
                        var arr = $(this).html().split(' &nbsp; ');
                        if (arr[0] == stock_id) {
                            stock_name = arr[1];
                        }
                    });
                    $(window).trigger({type:'create_order:multi_stocks:add_stock',stock:{stock_id:stock_id, stock_name: stock_name}});
                    me.find('input').val('').change();
                }else{
                    res.code==502204 ? $.omsAlert(res.msg,false) : $.failNotice(url,res);
                }
            }).fail($.failNotice.bind(null,url)).always(function(){
                me.find('.loading-loading').removeClass('loading');
            });
        }
    }).call(document.scripts[document.scripts.length-1].parentNode);
    </script>
</div>
