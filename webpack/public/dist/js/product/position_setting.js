'use strict';

/**
 * author: liuzeyafzy
 * 人员分配页面
 */
function JS_position_setting(prefix) {
  var selectize = {};
  var managerArr = [];

  initProductHeader(prefix);

  // FD.org_info
  var productMenu = new Vue({
    el: '#productMenu',
    data: {
      active: 'position_setting',
      permission: FD.permission,
      disabled: FD.fee_mode == 1 ? 'fee_setting' : ''
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

  var positionInfo = new Vue({
    el: '#positionInfo',
    data: {
      focusFlag: false,
      stockList: [],
      stock_input: '',
      stock_name: '',
      remark: '',

      edit_type: '1',
      stock_id: '',
      volume: '',
      price: '',
      product_id: FD.product_id
    },
    methods: {
      getStockList: function getStockList() {
        var _this = this;
        var str = (window.REQUEST_PREFIX || '') + '/oms/helper/code_genius?stock_code=' + this.stock_input;
        $.getJSON(str).done(function (res) {
          if (res.code == 0 || res.code == 1123124) {
            _this.stockList = res.data;
            // var html = '';
            // res.data.forEach(function(e){
            //   html += '<li data-id="' + e.stock_id +'" data-name="'+ e.stock_name +'">' + e.stock_id + ' &nbsp; ' + e.stock_name + '</li>';
            // });
            // $('.custom-stock-suggest').html(html).slideDown(300);

            // // 当只有一个符合条件时，默认选中该项。
            // if(1 == res.code.length){
            //   selectOneStock($('.custom-stock-suggest>li'));
            // }
          } else {
              // $.omsAlert('获取建议证券列表失败！',false,300);
            }
        }).always(function () {
          $('.stock-input').removeClass('loading');
        });
      },
      selectOneStock: function selectOneStock(id, name) {
        var _this = this;
        // this.inputStockCode = id;
        this.stock_name = name;
        this.stock_input = id.substring(0, 6);
        this.stock_id = id;
        this.stockList = [];
      },
      doSubmit: function doSubmit() {
        $.startLoading('正在保存...');
        $.ajax({
          type: 'post',
          url: prefix + '/portfolio/edit-position',
          data: {
            stock_id: this.stock_id,
            edit_type: this.edit_type,
            volume: this.volume,
            price: this.price,
            product_id: this.product_id
          },
          success: function success(_ref) {
            var code = _ref.code,
                msg = _ref.msg,
                data = _ref.data;

            if (0 == code) {
              $.clearLoading();
              $.omsAlert('修改成功');
            } else {
              $.clearLoading();
              $.omsAlert(msg);
            }
          },
          error: function error() {
            $.clearLoading();
            $.failNotice('网络异常，请重试');
          }
        });
      },
      doCancel: function doCancel() {
        location.href = prefix + '/product/base_lists';
      }
    }
  });
}
//# sourceMappingURL=position_setting.js.map
