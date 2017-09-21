<!--
五档行情模块
trigger:
order_create:trade_5:updated //股票更新，触发
order_create:trade_5:updated:first //股票更新，第一次更新，设置下单价格
policy_display_change //指令相关的事件 与原来的下单无关

on:
order_create:stock_code:ready //用户修改股票校验通过后，查询新的五档行情
create_order:stock_code:pattern_stuck //购买股票代码校验失败，清空五档行情
 
 -->
<div class="section-panel trade-5" updown-monitor="udm_trade_5:${stock_id}">
  <div class="panel high-low">
    <h1 class="loading-loading">
      <span data-src="stock_code|--" class="code">- -</span><br/>
      <span data-src="stock_name|--">- -</span>
    </h1>
    <div class="hd loading-loading" data-class="change_ratio|rmgColor">
      <b class="last_price" data-src="last_price|numeral:0,0.000">- -</b>
      <span data-src="change|numeral:0,0.000"></span>
      <span data-src="change_ratio|numeral:0,0.000%"></span>
    </div>
    <div class="bd">
      <p>
        今开：<span data-src="open_price|numeral:0,0.000" data-class="open_price|minus:prev_close_price|rmgColor">- -</span><br/>
        昨收：<span data-src="prev_close_price|numeral:0,0.000">- -</span>
      </p>
      <p>
        最高：<span data-src="high_price|numeral:0,0.000" data-class="high_price|minus:prev_close_price|rmgColor">- -</span><br/>
        最低：<span data-src="low_price|numeral:0,0.000" data-class="low_price|minus:prev_close_price|rmgColor">- -</span>
      </p>
      <p if="market|equalString:1">
        涨停：<span class="stop_top_price" data-src="stop_top|numeral:0,0.000" data-class="stop_top|minus:prev_close_price|rmgColor">- -</span><br/>
        跌停：<span class="stop_down_price" data-src="stop_down|numeral:0,0.000" data-class="stop_down|minus:prev_close_price|rmgColor"></span>
      </p>
    </div>
  </div>
  <div class="panel ask-bid">
    <div class="ask-bid__trade-tip hide"></div>
    <table>
      <tbody class="ask">
        <tr>
          <td>卖5</td>
          <td data-src="ask5_price|numeralTrade5:0,0.000" data-class="ask5_price|rmgColorTrade5:prev_close_price">- -</td>
          <td data-src="ask5_volume|numeralTrade5:0,0">- -</td>
        </tr>
        <tr>
          <td>卖4</td>
          <td data-src="ask4_price|numeralTrade5:0,0.000" data-class="ask4_price|rmgColorTrade5:prev_close_price">- -</td>
          <td data-src="ask4_volume|numeralTrade5:0,0">- -</td>
        </tr>
        <tr>
          <td>卖3</td>
          <td data-src="ask3_price|numeralTrade5:0,0.000" data-class="ask3_price|rmgColorTrade5:prev_close_price">- -</td>
          <td data-src="ask3_volume|numeralTrade5:0,0">- -</td>
        </tr>
        <tr>
          <td>卖2</td>
          <td data-src="ask2_price|numeralTrade5:0,0.000" data-class="ask2_price|rmgColorTrade5:prev_close_price">- -</td>
          <td data-src="ask2_volume|numeralTrade5:0,0">- -</td>
        </tr>
        <tr>
          <td>卖1</td>
          <td data-src="ask1_price|numeralTrade5:0,0.000" data-class="ask1_price|rmgColorTrade5:prev_close_price">- -</td>
          <td data-src="ask1_volume|numeralTrade5:0,0">- -</td>
        </tr>
        <tr class="blank-tr"><td>&nbsp;</td></tr>
      </tbody>
      <tbody><tr class="hr-tr"><td colspan="3" class="hr"></td></tr></tbody>
      <tbody class="bid">
        <tr>
          <td>买1</td>
          <td data-src="bid1_price|numeralTrade5:0,0.000" data-class="bid1_price|rmgColorTrade5:prev_close_price">- -</td>
          <td data-src="bid1_volume|numeralTrade5:0,0">- -</td>
        </tr>
        <tr>
          <td>买2</td>
          <td data-src="bid2_price|numeralTrade5:0,0.000" data-class="bid2_price|rmgColorTrade5:prev_close_price">- -</td>
          <td data-src="bid2_volume|numeralTrade5:0,0">- -</td>
        </tr>
        <tr>
          <td>买3</td>
          <td data-src="bid3_price|numeralTrade5:0,0.000" data-class="bid3_price|rmgColorTrade5:prev_close_price">- -</td>
          <td data-src="bid3_volume|numeralTrade5:0,0">- -</td>
        </tr>
        <tr>
          <td>买4</td>
          <td data-src="bid4_price|numeralTrade5:0,0.000" data-class="bid4_price|rmgColorTrade5:prev_close_price">- -</td>
          <td data-src="bid4_volume|numeralTrade5:0,0">- -</td>
        </tr>
        <tr>
          <td>买5</td>
          <td data-src="bid5_price|numeralTrade5:0,0.000" data-class="bid5_price|rmgColorTrade5:prev_close_price">- -</td>
          <td data-src="bid5_volume|numeralTrade5:0,0">- -</td>
        </tr>
      </tbody>
    </table>
  </div>
  <script>
  (function(){
    var me = $(this);
    var update_timer;
    var stock;
    var updated_count = 0;
    var direction = 'buy';
    //判断是否是新股
    function judgeNewStock(stock_code){
      let result = false;
      window.new_stock_list.forEach(function(e){
            // let stock_id = e.stock_id.replace(/\.(SZ|SH)$/i,'')
        if( stock_code == e.ticker ||stock_code == e.stock_id || stock_code == e.ipo_code){
          result =  e;
          result.stock_id = e.ipo_code + '.' +e.stock_id.split('.')[1];
          result.asset_class = "new"
        }
      })
        return result;
    }

    $(window).on('order_create:direction:changed', function(event){
      direction = event.direction;
    });

    // 事件监听，当鼠标在bid和ask中移动时，变化其中样式。
    var priceInterval;
    $(document).on('mouseover', 'tbody.ask>tr', function(event){
      if ('buy' == direction) {
        ;
      }else{
        return;
      }
      var data = me.getCoreData()
      if (data && data.stock_code) {
        var text = $(this).find('[data-src*=_price]').text().trim();
        if (isNaN(text - 0)) {
          return;
        }

        $(this).parents('tbody.ask').children('tr').removeClass('mouseover');
        $(this).addClass('mouseover');
        $(this).nextUntil('tr.blank-tr').addClass('mouseover');

        var _this = this;
        var doShowText = function(){
          // 点击<span>买</span><span>2</span>则自动将价格设置为买2价16.80，本次委卖数量设为69,000股(买1-2的总挂单量）
          var price = parseFloat($(_this).find('[data-src*=_price]').text().trim().replace(/\,/g,'')) || 0;
          var volume = parseFloat($(_this).find('[data-src*=_volume]').text().trim().replace(/\,/g,'')) || 0;

          $(_this).nextUntil('tr.blank-tr').each(function(i, e){
            volume += parseFloat($(e).find('[data-src*=_volume]').text().trim().replace(/\,/g,'')) || 0;
          });

          volume = Math.floor(volume / 100) * 100;
          volume = numeral(volume).format('0,0')
          var index = parseFloat($(_this).children().first().text().trim().replace(/[^\d]/g,'')) || 0;
          // var text = '点击卖'+ index +'则自动将价格设置为卖'+ index +'价'+ price +'，本次委买数量设为'+ volume +'股(卖1-'+ index +'的总挂单量）';
          var text = `点击卖${index}则自动将价格设置为卖${index}价${price}，本次委买数量设为${volume}股(卖1-${index}的总挂单量）`;
          $('.ask-bid__trade-tip').css('top', 80 - 10 * (index - 1) + 'px').text(text).removeClass('hide');
        }
        doShowText();
        priceInterval = setInterval(function(){
          doShowText();
        }, 1000);
      }
    }).on('mouseout', 'tbody.ask', function(event){
      var data = me.getCoreData()
      clearInterval(priceInterval);
      if (data && data.stock_code) {
        $(this).children('tr').removeClass('mouseover');
        $('.ask-bid__trade-tip').addClass('hide');
      }
    }).on('mouseover', 'tbody.bid>tr', function(event){
      if ('sell' == direction) {
        ;
      }else{
        return;
      }
      var data = me.getCoreData()
      if (data && data.stock_code) {
        var text = $(this).find('[data-src*=_price]').text().trim();
        if (isNaN(text - 0)) {
          return;
        }

        $(this).parents('tbody.bid').children('tr').removeClass('mouseover');
        $(this).addClass('mouseover');
        $(this).prevAll().addClass('mouseover');

        var _this = this;
        var doShowText = function(){
          // 点击<span>买</span><span>2</span>则自动将价格设置为买2价16.80，本次委卖数量设为69,000股(买1-2的总挂单量）
          var price = parseFloat($(_this).find('[data-src*=_price]').text().trim().replace(/\,/g,'')) || 0;
          var volume = parseFloat($(_this).find('[data-src*=_volume]').text().trim().replace(/\,/g,'')) || 0;

          $(_this).prevAll().each(function(i, e){
            volume += parseFloat($(e).find('[data-src*=_volume]').text().trim().replace(/\,/g,'')) || 0;
          });

          volume = Math.floor(volume / 100) * 100;
          volume = numeral(volume).format('0,0')
          var index = parseFloat($(_this).children().first().text().trim().replace(/[^\d]/g,'')) || 0;
          // var text = '点击买'+ index +'则自动将价格设置为买'+ index +'价'+ price +'，本次委卖数量设为'+ volume +'股(买1-'+ index +'的总挂单量）';
          var text = `点击买${index}则自动将价格设置为买${index}价${price}，本次委卖数量设为${volume}股(买1-${index}的总挂单量）`;
          $('.ask-bid__trade-tip').css('top', 100 + 10 * (index - 1) + 'px').text(text).removeClass('hide');
        }
        doShowText();
        priceInterval = setInterval(function(){
          doShowText();
        }, 1000);
      }
    }).on('mouseout', 'tbody.bid', function(event){
      var data = me.getCoreData()
      clearInterval(priceInterval);
      if (data && data.stock_code) {
        $(this).children('tr').removeClass('mouseover');
        $('.ask-bid__trade-tip').addClass('hide');
      }
    }).on('click', 'tbody.ask>tr', function(){
      if ('buy' == direction) {
        ;
      }else{
        return;
      }
      var price = parseFloat($(this).find('[data-src*=_price]').text().trim().replace(/\,/g,'')) || 0;
      price && $('#val_price').val( price ).change() && $('#val_volume').focus();
      var volume = parseFloat($(this).find('[data-src*=_volume]').text().trim().replace(/\,/g,'')) || 0;
      $(this).nextUntil('tr.blank-tr').each(function(i, e){
        volume += parseFloat($(e).find('[data-src*=_volume]').text().trim().replace(/\,/g,'')) || 0;
      });
      volume = Math.floor(volume / 100) * 100;
      $(window).trigger({
        type: 'trade_5:click:change_volume',
        volume: volume
      });
    }).on('click', 'tbody.bid>tr', function(){
      if ('sell' == direction) {
        ;
      }else{
        return;
      }
      var price = parseFloat($(this).find('[data-src*=_price]').text().trim().replace(/\,/g,'')) || 0;
      price && $('#val_price').val( price ).change() && $('#val_volume').focus();
      var volume = parseFloat($(this).find('[data-src*=_volume]').text().trim().replace(/\,/g,'')) || 0;
      $(this).prevAll().each(function(i, e){
        volume += parseFloat($(e).find('[data-src*=_volume]').text().trim().replace(/\,/g,'')) || 0;
      });
      volume = Math.floor(volume / 100) * 100;
      $(window).trigger({
        type: 'trade_5:click:change_volume',
        volume: volume
      });
    });

    $(window).on('order_create:stock_code:ready',function(event){
      clear5();
      stock = event.stock;
      if(stock.stock && stock.stock.asset_class == "new"){
        // 新股时重新渲染行情
        stock.last_price = stock.stock.price;
        stock.stock_name = stock.stock.stock_name;
        stock.stock_code = stock.stock_id;
        renderStockDetail(stock)
        update_timer = setInterval(function(){
        renderStockDetail(stock);},5000);
      }else{
        update_timer = setInterval(function(){
          update5(stock);
        },5000);
        update5(stock);
      }

    }).on('create_order:stock_code:pattern_stuck',function(){
      clear5();
    });

    // 点击价格时修改对应价格
    me.on('click','[data-src*=_price],[data-src*=stop_top],[data-src*=stop_down]',function(){
      var price = parseFloat($(this).text().trim().replace(/\,/g,'')) || 0;
      price && $('#val_price').val( price ).change() && $('#val_volume').focus();
    });

    function update5(stock){
      me.render($.extend(stock,{loading:true}));
      var url = (window.REQUEST_PREFIX||'')+"/oms/helper/stock_detail?stock_id="+stock.stock_id;
      var last_loading_timestamp = new Date().valueOf();
      me.attr('last_loading_timestamp',last_loading_timestamp);
      me.find('.loading-loading').addClass('loading');
      $.get(url).done(function(res){
        if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}

        res.code==0 && renderStockDetail($.pullValue(res,'data.0'));
        // (res.code!=0||!res.data||!res.data[0]) && failNotice(res);
        if (1 == res.code) {
          // 错误码为1，不提示
          ;
        }else{
          (res.code!=0||!res.data||!res.data[0]) && failNotice(res);
        }
      }).fail(failNotice).always(function(){
        if(last_loading_timestamp!=me.attr('last_loading_timestamp')){return;}
        me.find('.loading-loading').removeClass('loading');
      });

      function failNotice(res){
        $.omsAlert($.pullValue(res,'msg','请求异常'),false);
      }
    }

    // 渲染股票信息
    function renderStockDetail(data){
      updated_count ++;
      stock = data;
      if(stock.asset_class == 2){
        stock.stop_down = undefined;
        stock.stop_top = undefined;
        $('#stock_code').attr('sotck_type','repo')
        //国债不可选择市价和限价；国债默认限价模式
        $('[click-active=".order_model_limit_price"]').click();
        $('.order_model-ctrl').addClass('disabled');
      }else{
        $('#stock_code').removeAttr('sotck_type');
      }
      me.render(stock);
      if(stock.asset_class == 2){
        //国债逆回购强刷样式
        $('.stop_top_price').removeClass('green');
        $('.stop_down_price').removeClass('green');
      }
      if(stock.stock){
        //新股结构为stock下的stock
        $(window).trigger({type:'order_create:trade_5:updated',stock:stock.stock});
        //当前股票第一次更新
        //updated_count==1 && $(window).trigger({type:'order_create:trade_5:updated:first',stock:stock.stock});
      }else{

        $(window).trigger({type:'order_create:trade_5:updated',stock:stock});
        //当前股票第一次更新
        updated_count==1 && $(window).trigger({type:'order_create:trade_5:updated:first',stock:stock});

        // //当市价时，触发到“产品管理单元”的“policy_display_change”事件
        // if ($('.order_model_market_price').hasClass('active')) {
        //     $(window).trigger({type:'policy_display_change'});
        // }
        
      }


    }

    // 清空五档行情
    function clear5(){
      updated_count = 0;
      clearInterval(update_timer);
      me.attr('last_loading_timestamp','');
      me.find('.loading-loading').removeClass('loading');
      me.render({});
    }
  }).call(document.scripts[document.scripts.length-1].parentNode);
  </script>
</div>
