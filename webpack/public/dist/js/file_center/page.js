'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; };

function reportFileCenterFn() {

  //页面头部
  Vue.component('file-center-head', {
    props: ['product_list', 'batch_down_list', 'product_data'],
    template: '\n      <div class="file-center-head">\n        <h1 class="file-center-head__title">\u6587\u4EF6\u4E2D\u5FC3</h1>\n        <div class="file-center-head__report">\n          <vue-multiple_select :options="options" :flag_check_all="true" :checked_arr="select_id" :init_obj="init_obj" v-on:multiple_select="select_id = ($event)"></vue-multiple_select>\n        </div>\n        <div class="file-center-head__data">\n          <vue-zebra_date_picker :value="currentDate" v-on:select="currentDate = ($event)"  :min_date="\'2015-01-01\'" :max_date="currentDate"></vue-zebra_date_picker>\n        </div>\n\n        <div style="flex-grow: 1;"></div>\n\n        <button class="file-center-head__botchDown" @click="batch_down()">\u6279\u91CF\u4E0B\u8F7D</button>\n\n        <a v-on:click="refresh()" class="custom-grey-btn custom-grey-btn__refresh">\n          <i class="oms-icon refresh"></i>\u5237\u65B0\n        </a>\n      </div>\n    ',
    data: function data() {
      return {
        // options: '',
        select_id: '',
        currentDate: function () {
          return moment().format('YYYY-MM-DD');
        }(),
        init_obj: {
          allSelected: '全部报表',
          noMatchesFound: '未选择任何报表',
          placeholder: '请先选择报表'
        },
        batch_down_fn: false
      };
    },
    computed: {
      options: function options() {
        var report_file_center = [];
        //机构版专户版报表
        if (3 == window.LOGIN_INFO.org_info.theme) {
          report_file_center = [{
            value: '资产查询数据',
            label: '资产查询数据',
            num: '0'
          }, {
            value: '持仓查询数据',
            label: '持仓查询数据',
            num: '1'
          }, {
            value: '委托查询数据',
            label: '委托查询数据',
            num: '2'
          }, {
            value: '成交查询数据',
            label: '成交查询数据',
            num: '3'
          }, {
            value: '清算查询数据',
            label: '清算查询数据',
            num: '4'
          }];
        } else {
          report_file_center = [{
            value: '产品报表',
            label: '产品报表',
            num: '0'
          }, {
            value: '股票持仓报表',
            label: '股票持仓报表',
            num: '1'
          }, {
            value: '资产查询数据',
            label: '资产查询数据',
            num: '2'
          }, {
            value: '持仓查询数据',
            label: '持仓查询数据',
            num: '3'
          }, {
            value: '委托查询数据',
            label: '委托查询数据',
            num: '4'
          }, {
            value: '成交查询数据',
            label: '成交查询数据',
            num: '5'
          }];
        }
        return report_file_center;
      }
    },
    watch: {
      select_id: function select_id() {
        this.$emit('select_report_id', this.select_id);
      },
      currentDate: function currentDate() {
        this.$emit('current_date_change', this.currentDate);
      },
      batch_down_fn: function batch_down_fn() {
        this.$emit('batch_down_change_click', this.batch_down_fn);
      }
    },
    methods: {
      refresh: function refresh() {
        //刷新页面,方便组件重复利用
        if ("[object Function]" == Object.prototype.toString.call(this.$root.doRefresh)) {
          this.$root.doRefresh(true);
        }
      },
      batch_down: function batch_down() {
        var _this2 = this;

        var _this = this;
        this.batch_down_fn = true;
        // 如果没有选中的报表id,禁止点击
        if (undefined == this.batch_down_list || '' == this.batch_down_list) {
          $.omsAlert('请先选择报表');
          return false;
        }

        var down_url_arr = [];
        this.batch_down_list.forEach(function (e) {
          _this.product_list.forEach(function (i) {
            if (e == i.id) {
              var obj = '';
              obj = i.down_url.split('storage/')[1];
              down_url_arr.push(decodeURI(obj));
            }
          });
        });

        $.ajax({
          url: '/utility/downloadzip',
          type: 'GET',
          data: {
            user_id: window.LOGIN_INFO.user_id,
            file_name: down_url_arr.join(','),
            date: this.product_data.split('-').join('')
          },
          success: function success(_ref) {
            var code = _ref.code,
                msg = _ref.msg,
                data = _ref.data;

            window.location.href = '/utility/downloadzip?user_id=' + window.LOGIN_INFO.user_id + '&file_name=' + down_url_arr.join(',') + '&date=' + _this2.product_data.split('-').join('');
            return false;
          },
          error: function error() {
            $.omsAlert('网络异常，请尝试');
          }
        });
      }
    }
  });
  //input 点击事件，方便传值全选
  Vue.component('report-input-checkout', {
    props: ['reportItem', 'reportAllSelected', 'change_selected_id'],
    template: '\n      <div>\n        <input type="checkbox" v-model="change_model" :disabled="disabledFn(reportItem)" @click="change_selected_model()"/>\n        {{reportItem.category}}\n      </div>\n    ',
    data: function data() {
      return {
        change_model: false, //单个报表选中判断
        change_model_id: this.reportItem.id //当前报表id
      };
    },
    watch: {
      change_model: function change_model() {
        //通过是否勾选来得到选中的报表id
        var _this = this;
        if (false == this.change_model) {
          this.change_selected_id.forEach(function (e, index) {
            if (_this.reportItem.id == e) {
              _this.change_selected_id.splice(index, 1);
            }
          });
        } else {
          this.change_selected_id.push(this.reportItem.id);
        }
        this.$emit('change_model_report', this.change_model);
      },
      change_model_id: function change_model_id() {
        this.$emit('change_model_report_id', this.change_model_id);
      },
      reportAllSelected: function reportAllSelected() {
        //通过是否勾选来判断是否全部选中报表
        if (1 != this.reportItem.status) {
          return false;
        }
        this.change_model = this.reportAllSelected;
      }
    },
    methods: {
      change_selected_model: function change_selected_model() {
        if (false == this.change_model) {
          return this.change_model = false;
        }
        return this.change_model = true;
      },
      disabledFn: function disabledFn(reportItem) {
        if (1 != reportItem.status) {
          return 'disabled';
        }
      }
    }
  });

  Vue.component('file-center-content', {
    props: ['product_list', 'product_data'],
    template: '\n      <table class="file-center-content">\n        <tr>\n          <th><input type="checkbox" v-model="reportAllSelected"/>\u7C7B\u522B</th>\n          <th>\u62A5\u8868\u540D</th>\n          <th>\u72B6\u6001</th>\n          <th>\u751F\u6210\u65F6\u95F4</th>\n          <th></th>\n          <th></th>\n          <th></th>\n        </tr>\n        <tr v-for="reportItem in product_list">\n          <td>\n            <report-input-checkout :change_selected_id="change_selected_id" :reportAllSelected="reportAllSelected" :reportItem="reportItem"></report-input-checkout>\n          </td>\n          <td>{{reportItem.report_name}}</td>\n          <td v-text="reportStatus(reportItem)"></td>\n          <td>{{reportItem.down_time}}</td>\n          <td><a :id="\'report_id\'+reportItem.id" :class="{click_change: 1==reportItem.status,no_click_change:1!=reportItem.status}" @click="reportDoenLoad(reportItem)">\u4E0B\u8F7D</a></td>\n          <td><a class="file-center-content__reGenerate" :class="{click_change: 1!=reportItem.status,no_click_change:1==reportItem.status || 0 == reportItem.status}" @click="regenerate(reportItem)">\u91CD\u65B0\u751F\u6210</a></td>\n          <td><a class="file-center-content__delete" @click="deleteReport(reportItem)">\u5220\u9664</a></td>\n        </tr>\n        <tr v-if="0 == product_list.length">\n          <td colspan="7">\u8BE5\u65F6\u6BB5\u6682\u65E0\u5339\u914D\u8BB0\u5F55</td>\n        </tr>\n      </table>\n    ',
    data: function data() {
      return {
        reportAllSelected: false, //全选
        change_selected_id: []
      };
    },
    watch: {
      change_selected_id: function change_selected_id() {
        this.$emit('batch_down_report_id', this.change_selected_id);
      }
    },
    methods: {
      reportStatus: function reportStatus(itemId) {
        if (0 == itemId.status) {
          return '生成中';
        } else if (1 == itemId.status) {
          return '已生成';
        } else if (2 == itemId.status) {
          return '已失败';
        }
      },
      deleteReport: function deleteReport(item) {
        //删除报表文件
        var _this = this;
        $.confirm({
          title: '退出确认',
          content: '\n            <div class="vue-confirm">\n              <div style="font-size: 14px; text-align: center; color: #000000; padding: 60px 0;">\u786E\u8BA4\u5220\u9664\u8BE5\u6587\u4EF6\uFF1F</div>\n            </div>\n          ',
          closeIcon: true,
          columnClass: 'custom-window-width',
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--cancel',
          confirm: function confirm() {
            $.startLoading();
            $.ajax({
              url: '/bms-pub/report/file_delete',
              type: 'POST',
              data: {
                id: item.id
              },
              success: function success(_ref2) {
                var code = _ref2.code,
                    msg = _ref2.msg,
                    data = _ref2.data;

                if (0 == code) {
                  //刷新页面,方便组件重复利用
                  if ("[object Function]" == Object.prototype.toString.call(_this.$root.doRefresh)) {
                    _this.$root.doRefresh(true);
                  }
                  $.clearLoading();
                  $.omsAlert('删除成功');
                }
              },
              error: function error() {
                $.omsAlert('网络异常');
              }
            });
          },
          cancelButton: false
        });
      },
      reportDoenLoad: function reportDoenLoad(reportItem) {
        //下载
        var _this = this;
        if (1 != reportItem.status) {
          //如果是生成不成功的报表，下载不可点击
          return false;
        }
        window.location.href = reportItem.down_url + '?n=' + reportItem.report_name;
      },
      regenerate: function regenerate(reportItem) {
        var _this3 = this;

        if (1 == reportItem.status || 0 == reportItem.status) {
          //如果是报表生成成功的时候，重新生成不可点
          return false;
        }
        //由于各种类型的报表的参数结构不一致，与后台确认，只能根据数据的类型来得到数据
        var data = [];
        $.each(reportItem.request_url.data, function (key, val) {
          var str = '';
          if ('string' == typeof val) {
            str = key + '=' + val;
            data.push(str);
          } else if ('object' == (typeof val === 'undefined' ? 'undefined' : _typeof(val))) {
            $.each(val, function (key1, val1) {
              if ('string' == typeof val1) {
                str = key1 + '=' + val1;
                data.push(str);
              }
            });
          }
        });
        $.ajax({
          url: reportItem.request_url.url + '?' + data.join('&'),
          type: 'GET',
          data: {
            file_id: reportItem.id
          },
          success: function success(_ref3) {
            var code = _ref3.code,
                msg = _ref3.msg,
                data = _ref3.data;

            if (0 == code) {
              $.omsAlert('重新生成成功');
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this3.$root.doRefresh)) {
                _this3.$root.doRefresh(true);
              }
            } else {
              $.omsAlert(msg);
            }
          },
          error: function error() {
            $.omsAlert('网络异常，请重试');
          }
        });
      }
    }
  });

  var report_form = new Vue({
    el: '#file_center',
    data: {
      // 产品组列表数据
      product_list: [],
      //选中的报表类型
      chgSelected: '',
      batch_down_list: [],
      //批量下载
      batchFn: false,
      //当前日期
      product_data: function () {
        return moment().format('YYYY-MM-DD');
      }()
    },
    methods: {
      //下拉列表中产品的数据
      getProductList: function getProductList(current_data, reportType) {
        var _this = this;
        var date = current_data.split('-').join('');
        $.startLoading('正在查询');
        $.ajax({
          url: '/bms-pub/report/file_list?date=' + parseFloat(date) + '&category=' + reportType,
          type: 'GET',
          success: function success(_ref4) {
            var code = _ref4.code,
                msg = _ref4.msg,
                data = _ref4.data;

            if (0 == code) {
              _this.product_list = data;
            } else {
              $.omsAlert(msg);
            }
            $.clearLoading();
          },
          error: function error() {
            $.omsAlert('网络异常');
            $.clearLoading();
          }
        });
      },
      doRefresh: function doRefresh() {
        //刷新
        this.getProductList(this.product_data, this.chgSelected);
      }
    },
    watch: {
      chgSelected: function chgSelected() {
        this.getProductList(this.product_data, this.chgSelected);
      },
      product_data: function product_data() {
        this.getProductList(this.product_data, this.chgSelected);
      }
    }
  });
}
//# sourceMappingURL=page.js.map
