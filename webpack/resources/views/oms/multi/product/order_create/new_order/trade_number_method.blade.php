<!--
订单数量
trigger:
order_create:trade_number_method:change //交易数量修改，重新判断是否通过校验

on:
multi_products:create_order:finish //触发批量下单已完成事件，此处清空数量信息

 -->

<?php
    use App\Services\UserService;
    $org_info = UserService::getOrgInfo(); 
 ?>
<div>
 @if ($org_info['theme'] != 3)
  <div class="field radio-field">
    <label>下单方式</label>
    <div class="content" style="display: flex;">
      <select name="trade_number_method" class="trade_number_method" change-active=".trade_number_method">
        <option value="volume" method-type=".trade_number_method-by_volume">按绝对数量</option>
        <option value="assets_ratio" method-type=".trade_number_method-by_assets_ratio">按总资产比例</option>
        <option value="position_ratio" method-type=".trade_number_method-by_position_ratio">按目标仓位</option>
        <option value="cur_position_ratio" method-type=".trade_number_method-by_cur_position_ratio">按持仓比例</option>
      </select>
      <a class="icon-lock"><i></i></a>
    </div> 
  </div>

  <div class="field radio-field trade_number_method-by_volume active-enable">
    <label>按绝对数量</label>
    <div class="content">
      <input tabindex="1002" class="plus-input change-checkrisk-last" type="text" id="val_volume" name="volume" pattern="^[1-9]+\d*$" limit-rule="positive" limit-words="必须大于 0" x-placeholder="请输入数量">
      <div class="plus-ctrls">
        <span id="volume-ctrl-minus" class="plus-ctrl" click-value="#val_volume:-100"><span style="font-size: 19.6px;line-height: 22px;">-</span></span>
        <span id="volume-ctrl-plus" class="plus-ctrl" click-value="#val_volume:+100"><span style="font-size: 19.6px;line-height: 22px;">+</span></span>
      </div>
    </div>
  </div>

  <div class="field radio-field trade_number_method-by_assets_ratio active-enable">
    <label>总资产比例</label>
    <div class="content">
      <input class="plus-input change-checkrisk-last percent-plus-input" type="text" id="val_assets_ratio" name="assets_ratio" pattern="^\d+\.?\d*$" limit-rule="positive" limit-words="必须大于 0" x-placeholder="请输入比例">
      <div class="percent-ctrls">
        <span click-value="#val_assets_ratio:33.33">1/3</span>
        <span click-value="#val_assets_ratio:50">1/2</span>
        <span class="all" click-value="#val_assets_ratio:100">全部</span>
      </div>
      <div class="plus-ctrls">
        <span class="plus-ctrl" click-value="#val_assets_ratio:-1"><i>-</i><br/><span>1%</span></span>
        <span class="plus-ctrl" click-value="#val_assets_ratio:+1"><i>+</i><br/><span>1%</span></span>
      </div>
      <span class="unit percent-unit-signal" style="display: none;">%</span>
    </div>
  </div>

  <div class="field radio-field trade_number_method-by_position_ratio active-enable">
    {{-- <div class="field radio-field "> --}}
      <label>按目标仓位</label>
      <div class="content">
        <input tabindex="1002" class="plus-input percent-plus-input" type="text" id="val_position_ratio" name="position_ratio" pattern="^\d+\.?\d*$" x-placeholder="请输目标仓位">
        <div class="percent-ctrls">
          <span click-value="#val_position_ratio:33.33">1/3</span>
          <span click-value="#val_position_ratio:50">1/2</span>
          <span class="all" click-value="#val_position_ratio:100">全部</span>
        </div>
        <div class="plus-ctrls">
          <span class="plus-ctrl" click-value="#val_position_ratio:-1"><i>-</i><br/><span>1%</span></span>
          <span class="plus-ctrl" click-value="#val_position_ratio:+1"><i>+</i><br/><span>1%</span></span>
        </div>
        <span class="unit percent-unit-signal" style="display: none;">%</span>
      </div>
    {{-- </div> --}}
  </div>

  <div class="field radio-field trade_number_method-by_cur_position_ratio active-enable">
    {{-- <div class="field radio-field "> --}}
      <label>按持仓比例</label>
      <div class="content">
        <input tabindex="1002" class="plus-input percent-plus-input" type="text" id="val_cur_position_ratio" name="cur_position_ratio" pattern="^\d+\.?\d*$" x-placeholder="请输入比例">
        <div class="percent-ctrls">
          <span click-value="#val_cur_position_ratio:33.33">1/3</span>
          <span click-value="#val_cur_position_ratio:50">1/2</span>
          <span class="all" click-value="#val_cur_position_ratio:100">全部</span>
        </div>
        <div class="plus-ctrls">
          <span class="plus-ctrl" click-value="#val_cur_position_ratio:-1"><i>-</i><br/><span>1%</span></span>
          <span class="plus-ctrl" click-value="#val_cur_position_ratio:+1"><i>+</i><br/><span>1%</span></span>
        </div>
        <span class="unit percent-unit-signal" style="display: none;">%</span>
      </div>
    {{-- </div> --}}
  </div>

  {{-- 仅目标仓位支持填入数量，以支持分批下单的功能，其余不需要 --}}
  <div class="field radio-field trade_number_method-by_position_ratio active-enable" style="margin-top: 0;">
    <div class="field radio-field ">
      <label class="trade_label">本次委买</label>
      <div class="content" style="display: flex;">
        <input tabindex="1003" class="change-checkrisk-last" type="text" id="vale_current_volum" name="current_volume" pattern="^[1-9]+\d*$" limit-rule="positive" limit-words="必须大于 0" x-placeholder="请输入交易数量" style="border: 1px solid #ccc;">
        <div style="font-weight: normal;font-size: 12px;color: #999;"><span style="font-size: 16px;padding: 0 5px;">/</span><span class="entrust_total_num">0</span>股</div>
      </div>
    </div>
  </div> 
  {{-- <div class="field radio-field trade_number_method-by_assets_ratio active-enable" style="margin-top: 0;">
    <div class="field radio-field ">
      <label class="trade_label">本次委买</label>
      <div class="content" style="display: flex;">
        <input tabindex="1003" class="change-checkrisk-last" type="text" id="vale__volum" name="current_volume" pattern="^[1-9]+\d*$" limit-rule="positive" limit-words="必须大于 0" x-placeholder="请输入交易数量" style="border: 1px solid #ccc;">
        <div style="font-weight: normal;font-size: 12px;color: #999;"><span style="font-size: 16px;padding: 0 5px;">/</span><span class="entrust_total_num">0</span>股</div>
      </div>
    </div>
  </div>  --}}
