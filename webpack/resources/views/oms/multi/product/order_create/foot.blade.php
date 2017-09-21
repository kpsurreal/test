<div class="foot">
    <span class="indexs">
        <span class="index">
            上证指数
            <str data-class="000001.change|rgColor">
                <str data-src="000001.last_price|numeral:0.00"></str>
                <str data-src="000001.change|numeral:0.00"></str>
                <str data-src="000001.change_ratio|numeral:0.00%"></str>
            </str>
        </span>
        <span class="index">
            深证指数
            <str data-class="399001.change|rgColor">
                <str data-src="399001.last_price|numeral:0.00"></str>
                <str data-src="399001.change|numeral:0.00"></str>
                <str data-src="399001.change_ratio|numeral:0.00%"></str>
            </str>
        </span>
        <span class="index">
            创业板指
            <str data-class="399006.change|rgColor">
                <str data-src="399006.last_price|numeral:0.00"></str>
                <str data-src="399006.change|numeral:0.00"></str>
                <str data-src="399006.change_ratio|numeral:0.00%"></str>
            </str>
        </span>
    </span>
    <span class="time" data-src="time">2016/08/01 10:16:22</span>

    <script>
    (function(){
        var me = $(this);
        var data = {
            '000001':{},
            '399001':{},
            '399006':{},
        };

        var indexs = [
            '000001.SH', //上证指数
            '399001.SZ', //深证指数
            '399006.SZ'  //创业板指
        ];
        var url = (window.REQUEST_PREFIX||'')+"/oms/helper/stock_brief?stock_id="+indexs.join(',');

        $(loadStockIndexs);
        setInterval(render,1000);
        setInterval(loadStockIndexs,6000);

        function loadStockIndexs(){
            $.get(url).done(function(res){
                if(res.code==0){
                    var res_data = $.pullValue(res,'data',[]);
                    res_data.forEach && res_data.forEach(function(index_stock){
                        $.extend(data[index_stock.stock_code],index_stock);
                    });
                    render();
                }
            });
        }

        function render(){
            data.time = moment().format('YYYY/MM/DD HH:mm:ss');
            me.render(data);
        }
    }).call( document.scripts[document.scripts.length-1].parentNode );
    </script>
</div>
