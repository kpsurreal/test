
<!--
创建订单
trigger:
order_create:stock_code:ready //股票校验事件，触发行情更新
create_order:stock_code:pattern_stuck //校验股票代码失败后触发
order_create:direction:changed // 下单方向被用户修改后触发，然后改本页面文案，修改下单模块的菜单
create_order:form:warning-toggle //单股票下单页面，当底部提示不能按照用户所期望购买时，显示问号按钮，用户点击该按钮，产品列表需要显示原因。
me:   stock_info_update //页面内部事件，更新了行情数据，买1价卖1价什么的
create_order:form:changed //触发“提交表单”的事件，但是成功失败分别如何处理待理解
'create_order:form:changed:' + (validate_pass ? 'pass' : 'stuck') //触发“提交表单”的事件，但是成功失败分别如何处理待理解
risk_info_pre_start //现在已经找不到监听处理该事件的地方了。因为前端风控已不需要向后台查询。
risk_info_pre_finish //现在已经找不到监听处理该事件的地方了。因为前端风控已不需要向后台查询。
create_order:form:submit //用户点击提交后，进行二次提示并提交

on:
multi_load
$('#stock_code').on. pattern_pass、pattern_stuck、stock_code:suggest
$('.direction-ctrl').on click_active

order_create:by_stock //点击持仓列表后，下单模块更新选中股票
order_create:trade_5:updated //五档行情更新，直接触发stock_info_update，其实就是页面内部事件，更新了行情数据，买1价卖1价什么的
order_create:trade_5:updated:first //五档行情第一次更新，更新价格
order_create:success //已经找不到触发该事件的地方了，且本模块监听之后也就做了下数据清空的处理
load spa_product_change //已经找不到触发该事件的地方了 balance_amount_changed //多产品相关已经找不到触发该事件的地方了
order_create:direction:changed //自己监听自己页面触发的事件，修改“提交委买”“提交委卖”这样的文字显示
order_create:trade_number_method:change //交易数量修改，重新判断是否通过校验
order_create:nav:multi-stocks:sell order_create:nav:multi-stocks:buy //收到菜单切换的事件后，清空单股票购买的数量。
multi_products:head:predict //从产品组列表模块获取数据，查看预计的数据是否通过校验什么的
product:position:row-click //用户点击持仓的某行，下单列表显示为该股票

 -->

<?php
use App\Services\OMS\Workflow\OMSWorkflowEntrustService;
?>
<link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
<style>
  .selectize-input{
    padding: 0 10px;
    border-radius: 3px;
    line-height: 28px;
    height: 28px;
    font-size: 12px;
    color: #000000;
    font-weight: normal;
  }
  .custon_option{
    position: relative;
    font-weight: normal;
    font-size: 11px;
    color: #595959;
  }
  .custon_option>span.default{
    display: none;

  }
  .custon_option>span.set_default{
    display: none;
    position: absolute;
    right: 5px;
    font-size: 10px;
    color: #2196F3;
    font-weight: normal;
    cursor: pointer;
  }
  .custon_option:hover>span.set_default{
    display: inline;
    /*display: block;
    top: 8px;*/
  }
  .custon_option.default:hover>span.set_default{
    display: none;
  }
  .custon_option.default>span.default{
    display: inline-block;
    position: absolute;
    right: 5px;
    font-size: 10px;
    color: #2196F3;
    font-weight: normal;
    cursor: pointer;
  }
  .custon_option.default>span.set_default{
    display: none;
  }
  .selectize-control{
    height: 28px;
  }
