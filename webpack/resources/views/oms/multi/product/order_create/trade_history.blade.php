<!--
成交历史模块 //3.8.0版本，因为需求单1003016而对这个页面进行删除。文件代码虽然保留，但已不会再有页面引用了。
trigger: 无

on:
product:position:row-click //用户点击持仓的某行，需要显示该股票的交易历史
order_create:stock_code:ready //用户修改想购买股票后，需要显示新的股票交易历史
 -->
<div class="section-panel stock-trade-history" style="display:none;">
  <header class="popup-hd">
    <font style="font-size:16px;font-weight:600;">个股交易历史</font>
    &nbsp; &nbsp; 交易策略 <str data-src="product.name"></str>
  </header>
  <div class="popup-bd">
    <div class="content-bd">
      <table class="oms-table loading-loading nothing-nothing">
        <tr class="hd">
          <th>成交时间</th>
          <th>交易方向</th>
          <th class="cell-right">交易价格</th>
          <th class="cell-right">交易数量</th>
          <th class="cell-right">交易金额</th>
        </tr>
        <tbody class="loading-hide" rows-body></tbody>
        <script type="text/html" row-tpl>
          <tr>
            <td data-src="updated_at|unixTime"></td>
            <td>
              <span data-src="entrust.model|entrustModelCH"></span>
              <span data-class="entrust.type|mapVal:1->red,2->blue" data-src="entrust.type|entrustTypeCH"></span>
            </td>
            <td class="cell-right" data-src="deal.price|numeral:0,0.000"></td>
            <td class="cell-right" data-src="deal.amount|numFormat:0,0"></td>
            <td class="cell-right" data-src="deal.price|multiply_by:deal.amount|numeral:0,0.000"></td>
          </tr>
        </script>
      </table>
      <div class="page-ctrls" data-src="|getPageControls"></div>
    </div>
  </div>
  <script>
  (function(){
      var me = this;
      var position;

      $(window).on('product:position:row-click',function(event){
          var now_position = event.position;
          if(
              now_position==position || (
                  $.pullValue(position,'stock_id')==$.pullValue(now_position,'stock_id')
                  && $.pullValue(position,'product_id')==$.pullValue(now_position,'product_id')
              )
          ){
              return;
          }else{
              position = now_position;
          }

          showOrderHistoryByPosition(event.position);
      }).on('order_create:stock_code:ready',function(event){
          var stock_id = $.pullValue(event,'stock.stock_id',NaN);
          stock_id!=$.pullValue(position,'stock_id',NaN) && me.hide();
      });

      function showOrderHistoryByPosition(position){
          var url = (window.REQUEST_PREFIX||'') + '/oms/order/get_deal_list?permission_type=product&product_id=' + position.product_id + '&count=5&stock_id='+position.stock_id + '&start=2015-01-01';

          me.render({
              product: {
                  name: $.pullValue(position, 'product.name')
              },
              stock: {
                  code: position.stock_id,
                  name: position.stock_name
              }
          });
          me.find('table').renderTable([]);
          me.show();

          loadOrderHistoryList(url);
          me.find('.page-ctrls').off('nav').on('nav',function(event){
              // 塞入参数然后加载 orders 数据
              var page_num = event.page_num;
              url = url.replace(/page\=\d?\&?/g,'').replace('?','?page='+page_num+'&');
              loadOrderHistoryList(url);
          });
      }

      function loadOrderHistoryList(url){
          me.find('.loading-loading').addClass('loading').end().find('.nothing-nothing').removeClass('nothing');

          var last_loading_timestamp = new Date().valueOf();
          me.attr('last_loading_timestamp',last_loading_timestamp);
          $.getJSON(url,function(res){
              if( me.attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
              if(res.code==0){
                  // 分页逻辑
                  $.pullValue(res,'data.list') ? me.find('.page-ctrls').render( $.pullValue(res,'data') ) : me.find('.page-ctrls').html('');
                  // 获取数据列表的逻辑，兼容分页数据和非分页数据
                  var orders = $.pullValue(res,'data.list',$.pullValue(res,'data',[]));

                  orders.length && me.find('table').renderTable(orders);
                  !orders.length && me.find('.nothing-nothing').addClass('nothing');
              }else{
                  $.omsAlert('获取信息失败！'+(res.msg||'未知错误！'),false);
              }
          }).always(function(){
              if( me.attr('last_loading_timestamp')!=last_loading_timestamp ){return;}
              me.find('.loading-loading').removeClass('loading');
          });
      }
  }).call( $(document.scripts[document.scripts.length-1]).parent() );
  </script>
</div>
