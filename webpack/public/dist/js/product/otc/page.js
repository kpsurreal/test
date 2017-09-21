'use strict';

//场外资产页面js
function outsideAssetFn() {
  //头部  --  子组件
  Vue.component('asset-out-head', {
    props: ['product_list', 'product_info', 'product_id'],
    template: '\n      <div class="asset_out_head">\n        <ul class="asset_out_head_title">\n          <li>\n            <h1>\u573A\u5916\u8D44\u4EA7</h1>\n            <vue-selectize :options="options" :placeholder="\'\u8BF7\u5148\u9009\u62E9\u4EA7\u54C1\'" :value="value" v-on:input="chgSelected = ($event)"></vue-selectize>\n          </li>\n        </ul>\n        <p class="asset_out_head_disc" v-if="product_list.length == 0">\u5F53\u524D\u6CA1\u6709\u4EA7\u54C1\u7EC4\uFF0C\u4E0D\u652F\u6301\u573A\u5916\u8D44\u4EA7\u5F55\u5165</p>\n\n      </div>\n    ',
    data: function data() {
      return {
        chgSelected: '',
        // popup: false,
        select_show: false,
        // sele_input_show: false,
        value: ''
      };
    },
    computed: {
      options: function options() {
        //将数据通过options添加到下拉框中
        var product_arr = [];
        this.product_list.forEach(function (e) {
          var obj = {
            type: e.type,
            label: e.name,
            value: e.id
          };
          product_arr.push(obj);
        });
        return product_arr;
      },
      value: function value() {
        //默认选中第一个账户
        return this.product_id;
      }
    },
    watch: { //数据监控
      chgSelected: function chgSelected() {
        //获取选中基金产品的id
        this.$emit('change_selected', this.chgSelected);
      }
    }
  });

  //录入弹窗
  Vue.component('asset-out-popup', {
    props: ['options_pro', "product_id", 'select_show', 'po_pup', 'product_name', 'chgTypeSelected', 'income_cash'],
    template: '\n      <div class="asset-out-popup">\n        <div class="asset-out-popup-content">\n          <h2 class="asset-out-popup-content-title">{{getType()}}</h2>\n          <p class="closeBtn" v-on:click="closeBtnFunc()">x</p>\n          <table class="asset-out-popup-content-form">\n            <thead>\n            <tr>\n              <td class="padd_bottom_20">\u6240\u5C5E\u4EA7\u54C1\u7EC4<span>*</span></td>\n              <td style="position:relative;"><input type="text" disabled="disabled" :title="product_name" :value="product_name" class="change_product_input"/><span class="change_product_input_after"></span></td>\n            </tr>\n            </thead>\n            <tbody v-if="chgTypeSelected == \'1\'">\n              <tr>\n                <td class="padd_bottom_10">\u5B9A\u589E\u80A1\u7968<span>*</span></td>\n                <td class="padd_bottom_10">\n                  <vue-stock-search :custom_cls="\'asset-out-popup-content-form-num\'" :stock_input_id="stock_input_type_id" v-on:stock_id="stock_id = $event" v-on:stock_input="stock_input_type_id = $event"></vue-stock-search>\n                </td>\n              </tr>\n              <tr>\n                <td class="padd_bottom_10">\u6570\u91CF<span>*</span></td>\n                <td class="padd_bottom_10">\n                  <div class="asset-out-popup-content-form-num"><input type="number" value="" placeholder="\u8BF7\u8F93\u5165\u6570\u91CF" v-on:keydown="onlyParseIntNum()" class="stock_quantity_input"/>\u80A1</div>\n                </td>\n              </tr>\n              <tr>\n                <td class="padd_bottom_10">\u5B9A\u589E\u4EF7\u683C<span>*</span></td>\n                <td class="padd_bottom_10">\n                  <div class="asset-out-popup-content-form-num"><input type="number" value="" v-on:keydown="onlyParseFloatNum(\'.price_input\')" placeholder="\u8BF7\u8F93\u5165\u4EF7\u683C" class="price_input"/>\u5143</div>\n                </td>\n              </tr>\n              <tr>\n                <td class="padd_bottom_10">\u8D77\u59CB\u65E5\u671F<span>*</span></td>\n                <td class="padd_bottom_10">\n                  <vue-zebra_date_picker v-on:clear="startDate = $event" :value="startDate" v-on:select="startDate = ($event)" ></vue-zebra_date_picker>\n                </td>\n              </tr>\n              <tr>\n                <td class="padd_bottom_10">\u89E3\u9501\u65E5\u671F<span>*</span></td>\n                <td class="padd_bottom_10">\n                  <vue-zebra_date_picker :start_date_time="currentDate" :value="currentDate" v-on:select="currentDate = ($event)" ></vue-zebra_date_picker>\n                </td>\n              </tr>\n              <tr>\n                <td colspan="2" class="text-center-btn">\n                  <button class="btn setByInputBtn"  v-on:click="setByInput()">\u786E\u5B9A</button>\n                </td>\n              </tr>\n            </tbody>\n            <tbody v-if="chgTypeSelected == \'2\'">\n              <tr>\n                <td class="padd_bottom_10">\u4EE3\u7801<span>*</span></td>\n                <td class="padd_bottom_10"><input type="text" value="" placeholder="\u8BF7\u8F93\u5165\u8BC1\u5238\u4EE3\u7801" class="stock_code_input"/></td>\n              </tr>\n              <tr>\n                <td class="padd_bottom_10">\u540D\u79F0<span>*</span></td>\n                <td class="padd_bottom_10"><input type="text" value="" placeholder="\u8BF7\u8F93\u5165\u540D\u79F0" class="stock_name"/></td>\n              </tr>\n              <tr>\n                <td class="padd_bottom_10">\u4EFD\u989D<span>*</span></td>\n                <td class="padd_bottom_10"><input name="share" type="number" value="" placeholder="\u8BF7\u8F93\u5165\u4EFD\u989D" class="share"/></td>\n              </tr>\n              <tr>\n                <td class="padd_bottom_10">\u5E02\u503C<span>*</span></td>\n                <td class="padd_bottom_10"><div class="asset-out-popup-content-form-num"><input type="number" value="" v-on:keydown="onlyParseFloatNum(\'.market_value\')" placeholder="\u8BF7\u8F93\u5165\u5E02\u503C" class="market_value"/>\u5143</div></td>\n              </tr>\n              <tr>\n                <td class="padd_bottom_10">\u6D6E\u76C8\u7387</td>\n                <td class="padd_bottom_10"><div class="asset-out-popup-content-form-num"><input type="number" value="" v-on:keydown="onlyParseFloatNum(\'.profit_rate\')" placeholder="\u8BF7\u8F93\u5165\u6D6E\u76C8\u7387" class="profit_rate"/>%</div></td>\n              </tr>\n              <tr>\n                <td colspan="2" class="text-center-btn"><button class="btn" v-on:click="monetaryFundInput()">\u786E\u5B9A</button></td>\n              </tr>\n            </tbody>\n            <tbody v-if="chgTypeSelected == \'3\'">\n              <tr>\n                <td class="padd_bottom_10">\u81EA\u52A8\u8BFB\u53D6<span>*</span></td>\n                <td class="padd_bottom_10">\n                  <div class="asset-out-popup-content-form-num">\n                    <form class="form_file">\n                      <input style="display: block;" class="input-disabled-file" disabled="disabled" type="text" :value="income_cash && income_cash.read_url" placeholder="\u8BF7\u5F55\u5165\u4F30\u503C\u8868\u6587\u4EF6\u540D"/>\n                    </form>\n                    <a class="input-btn" v-on:click="autoSwapInput()">\u8BFB\u53D6</a>\n                  </div>\n                </td>\n              </tr>\n              <tr>\n                <td class="padd_bottom_10">\u4E0A\u4F20\u6587\u4EF6<span>*</span></td>\n                <td class="padd_bottom_10">\n                  <div class="asset-out-popup-content-form-num">\n                    <form method="post" id="submit_file" target="iframeName" action="/task/uploadxls">\n                      <input id="file-upload" name="file" type="file" value="" placeholder="\u8BF7\u5F55\u5165\u4F30\u503C\u8868\u6587\u4EF6\u540D"/>\n                    </form>\n                    <a class="input-btn" v-on:click="incomeSwapInput()">\u4E0A\u4F20</a>\n\n                  </div>\n                </td>\n              </tr>\n            </tbody>\n            <tbody v-if="chgTypeSelected == \'4\'">\n              <tr>\n                <td class="padd_bottom_10">\u91D1\u989D<span>*</span></td>\n                <td class="padd_bottom_10"><div class="asset-out-popup-content-form-num"><input type="number" value="" v-on:keydown="onlyParseFloatNum(\'.amount\')" placeholder="\u8BF7\u5F55\u5165\u91D1\u989D" class="amount"/>\u5143</div></td>\n              </tr>\n              <tr>\n                <td>\u5907\u6CE8</td>\n                <td><textarea placeholder="\u8BF7\u5F55\u5165\u5907\u6CE8" class="write_area"></textarea></td>\n              </tr>\n              <tr>\n                <td colspan="2" class="text-center-btn"><button class="btn" v-on:click="cashInput()">\u786E\u5B9A</button></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n      </div>\n    ',
    data: function data() {
      return {
        chgProSelected: '',
        // chgTypeSelected: 1,
        startDate: function () {
          return moment().format('YYYY-MM-DD');
        }(),
        currentDate: '',
        stock_id: '', //股票id给后台传值
        stock_input_type_id: '', //辅助寻找input框中股票id的前6位
        options_type: [{ label: '定增', value: '1' }, { label: '场外货币基金', value: '2' }, { label: '收益互换', value: '3' }, { label: '现金', value: '4' }]
      };
    },
    methods: {
      getType: function getType() {
        if (1 == this.chgTypeSelected) {
          return '定增录入';
        } else if (2 == this.chgTypeSelected) {
          return '货币基金录入';
        } else if (3 == this.chgTypeSelected) {
          return '收益互换录入';
        } else if (4 == this.chgTypeSelected) {
          return '场外现金资产录入';
        }
        return '';
      },
      closeBtnFunc: function closeBtnFunc() {
        //弹窗关闭按钮事件
        this.stock_id = '';
        this.stock_input_type_id = '';
        this.currentDate = '';
        if (this.po_pup == true) {
          this.$emit('change_popup', false);
        }
      },
      onlyParseIntNum: function onlyParseIntNum() {//只可输入整数
        // if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8) {
        //   event.returnValue=true;
        // } else {
        //   event.returnValue=false;
        // }
      },
      onlyParseFloatNum: function onlyParseFloatNum(str) {
        //可输入整数和小数点，通过获取单独标签的value值来进行判断小数点的个数
        if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105 || event.keyCode == 8 || event.keyCode == 110 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {
          if ($(str).val().indexOf('.') != -1 && event.keyCode == 110 || $(str).val().indexOf('.') != -1 && event.keyCode == 190) {
            event.preventDefault();
            return;
          }
          event.returnValue = true;
        } else {
          event.returnValue = false;
        }
      },
      setByInput: function setByInput() {
        //定增录入
        //产品组id
        if (this.product_id == '') {
          var group_id = this.chgProSelected;
        } else {
          var group_id = this.product_id;
        }
        var _this = this;

        //股票代码
        var stock_id = this.stock_id;
        //volume	 持仓数量
        var volume = $(".stock_quantity_input").val();
        //stock_price 定增价格
        var stock_price = $(".price_input").val();
        //start_date 起始日期
        var start_date = this.startDate;
        //unlock_date 解锁日期
        var unlock_date = this.currentDate;
        if (group_id == '') {
          $.omsAlert('产品组id不能为空');
          return false;
        }
        if (stock_id == '') {
          $.omsAlert('请输入正确的股票代码');
          return false;
        }
        if (volume == '') {
          $.omsAlert('持仓数量不能为空');
          return false;
        }
        if (stock_price == '') {
          $.omsAlert('定增价格不能为空');
          return false;
        }
        if (start_date == '') {
          $.omsAlert('起始日期不能为空');
          return false;
        }
        if (unlock_date == '') {
          $.omsAlert('解锁日期不能为空');
          return false;
        }
        //起始日期  和  解锁日期 进行比较
        if (start_date >= unlock_date) {
          $.omsAlert('解锁日期必须大于起始日期');
          return false;
        }
        $.ajax({
          url: '/bms-pub/product/otc/private_placement/add',
          type: 'POST',
          data: {
            group_id: group_id,
            stock_id: stock_id,
            volume: volume,
            stock_price: stock_price,
            start_date: start_date,
            unlock_date: unlock_date
          },
          success: function success(res) {
            if (0 == res.code) {
              _this.$emit('change_popup', false);
              $.omsAlert("录入成功");
              //录入成功之后清空数据
              $(".stock_quantity_input").val('');
              $(".price_input").val('');
              $(".client-stockInput").val('');
              _this.stock_id = '';
              _this.stock_input_type_id = '';
              _this.currentDate = '';
              if (_this.product_id != '') {
                asset_out.pageProductInfo(group_id);
              }
            } else {
              $.omsAlert(res.msg);
            }
          },
          error: function error() {
            $.omsAlert(res.msg);
          }
        });
      },
      monetaryFundInput: function monetaryFundInput() {
        //货币基金录入
        //产品组id
        if (this.product_id == '') {
          var group_id = this.chgProSelected;
        } else {
          var group_id = this.product_id;
        }
        //股票代码
        var stock_id = $(".stock_code_input").val();
        //stock_name 股票名称
        var stock_name = $(".stock_name").val();
        // share 份额
        var share = $('.share').val();
        //market_value	 市值
        var market_value = $(".market_value").val();
        //profit_rate 浮盈率
        var profit_rate = $(".profit_rate").val() / 100;
        var _this = this;
        if (group_id == '') {
          $.omsAlert('产品组id不能为空');
          return false;
        }
        if (stock_id == '') {
          $.omsAlert('证券代码不能为空');
          return false;
        }
        if (stock_name == '') {
          $.omsAlert('名称不能为空');
          return false;
        }
        if (share == '') {
          $.omsAlert('份额不能为空');
          return false;
        }
        if (market_value == '') {
          $.omsAlert('市值不能为空');
          return false;
        }
        // if (profit_rate == '') {
        //   $.omsAlert('浮盈率不能为空');
        //   return false;
        // }
        $.ajax({
          url: '/bms-pub/product/otc/monetary_fund/add',
          type: 'POST',
          data: {
            group_id: group_id,
            stock_id: stock_id,
            stock_name: stock_name,
            volume: share,
            market_value: market_value,
            profit_rate: profit_rate
          },
          success: function success(res) {
            if (0 == res.code) {
              _this.$emit('change_popup', false);
              $.omsAlert('录入成功');
              //清空数据
              $(".stock_code_input").val('');
              $(".stock_name").val('');
              $(".market_value").val('');
              $(".profit_rate").val('');
              $('.share').val('');
              if (_this.product_id != '') {
                asset_out.pageProductInfo(group_id);
              }
            } else {
              $.omsAlert(res.msg);
            }
          },
          error: function error() {
            $.omsAlert(res.msg);
          }
        });
      },
      autoSwapInput: function autoSwapInput() {
        //收益互换字段录入
        //产品组id
        if (this.product_id == '') {
          var group_id = this.chgProSelected;
        } else {
          var group_id = this.product_id;
        }
        var _this = this;
        //upload_file 标准上传数据流格式
        if (group_id == '') {
          $.omsAlert("产品组id不能为空");
          return false;
        }
        $.startLoading('正在读取');
        $.ajax({
          url: '/bms-pub/product/otc/income_swap/read',
          type: 'post',
          data: {
            group_id: group_id
          },
          success: function success(_ref) {
            var code = _ref.code,
                msg = _ref.msg,
                data = _ref.data;

            if (0 == code) {
              _this.$root.doRefresh();
              $.clearLoading();
              $.omsAlert('读取成功');
            } else {
              $.clearLoading();
              $.omsAlert(msg);
            }
          },
          error: function error() {
            $.clearLoading();
            $.omsAlert('网络异常，请重试');
          }
        });
      },
      incomeSwapInput: function incomeSwapInput() {
        //收益互换录入
        //产品组id
        if (this.product_id == '') {
          var group_id = this.chgProSelected;
        } else {
          var group_id = this.product_id;
        }
        var _this = this;
        //upload_file 标准上传数据流格式
        if (group_id == '') {
          $.omsAlert("产品组id不能为空");
          return false;
        }
        var form = new FormData(document.getElementById("submit_file"));

        var oFile = document.getElementById("submit_file").file.files[0];

        if (undefined == oFile) {
          $.omsAlert('请选择正确的文件');
          return false;
        }
        var reader = new FileReader();
        $.startLoading('正在读取');
        reader.onload = function (oFREvent) {
          $.ajax({
            url: '/task/uploadxls',
            // url: " {{ config('platform.utility_control_uri')}}"  + "/task/uploadxls",
            type: 'POST',
            data: form,
            processData: false,
            contentType: false,
            success: function success(res) {
              res = JSON.parse(res);
              if (res.code == 0) {
                var upload = res.data.upload;
                $.ajax({
                  url: '/bms-pub/product/otc/income_swap/add',
                  type: 'POST',
                  data: {
                    group_id: group_id,
                    upload_file: upload
                  },
                  success: function success(res) {
                    if (0 == res.code) {
                      _this.$emit('change_popup', false);
                      _this.$root.doRefresh();
                      $.clearLoading();
                      $.omsAlert('录入成功');
                      // if (_this.product_id != '') {
                      //   asset_out.pageProductInfo(group_id);
                      // }
                    } else {
                      $.clearLoading();
                      $.omsAlert(res.msg);
                    }
                  },
                  error: function error() {
                    $.clearLoading();
                    $.omsAlert(res.msg);
                  }
                });
              } else {
                $.clearLoading();
                $.omsAlert(res.msg);
              }
            },
            error: function error() {
              $.clearLoading();
              $.omsAlert('网络异常，请重试');
            }
          });
        };
        reader.onerror = function (oFREvent) {
          $.omsAlert('文件读取失败，请重试');
        };
        reader.readAsDataURL(oFile);
      },
      cashInput: function cashInput() {
        //现金录入
        //产品组id
        if (this.product_id == '') {
          var group_id = this.chgProSelected;
        } else {
          var group_id = this.product_id;
        }
        //amount	 资金
        var amount = $(".amount").val();
        //备注
        var remark = $(".write_area").val();
        if (group_id == '') {
          $.omsAlert('产品组id不能为空');
          return false;
        }
        if (amount == '') {
          $.omsAlert('资金不能为空');
          return false;
        }
        var _this = this;
        $.ajax({
          url: '/bms-pub/product/otc/cash/add',
          type: 'POST',
          data: {
            group_id: group_id,
            amount: amount,
            remark: remark
          },
          success: function success(res) {
            if (0 == res.code) {
              _this.$emit('change_popup', false);
              $.omsAlert('录入成功');
              $(".amount").val('');
              $(".write_area").val('');
              if (_this.product_id != '') {
                asset_out.pageProductInfo(group_id);
              }
            } else {
              $.omsAlert(res.msg);
            }
          },
          error: function error() {
            $.omsAlert(res.msg);
          }
        });
      }
    },
    watch: { //数据监控
      chgProSelected: function chgProSelected() {
        //获取选中基金产品的id
        this.$emit('change_pro_selected', this.chgProSelected);
      },
      chgTypeSelected: function chgTypeSelected() {
        //获取选中基金产品的id
        this.$emit('change_type_selected', this.chgTypeSelected);
      },
      stock_id: function stock_id() {
        //定增股票id
        this.$emit('change_input_id', this.stock_id);
      }
    }
  });

  //主体  --  子组件
  Vue.component('asset-out-content', {
    mixins: [numberMixin], //在component.js中引入numberMixin插件名，就可以直接调用里面的插件内容numeralNumber
    props: ['product_info', 'product_id', 'product_name'],
    template: '\n      <div class="asset_out_content">\n        <div class="asset_out_content_set">\n          <p>\n            <span  v-html="\'\u5B9A\u589E\uFF08\u5E02\u503C\uFF1A\xA5 \'+ numeralNumber(set_by_markert(),2) + \'\uFF09\'"></span>\n            <b class="trigale trigale_set" v-on:click="trigaleSet()"></b>\n            <a v-on:click="clear_jconfirm = true;action_type = 1;" class="bem-ui-btn" style="float: right;margin-right: 20px;">\u6E05\u7A7A</a>\n            <a v-on:click="popup = true;chgTypeSelected = 1;" class="bem-ui-btn" style="float: right;margin-right: 10px;">\u5F55\u5165\u8D44\u4EA7</a>\n          </p>\n          <table class="asset_out_content_set_table" v-show="trigale_set_table">\n            <thead>\n              <tr>\n                <td class="padd_left">\u5B9A\u589E\u80A1\u7968</td>\n                <td class="padd_right_100">\u6570\u91CF</td>\n                <td class="padd_right">\u5B9A\u589E\u4EF7\u683C</td>\n                <td class="padd_right_150">\u5E02\u503C</td>\n                <td class="padd_left padd_right_60">\u8D77\u59CB\u65E5\u671F</td>\n                <td class="padd_left">\u89E3\u9501\u65E5\u671F</td>\n                <td class="padd_right"></td>\n              </tr>\n            </thead>\n            <tbody  v-for="private_placement in product_info.private_placement" v-if="product_info.private_placement.length > 0">\n              <tr>\n                <td class="padd_left">{{private_placement.stock_id}}&nbsp;&nbsp;{{private_placement.stock_name}}</td>\n                <td class="padd_right_100">{{private_placement.volume}}</td>\n                <td class="padd_right">{{numeralNumber(private_placement.stock_price,3)}}</td>\n                <td class="padd_right_150">{{numeralNumber(private_placement.market_value,2)}}</td>\n                <td class="padd_left padd_right_60">{{private_placement.start_date}}</td>\n                <td class="padd_left">{{private_placement.unlock_date}}</td>\n                <td class="padd_right">\n                  <a class="modify" v-on:click="changeModify(private_placement)">\u4FEE\u6539</a>\n                  <a class="deleted" v-on:click="doSetByDelete(private_placement.id)">\u5220\u9664</a>\n                </td>\n              </tr>\n              <tr class="asset_out_content_set_modify" v-show="change_id == private_placement.id">\n                <td colspan="7">\n                  <ul>\n                    <li>\n                      <span>\u6570\u91CF</span>\n                      <div>\n                        <input type="number" v-model="change_val" v-on:keydown="onlyParseIntNum()"/>\u80A1\n                      </div>\n                    </li>\n                    <li>\n                      <span>\u5B9A\u589E\u4EF7\u683C</span>\n                      <div>\n                        <input type="number" v-model="change_price" v-on:keydown="onlyParseFloatNum(change_price)"/>\u5143\n                      </div>\n                    </li>\n                    <li>\n                      <span>\u8D77\u59CB\u65E5\u671F</span>\n                      <vue-zebra_date_picker v-on:clear="change_start_time = $event" :value="change_start_time" v-on:select="change_start_time = ($event)"></vue-zebra_date_picker>\n                    </li>\n                    <li>\n                      <span>\u89E3\u9501\u65E5\u671F</span>\n                      <vue-zebra_date_picker v-on:clear="change_unlock_time = $event" :value="change_unlock_time" v-on:select="change_unlock_time = ($event)" ></vue-zebra_date_picker>\n                    </li>\n                    <li>\n                      <button class="preservation" v-on:click="setByPreser(private_placement.id)">\u4FDD\u5B58</button>\n                      <button class="cancel" v-on:click="change_id = \'\'">\u53D6\u6D88</button>\n                    </li>\n                  </ul>\n                </td>\n              </tr>\n            </tbody>\n            <tbody v-if="product_info.private_placement.length == 0">\n              <tr>\n                <td colspan="7" style="text-align:left;padding-left:10px;"><p>\u6CA1\u6709\u76F8\u5173\u6570\u636E</p></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <div class="asset_out_content_set">\n          <p>\n            <span v-html="\'\u8D27\u5E01\u57FA\u91D1\uFF08\u5E02\u503C\uFF1A\xA5 \' + numeralNumber(currency_markert(),2) + \'\uFF09\'"></span>\n            <b class="trigale trigale_currenty_table" v-on:click="trigaleCurrenty()"></b>\n            <a v-on:click="clear_jconfirm = true;action_type = 2;" class="bem-ui-btn" style="float: right;margin-right: 20px;">\u6E05\u7A7A</a>\n            <a v-on:click="popup = true;chgTypeSelected = 2;" class="bem-ui-btn" style="float: right;margin-right: 10px;">\u5F55\u5165\u8D44\u4EA7</a>\n          </p>\n          <table class="asset_out_content_set_table" v-show="trigale_currenty_table">\n            <thead>\n              <tr>\n                <td class="padd_left">\u4EE3\u7801</td>\n                <td class="padd_left">\u540D\u79F0</td>\n                <td class="padd_right">\u4EFD\u989D</td>\n                <td class="padd_right">\u5E02\u503C</td>\n                <td class="padd_right">\u6D6E\u76C8\u7387</td>\n                <td class="padd_right"></td>\n              </tr>\n            </thead>\n            <tbody  v-for="monetary_fund in product_info.monetary_fund" v-if="product_info.monetary_fund.length > 0">\n              <tr>\n                <td class="padd_left">{{monetary_fund.stock_id}}</td>\n                <td class="padd_left">{{monetary_fund.stock_name}}</td>\n                <td class="padd_right">{{numeralNumber(monetary_fund.volume,0)}}</td>\n                <td class="padd_right">{{numeralNumber(monetary_fund.market_value,2)}}</td>\n                <td class="padd_right" :class="{red: checkPositive(monetary_fund.profit_rate), green: checkNegative(monetary_fund.profit_rate)}">{{numeralNumber(monetary_fund.profit_rate*100,2)+ \'%\'}}</td>\n                <td class="padd_right">\n                  <a class="modify" v-on:click="change_asset_id = monetary_fund.id, change_asset_market = monetary_fund.market_value, change_asset_profit = monetary_fund.profit_rate*100, change_asset_volume = monetary_fund.volume">\u4FEE\u6539</a>\n                  <a class="deleted" v-on:click="doMonetaryDelete(monetary_fund.id)">\u5220\u9664</a>\n                </td>\n              </tr>\n              <tr class="asset_out_content_set_modify" v-show="change_asset_id == monetary_fund.id">\n                <td colspan="7">\n                  <ul>\n                    <li>\n                      <span>\u4EFD\u989D</span>\n                      <div>\n                        <input type="number" v-model="change_asset_volume" v-on:keydown="onlyParseFloatNum(change_asset_volume)"/>\n                      </div>\n                    </li>\n                    <li>\n                      <span>\u5E02\u503C</span>\n                      <div>\n                        <input type="number" v-model="change_asset_market" v-on:keydown="onlyParseFloatNum(change_asset_market)"/>\u5143\n                      </div>\n                    </li>\n                    <li>\n                      <span>\u6D6E\u76C8\u7387</span>\n                      <div>\n                        <input type="number" v-model="change_asset_profit" v-on:keydown="onlyParseFloatNum(change_asset_profit)"/>%\n                      </div>\n                    </li>\n                    <li>\n                      <button class="preservation" v-on:click="monetaryPreser(monetary_fund.id)">\u4FDD\u5B58</button>\n                      <button class="cancel" v-on:click="change_asset_id = \'\'">\u53D6\u6D88</button>\n                    </li>\n                  </ul>\n                </td>\n              </tr>\n            </tbody>\n            <tbody v-if="product_info.monetary_fund.length == 0">\n              <tr>\n                <td colspan="7" style="text-align:left;padding-left:10px;"><p>\u6CA1\u6709\u76F8\u5173\u6570\u636E</p></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <div class="asset_out_content_set">\n          <p>\n            <span v-html="\'\u6536\u76CA\u4E92\u6362\uFF08\u5E02\u503C\uFF1A\xA5 \' + numeralNumber(income_swap_markert(),2) + \'\uFF09\'"></span>\n            <b class="trigale trigale_income_table" v-on:click="trigaleIncome()"></b>\n            <span class="dot-tip exclamation" v-show="product_info.income_cash && product_info.income_cash.err_info != \'\' && product_info.income_cash.err_info != undefined" style="margin-right: 10px;vertical-align: bottom;">\n              <div v-on:mouseover="language_show()" v-on:mouseout="language_hide()">\n                <em>i</em>\n                <span class="str">\n                  <span class="msg">\n                    <span v-text="product_info.income_cash.err_info"></span>\n                  </span>\n                </span>\n              </div>\n            </span>\n            <a v-on:click="clear_jconfirm = true;action_type = 3;" class="bem-ui-btn" style="float: right;margin-right: 20px;">\u6E05\u7A7A</a>\n            <a v-on:click="popup = true;chgTypeSelected = 3;" class="bem-ui-btn" style="float: right;margin-right: 10px;">\u5F55\u5165\u8D44\u4EA7</a>\n          </p>\n          <table class="asset_out_content_set_table asset_out_content_set_body" v-show="trigale_income_table">\n            <thead>\n              <tr>\n                <td class="padd_left">\u5BA2\u6237\u53F7</td>\n                <td class="padd_left">\u6E05\u5355\u7F16\u53F7</td>\n                <td class="padd_left">\u4F30\u503C\u65E5\u671F</td>\n                <td class="padd_left">\u8BC1\u5238\u4EE3\u7801</td>\n                <td class="padd_left">\u8BC1\u5238\u540D\u79F0</td>\n                <td class="padd_left">\u6301\u4ED3\u7C7B\u578B</td>\n                <td class="padd_right">\u6807\u7684\u6570\u91CF</td>\n                <td class="padd_right">\u4EA4\u6613\u8D27\u5E01</td>\n                <td class="padd_right">\u671F\u521D\u4EF7\u683C</td>\n                <td class="padd_right">\u5F53\u524D\u4EF7\u683C</td>\n                <td class="padd_right">\u6DA8\u8DCC\u5E45</td>\n                <td class="padd_right">\u603B\u6210\u672C</td>\n                <td class="padd_right">\u7D2F\u8BA1\u5B9E\u73B0\u6536\u76CA</td>\n                <td class="padd_right">\u603B\u6D6E\u52A8\u76C8\u4E8F</td>\n                <td class="padd_right">\u5E02\u503C</td>\n              </tr>\n            </thead>\n            <tbody v-for="income_swap in product_info.income_swap" v-if="product_info.income_swap.length > 0" >\n              <tr>\n                <td class="padd_left">{{income_swap.guest_id}}</td>\n                <td class="padd_left">{{income_swap.list_number}}</td>\n                <td class="padd_left">{{income_swap.valuation_date}}</td>\n                <td class="padd_left">{{income_swap.security_id}}</td>\n                <td class="padd_left">{{income_swap.security_name}}</td>\n                <td class="padd_left" v-if="income_swap.position_type == \'\'">--</td>\n                <td class="padd_left" v-else>{{income_swap.position_type}}</td>\n                <td class="padd_right">{{income_swap.hold_volume}}</td>\n                <td class="padd_right">{{income_swap.currency}}</td>\n                <td class="padd_right">{{numeralNumber(income_swap.begin_price,3)}}</td>\n                <td class="padd_right">{{numeralNumber(income_swap.current_price,3)}}</td>\n                <td class="padd_right" :class="{red: checkPositive(income_swap.rise_fall_rate), green: checkNegative(income_swap.rise_fall_rate)}">{{numeralNumber(income_swap.rise_fall_rate*100,2)+ \'%\'}}</td>\n                <td class="padd_right">{{numeralNumber(income_swap.total_cost,2)}}</td>\n                <td class="padd_right">{{numeralNumber(income_swap.accumulate_profit,2)}}</td>\n                <td class="padd_right">{{numeralNumber(income_swap.total_profit,2)}}</td>\n                <td class="padd_right">{{numeralNumber(income_swap.market_value,2)}}</td>\n              </tr>\n            </tbody>\n            <tbody v-if="product_info.income_swap.length == 0">\n              <tr>\n                <td colspan="15" style="text-align:left;padding-left:10px;"><p>\u6CA1\u6709\u76F8\u5173\u6570\u636E</p></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <div class="asset_out_content_set">\n          <p>\n            <span>\u573A\u5916\u73B0\u91D1\u8D44\u4EA7</span>\n            <b class="trigale trigale_asset_table" v-on:click="trigaleAsset()"></b>\n            <a v-on:click="clear_jconfirm = true;action_type = 4;" class="bem-ui-btn" style="float: right;margin-right: 20px;">\u6E05\u7A7A</a>\n            <a v-on:click="popup = true;chgTypeSelected = 4;" class="bem-ui-btn" style="float: right;margin-right: 10px;">\u5F55\u5165\u8D44\u4EA7</a>\n          </p>\n          <table class="asset_out_content_set_table" v-show="trigale_asset_table">\n            <thead>\n              <tr>\n                <td class="padd_left">\u91D1\u989D</td>\n                <td class="padd_left">\u5907\u6CE8</td>\n                <td class="padd_right"></td>\n              </tr>\n            </thead>\n            <tbody v-for="cash in product_info.cash" v-if="product_info.cash.length > 0">\n              <tr>\n                <td class="padd_left">{{numeralNumber(cash.amount,2)}}</td>\n                <td class="padd_left" v-if="cash.remark != \'\'">{{cash.remark}}</td>\n                <td class="padd_left" v-else>--</td>\n                <td class="padd_right"><a class="modify" v-on:click="change_cash_id = cash.id, change_cash_val = cash.amount, change_cash_remark = cash.remark">\u4FEE\u6539</a>   <a class="deleted" v-on:click="doCashDelete(cash.id)">\u5220\u9664</a></td>\n              </tr>\n              <tr class="asset_out_content_set_modify" v-show="change_cash_id == cash.id">\n                <td colspan="7">\n                  <ul>\n                    <li>\n                      <span>\u91D1\u989D</span>\n                      <div>\n                        <input type="number" v-model="change_cash_val" v-on:keydown="onlyParseFloatNum(change_cash_val)"/>\u5143\n                      </div>\n                    </li>\n                    <li>\n                      <span>\u5907\u6CE8</span>\n                      <div style="width:350px;">\n                        <input type="text" v-model="change_cash_remark" class="cash_remark" :placeholder="\'\u6700\u591A\u4E0D\u8D85\u8FC750\u4E2A\u5B57\'"/>\n                      </div>\n                    </li>\n                    <li>\n                      <button class="preservation" v-on:click="changePreser(cash.id)">\u4FDD\u5B58</button>\n                      <button class="cancel" v-on:click="change_cash_id = \'\'">\u53D6\u6D88</button>\n                    </li>\n                  </ul>\n                </td>\n              </tr>\n            </tbody>\n            <tbody v-if="product_info.cash.length == 0">\n              <tr>\n                <td colspan="7" style="text-align:left;padding-left:10px;"><p>\u6CA1\u6709\u76F8\u5173\u6570\u636E</p></td>\n              </tr>\n            </tbody>\n          </table>\n        </div>\n        <asset_jconfirm v-show="jconfirm"></asset_jconfirm>\n        <clear_jconfirm v-show="clear_jconfirm" :product_name="product_name" :action_type="action_type" v-on:doHide="clear_jconfirm = false;" v-on:doClear="doClear()"></clear_jconfirm>\n        <asset-out-popup v-show="popup" :income_cash="product_info.income_cash" :product_name="product_name" :po_pup="popup" :product_id="product_id" :chgTypeSelected="chgTypeSelected" v-on:change_popup="popup = $event"></asset-out-popup>\n      </div>\n    ',
    data: function data() {
      return {
        clear_jconfirm: false,
        action_type: 1,
        chgTypeSelected: 1,
        popup: false,
        asset_show: false,
        change_id: '',
        change_cash_id: '',
        change_asset_id: '',
        change_start_time: '', //起始时间
        change_unlock_time: '', //解锁时间
        change_val: '', //定增数量
        change_price: '', //定增价格
        change_asset_market: '', //货币基金市值
        change_asset_profit: '', //货币基金浮盈率
        change_asset_volume: '', //货币基金份额
        change_cash_val: '', //场外现金
        change_cash_remark: '',
        trigale_set_table: true,
        trigale_currenty_table: true,
        trigale_income_table: true,
        trigale_asset_table: true,
        jconfirm: false
      };
    },
    methods: {
      language_show: function language_show() {
        $(this.$el).find('.str').show();
        if ($(this.$el).find('.str .msg').css('width').split('px')[0] > 246) {
          $(this.$el).find('.str .msg').addClass('hover-tip-width');
        } else {
          $(this.$el).find('.str .msg').removeClass('hover-tip-width');
        }
      },
      language_hide: function language_hide() {
        $(this.$el).find('.str').hide();
        $(this.$el).find('.str .msg').removeClass('hover-tip-width');
      },
      doClear: function doClear() {
        var _this = this;
        var url = '';
        if (1 == this.action_type) {
          url = '/bms-pub/product/otc/private_placement/clear';
        } else if (2 == this.action_type) {
          url = '/bms-pub/product/otc/monetary_fund/clear';
        } else if (3 == this.action_type) {
          url = '/bms-pub/product/otc/income_swap/clear';
        } else if (4 == this.action_type) {
          url = '/bms-pub/product/otc/cash/clear';
        }

        $.ajax({
          url: url,
          type: 'post',
          data: {
            group_id: this.product_id
          },
          success: function success(_ref2) {
            var code = _ref2.code,
                msg = _ref2.msg,
                data = _ref2.data;

            if (0 == code) {
              _this.clear_jconfirm = false;

              _this.$root.doRefresh();
            } else {
              $.omsAlert(msg);
            }
          },
          error: function error() {
            $.omsAlert('网络异常，请重试');
          }
        });
      },
      checkPositive: function checkPositive(num) {
        //比较数字大小
        return parseFloat(num) > 0;
      },
      checkNegative: function checkNegative(num) {
        //比较数字大小
        return parseFloat(num) < 0;
      },
      onlyParseIntNum: function onlyParseIntNum() {//只可输入整数
        // if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8) {
        //   event.returnValue=true;
        // } else {
        //   event.returnValue=false;
        // }
      },
      onlyParseFloatNum: function onlyParseFloatNum(str) {
        //可输入整数和小数点 ,直接通过input框中输入的数字的变化来进行小数点的数字判断
        //event.keyCode>=48 && event.keyCode<=57，代表主键盘0到9的数字
        //event.keyCode>=96 && event.keyCode<=105，代表小键盘0到9的数字
        //event.keyCode=8，代表BackSpace键
        //event.keyCode==110, event.keyCode==190，代表小键盘区和主键盘区的小数点
        var str = '' + str;
        if (event.keyCode >= 48 && event.keyCode <= 57 || event.keyCode >= 96 && event.keyCode <= 105 || event.keyCode == 8 || event.keyCode == 110 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {
          //只允许输入一个小数点
          if (str.indexOf('.') != -1 && event.keyCode == 110 || str.indexOf('.') != -1 && event.keyCode == 190) {
            event.preventDefault();
            return;
          }
          event.returnValue = true;
        } else {
          event.returnValue = false;
        }
      },
      changeModify: function changeModify(row) {
        //点击修改,传进一个数组，直接调用数组中的某些参数
        this.change_id = row.id;
        this.change_val = row.volume;
        this.change_price = row.stock_price;
        this.change_start_time = row.start_date;
        this.change_unlock_time = row.unlock_date;
      },
      trigaleSet: function trigaleSet() {
        //定增点击展开与收缩
        if (this.trigale_set_table == true) {
          this.trigale_set_table = false;
          $(".trigale_set").css('transform', 'rotate(180deg)');
        } else if (this.trigale_set_table == false) {
          this.trigale_set_table = true;
          $(".trigale_set").css('transform', 'rotate(360deg)');
        }
      },
      trigaleCurrenty: function trigaleCurrenty() {
        //货币 点击展开与收缩
        if (this.trigale_currenty_table == true) {
          this.trigale_currenty_table = false;
          $(".trigale_currenty_table").css('transform', 'rotate(180deg)');
        } else if (this.trigale_currenty_table == false) {
          this.trigale_currenty_table = true;
          $(".trigale_currenty_table").css('transform', 'rotate(360deg)');
        }
      },
      trigaleIncome: function trigaleIncome() {
        //收益互换点击  展开与收缩
        if (this.trigale_income_table == true) {
          this.trigale_income_table = false;
          $(".trigale_income_table").css('transform', 'rotate(180deg)');
        } else if (this.trigale_income_table == false) {
          this.trigale_income_table = true;
          $(".trigale_income_table").css('transform', 'rotate(360deg)');
        }
      },
      trigaleAsset: function trigaleAsset() {
        //场外现金 点击  展开与收缩
        if (this.trigale_asset_table == true) {
          this.trigale_asset_table = false;
          $(".trigale_asset_table").css('transform', 'rotate(180deg)');
        } else if (this.trigale_asset_table == false) {
          this.trigale_asset_table = true;
          $(".trigale_asset_table").css('transform', 'rotate(360deg)');
        }
      },
      set_by_markert: function set_by_markert() {
        //定增总市值
        var val = 0;
        this.product_info.private_placement.forEach(function (e) {
          val += parseFloat(e.market_value);
        });
        return val;
      },
      currency_markert: function currency_markert() {
        //货币基金总市值
        var val = 0;
        this.product_info.monetary_fund.forEach(function (e) {
          val += parseFloat(e.market_value);
        });
        return val;
      },
      income_swap_markert: function income_swap_markert() {
        //收益互换总市值
        var val = 0;
        this.product_info.income_swap.forEach(function (e) {
          if (e.exchange_rate != 0) {
            var market_value = e.exchange_rate * e.market_value;
            val += parseFloat(market_value);
          } else {
            val += parseFloat(e.market_value);
          }
        });
        return val;
      },
      doSetByDelete: function doSetByDelete(id) {
        //定增删除
        var _this = this;
        _this.jconfirm = true;
        $('.custom-for-delete').off().on('click', '.closeIcon', function () {
          _this.clear_jconfirm = false;
          _this.jconfirm = false;
        }).on('click', '.vue-confirm__btns--submit', function () {
          _this.jconfirm = false;
          $.ajax({
            url: '/bms-pub/product/otc/private_placement/delete',
            type: 'POST',
            data: {
              id: id
            },
            success: function success(res) {
              if (0 == res.code) {
                $.omsAlert('删除成功');
                asset_out.pageProductInfo(asset_out.product_id);
              } else {
                $.omsAlert(res.msg);
              }
            },
            error: function error() {
              $.omsAlert('删除失败');
            }
          });
        });
      },
      doMonetaryDelete: function doMonetaryDelete(id) {
        //货币删除
        var _this = this;
        _this.jconfirm = true;
        $('.custom-for-delete').off().on('click', '.closeIcon', function () {
          _this.clear_jconfirm = false;
          _this.jconfirm = false;
        }).on('click', '.vue-confirm__btns--submit', function () {
          _this.jconfirm = false;
          $.ajax({
            url: '/bms-pub/product/otc/monetary_fund/delete',
            type: 'POST',
            data: {
              id: id
            },
            success: function success(res) {
              if (0 == res.code) {
                $.omsAlert('删除成功');
                asset_out.pageProductInfo(asset_out.product_id);
              } else {
                $.omsAlert(res.msg);
              }
            },
            error: function error() {
              $.omsAlert('删除失败');
            }
          });
        });
      },
      doCashDelete: function doCashDelete(id) {
        //现金删除
        var _this = this;
        _this.jconfirm = true;
        $('.custom-for-delete').off().on('click', '.closeIcon', function () {
          _this.clear_jconfirm = false;
          _this.jconfirm = false;
        }).on('click', '.vue-confirm__btns--submit', function () {
          _this.jconfirm = false;
          $.ajax({
            url: '/bms-pub/product/otc/cash/delete',
            type: 'POST',
            data: {
              id: id
            },
            success: function success(res) {
              if (0 == res.code) {
                $.omsAlert('删除成功');
                asset_out.pageProductInfo(asset_out.product_id);
              } else {
                $.omsAlert(res.msg);
              }
            },
            error: function error() {
              $.omsAlert('删除失败');
            }
          });
        });
      },
      changePreser: function changePreser(id) {
        //现金资产保存
        //金额
        var amount = this.change_cash_val;
        //备注
        var remark = this.change_cash_remark;
        var _this = this;
        $.ajax({
          url: '/bms-pub/product/otc/cash/modify',
          type: 'POST',
          data: {
            id: id,
            amount: amount,
            remark: remark
          },
          success: function success(res) {
            if (0 == res.code) {
              _this.change_cash_id = '';
              //重新获取当前选中基金的内容
              asset_out.pageProductInfo(asset_out.product_id);
              //刷新下拉列表
              // asset_out.pageProductList();
              $.omsAlert('修改成功');
            } else {
              $.omsAlert(res.msg);
            }
          },
          error: function error() {
            $.omsAlert('网络异常');
          }
        });
      },
      monetaryPreser: function monetaryPreser(id) {
        //货币基金资产保存
        //市值
        var market_value = this.change_asset_market;
        //浮盈率
        var profit_rate = this.change_asset_profit / 100;
        //份额
        var volume = this.change_asset_volume;
        var _this = this;
        $.ajax({
          url: '/bms-pub/product/otc/monetary_fund/modify',
          type: 'POST',
          data: {
            id: id,
            market_value: market_value,
            profit_rate: profit_rate,
            volume: volume
          },
          success: function success(res) {
            if (0 == res.code) {
              _this.change_asset_id = '';
              //重新获取当前选中基金的内容
              asset_out.pageProductInfo(asset_out.product_id);
              //刷新下拉列表
              // asset_out.pageProductList();
              $.omsAlert('修改成功');
            } else {
              $.omsAlert(res.msg);
            }
          },
          error: function error() {
            $.omsAlert('网络异常');
          }
        });
      },
      setByPreser: function setByPreser(id) {
        //定增保存
        //数量
        var volume_val = this.change_val;
        //定增价格
        var stock_price_val = this.change_price;
        //起始日期
        var startDate_time = this.change_start_time;
        //解锁日期
        var currentDate_time = this.change_unlock_time;
        if (startDate_time == '') {
          $.omsAlert('起始日期不能为空');
          return false;
        }
        if (currentDate_time == '') {
          $.omsAlert('解锁日期不能为空');
          return false;
        }
        //起始日期  和  解锁日期 进行比较
        if (startDate_time >= currentDate_time) {
          $.omsAlert('解锁日期必须大于起始日期');
          return false;
        }

        var _this = this;
        $.ajax({
          url: '/bms-pub/product/otc/private_placement/modify',
          type: 'POST',
          data: {
            id: id,
            volume: volume_val,
            stock_price: stock_price_val,
            start_date: startDate_time,
            unlock_date: currentDate_time
          },
          success: function success(res) {
            if (0 == res.code) {
              _this.change_id = '';
              //重新获取当前选中基金的内容
              asset_out.pageProductInfo(asset_out.product_id);
              //刷新下拉列表
              // asset_out.pageProductList();
              $.omsAlert('修改成功');
            } else {
              $.omsAlert(res.msg);
            }
          },
          error: function error() {
            $.omsAlert('网络异常');
          }
        });
      }
    }
  });

  //确认删除的弹窗
  Vue.component('asset_jconfirm', {
    props: [],
    template: '\n      <div class="jconfirm jconfirm-white custom-for-delete">\n        <div class="jconfirm-bg seen" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); opacity: 0.2;"></div>\n        <div class="jconfirm-scrollpane">\n          <div class="container">\n            <div class="row">\n              <div class="jconfirm-box-container custom-window-width">\n                <div class="jconfirm-box" role="dialog" aria-labelledby="jconfirm-box20474" tabindex="-1" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1.2); margin-top: 260px; transition-property: transform, opacity, box-shadow, margin;">\n                  <div class="closeIcon" style="display: block;">\xD7</div>\n                  <div class="title-c"><span class="icon-c">\u786E\u8BA4\u5220\u9664</span><span class="title" id="jconfirm-box20474">\u786E\u5B9A\u5220\u9664\u8BE5\u573A\u5916\u8D44\u4EA7\uFF1F</span></div>\n                  <div class="buttons">\n                    <button type="button" class="btn vue-confirm__btns--submit vue-confirm__btns--warn">\u786E\u5B9A</button>\n                  </div>\n                  <div class="jquery-clear">\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    '
  });

  //确认清空的弹窗
  // 从父组件获取到的props有：产品名称、场外资产类型
  // 上报给父组件的事件有：隐藏组件、确认清空
  Vue.component('clear_jconfirm', {
    props: ['product_name', 'action_type'],
    template: '\n      <div class="jconfirm jconfirm-white custom-for-delete">\n        <div class="jconfirm-bg seen" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); opacity: 0.2;"></div>\n        <div class="jconfirm-scrollpane">\n          <div class="container">\n            <div class="row">\n              <div class="jconfirm-box-container custom-window-width">\n                <div class="jconfirm-box" role="dialog" aria-labelledby="jconfirm-box20474" tabindex="-1" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1.2); margin-top: 260px; transition-property: transform, opacity, box-shadow, margin;">\n                  <div v-on:click="doHide" class="closeIcon" style="display: block;">\xD7</div>\n                  <div class="title-c">\n                    <span class="icon-c">\u786E\u8BA4\u6E05\u7A7A</span>\n                    <span class="title" id="jconfirm-box20474">\u786E\u8BA4\u6E05\u7A7A{{product_name}}\u7684\u6240\u6709{{getActionTypeName}}\u8D44\u4EA7\uFF1F</span>\n                  </div>\n                  <div class="buttons">\n                    <button v-on:click="doClear" type="button" class="btn vue-confirm__btns--warn">\u786E\u5B9A</button>\n                  </div>\n                  <div class="jquery-clear">\n                  </div>\n                </div>\n              </div>\n            </div>\n          </div>\n        </div>\n      </div>\n    ',
    data: function data() {
      return {
        options_type: [{ label: '定增', value: '1' }, { label: '场外货币基金', value: '2' }, { label: '收益互换', value: '3' }, { label: '现金', value: '4' }]
      };
    },
    computed: {
      getActionTypeName: function getActionTypeName() {
        var _this = this;
        var rtn = '';
        this.options_type.forEach(function (e) {
          if (e.value == _this.action_type) {
            rtn = e.label;
          }
        });

        return rtn;
      }
    },
    methods: {
      // 上报事件隐藏该组件
      doHide: function doHide() {
        this.$emit('doHide');
      },
      // 上报事件清空
      doClear: function doClear() {
        this.$emit('doClear');
      }
    }
  });

  //初始化vue
  var asset_out = new Vue({
    el: '#outside_asset',
    data: {
      //场外资产产品列表
      product_list: [],
      //当前选中的产品id
      product_id: '',
      // 当前选中的产品名称
      product_name: '',
      //选中产品的信息
      product_info: {}
    },
    methods: {
      doRefresh: function doRefresh() {
        this.pageProductInfo(this.product_id);
      },
      //下拉列表
      pageProductList: function pageProductList() {
        var _this = this;
        $.ajax({
          url: '/bms-pub/product/get_product_group?only_top=0',
          type: 'get',
          success: function success(res) {
            if (0 == res.code) {
              if (res.data != '') {
                res.data.lists.forEach(function (e) {
                  e.type = 'group';
                });
                _this.product_list = res.data.lists;
                if (res.data.lists.length > 0) {
                  _this.product_id = res.data.lists[0].id; //默认选中第一个账户
                  _this.product_name = res.data.lists[0].name;
                }
              }
            }
          },
          error: function error(res) {
            $.omsAlert(res.msg);
          }
        });
      },
      pageProductInfo: function pageProductInfo(id) {
        var _this = this;
        $.startLoading('正在查询');
        $.ajax({
          url: '/bms-pub/product/otc/list?group_id=' + id,
          type: 'GET',
          success: function success(res) {
            if (0 == res.code) {
              _this.product_info = res.data;
            }
            $.clearLoading();
          },
          error: function error(res) {
            $.omsAlert(res.msg);
            $.clearLoading();
          }
        });
      }
    },
    watch: {
      product_id: function product_id() {
        var _this = this;
        this.pageProductInfo(this.product_id);
        this.product_list.forEach(function (e) {
          if (e.id == _this.product_id) {
            _this.product_name = e.name;
          }
        });
      }
    }
  });
  asset_out.pageProductList();
}
//# sourceMappingURL=page.js.map
