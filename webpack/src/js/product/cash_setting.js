/**
 * author: liuzeyafzy
 * 资金调整页面
 */
function JS_cash_setting(prefix){
  let productHeader = initProductHeader(prefix);

  // FD.org_info
  let productMenu = new Vue({
    el: '#productMenu',
    data: {
      active: 'cash_setting',
      permission: FD.permission,
      disabled: (FD.fee_mode == 1) ? 'fee_setting' : ''
    },
    methods: {
      goto: function goto(e) {
        var li = $(e.currentTarget);
        if (!li.hasClass('active') && !li.hasClass('disabled')) {
          location.href = prefix + '/product/' + li.attr('data-str') + '?product_id=' + FD.product_id;
        }
      }
    }
  });

  let cashInfo = new Vue({
    el: '#cashInfo',
    computed: {
      freeMoneyLabel: function(){
        if (1 == this.op_type) {
          // 入金则是“账户可分配金额”
          return '账户可分配金额';
        }else if(2 == this.op_type){
          // 出金则是可操作 可操作金额=当前账户可用资金
          return '可操作金额';
        }else if(3 == this.op_type){
          // 冻结则是当前账户可冻结资金（可冻结资金=可用资金）
          return '可冻结金额';
        }else if(4 == this.op_type){
          // 可解冻金额=当前账户已冻结未解冻资金
          return '可解冻金额';
        }
      },
      freeMoney: function(){
        var rtn = '--';
        if (1 == this.op_type) {
          // 入金则是可分配
          rtn = this.baseAccountInfo.can_allocate_fund;
        }else if(2 == this.op_type){
          // 出金则是可操作 可操作金额=当前账户可用资金
          rtn = this.productInfo.enable_cash;
        }else if(3 == this.op_type){
          // 冻结则是当前账户可冻结资金（可冻结资金=可用资金）
          rtn = this.productInfo.enable_cash;
        }else if(4 == this.op_type){
          // 可解冻金额=当前账户已冻结未解冻资金
          rtn = this.productInfo.manual_frozen_amount;
        }
        this.checkMoney(this.changeMoney, rtn);
        return rtn;
      },
      productInfo: function(){
        return productHeader.balanceInfo;
      },
      groupInfo: function(){
        return productHeader.groupInfo;
      },
      afterTotal_assets: function(){
        var rtn = Number(this.productInfo.total_assets);
        if (1 == this.op_type) {
          // // 入金则是“账户可分配金额”
          // rtn = Number(this.productInfo.total_assets) + Number(this.changeMoney);

          // 入金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.productInfo.total_assets) + Number(this.amount) + Number(this.right_amount);
          }else{
            rtn = Number(this.productInfo.total_assets) + Number(this.changeMoney);
          }
        }else if(2 == this.op_type){
          // // 出金则是可操作 可操作金额=当前账户可用资金
          // rtn = Number(this.productInfo.total_assets) - Number(this.changeMoney);

          // 出金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.productInfo.total_assets) - Number(this.amount) - Number(this.right_amount);
          }else{
            rtn = Number(this.productInfo.total_assets) - Number(this.changeMoney);
          }
        }else if(3 == this.op_type){

        }else if(4 == this.op_type){

        }
        return rtn;
      },
      afterRight_capital: function(){
        var rtn = Number(this.productInfo.right_capital);
        if (1 == this.op_type) {
          // 入金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.productInfo.right_capital) + Number(this.right_amount);
          }else{

          }
        }else if(2 == this.op_type){
          // 出金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.productInfo.right_capital) - Number(this.right_amount);
          }else{
          }
        }else if(3 == this.op_type){

        }else if(4 == this.op_type){

        }
        return rtn;
      },
      afterAssure_capital: function(){
        var rtn = Number(this.groupInfo.assure_capital);
        if (1 == this.op_type) {
          // 入金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.groupInfo.assure_capital) + Number(this.right_amount);
          }else{

          }
        }else if(2 == this.op_type){
          // 出金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.groupInfo.assure_capital) - Number(this.right_amount);
          }else{
          }
        }else if(3 == this.op_type){

        }else if(4 == this.op_type){

        }
        return rtn;
      },
      afterLoan_capital: function(){
        var rtn = Number(this.groupInfo.loan_capital);
        if (1 == this.op_type) {
          // 入金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.groupInfo.loan_capital) + Number(this.amount);
          }else{

          }
        }else if(2 == this.op_type){
          // 出金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.groupInfo.loan_capital) - Number(this.amount);
          }else{

          }
        }else if(3 == this.op_type){

        }else if(4 == this.op_type){

        }
        return rtn;
      },
      afterBalance_amount: function(){
        var rtn = Number(this.productInfo.balance_amount);
        if (1 == this.op_type) {
          // // 入金则是“账户可分配金额”
          // rtn = Number(this.productInfo.balance_amount) + Number(this.changeMoney);

          // 入金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.productInfo.balance_amount) + Number(this.amount) + Number(this.right_amount);
          }else{
            rtn = Number(this.productInfo.balance_amount) + Number(this.changeMoney);
          }
        }else if(2 == this.op_type){
          // // 出金则是可操作 可操作金额=当前账户可用资金
          // rtn = Number(this.productInfo.balance_amount) - Number(this.changeMoney);

          // 出金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.productInfo.balance_amount) - Number(this.amount) - Number(this.right_amount);
          }else{
            rtn = Number(this.productInfo.balance_amount) - Number(this.changeMoney);
          }
        }else if(3 == this.op_type){

        }else if(4 == this.op_type){

        }
        return rtn;
      },
      afterEnable_cash: function(){
        var rtn = Number(this.productInfo.enable_cash);
        if (1 == this.op_type) {
          // // 入金则是“账户可分配金额”
          // rtn = Number(this.productInfo.enable_cash) + Number(this.changeMoney);

          // 入金区分是否是专户版，专户版则需要加上保证金金额和借款金额
          if (3 == this.org_info.theme) {
            rtn = Number(this.productInfo.enable_cash) + Number(this.amount) + Number(this.right_amount);
          }else{
            // 入金则是“账户可分配金额”
            rtn = Number(this.productInfo.enable_cash) + Number(this.changeMoney);
          }
        }else if(2 == this.op_type){
          // // 出金则是可操作 可操作金额=当前账户可用资金
          // rtn = Number(this.productInfo.enable_cash) - Number(this.changeMoney);

          // 出金区分是否是专户版，专户版则需要加上保证金金额和借款金额
          if (3 == this.org_info.theme) {
            rtn = Number(this.productInfo.enable_cash) - Number(this.amount) - Number(this.right_amount);
          }else{
            // 入金则是“账户可分配金额”
            rtn = Number(this.productInfo.enable_cash) - Number(this.changeMoney);
          }
        }else if(3 == this.op_type){
          rtn = Number(this.productInfo.enable_cash) - Number(this.changeMoney);
        }else if(4 == this.op_type){
          rtn = Number(this.productInfo.enable_cash) + Number(this.changeMoney);
        }
        return rtn;
      },
      afterCan_allocate_fund: function(){
        var rtn = Number(this.baseAccountInfo.can_allocate_fund);
        if (1 == this.op_type) {
          // // 入金则是“账户可分配金额”
          // rtn = Number(this.baseAccountInfo.can_allocate_fund) - Number(this.changeMoney);

          // 入金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.baseAccountInfo.can_allocate_fund) - Number(this.amount) - Number(this.right_amount);
          }else{
            rtn = Number(this.baseAccountInfo.can_allocate_fund) - Number(this.changeMoney);
          }
        }else if(2 == this.op_type){
          // // 出金则是可操作 可操作金额=当前账户可用资金
          // rtn = Number(this.baseAccountInfo.can_allocate_fund) + Number(this.changeMoney);

          // 入金区分是否是专户版
          if (3 == this.org_info.theme) {
            rtn = Number(this.baseAccountInfo.can_allocate_fund) + Number(this.amount) - Number(this.right_amount);
          }else{
            rtn = Number(this.baseAccountInfo.can_allocate_fund) + Number(this.changeMoney);
          }
        }else if(3 == this.op_type){
          // rtn = Number(this.baseAccountInfo.can_allocate_fund) - Number(this.changeMoney);
        }else if(4 == this.op_type){
          // rtn = Number(this.baseAccountInfo.can_allocate_fund) + Number(this.changeMoney);
        }
        return rtn;
        // baseAccountInfo
      }
    },
    watch: {
      actionType: function(newValue, oldValue){
        if (newValue == 0) {
          this.op_type = 1;
        }else if(newValue == 1){
          this.op_type = 3;
        }
      },
      amount: function(newValue, oldValue){
        if (/^\d+\.{0,1}\d{0,2}$/.test(newValue) || newValue == '' || newValue == 0) {
          ;
        }else{
          this.amount = oldValue;
        }
      },
      right_amount: function(newValue, oldValue){
        if (/^\d+\.{0,1}\d{0,2}$/.test(newValue) || newValue == '' || newValue == 0) {
          ;
        }else{
          this.right_amount = oldValue;
        }
      },
      changeMoney: function(newValue, oldValue){
        if (/^\d+\.{0,1}\d{0,2}$/.test(newValue) || newValue == '' || newValue == 0) {
          ;
        }else{
          this.changeMoney = oldValue;
        }
        this.checkMoney(newValue, this.freeMoney);
      }
    },
    data: {
      changeMoney: 0, // 修改的金额数
      actionType: 0, //自定义的枚举值，0表示出入金 1表示冻结解冻，与后台的交互枚举值为：op_type 1:入金 2:出金 3:冻结 4:解冻
      op_type: 1,
      org_info: FD.org_info,
      baseAccountInfo: {},
      amount: '',
      right_amount: '',
      remark: ''
    },
    methods: {
      showSpecial: function(){
        return (this.org_info.theme == 3 && 0 == this.actionType)
      },
      checkMoney: function(value, freeMoney){
        if (value > freeMoney) {
          // $('.form-error-tip').removeClass('hide');
        }else{
          $('.form-error-tip').addClass('hide');
        }
      },
      numeralNumber: function(arg, num){
        if (undefined != num) {
          var str = '0.'
          for (let i = num - 1; i >= 0; i--) {
            str += '0';
          }
          return numeral(arg).format( '0,' + str );
        }
        return numeral(arg).format( '0,0.00' );
      },
      changeActionType: function(v){
        if (0 == v) {
          cashInfo.op_type = 1;
        }else{
          cashInfo.op_type = 3
        }
        console.log(cashInfo.op_type);
      },
      getBaseAccountInfo: function(){
        var _this = this;
        $.ajax({
          url: prefix + '/portfolio/fund-base-account-info',
          data: {
            product_id: FD.product_id
          },
          success: function({code, msg, data}){
            if (0 == code) {
              _this.baseAccountInfo = data;
            }else{
              $.omsAlert(msg);
            }
          },
          error: function(){
            $.failNotice('网络异常，请重试');
          }
        });
      },
      showHistory: function(){
        var _this = this;
        var html = `
        <div style="min-height: 300px;max-height: 400px;overflow: auto;">
          <select class="showHistoryByType">

          </select>
          <table>
            <thead>
              <tr>
                <th style="padding-left: 20px;text-align: left;">类型</th>
                <th style="padding-left: 20px;text-align: left;">操作金额</th>
                <th style="padding-left: 20px;text-align: left;">操作时间</th>
                <th style="padding-left: 20px;text-align: left;">操作人</th>
                <th style="padding-left: 20px;text-align: left;">备注</th>
              </tr>
            </thead>
            <tbody class="showHistoryTBody">

            </tbody>
          </table>
          <div class="historyPage"></div>
        </div>`;
        $.confirm({
          title: '资金变动记录',
          content: html,
          closeIcon: true,
          columnClass: 'custom-window-width',
          confirmButton: false,
          cancelButton: false
        });

        this.showHistoryByType = $('.showHistoryByType').selectize({
          valueField: 'value',
          labelField: 'label',
          create: false,
          onChange: function(){
            _this.getFundHistory();
          },
          render: {
            item: function(item, escape){
              return '<div class="item" data-value="'+ item.value +'" title="'+ item.label +'">' + escape(item.label) + '</div>';
            },
            option: function(item, escape){
              var label = item.value;
              return '<div class="option" title="'+ item.label +'">' + escape(item.label) +
              '</div>';
            }
          }
        })[0].selectize;

        if (3 == this.org_info.theme) {
          this.showHistoryByType.addOption([{
            label: '全部变动分类',
            value: 0
          },{
            label: '入金',
            value: 5
          },{
            label: '出金',
            value: 6
          },{
            label: '冻结',
            value: 3
          },{
            label: '解冻',
            value: 4
          }]);
        }else{
          this.showHistoryByType.addOption([{
            label: '全部变动分类',
            value: 0
          },{
            label: '入金',
            value: 1
          },{
            label: '出金',
            value: 2
          },{
            label: '冻结',
            value: 3
          },{
            label: '解冻',
            value: 4
          }]);
        }
        
        this.showHistoryByType.setValue(0);

        // this.getFundHistory();
      },
      getFundHistory: function(index){
        var _this = this;
        var getOpType = function(type){
          var op_type = {
            '1': '入金',
            '2': '出金',
            '3': '冻结',
            '4': '解冻',
            '5': '入金',
            '6': '出金'
          }
          return op_type[type];
        }
        $.ajax({
          url: prefix + '/portfolio/fund-history',
          data: {
            product_id: FD.product_id,
            page: index || 1,
            limit: 20,
            op_type: this.showHistoryByType.getValue()
          },
          success: function({code, msg, data}){
            if (0 == code) {
              var str = '';
              data.data.forEach(function(e){
                if (_this.org_info.theme == 3 && (e.op_type == 5 || e.op_type == 6)) {
                  str += `
                  <tr>
                    <td style="padding-left: 20px;text-align: left;">` + getOpType(e.op_type) + `</td>
                    <td style="padding-left: 20px;text-align: left;max-width: 300px;word-wrap: break-word;">` + _this.numeralNumber(e.amount) + '(含保证金' + _this.numeralNumber(e.right_amount) + '，借款' + _this.numeralNumber(e.loan_amount) + `)</td>
                    <td style="padding-left: 20px;text-align: left;">` + e.created_at + `</td>
                    <td style="padding-left: 20px;text-align: left;">` + e.nick_name + `</td>
                    <td style="padding-left: 20px;text-align: left;">`+ (('' == e.remark) ? `--` : e.remark) +`</td>
                  </tr>`;
                }else{
                  str += `
                  <tr>
                    <td style="padding-left: 20px;text-align: left;">` + getOpType(e.op_type) + `</td>
                    <td style="padding-left: 20px;text-align: left;max-width: 300px;word-wrap: break-word;">` + _this.numeralNumber(e.amount) + `</td>
                    <td style="padding-left: 20px;text-align: left;">` + e.created_at + `</td>
                    <td style="padding-left: 20px;text-align: left;">` + e.nick_name + `</td>
                    <td style="padding-left: 20px;text-align: left;">`+ (('' == e.remark) ? `--` : e.remark) +`</td>
                  </tr>`;
                }
              })
              
              $('.showHistoryTBody').html(str);
              $('.historyPage').html(data.data_page_html);
            }else{
              $.omsAlert(msg);
            }
          },
          error: function(){
            $.failNotice();
          }
        })
      },
      doSave: function(){
        var _this = this;
        var changeMoney = this.changeMoney;
        var amount = this.amount;
        var right_amount = this.right_amount;
        var op_type = this.op_type;
        var remark = this.remark;
        if (this.showSpecial()) {
          if ('' == amount) {
            amount = 0;
          }
          if ('' == right_amount) {
            right_amount = 0;
          }
          if (/^\d+(\.\d{1,2})?$/.test(amount) && /^\d+(\.\d{1,2})?$/.test(right_amount)) {
            ;
          }else{
            $.omsAlert('金额格式不对');
            return false;
          }
          if (amount < 0 || right_amount < 0 || (amount == 0 && right_amount == 0)) {
            $.omsAlert('金额必须大于0')
            return false;
          }

          // if (0 >= this.afterRight_capital && 0 < this.afterLoan_capital) {
          //   $.omsAlert('借款金额超过杠杆比例限制')
          //   return false;
          // }else{
          //   if (this.afterLoan_capital / this.afterRight_capital > productHeader.groupInfo.lever_ratio) {
          //     $.omsAlert('借款金额超过杠杆比例限制')
          //     return false;
          //   }
          // }

          if (amount + right_amount > this.freeMoney) {
            if (1 == op_type) {
              $.confirm({
                title: '已达上限',
                content: '<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>慎重！账户可分配余额不足，或将导致无法买入证券，确定继续？</div>',
                closeIcon: true,
                confirmButton: ' 确定 ',
                confirm: function(){
                  doSubmitV2(_this, amount, right_amount, op_type, remark);
                },
                cancelButton: false
              });
            }else{
              $.omsAlert(this.freeMoneyLabel + '不足');
            }
            return false;
          }
          doSubmitV2(_this, amount, right_amount, op_type, remark)
        }else{
          if (/^\d+(\.\d{1,2})?$/.test(changeMoney)) {
            ;
          } else {
            $.omsAlert('金额格式不对');
            return false;
          }
          if (changeMoney > 0) {
            ;
          }else{
            $.omsAlert('金额必须大于0');
            return false;
          }
          if (changeMoney > this.freeMoney) {
            if (1 == op_type) {
              $.confirm({
                title: '已达上限',
                content: '<div style="text-align: center;height: 150px;line-height: 150px;"><i class="warn-icon"></i>慎重！账户可分配余额不足，或将导致无法买入证券，确定继续？</div>',
                closeIcon: true,
                confirmButton: ' 确定 ',
                confirm: function(){
                  doSubmit(_this, changeMoney, op_type, remark);
                },
                cancelButton: false
              });
            }else{
              $.omsAlert(this.freeMoneyLabel + '不足');
            }
            return false;
          }
          doSubmit(_this, changeMoney, op_type, remark)
        }
      },
      urlBack: function(){
        location.href = prefix + '/product/base_lists';
      }
    }
  });

  cashInfo.getBaseAccountInfo();

  var _search_get = function(url, name){
    var params = {};
    url.replace(/^\?/,'').split('&').forEach(function(x){
        params[ x.replace(/\=.*/,'') ] = decodeURIComponent( x.replace(/.*\=/,'') );
    });

    return params[name];
  }

  $(document).on('click', '.historyPage>.pagination a', function () {
    var page = _search_get($(this).attr('href').match(/\?.*/)[0], 'page');
    cashInfo.getFundHistory(page);
    return false;
  });

  function doSubmit(_this, changeMoney, op_type, remark){
    $.startLoading('正在保存...');
    $.ajax({
      url: prefix + '/portfolio/fund-adjust',
      type: 'post',
      data: {
        product_id: FD.product_id,
        amount: changeMoney,
        op_type: op_type,
        remark: remark
      },
      success: function({code, msg, data}){
        $.clearLoading();
        if (0 == code) {
          productHeader.getGroupInfo();
          productHeader.getBalanceInfo();
          cashInfo.getBaseAccountInfo();
          _this.changeMoney = 0;
          $.omsAlert('保存成功');
        }else{
          $.omsAlert(msg);
        }
      },
      error: function(){
        $.clearLoading();
        $.failNotice();
      }
    })
  }

  function doSubmitV2(_this, amount, right_amount, op_type, remark){
    $.startLoading('正在保存...');
    $.ajax({
      url: prefix + '/portfolio/fund-adjust',
      type: 'post',
      data: {
        product_id: FD.product_id,
        amount: amount,
        right_amount: right_amount,
        op_type: (op_type == 1 ? 5 : 6),
        remark: remark
      },
      success: function({code, msg, data}){
        $.clearLoading();
        if (0 == code) {
          productHeader.getGroupInfo();
          productHeader.getBalanceInfo();
          cashInfo.getBaseAccountInfo();
          _this.amount = 0;
          _this.right_amount = 0;
          $.omsAlert('保存成功');
        }else{
          $.omsAlert(msg);
        }
      },
      error: function(){
        $.clearLoading();
        $.failNotice();
      }
    })
  }
}