@else
  <div class="field radio-field">
    <label>下单方式</label>
    <label style="width:auto;text-align: left;" click-active=".trade_number_method-by_volume">
      <input type="radio" name="trade_number_method" value="volume" checked="true">绝对数量
    </label>
    <!-- <label style="width:auto" click-active=".trade_number_method-by_assets_ratio">
      <input type="radio" name="trade_number_method" value="assets_ratio"><span id="trade_text">总资产比</span>
    </label> -->
    <label style="width:auto;text-align: left;" click-active=".trade_number_method-by_position_ratio">
      <input type="radio" name="trade_number_method" value="position_ratio">调仓到
    </label>
  </div>

  <div class="field radio-field trade_number_method-by_volume active-enable">
    <label>数量</label>
    <div class="content">
      <input tabindex="1002" class="plus-input change-checkrisk-last" type="text" id="val_volume" name="volume" pattern="^[1-9]+\d*$" limit-rule="positive" limit-words="必须大于 0" x-placeholder="请输入交易数量">
      <div class="plus-ctrls">
        <span id="volume-ctrl-minus" class="plus-ctrl" click-value="#val_volume:-100"><span style="font-size: 19.6px;line-height: 22px;">-</span></span>
        <span id="volume-ctrl-plus" class="plus-ctrl" click-value="#val_volume:+100"><span style="font-size: 19.6px;line-height: 22px;">+</span></span>
      </div>
    </div>
  </div>

  <!-- <div class="field radio-field trade_number_method-by_assets_ratio active-enable">
    <label>比例</label>
    <div class="content">
      <input class="plus-input change-checkrisk-last percent-plus-input" type="text" id="val_assets_ratio" name="assets_ratio" pattern="^\d+\.?\d*$" limit-rule="positive" limit-words="必须大于 0" x-placeholder="请输入交易数量">
      <div class="percent-ctrls">
        <span click-value="#val_assets_ratio:33.33">1/3</span>
        <span click-value="#val_assets_ratio:50">1/2</span>
        <span class="all" click-value="#val_assets_ratio:100">全部</span>
      </div>
      <div class="plus-ctrls">
        <span class="plus-ctrl" click-value="#val_assets_ratio:+1"><i>+</i><br/><span>1%</span></span>
        <span class="plus-ctrl" click-value="#val_assets_ratio:-1"><i>-</i><br/><span>1%</span></span>
      </div>
      <span class="unit percent-unit-signal" style="left:11px;">%</span>
    </div>
  </div> -->
  <div class="field radio-field trade_number_method-by_position_ratio active-enable" style="margin-top: 0;">
    <div class="field radio-field ">
      <label>目标比例</label>
      <div class="content">
        <input tabindex="1002" class="plus-input percent-plus-input" type="text" id="val_position_ratio" name="position_ratio" pattern="^\d+\.?\d*$" x-placeholder="请输入交易数量">
        <div class="percent-ctrls">
          <span click-value="#val_position_ratio:33.33">1/3</span>
          <span click-value="#val_position_ratio:50">1/2</span>
          <span class="all" click-value="#val_position_ratio:100">全部</span>
        </div>
        <div class="plus-ctrls">
          <span class="plus-ctrl" click-value="#val_position_ratio:-1"><i>-</i><br/><span>1%</span></span>
          <span class="plus-ctrl" click-value="#val_position_ratio:+1"><i>+</i><br/><span>1%</span></span>
        </div>
        <span class="unit percent-unit-signal" style="display: none;">%</span>
      </div>
    </div>

    
  </div>
  <div class="field radio-field trade_number_method-by_position_ratio active-enable" style="margin-top: 0;">
    <div class="field radio-field ">
      <label class="trade_label">本次委买</label>
      <div class="content" style="display: flex;">
        <input tabindex="1003" class="change-checkrisk-last" type="text" id="vale_current_volum" name="current_volume" pattern="^[1-9]+\d*$" limit-rule="positive" limit-words="必须大于 0" x-placeholder="请输入交易数量" style="border: 1px solid #ccc;">
        <div style="font-weight: normal;font-size: 12px;color: #999;"><span style="font-size: 16px;padding: 0 5px;">/</span><span class="entrust_total_num">0</span>股</div>
        <!-- <div class="plus-ctrls">
          <span class="plus-ctrl" click-value="#vale_current_volum:+100"><i>+</i><br/><span>100</span></span>
          <span class="plus-ctrl" click-value="#vale_current_volum:-100"><i>-</i><br/><span>100</span></span>
        </div> -->
      </div>
      <!-- <div class="content">
        <input class="plus-input change-checkrisk-last" type="text" id="val_position_ratio" name="position_ratio" pattern="^\d+\.?\d*$" limit-rule="positive" limit-words="必须大于 0" x-placeholder="请输入交易数量">
        <div class="percent-ctrls">
          <span click-value="#val_position_ratio:33.33">1/3</span>
          <span click-value="#val_position_ratio:50">1/2</span>
          <span class="all" click-value="#val_position_ratio:100">全部</span>
        </div>
        <div class="plus-ctrls">
          <span class="plus-ctrl" click-value="#val_position_ratio:+1"><i>+</i><br/><span>1%</span></span>
          <span class="plus-ctrl" click-value="#val_position_ratio:-1"><i>-</i><br/><span>1%</span></span>
        </div>
        <span class="unit percent-unit-signal" style="left:11px;">%</span>
      </div> -->
    </div>
  </div>
  @endif 

  <script>
  (function(){
      var me = $(this);
      var trade_number_method; //记录是如何得到订单数量的。 可能的值有：'volume' 'assets_ratio' 'position_ratio'
      var percent_unit_signal = me.find('.percent-unit-signal');
      var assets_rate_input = me.find('[name=assets_ratio]');
      var position_rate_input = me.find('[name=position_ratio]');
      var cur_position_rate_input = me.find('[name=cur_position_ratio]');
      var volume_input = me.find('[name=volume]');

      // 锁定按钮相关功能
      if (3 != window.LOGIN_INFO.org_info.theme) {
        common_storage.getItem('lock__trade_number_method' + window.LOGIN_INFO.user_id, function(rtn){
          if (0 == rtn.code) {
            if ('true' == rtn.data) {
              $('.icon-lock').addClass('locked');
              $('.trade_number_method').attr('disabled', true);
              common_storage.getItem('lock__trade_number_method__value' + window.LOGIN_INFO.user_id, function(rtn){
                if (0 == rtn.code) {
                  $('.trade_number_method').val(rtn.data).change();
                }
              })
            }else{
              $('.icon-lock').addClass('unlocked');
              $('.trade_number_method').attr('disabled', false);
            }
          }else{
            $('.icon-lock').addClass('unlocked');
          }
        });

        $(document).on('click', '.icon-lock', function(e){
          if ($(this).hasClass('locked')) {
            $(this).removeClass('locked').addClass('unlocked');
            $('.trade_number_method').attr('disabled', false);
            common_storage.setItem('lock__trade_number_method' + window.LOGIN_INFO.user_id, 'false');
          }else{
            $(this).removeClass('unlocked').addClass('locked');
            $('.trade_number_method').attr('disabled', true);
            common_storage.setItem('lock__trade_number_method' + window.LOGIN_INFO.user_id, 'true');
            common_storage.setItem('lock__trade_number_method__value' + window.LOGIN_INFO.user_id, $('.trade_number_method').val());
          }
        });
      }

      // // 委买输入框限制 事件监听的代码写错了
      // $(document).on('#vale_current_volum', 'change', function(e){
      //   var val = $(this).val() || 0;
      //   var limit = $('.entrust_total_num').html() || 0;
      //   // if (val > limit) {
      //   //   $(this).attr('x-placeholder', '本次委买/卖不得大于缺口数量').addClass('stuck');
      //   // }else{
      //   //   $(this).attr('x-placeholder', '请输入交易数量');
      //   // }
      // });

      // 订单完成后，数量恢复为空
      $(window).on('multi_products:create_order:finish',function(){
        if ('position_ratio' !== trade_number_method) {
          me.find('[name='+trade_number_method+']').val('').change();
        }else{
          me.find('[name='+trade_number_method+']').change(); //不修改
          me.find('[name="current_volume"]').val('').change();
        }
      });

      // 五档行情点击后，数量填充
      $(window).on('trade_5:click:change_volume', function(event){
        if ('position_ratio' == trade_number_method) {
          me.find('[name="current_volume"]').val(event.volume).change();
        }else if('assets_ratio' == trade_number_method){
          me.find('[name="current_volume"]').val(event.volume).change();
        }else{
          // me.find('[name='+trade_number_method+']').val(event.volume).change();
         me.find('[name='+trade_number_method+']').val(event.volume).change();
        }

      });

      $(window).on('order_create:direction:changed', function(event){
        var direction = event.direction;
        if ('buy' == direction) {
          $('#trade_text').html('总资产比');
          $('.trade_label').html('本次委买');
        }else if('sell' == direction){
          $('#trade_text').html('可卖比例');
          $('.trade_label').html('本次委卖');
        }
      });

      $(document).on('change', '.trade_number_method', function(event){
        if ('volume' == $(this).val()) {
          me.find('[name="volume"]').val('').change();
        }else if('assets_ratio' == $(this).val()){
          me.find('[name="assets_ratio"]').val('').change();
        }else if('position_ratio' == $(this).val()){
          me.find('[name="position_ratio"]').val('').change();
          me.find('[name="current_volume"]').val('').change();
        }else if('cur_position_ratio' == $(this).val()){
          me.find('[name="cur_position_ratio"]').val('').change();
        }
      })

      //按量交易、按比例交易
      $(function(){
        // 给radio框新增事件，同时默认选中第一个
        if(window.LOGIN_INFO.org_info.theme == 3){
            me.find('.radio-field input[type=radio]').on('change',tradeNumberMethodUpdate).first().click().prop('checked',true).change();
         }else{
            me.find('.trade_number_method').on('change',tradeNumberMethodUpdate).first().prop('checked',true).change();
         }
        
        // 给旧的按数量和按比例的input框新增事件，点击后进行对应的处理，原来的resetRateInput和resetVolumeInput被对应修改
        // 所谓的对应处理就是输入内容的校验
        me.find('[name=position_ratio]').on('keyup change',function(){
          resetRateInput(position_rate_input)
        });
        me.find('[name=assets_ratio]').on('keyup change',function(){
          resetRateInput(assets_rate_input)
        });
        me.find('[name=cur_position_ratio]').on('keyup change',function(){
          resetRateInput(cur_position_rate_input)
        });
        me.find('[name=volume]').on('keyup change',resetVolumeInput);
      });

      // 每当用户修改radio时调用该函数 也就是切换事件
      function tradeNumberMethodUpdate(){
        // 得到新的方式
        var new_method = getTradeNumberMethod();
        // 数量计算方式修改了则触发事件
        if( trade_number_method != new_method ){
          $(window).trigger({
            type: 'order_create:trade_number_method:change',
            trade_number_method: new_method
          });
          trade_number_method = new_method;
        }

        var tmpInput = $('.radio-field.active-enable.active').find('input.percent-plus-input');
       // resetRateInput(tmpInput); //这里为什么要单独的对rate数据变化进行判断呢？猜测是为了百分号显示隐藏的缘故   第一次进入这里时要处理

        // 联动输入框的灰显或者显示 额外新增了显示／隐藏的切换
        (window.requestAnimationFrame||window.setTimeout)(function(){
          me.find('.radio-field.active-enable:not(.active)').find('input:not([type=radio])').attr('disabled',true)
            .end().find('.plus-ctrl,[click-value]').addClass('disabled active');
          me.find('.radio-field.active-enable:not(.active)').hide().find('input.plus-input').addClass('disabled');
          me.find('.radio-field.active-enable:not(.active)').find('.percent-ctrls').toggleClass('active', false);

          me.find('.radio-field.active-enable.active').find('input:not([type=radio])').removeAttr('disabled')
            .end().find('.plus-ctrl,[click-value]').removeClass('disabled active');
          me.find('.radio-field.active-enable.active').show().find('input.plus-input').removeClass('disabled');
          me.find('.radio-field.active-enable.active').find('.percent-ctrls').toggleClass('active', true);
        });
      }

      function getTradeNumberMethod(){
        // 得到祖先form元素的数据，已经超出了本身模块。
        // 但是实际上也就是获取本模块的name为“trade_number_method”的值而已。
        // 新修改之后可能的值有：'volume' 'assets_ratio' 'position_ratio'
        // return me.closest('form').serializeArray().filter(function(item){
        //   return item.name === 'trade_number_method'
        // })[0].value;



        //由于新股申购的问题 这里给了一个默认的交易方式
        var method = me.closest('form').serializeArray().filter(function(item){
          return item.name === 'trade_number_method'
        })
        if(method[0]){
          return method[0].value;
        }else{
          return 'volume'
        }

      }

      // 重置数量输入框
      function resetVolumeInput(){
        // 如果是按‘总资产比’、‘调仓到’，则返回
        if(trade_number_method=='assets_ratio' || trade_number_method=='position_data_ratio'){return;}

        var volume_value = volume_input.val();

        if(!volume_value){
          volume_input.attr('old_value','');
          return;
        }

        // 如果数据不符合校验，则使用旧的数据，且重新走change流程
        if(volume_input.is('.pattern-stuck')){
          volume_input.val(volume_input.attr('old_value')||'').change();
          return;
        }else{
          volume_input.attr('old_value',volume_value);
        }
      }

      // 重置比例输入框
      function resetRateInput(rate_input){
        // 数量获取方式为绝对数量时，隐藏“%”这个单位
        if(trade_number_method=='volume'){
          return percent_unit_signal.hide();
        }

        var rate_value = rate_input.val();

        // 我的天，这段逻辑只是为了在比例值为空的时候，隐藏“%”这个符号
        if(!rate_value){
          percent_unit_signal.hide();
          rate_input.attr('old_value','');
          return;
        }else{
          percent_unit_signal.css({
            left: (1+rate_value.length/1.8)+'em'
          }).show();
        }

        // 如果数据不符合校验，则使用旧的数据，且重新走change流程
        if(rate_input.is('.pattern-stuck')){
          rate_input.val(rate_input.attr('old_value')||'').change();
          return;
        }else{
          rate_input.attr('old_value',rate_value);
        }

        // 限制长度
        if( rate_value.length > 5 ){
          rate_value = rate_value.substr(0,5);
          rate_input.val(rate_value).change();
          return;
        }

        // 限制最大值
        if( rate_value>100 ){
          rate_value = 100;
          rate_input.val(rate_value).change();
          return;
        }
      }
  }).call(document.scripts[document.scripts.length-1].parentNode);
  </script>
</div>