</style>
<script type="text/javascript" src="{{ asset('/js/plugin/selectize/js/standalone/selectize.js') }}"></script>
<div class="section-panel create-order">
  <div class="oms-popup popup-create-order" id="popup-create-order">
    <form class="popup-bd create-order-form" id="create_order_form" autocomplete="off">
      <div class="content-bd">
        <div class="field first-field">
          <label>股票代码</label>
          <div class="content stock-code">
            <input tabindex="1000" id="stock_code" data-market="marketA" type="text" autocomplete="off" name="stock_code" pattern="^(\d{6}\.(SZ|SH)|\d{5}\.(HK))$" x-placeholder="请输入股票代码或拼音" focus-class="active" active-slide="#magic-suggest" comment="#magic-suggest 定义在 oms.fliters 中...">
            <div class="magic-suggest-wrap" data-src="|getMagicSuggest"></div>
            <span class="stock-name" id="stock_name_addon"></span>
          </div>
        </div>
        <div class="field">
          <label>报价方式</label>
          <!-- A股的报价方式 -->
          <div class="content order_model-marketA">
            <label class="active order_model-ctrl order_model_limit_price" click-active=".order_model_limit_price">
              限价
              <input class="sr-only change-checkrisk-last" type="radio" checked="checked" name="trade_mode" value="{{OMSWorkflowEntrustService::ORDER_MODEL_LIMIT_PRICE}}">
              <i class="oms-icon right"></i>
            </label>
            <label class="order_model-ctrl order_model_market_price" click-active=".order_model_market_price">
              市价
              <input class="sr-only change-checkrisk-last" type="radio" name="trade_mode" value="{{OMSWorkflowEntrustService::ORDER_MODEL_MARKET_PRICE}}">
              <i class="oms-icon right"></i>
            </label>
          </div>

          <!-- 港股的报价方式 -->
          <div class="content order_model-marketH" style="display: none;">
            <select id="order_model-select"></select>
          </div>
        </div>
        
        <div class="field" style="display:none;">
          <label>买卖方向</label>
          <div class="content">
            <label class="active direction-ctrl buy" click-active="_self">
              买入
              <input class="change-checkrisk-last trade_direction_buy" type="radio" checked="checked" name="trade_direction" value="{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}">
              <i class="oms-icon right"></i>
            </label>
            <label class="direction-ctrl sell" click-active="_self">
              卖出
              <input class="change-checkrisk-last trade_direction_sell" type="radio" name="trade_direction" value="{{OMSWorkflowEntrustService::ORDER_DIRECTION_SELL}}">
              <i class="oms-icon right"></i>
            </label>
          </div>
        </div>
        <div class="field" style="display:none;">
          <label>市场类别</label>
          <div class="content">
            <label class="active market-ctrl marketA" click-active="_self">
              沪深
              <input class="change-checkrisk-last trade_marketA" type="radio" checked="checked" name="trade_market" value="1">
              <i class="oms-icon right"></i>
            </label>
            <label class="market-ctrl marketHSH" click-active="_self">
              港股
              <input class="change-checkrisk-last trade_marketH" type="radio" name="trade_market" value="2">
              <i class="oms-icon right"></i>
            </label>
            <label class="market-ctrl marketHSZ" click-active="_self">
              港股
              <input class="change-checkrisk-last trade_marketH" type="radio" name="trade_market" value="3">
              <i class="oms-icon right"></i>
            </label>
          </div>
        </div>
        <div>
          <div class="active-show order_model_limit_price">
          </div>
          {{-- 市价 不使用价格输入控制 --}}
          <div class="active-show order_model_market_price">
            <div class="field">
              <label>委托方式</label>
              <div class="content">
                <select id="custom-select" placeholder="请输入股票代码">
                </select>
              </div>
            </div>
          </div>
        </div>
        <div>
          {{-- 限价才展示 使用价格输入控制 --}}
          <div class="active-show order_model_limit_price active">
            <div class="field">
              <label>价格</label>
              <div class="content">
                <input tabindex="1001" class="plus-input change-checkrisk-last" type="text" id="val_price" name="price" pattern="^\d*\.?\d+$" limit-rule="positive" limit-words="必须大于 0" x-placeholder="请输入股票价格">
                <div class="plus-ctrls">
                  <span id="price-ctrl-minus" class="plus-ctrl" click-value="#val_price:-.01"><i>-</i><br/><span>0.01</span></span>
                  <span id="price-ctrl-plus" class="plus-ctrl" click-value="#val_price:+.01"><i>+</i><br/><span>0.01</span></span>
                  <span style="display: none;" id="marketH-price-ctrl-minus" class="plus-ctrl" click-value="#val_price:-.01"><span style="font-size: 19.6px;line-height: 22px;">-</span></span>
                  <span style="display: none;" id="marketH-price-ctrl-plus" class="plus-ctrl" click-value="#val_price:+.01"><span style="font-size: 19.6px;line-height: 22px;">+</span></span>
                </div>
              </div>
            </div>
          </div>
          {{-- 市价 不使用价格输入控制 --}}
          <div class="active-show order_model_market_price">
            <div class="field">
              <label>价格</label>
              <div class="content">
                <input class="plus-input" type="text" placeholder="市价" value="市价" disabled readonly>
                <div class="plus-ctrls">
                  <span class="plus-ctrl disabled"><i>-</i><br/>0.01</span>
                  <span class="plus-ctrl disabled"><i>+</i><br/>0.01</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        @include('oms.multi.product.order_create.new_order.trade_number_method')

        <div class="field risk-pre" style="display:none;">
          <center class="content risk-info-pre" id="riskInfoPre">
            可用资金 <span data-src="balance_amount|getBalanceAmount|numFormat:0,0.00">--</span>
            最大可买 <span class="blue"><span data-src="buy_max_volume|numFormat">--</span> 股</span>
            最大可卖 <span class="yellow"><span data-src="sell_max_volume|numFormat">--</span> 股</span>
          </center>
        </div>
      </div>

      <div class="content-foot" id="risk2Res" style="border-top:0;">
        <div if="loading" class="submit-wrap">
          <p class="loading">等待风控检测...</p>
          <button class="oms-btn disabled" type="submit" disabled="true" submit-direction-relative>提交委托</button>
        </div>
        <div if="loading|isFalse">
          <div if="code|notNum" class="submit-wrap">
            <p if="msg" data-src="msg" class="red"></p>
            <button class="oms-btn disabled" disabled="true" submit-direction-relative>提交委托</button>
          </div>
          <div if="code|numNotEqual:0">
            <div class="active-show default-active submit-wrap">
              <p data-src="msg" class="red resk2-fail-msg"></p>
              <button class="oms-btn disabled" disabled="true" submit-direction-relative>提交委托</button>
            </div>
          </div>
          <div if="code|numEqual:0" class="resk2-pass submit-wrap">
            <p class="green"><span data-src="msg"></span><span if="warning_count" class="warning-mark">?</span></p>
            <button tabindex="0" class="oms-btn" submit submit-direction-relative>提交委托</button>
          </div>
        </div>
      </div>
    </form>
  </div>
  <script>
  var selectize;
  (function(){
    var me = $(this);

    var trade_number_method;
    var orginfo_theme = window.LOGIN_INFO.org_info.theme;

    var product_list = [];
    var product_ids = [];
    var predict;
    var direction ="buy";//下单方式
    var timeOuter;//延时器



    $(window).on('multi_load',function(event){
      product_list = event.product_list;
      product_ids = event.product_ids;
    });

    // 港股报价方式
    var orderModeSelectize = $('#order_model-select').selectize({
      valueField: 'value',
      labelField: 'label'
    })[0].selectize;

    // 委托方式下拉框
    var $select = $('#custom-select').selectize({
      valueField: 'key',
      labelField: 'value',
      render: {
        option: function(item, escape) {
          var label = item.value;
          var clsStr = '';
          if (true == item.is_default) {
            clsStr = 'default';
          }
          return '<div class="custon_option '+ clsStr +'">' +
            '<span class="label">' + escape(label) + '</span>' +
            '<span class="default">默认</span>' +
            '<span class="set_default" data-value="'+ item.key +'" data-market="'+ item.market +'">设为默认</span>' +
          '</div>';
        }
      },
      //这里是修改了selectize的源码后新增的方法，用于在设置了默认的选中项执行。
      onSetDefault: function(e){
        var dst = $(e.currentTarget).attr('data-value');
        var market = $(e.currentTarget).attr('data-market');
        utils.stock_custom.chgMarketData(market, dst);
        var tmpData = utils.stock_custom.getMarketData(market);
        selectize.clearOptions();
        tmpData.forEach(function(e){
          e.market = market;
          selectize.addOption(e);
        });
        selectize.setValue(dst);
        ChangeSelectize(market, dst);
      }
    });
    selectize = $select[0].selectize;
    utils.stock_custom.init(LOGIN_INFO.user_id);

    function ChangeSelectize(market, dst){
      $.ajax({
        url: (window.REQUEST_PREFIX||'')+'/oms/helper/default_price_type',
        type: 'post',
        data: {
          price_type: dst,
          market_type: market
        },
        success: function(res){
          // GetSelectize(dst);
        },
        error: function(){
          $.failNotice('网络异常');
        }
      });
    }

    function GetSelectize(flag){
      var tmpArrSZ = [], tmpArrSH = [];
      $.ajax({
        url: (window.REQUEST_PREFIX||'')+'/oms/helper/price_type_list',
        success: function(res){
          var tmpId;
          if (0 == res.code) {
            tmpArrSZ = res.data['SZ'];
            tmpArrSH = res.data['SH'];

            selectize.clearOptions();
            tmpArrSZ.forEach(function(e){
              e.market = 'SZ';
              // var market = $('#stock_code').attr('data-market');
              if ($('#stock_code').val().indexOf('SZ') >= 0) {
                if (true == !!e.is_default) {
                  tmpId = e.key;
                }
                selectize.addOption(e);
              }
            });
            utils.stock_custom.setMarketData('SZ', tmpArrSZ);

            tmpArrSH.forEach(function(e){
              e.market = 'SH';
              if ($('#stock_code').val().indexOf('SH') >= 0) {
                if (true == !!e.is_default) {
                  tmpId = e.key;
                }
                selectize.addOption(e);
              }
            });
            utils.stock_custom.setMarketData('SH', tmpArrSH);

            if (true === flag) {
              selectize.setValue(tmpId);
            }
          }else{
            $.failNotice(res.msg);
          }
        },
        error: function(){
          $.failNotice('网络异常');
        }
      });
    }

    $(function(){
      //ie keyup but value didn't change bug fix;
      /msie|edge/i.test(navigator.userAgent) && $('input').on('keyup',function(){
        $(this).blur().change().focus();
      });

      /msie|edge/i.test(navigator.userAgent) && $('label').on('click_active',function(){
        $(this).find('input[type=radio]').change();
      });

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
      // 估计是初始状态下隐藏提示
      me.find('.magic-suggest-wrap').render();

      //新股添加失去焦点事件
      $('#stock_code').on('blur',function(e){
        var new_value = $(this).val().trim();
        if(judgeNewStock(new_value) && direction == "buy"  && window.orginfo_theme != 3){
          let stock =  judgeNewStock(new_value);
          me.data('stock_info',stock);
          $('#stock_code').val(stock.stock_id).change();
          $('#val_price').val(stock.price).change().attr('disabled','disabled');
          $('#price-ctrl-plus').addClass('disabled');
          $('#price-ctrl-minus').addClass('disabled');
          // $('.trade_number_method').val('volume').attr('disabled','disabled'); // 3.11 禁止使用dom切换下单方式。同时也不需要在这里进行切换了。新股、国债都支持各种下单方式
          $('#val_volume').val(stock.max_volume).attr('max_volume', stock.max_volume).change()
          // $('#val_volume').attr('disabled','disabled');
          // $('#volume-ctrl-plus').addClass('disabled');
          // $('#volume-ctrl-minus').addClass('disabled');

          // $('.trade_number_method-by_volume').hide();
          $('[click-active=".order_model_limit_price"]').click();
          $('.order_model-ctrl').addClass('disabled')
           e.stopPropagation && e.stopPropagation();
           if(e.preventDefault){
            e.preventDefault = false;
           }

        }

        if($('#stock_code').attr('sotck_type') == 'repo'){
          $('[click-active=".order_model_limit_price"]').click();
          $('.order_model-ctrl').addClass('disabled')
        }

      })

      $('#stock_code').on('change',function(e){
        var new_value = $(this).val().trim();
        if(judgeNewStock(new_value) && direction == "buy"  && window.orginfo_theme != 3){
          // 新股
        }else if($('#stock_code').attr('sotck_type') == 'repo'){
          // 国债
          $('[click-active=".order_model_limit_price"]').click();
          $('.order_model-ctrl').addClass('disabled')
        }else{
          // 股票基金等
          $('#val_price').removeAttr('disabled').removeAttr('readyonly');
          $('#val_price').attr('disabled',false);
          $('#price-ctrl-plus').removeClass('disabled');
          $('#price-ctrl-minus').removeClass('disabled');

          // $('#val_volume').removeAttr('disabled');
          $('#val_volume').attr('disabled',false);
          $('#volume-ctrl-plus').removeAttr('disabled');
          $('#volume-ctrl-minus').removeAttr('disabled');
          // $('.trade_number_method').removeAttr('disabled').removeAttr('readyonly'); // 3.11 禁止使用dom切换下单方式。同时也不需要在这里进行切换了。新股、国债都支持各种下单方式
          // $('.trade_number_method').val('volume').change();
          $('.order_model-ctrl').removeClass('disabled')
        }
      })
      $('#stock_code').on('focus',function(){
        $('#stock_code').removeAttr('sotck_type');
      })
      
      // 股票编码自定义事件，校验通过时的处理，校验失败时的处理，
      $('#stock_code').on('pattern_pass',function(event){

        if( ($(this).attr('last_value') || '').indexOf($(this).val().trim())===0 ){return;}
        var stock = me.data('stock_info');
        var new_value = $(this).val();
        var old_value = $(this).attr('old_value');
        if(new_value==old_value){return;}
        $(this).attr('old_value',new_value);
        //判断是否是新股
        //新股走上面的分支
        if(judgeNewStock(new_value) && direction == "buy"){
          let stock =  judgeNewStock(new_value);
          setTimeout(function(){
              $(window).trigger({type:'order_create:stock_code:ready', stock:{
                  stock_name: $('#stock_name_addon').html(),
                  stock_code: $('#stock_code').val().replace(/\.(SZ|SH)$/i,''),
                  stock_id: $('#stock_code').val(),
                  stock:stock,
              }});
          });
        }else{
          setTimeout(function(){
            $(window).trigger({type:'order_create:stock_code:ready', stock:{
              stock_name: $('#stock_name_addon').html(),
              stock_code: $('#stock_code').val().replace(/\.(SZ|SH|HK)$/i,''),
              stock_id: $('#stock_code').val()
            }});
          });
        }

        GetSelectize(true);

        checkRiskInfoPre();
      }).on('pattern_stuck',function(){
        // console.log('dddddd');
        var stock = me.data('stock_info');
        var new_value = $(this).val().trim();
        //新股修改dom节点后还原
        // $('.order_model-marketA').find('input').removeAttr('disabled').removeAttr('readyonly');
        // $('#val_price').removeAttr('disabled').removeAttr('readyonly');
        // $('.trade_number_method').removeAttr('disabled').removeAttr('readyonly');
        // $('#val_volume').removeAttr('disabled').removeAttr('readyonly');

        if( new_value.length==6 && ($(this).attr('last_value') || '').indexOf(new_value)===0 ){return;}
        $(this).removeAttr('last_value').removeAttr('old_value');
        me.data('stock_info',{});
        $('#stock_name_addon').html('');
        $(window).trigger({type:'create_order:stock_code:pattern_stuck'});
        checkFormInputsStuck();
        if ('marketA' == $(this).attr('data-market')) {
          $('#price-ctrl-plus').attr('click-value', '#val_price:+.01').show().find('span').html('0.01');
          $('#price-ctrl-minus').attr('click-value', '#val_price:-.01').show().find('span').html('0.01');
          $('#marketH-price-ctrl-plus').hide();
          $('#marketH-price-ctrl-minus').hide();
        }else{
          $('#price-ctrl-plus').hide();
          $('#price-ctrl-minus').hide();
          $('#marketH-price-ctrl-plus').show();
          $('#marketH-price-ctrl-minus').show();
        }
      }).on('stock_code:suggest',function(event){
        var stock = event.stock;
        $('#val_price').val('')
        $('#stock_code').val(stock.stock_code + '.' + stock.exchange.slice(0,2)).change();
        $('#stock_name_addon').text(stock.stock_name);
        $('#val_price').val('');
      });

      $('#val_price').on('change', function(event){
        var market = $('#stock_code').attr('data-market');
        var stock = me.data('stock_info');
        if ('marketA' == market) {
          // 无需处理，就是正常显示
          // $('#price-ctrl-plus').show().find('span').html('0.01');
          // $('#price-ctrl-minus').show().find('span').html('0.01');
          // $('#marketH-price-ctrl-plus').hide();
          // $('#marketH-price-ctrl-minus').hide();
        }else{
          var price = parseFloat($(this).val());
          var arr = [{
            min: 0.01,
            max: 0.25,
            step: '0.001'
          },{
            min: 0.25,
            max: 0.5,
            step: '0.005'
          },{
            min: 0.5,
            max: 10,
            step: '0.01'
          },{
            min: 10,
            max: 20,
            step: '0.02'
          },{
            min: 20,
            max: 100,
            step: '0.05'
          },{
            min: 100,
            max: 200,
            step: '0.1'
          },{
            min: 200,
            max: 500,
            step: '0.2'
          },{
            min: 500,
            max: 1000,
            step: '0.5'
          },{
            min: 1000,
            max: 2000,
            step: '1'
          },{
            min: 2000,
            max: 5000,
            step: '2'
          },{
            min: 5000,
            max: 9995,
            step: '5'
          }];
          var maxArr = arr.filter(function(e){
            return e.min <=price && price < e.max;
          });
          var minArr = arr.filter(function(e){
            return e.min < price && price <= e.max;
          })

          if (maxArr.length == 1 && minArr.length == 1) {

            $('#price-ctrl-plus').attr('click-value', '#val_price:+' + maxArr[0].step).show().find('span').html(maxArr[0].step);
            $('#price-ctrl-minus').attr('click-value', '#val_price:-' + minArr[0].step).show().find('span').html(minArr[0].step);



            $('#marketH-price-ctrl-plus').hide();
            $('#marketH-price-ctrl-minus').hide();
          }
        }
      })

      // 似乎已经无用
      // me.find('[name=trade_direction]').on('change',setMaxVolumeValue);

      // 当价格变化后，进行风控判断
      $('#create_order_form').find('input.change-checkrisk-last').on('change keyup click',tryCheckRiskBeforeSubmit);

      // 表单提交时，尝试提交表单
      $('#create_order_form').on('click', '[submit]', tryCreateOrder);

      // 多产品页面已没有强制提交功能
      // $('#force-inputs').on('click_active',function(){
      //   $('input[name=is_force]').prop('checked',true);
      //   $(this).find('input:not([type=checkbox])').val('').change().filter('[name=force_pswd]').attr('type','password');
      // });

      var chgModeOfMarketH = function(direction){
        // 修改报价方式的内容 不限制是否是港股，如果限制的话，港股买 -》沪深买 -》沪深卖-》港股卖 这样的流程会导致限制内的逻辑走不到
        if ('buy' == direction) {
          orderModeSelectize.clearOptions();
          orderModeSelectize.addOption({
            label: '增强限价买入',
            value: '5'
          });
          orderModeSelectize.addOption({
            label: '竞价限价买入',
            value: '4'
          });
        }else if('sell' == direction){
          orderModeSelectize.clearOptions();
          orderModeSelectize.addOption({
            label: '增强限价卖出',
            value: '5'
          });
          orderModeSelectize.addOption({
            label: '竞价限价卖出',
            value: '4'
          });
          // orderModeSelectize.addOption({
          //   label: '零股限价卖出',
          //   value: ''
          // });
        }

        // 根据时间，设置默认值
        var time = moment();
        var hour = time.hour();
        var minute = time.minute();
        if ((9 == hour && 0 <= minute && 15 > minute) ||
          (12 == hour && 1 <= minute && 6 > minute) ||
          (16 == hour && 1 <= minute && 6 > minute)) {
          orderModeSelectize.setValue(4);
        }else{
          orderModeSelectize.setValue(5);
        }
      }
      //买卖方向变更
      $('.direction-ctrl').on('click_active',function(){
        // $('#val_volume').val('').change(); //不清空数量咯
        //getTradeDirection 是通过 表单 serializeArray 来实现的，有一点延迟
        (window.requestAnimationFrame||window.setTimeout)(function(){
          var direction = buyOrSell();
          var form = $('#create_order_form');
          form.find('#val_volume').val('').change();
          // form.find('#vale__volum').val('').change(); // 3.11版本只保留目标仓位情况下的数量填写
          form.find('#vale_current_volum').val('').change();
          $(window).trigger({type:'order_create:direction:changed',direction:direction});

          chgModeOfMarketH(direction);
        });
      });

      //市场变更
      $('.market-ctrl').on('click_active',function(){
        (window.requestAnimationFrame||window.setTimeout)(function(){
          var market = 'marketA';
          if ($('.market-ctrl.marketA.active').length > 0) {
            market = 'marketA';
          }else if($('.market-ctrl.marketHSH.active').length > 0){
            market = 'marketHSH';
          }else if($('.market-ctrl.marketHSZ.active').length > 0){
            market = 'marketHSZ';
          }
          var model = isMarketPriceOrder() ? 'market' : 'limit';
          var direction = buyOrSell();
          if ('marketA' == market) {
            $('.order_model-marketA').show();
            $('.order_model-marketH').hide();
          }
          if ('marketHSH' == market || 'marketHSZ' == market) {
            $('.order_model-marketH').show();
            $('.order_model-marketA').hide();
          }

          // 港股时，处理好order_model_market_price
          if ('marketHSH' == market || 'marketHSZ' == market) {
            $('#stock_code').attr('data-market', market).keyup();
            $('#add_stock_code').attr('data-market', market).keyup();
            $('.active-show.order_model_market_price').removeClass('active');
            $('.active-show.order_model_limit_price').addClass('active');

            // 港股时
            $('#marketH-price-ctrl-plus').show();
            $('#marketH-price-ctrl-minus').show();
            $('#price-ctrl-plus').hide();
            $('#price-ctrl-minus').hide();
          }
          if ('marketA' == market) {
            $('#stock_code').attr('data-market', market).keyup();
            $('#add_stock_code').attr('data-market', market).keyup();
            if ('limit' == model) {
              $('.active-show.order_model_market_price').removeClass('active');
              $('.active-show.order_model_limit_price').addClass('active')
            }else if('market' == model){
              $('.active-show.order_model_market_price').addClass('active');
              $('.active-show.order_model_limit_price').removeClass('active');
            }

            // A股时
            $('#price-ctrl-plus').show();
            $('#price-ctrl-minus').show();
            $('#marketH-price-ctrl-plus').hide();
            $('#marketH-price-ctrl-minus').hide();
          }

          chgModeOfMarketH(direction);

          $(window).trigger({
            type: 'order_create:market:changed',
            market: market
          });

          setTimeout(checkFormInputsStuck);
        })
      });

      // 限价、市价切换
      $('.order_model-ctrl').on('click_active',function(){
        setTimeout(checkFormInputsStuck);
        var model = isMarketPriceOrder() ? 'market' : 'limit';
        if ('limit' == model) {
          $('#val_price').attr('tabindex', '1002');
        }else{
          $('#val_price').attr('tabindex', '');
        }
      });

      // 页面行情数据更新，但是不能理解为什么要绕一个事件
      me.on('stock_info_update',function(event){
        me.data('stock_info',event.stock);
      });

      // 一旦触发change和keyup，则进行广播
      me.on('change keyup',broadcastFormChange);

      // y表单页面错误按钮，用户点击之后，需要在产品列表中提示用户原因
      me.on('click','.warning-mark',function(){
        $(window).trigger('create_order:form:warning-toggle');
      });

      // 第一次进入该页面，需要通过广播使其他页面统一
      broadcastFormChange();
    });

    // 该模块页面响应其他模块触发的事件
    $(window).on('order_create:by_stock',function(event){ //用户点击持仓列表的股票后触发。
      var form = $('#create_order_form');

      if(event.stock && event.stock.stock_code && event.stock.stock_name){
        var stock_code = event.stock.stock_code;
        // 此处不应该根据market来判断，因为在持仓那边点击后，可能market没有修改为对应的值，还是旧的。
        if (/HKSH/.test(stock_code)) {
          stock_code = stock_code.replace('SH', '');
        }
        if (/HKSZ/.test(stock_code)) {
          stock_code = stock_code.replace('SZ', '');
        }
        
        form.find('#val_volume').val('').change();
        // form.find('#vale__volum').val('').change(); // 3.11版本只保留目标仓位情况下的数量填写
        form.find('#vale_current_volum').val('').change();
        
        if( stock_code != me.find('[name=stock_code]').val() ){
          reset();
          form.find('#stock_name_addon').html(event.stock.stock_name);
          form.find('#stock_code').val(stock_code).change();
          form.find('[name=price]').val('').change();
          form.find('#val_volume').focus();
        }
      }else{
        reset();
        form.find('#stock_name_addon').html('');
        form.find('#stock_code').focus();
        setTimeout(function(){
          form.find('#stock_code').focus();
        },500);
      }

      // 重置表格
      function reset(){
        //清空数据
        $('#riskInfoPre').render({});
        $('#risk2Res').render({msg:'请输入股票代码...'}).find('.active-show').removeClass('active').filter('.default-active').addClass('active');

        form.find('input:not([type=radio]):not([type=hidden]):not([type=checkbox]):not(.force-append):not(#stock_code)').val('').change();
        form.find('input.force-append').removeClass('stuck');
        $('input[name=is_force]').prop('checked',false);
      }
    }).on('order_create:trade_5:updated',function(event){ //五档行情更新
        me.trigger({type:'stock_info_update',stock:event.stock});
    }).on('order_create:trade_5:updated:first',function(event){ //当前股票第一次五档行情更新
      //当前股票第一次更新
      resetDefaultValPrice();

      // oms3.8.1 根据股票的trading_unit，修改数量的最小单位
      $('#val_volume').attr('placeHolder', '每手' + event.stock.trading_unit + '股');
      $('#volume-ctrl-plus').attr('click-value', '#val_volume:+' + event.stock.trading_unit);
      $('#volume-ctrl-minus').attr('click-value', '#val_volume:-' + event.stock.trading_unit);

      $('#vale_current_volum').attr('placeHolder', '每手' + event.stock.trading_unit + '股');

      // 只是重新刷显示，不修改锁定的下单方式内容
      $('[name=trade_number_method]').change();

      // //国债逆回购 下单方式只能为按绝对数量 切只能购买时
      // if(window.orginfo_theme != 3){
      //   if(event.stock.asset_class == 2  ){
      //     //国债逆回购
      //     $('[name=trade_number_method]').val('volume').change().attr("disabled","disabled");
      //     $('#val_volume').attr('placeHolder', '每手' + event.stock.trading_unit + '张');
      //   }else{
      //     $('[name=trade_number_method]').val('volume').change().removeAttr("disabled");
      //   }
      // }



      // 因为a股基金的最小价格变动单位是“0.001”，而股票是“0.01” 所以要在这里做处理
      // 此处使用了行情数据中的price_level
      var market = 'marketA';
      if ($('.market-ctrl.marketA.active').length > 0) {
        market = 'marketA';
      }else if($('.market-ctrl.marketHSH.active').length > 0){
        market = 'marketHSH';
      }else if($('.market-ctrl.marketHSZ.active').length > 0){
        market = 'marketHSZ';
      }
      if ('marketA' == market) {
        var step = event.stock.price_level;
        //国债逆回购调整 价格修改
        if(event.stock.asset_class == 2 && event.stock.exchange =='SZ'){
          step = 0.001;
        }
        if(event.stock.asset_class == 2 && event.stock.exchange =='SH'){
          step = 0.005;
        }

        $('#price-ctrl-plus').attr('click-value', '#val_price:+' + step).show().find('span').html(step);
        $('#price-ctrl-minus').attr('click-value', '#val_price:-' + step).show().find('span').html(step);
        $('#marketH-price-ctrl-plus').hide();
        $('#marketH-price-ctrl-minus').hide();
      }
    }).on('order_create:success',function(){ //已经找不到触发该事件的地方了。
      console.log('order_create:success')
      me.find('[name=stock_code],[name=volume],[name=price]').val('').removeAttr('last_value').removeAttr('old_value').change();
    }).on('load spa_product_change balance_amount_changed', // 已经不再有地方触发该事件
      checkRiskInfoPre
    ).on('order_create:direction:changed',function(event){ // 下单方向切换
      direction = event.direction;

      $('[submit-direction-relative]').text(
        '提交委' + (direction == 'buy' ? '买' : '卖')
      ).toggleClass('red',direction=='buy')
      .toggleClass('blue',direction=='sell');

    }).on('order_create:trade_number_method:change',function(event){ //交易数量修改
      trade_number_method = event.trade_number_method;
      checkFormInputsStuck();
    }).on('order_create:nav:multi-stocks:sell order_create:nav:multi-stocks:buy',function(){ //用户点击菜单切换（点击多股票的那两个菜单才会触发）
      me.find('[name=volume],[name=rate]').val('').removeAttr('last_value').removeAttr('old_value').change();;
    }).on('multi_products:head:predict:after_preview',function(event){ //在产品列表被设置为自动预警。
      predict = $.pullValue(event,'predict');
      $('.entrust_total_num').html(predict.total_gap);
      $('.entrust_total_num').data('display_arr', predict.display_arr);
      checkFormInputsStuck();
    }).on('product:position:row-click',function(event){ //持仓模块点击某行时，修改股票代码。
      var position_stock_code = event.position.stock_id;
      me.find('[name=stock_code]').val()!=position_stock_code && me.find('[name=stock_code]').val(position_stock_code).change();
    });

    // 广播？
    function broadcastFormChange(){
      broadcast();
      (window.requestAnimationFrame||window.setTimeout)(broadcast);//再来一遍？
      function broadcast(){
        var validate_pass = !getStuckInputs().length;
        $(window).trigger({
          type: 'create_order:form:changed',
          form_data: getFormSerializeObj(),
          validate_pass: validate_pass
        });
        // $(window).trigger({
        //   type: 'create_order:form:changed:' + (validate_pass ? 'pass' : 'stuck'),
        //   form_data: getFormSerializeObj()
        // });
        // oms3.8.0新增处理，在stuck时，如果只是没有填写“委卖”数量，那么也触发到is_running页面，然后算出总量后，再显示给用户
        var arr = getStuckInputs();
        if (1 == arr.length && $(arr[0]).is('[name="current_volume"]')) {
          $(window).trigger({
            type: 'create_order:form:changed:pass',
            form_data: getFormSerializeObj()
          });
          // $(window).trigger({
          //   type: 'create_order:form:changed:current_volume',
          //   form_data: getFormSerializeObj()
          // });
        }else{
          $(window).trigger({
            type: 'create_order:form:changed:' + (validate_pass ? 'pass' : 'stuck'),
            form_data: getFormSerializeObj()
          });
        }
        checkFormInputsStuck();
      }
    }

    // 表单数据格式化
    function getFormSerializeObj(){

      var stock = me.data('stock_info');
      var form = me.find('form').first();
      var result = {};
      var data = form.serializeArray();
      data.forEach(function(item){
        result[item.name] = item.value;
      });
      //股票类型 国债期货股票 2为国债
      if(stock && stock.asset_class){
        result.asset_class=stock.asset_class;
      }
      return result;
    }

    // 预先风控校验
    function checkRiskInfoPre(){
      var form = $('#create_order_form');
      $('#riskInfoPre').render({});
      $('#risk2Res').render({msg:'正在检测可买可卖数量...'}).find('.active-show').removeClass('active').filter('.default-active').addClass('active');

      if( $('#stock_code').hasClass('pass') ){
        $('#riskInfoPre').addClass('loading');
        $(window).trigger({type:'risk_info_pre_start'});// 未找到监听该事件的地方。

        var res_data = getRiskInfoPreData(); // 这函数返回的数据看起来不对（因为风控位置已经变化，这里不会再显示了。“#riskInfoPre”元素已经不显示了）
        $('#riskInfoPre').removeClass('loading');
        $('#riskInfoPre').render(res_data);

        // setMaxSellBuyVolumeValue(res_data); //似乎已无用
        $('#val_volume').val('').change().focus(); //数量清空
        $(window).trigger({ // 未找到监听该事件的地方。
          type:'risk_info_pre_finish',
          more_data: res_data
        });
      }else{
        checkFormInputsStuck();
      }
    }

    function getRiskInfoPreData(){
      var balance_amount = 1000;
      var last_price = 10;
      return {
        balance_amount: balance_amount,
        sell_max_volume: balance_amount/last_price,
        buy_max_volume: balance_amount/last_price
      }
    }

    // 风控判断 每当用户修改数量时就会触发。这里是页面判断的主要流程。
    // 但是由于风控改版，这里大致只需要以下几个流程：
    // 1.checkFormInputsStuck使form表单进行校验 （至于说为什么调用了两次checkFormInputsStuck，不明白原因）
    // 2.没有数据变更的时候，不继续
    function tryCheckRiskBeforeSubmit(){
      var form = $('#create_order_form');

      if($('#riskInfoPre').is('.loading')){return;}
      checkFormInputsStuck();

      //没有数据变更的时候，不发送请求
      var new_serialize_str = form.serialize().replace(/\&(is_force|msg|force_pswd)\=[^\&]*/g,'');
      if( new_serialize_str===form.attr('last-serialize') ){return;}
      form.attr( 'last-serialize', new_serialize_str );

      var data = form.serialize().replace('stock_code','stock_id');
      data = isMarketPriceOrder() ? data.replace(/\&price\=[^\&]*/,'') : data;

      var stuck_inputs = getStuckInputs(); //获取阻塞的input

      if(!stuck_inputs.length){
        $('#risk2Res').render({loading:true}).find('.active-show').removeClass('active').filter('.default-active').addClass('active');
        $('input[name=is_force]').prop('checked',false);
        $('#risk2Res').render({code:0});
      }

      checkFormInputsStuck();
    }

    //提交表单，创建新委托单

    //################## TODO: 批量创建委托 ##################
    // 提交表单，通过事件“create_order:form:submit”
    function tryCreateOrder(){
      var form = $('#create_order_form');

      //表单验证
      var stuck = false;
      var stuck_inputs = getStuckInputs();

      stuck_inputs.each(function(){
        $.omsAlert($(this).focus().closest('.field').find('label:first').text() + '不正确！',false);
        stuck = true;
        return !stuck;
      });

      !stuck && $(window).data('order_creating') && alert('上次提交尚未完成，可能是你手速太快了，你可以刷新页面或稍后重试！');

      broadcastFormChange();//保证跟踪到变化

      setTimeout(function(){
        !stuck && $(window).trigger('create_order:form:submit');
      },100);

      return false;
    }

    // 重置价格
    function resetDefaultValPrice(){
      // stock_info是3.8.1新增的，以前使用的都是自己获取的stock。
      var stock = me.data('stock_info');
      var tmp_stock_id = $('[name=stock_code]').val();

      var market = 'marketA';
      if ($('.market-ctrl.marketA.active').length > 0) {
        market = 'marketA';
      }else if($('.market-ctrl.marketHSH.active').length > 0){
        market = 'marketHSH';
      }else if($('.market-ctrl.marketHSZ.active').length > 0){
        market = 'marketHSZ';
      }

      if ('marketHSH' == market) {
        tmp_stock_id += 'SH';
      }
      if ('marketHSZ' == market) {
        tmp_stock_id += 'SZ';
      }
      if(!stock || stock.stock_id != tmp_stock_id){return;}

      var pre_price = $.pullValue(
        stock,
        ( getTradeDirection()=='{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'ask' : 'bid' ) + '1_price',
        $.pullValue(stock, 'last_price', 0)
      );

      // 股票代码修改时，会清空$('#val_price')。此处新增判断价格是否存在，为了避免用户输入之后又被买1卖1价覆盖的问题
      var tmpPrice = $('#val_price').val();
      if ('' == tmpPrice || 0 == tmpPrice) {
          pre_price && $('#val_price').val(pre_price).change();
      }else{
          ;
      }
      // pre_price && $('#val_price').val(pre_price).change();
    }

    // 校验表单是否失败，以及需要提示的具体内容。没有校验失败也进行提示
    function checkFormInputsStuck(){
      var stock = me.data('stock_info');
     // console.log('账单数据验证');
      if (undefined == window.PRODUCTS) {
        return;
      }
      // 判断用户是否选中组合，通过window.PRODUCTS[n].checked即可
      var checkedNum = 0;
      window.PRODUCTS.forEach(function(e){
        if (e.checked) {
          checkedNum++;
        }
      });
      if (0 == checkedNum) {
        if (3 == orginfo_theme) {
          $('#risk2Res').render({msg: '请勾选下单策略'});
        }else{
          $('#risk2Res').render({msg: '请勾选交易单元'});
        }
        
        return;
      }

      var form = $('#create_order_form');

      var stuck_inputs = getStuckInputs();


      // 国债逆回购暂不支持回购
      if(stock && buyOrSell()=='buy' && stock.asset_class == 2){
        $('#risk2Res').render({msg: '暂未支持国债正回购，敬请期待！'});
        return;
      }
      // 国债逆回购不支持绝对数量之外的下单方式
      if (stock && 2 == stock.asset_class && 'volume' != trade_number_method) {
        $('#risk2Res').render({msg: '国债逆回购暂不支持该下单方式！'});
        return;
      }
      // 新股不支持卖出
      if(stock && buyOrSell()=='sell' && stock.asset_class == "new"){
        $('#risk2Res').render({msg: '新股不支持卖出，请重新选择！'});
        $(window).trigger({
          type: 'create_order:form:changed:stuck',
          form_data: ''
        });
        return;
      }

      // 新股不支持绝对数量之外的下单方式
      if (stock && 'new' == stock.asset_class && 'volume' != trade_number_method) {
        $('#risk2Res').render({msg: '新股申购暂不支持该下单方式！'});
        return;
      }

      if( stuck_inputs.length ){
        var stuck_input = stuck_inputs.first();
        var stuck_input_value = stuck_input.val().trim();
        var stuck_label = stuck_input.closest('.field').find('label:first').text();
        var stuck_msg = stuck_input_value ? stuck_label+'格式不正确！' : stuck_input.attr('x-placeholder');

        if( !stuck_input.is('.pattern-stuck') && stuck_input.is('.limit-rule-stuck') ){
          stuck_msg = stuck_label + stuck_input.attr('limit-words');
        }

        $('#risk2Res').render({msg: stuck_msg});
        return;
      }
      //添加结构版国债逆回购 提示信息
      if(window.LOGIN_INFO.org_info.theme !=3 && stock.asset_class == 2){
        if((+me.find('[name=volume]').val() || 0)% stock.trading_unit !==0){
          $('#risk2Res').render({msg: '请输入'+stock.trading_unit+'的倍数'});
          return;
        }
      }
      if( buyOrSell()=='buy' && getTradeNumberMethod()=='volume' && (+me.find('[name=volume]').val()||0)%100!==0 ){
        $('#risk2Res').render({msg: '买入数量必须为整手'});
        return;
      }

      var predict_pass_risk_check = $.pullValue(predict, 'pass_risk_check', false);
      if (!predict_pass_risk_check) {
        $('#risk2Res').render({msg: '已触发禁止性风控'});
        return;
      }

      // 校验成功也进行提示
      // 下面的数据predict来自于is_running页面
      var predict_total_entrust_volume = $.pullValue(predict,'total_entrust_volume',0);
      var predict_direction = $.pullValue(predict,'trade_direction',NaN);
      var warning_count = $.pullValue(predict,'warning_count',0);
      var msg = '预计总共'+ (
        predict_direction
          ? (predict_direction=='{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}'?'买入':'卖出')
          : '委托'
        ) +  ' '+numeral(predict_total_entrust_volume).format('0,0')+' 股';



      if(window.LOGIN_INFO.org_info.theme !=3 && stock.asset_class == 2){
        var predict_total_entrust_volume = $.pullValue(predict,'total_entrust_volume',0);
        var predict_direction = $.pullValue(predict,'trade_direction',NaN);
        var warning_count = $.pullValue(predict,'warning_count',0);
        var msg = '预计总共'+ (
          predict_direction
            ? (predict_direction=='{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}'?'买入':'卖出')
            : '委托'
          ) +  ' '+numeral(predict_total_entrust_volume).format('0,0')+' 张';

      }else{
        var predict_total_entrust_volume = $.pullValue(predict,'total_entrust_volume',0);
        var predict_direction = $.pullValue(predict,'trade_direction',NaN);
        var warning_count = $.pullValue(predict,'warning_count',0);
        var msg = '预计总共'+ (
          predict_direction
            ? (predict_direction=='{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}'?'买入':'卖出')
            : '委托'
          ) +  ' '+numeral(predict_total_entrust_volume).format('0,0')+' 股';
      }

      $('#risk2Res').render({
          code: predict_total_entrust_volume>0 ? 0 : 101,
          msg: msg,
          warning_count: warning_count
      });
    }

    // 获取不能通过校验的输入框
    function getStuckInputs(){
      var form = $('#create_order_form');

      // selector用来确定form中需要进行校验的元素，之前的方式用了好几个三元运算，在需求迭代时，认为已经不够清晰易懂的让人读懂代码了。
      // 所以对selector变量获取方式进行重写。
      // 另，需要思考，在jquery盛行的年代，除了在这里处理，还有没有更好的方式／流程？
      // 或者，方式为数量时，就取非“rate”的元素，能不能改进？
      var selector = '.stuck';
      if (isMarketPriceOrder()) {
        selector += ':not([name=price])'; //市价单不考虑价格
      }

      // 所有情形均忽略current_volume。提交到右侧预览处理
      if ('volume' == trade_number_method) {
        selector += ':not([name=assets_ratio]):not([name=position_ratio]):not([name=current_volume]):not([name=cur_position_ratio])';
      }else if('assets_ratio' == trade_number_method){
        selector += ':not([name=volume]):not([name=position_ratio]):not([name=current_volume]):not([name=cur_position_ratio])'
      }else if('position_ratio' == trade_number_method){
        selector += ':not([name=volume]):not([name=assets_ratio]):not([name=current_volume]):not([name=cur_position_ratio])';
      }else if('cur_position_ratio' == trade_number_method){
        selector += ':not([name=volume]):not([name=assets_ratio]):not([name=current_volume]):not([name=position_ratio])'
      }

      return form.find(selector);
    }

    // 判断是否是市价
    function isMarketPriceOrder(){
      return getTradeMode()=="{{OMSWorkflowEntrustService::ORDER_MODEL_MARKET_PRICE}}";
    }

    // 获取交易类型
    function getTradeMode(){
      var stock = me.data('stock_info');

      if( stock && stock.asset_class == "new"){
        return 1
      }

      return me.find('form:first').serializeArray().filter(function(item){
        return item.name === 'trade_mode'
      })[0].value;
    }

    // 获取交易方式（按数量，按比例）
    function getTradeNumberMethod(){
      var stock = me.data('stock_info');
      if(stock && stock.asset_class == "new"){
        return 'volume'
      }

      // var flag = $('.trade_number_method').attr('disabled');
      // $('.trade_number_method').attr('disabled', false);
      var rtn = me.find('form:first').serializeArray().filter(function(item){
        return item.name === 'trade_number_method'
      })[0].value;
      // $('.trade_number_method').attr('disabled', flag);
      return rtn;
    }

    // 获取买入卖出（交易方向）
    function buyOrSell(){
      return getTradeDirection() == '{{OMSWorkflowEntrustService::ORDER_DIRECTION_BUY}}' ? 'buy' : 'sell'
    }

    // 获取交易方向
    function getTradeDirection(){
      return me.find('form:first').serializeArray().filter(function(item){
        return item.name === 'trade_direction'
      })[0].value;
    }

    // 设置最大可卖可买数量，评估已无用
    // function setMaxSellBuyVolumeValue(data){
    //   // setMaxVolumeValue();
    // }

    // 设置最大数量
    // function setMaxVolumeValue(res){}
  }).call(document.scripts[document.scripts.length-1].parentNode);
  </script>
</div>
