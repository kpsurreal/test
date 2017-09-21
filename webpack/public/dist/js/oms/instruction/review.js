"use strict";

/**
 * Author: jiangjian; liuzeyafzy@gmail.com
 * 指令审核
 */

var tableData_wait = [{
  th: "stock.stock_code", //证劵代码
  show_type: 'checkbox',
  name: "证券代码",
  class_name: "vue_text_default",
  float: 'right'
}, {
  th: "stock.stock_name",
  show_type: "text",
  name: "证券名称",
  class_name: "vue_text_default",
  float: 'right'
}, {
  th: "stock.market_name",
  show_type: "text",
  name: "交易市场",
  class_name: "vue_text_default",
  float: 'right'
}, {
  th: "gathering.product_name_list",
  show_type: "text",
  name: "产品账户",
  class_name: "vue_number_default",
  float: 'right'
}, {
  th: "gathering.unit_name_list",
  show_type: "text",
  name: "单元名称",
  class_name: "vue_number_default",
  float: 'right'
}, {
  th: "instruction.invest_type",
  show_type: "text",
  name: "投资类型",
  class_name: "vue_number_default",
  float: 'right'
}, {
  th: "gathering.deal_direction_name",
  show_type: "text",
  name: "买卖标记",
  class_name: "vue_number_default",
  float: 'right'
}, {
  th: "gathering.price",
  show_type: "text",
  name: "价格",
  class_name: "vue_number_default",
  float: 'left'
}, {
  th: "gathering.ins_amount",
  show_type: "text",
  name: "指令数量",
  class_name: "vue_number_default",
  float: 'left'
}, {
  th: "gathering.ins_balance",
  show_type: "text",
  name: "金额",
  class_name: "vue_number_default",
  float: 'left'
}, {
  th: "instruction.entrust_flag",
  show_type: "text",
  name: "标识",
  class_name: "vue_input_default",
  float: 'right'
}, {
  th: "instruction.ins_id",
  show_type: "text",
  name: "原委托序号",
  class_name: "",
  float: 'left'
}, {
  th: "instruction.creator_name",
  show_type: "text",
  name: "创建人",
  class_name: "vue_input_default",
  float: 'right'
}, {
  th: "instruction.created_at",
  show_type: "text",
  name: "创建时间",
  class_name: "vue_input_default",
  float: 'right'
}, {
  th: "instruction.comment",
  show_type: "text",
  name: "备注",
  class_name: "overhide",
  float: 'right'
}, {
  th: "instruction.status_desc",
  show_type: "text",
  name: "审批状态",
  class_name: "vue_input_default",
  float: 'left'
}];

var tableData_result = [{
  th: "stock.stock_code", //证劵代码
  show_type: 'text',
  name: "证券代码",
  class_name: "vue_input_default",
  float: 'right'
}, {
  th: "stock.stock_name",
  show_type: "text",
  name: "证券名称",
  class_name: "vue_text_default",
  float: 'right'
}, {
  th: "gathering.product_name_list",
  show_type: "text",
  name: "产品账户",
  class_name: "vue_number_default",
  float: 'right'
}, {
  th: "gathering.unit_name_list",
  show_type: "text",
  name: "单元名称",
  class_name: "vue_number_default",
  float: 'right'
}, {
  th: "instruction.invest_type",
  show_type: "text",
  name: "投资类型",
  class_name: "vue_number_default",
  float: 'right'
}, {
  th: "gathering.deal_direction_name",
  show_type: "text",
  name: "买卖标记",
  class_name: "vue_number_default",
  float: 'right'
}, {
  th: "gathering.price",
  show_type: "text",
  name: "价格",
  class_name: "vue_number_default",
  float: 'left'
}, {
  th: "gathering.ins_amount",
  show_type: "text",
  name: "指令数量",
  class_name: "vue_number_default",
  float: 'left'
}, {
  th: "gathering.ins_balance",
  show_type: "text",
  name: "金额",
  class_name: "vue_number_default",
  float: 'left'
}, {
  th: "instruction.entrust_flag",
  show_type: "text",
  name: "标识",
  class_name: "vue_input_default",
  float: 'right'
}, {
  th: "instruction.ins_id",
  show_type: "text",
  name: "原委托序号",
  class_name: "vue_input_default",
  float: 'left'
}, {
  th: "instruction.creator_name",
  show_type: "text",
  name: "创建人",
  class_name: "vue_input_default",
  float: 'right'
}, {
  th: "instruction.created_at",
  show_type: "text",
  name: "创建时间",
  class_name: "vue_input_default",
  float: 'right'
}, {
  th: "instruction.review_username",
  show_type: "text",
  name: "审批人",
  class_name: "vue_input_default",
  float: 'left'
}, {
  th: "instruction.review_time",
  show_type: "text",
  name: "审批时间",
  class_name: "vue_input_default",
  float: 'left'
}, {
  th: "instruction.comment",
  show_type: "text",
  name: "备注",
  class_name: "overhide",
  float: 'right'
}, {
  th: "instruction.status_desc",
  show_type: "text",
  name: "审批状态",
  class_name: "vue_input_default",
  float: 'left'
}];

var review_vm = new Vue({
  el: '[review_top]',
  data: {
    'table_data': tableData_wait,
    'status': "wait",
    'list_data': [],
    'timer': '',
    'checkarr': [],
    'checkAll': false,
    'newdata': '',
    'loading': false
  },
  template: "\n    <div style=\"background: white; padding: 0 0 20px;flex:1\">\n      <div class=\"review_top\">\n        <h2>\u6307\u4EE4\u5BA1\u6279</h2>\n        <button class=\"pass\" @click=\"btn_pass\" v-show=\"status=='wait'\">\u901A\u8FC7</button>\n        <button class=\"refuse\" @click=\"btn_refuse\" v-show=\"status=='wait'\">\u62D2\u7EDD</button>\n        <div class=\"btn-box\">\n          <label><input name=\"approval\" type=\"radio\" value=\"\" checked @click=\"btn_click('wait')\"/>\u5F85\u5BA1\u6279\u6307\u4EE4 </label> \n          <label><input name=\"approval\" type=\"radio\" value=\"\" @click=\"btn_click('done')\" />\u5DF2\u5BA1\u6279\u6307\u4EE4 </label>\n          <a v-if=\"status=='done'\" style=\"height: 32px;display: inline-block;line-height: 32px;background-color: #e8e9ed;border-radius: 4px;\" class=\"custom-grey-btn custom-grey-btn__export\" :class=\"{'doBtnExport_bgd': true}\"  v-on:click=\"doExport()\">\n            <i class=\"oms-icon oms-icon-export\"></i>\u5BFC\u51FA\n          </a>\n          <a refresh-btn=\"\" @click=\"btn_refresh\" v-bind:class=\"{'loading': loading}\" class=\"refresh oms-btn gray refresh-btn loading-loading right\" href=\"javascript:;\"><i class=\"oms-icon refresh\"></i>\u5237\u65B0</a>\n        </div>\n      </div>\n      <div class=\"review_section\" >\n        <table class=\"newweb-common-grid\">\n          <tbody>\n            <tr>\n              <th v-for=\"(item,index) in table_data\" :style=\"{'text-align':item.float}\"\">\n                  <input type=\"checkbox\"  v-if=\"item.show_type=='checkbox'\" @change=\"check_all\" v-model=checkAll />\n                  <span>{{item.name}}</span>\n              </th>\n            </tr>\n            <tr v-for=\"(list_item,list_index) in list_data\">\n              <td v-for=\"(head_item,head_index) in table_data\" :style=\"{'text-align':head_item.float}\" :class=\"{'overhide':head_item.class_name == 'overhide'}\">\n                <input type=\"checkbox\" v-if=\"head_item.show_type=='checkbox'\" @change=\"check_one\" v-model=checkarr[list_index] />\n                <span v-if=\"head_item.class_name == 'overhide'\" :title=\"get_sec_with_th(list_item,head_item.th)\" v-bind:style=\"get_secStyle_with_th(list_item,head_item.th)\" v-html=\"get_sec_with_th(list_item,head_item.th)\"></span>\n                <span v-else v-bind:style=\"get_secStyle_with_th(list_item,head_item.th)\">{{ get_sec_with_th(list_item,head_item.th) }}</span>\n              </td>\n            </tr>\n          </tbody>\n        </table>\n      </div> \n    </div>\n  ",
  mounted: function mounted() {
    var self = this;
    this.review_ajax();
    this.checkarr = new Array(this.list_data.length);
    for (var i = 0; i < this.checkarr.length; i++) {
      this.checkarr[i] = false;
    };

    setInterval(function () {
      self.review_ajax();
    }, 1000 * 3);
  },

  watch: {
    status: function status(ele) {
      if (ele == "done") {
        this.table_data = tableData_result;
      }
      if (ele == "wait") {
        this.table_data = tableData_wait;
      }
    }
  },
  methods: {
    doExport: function doExport() {
      window.location.href = window.REQUEST_PREFIX + '/sync/pb_ins/export_reviewed' + '?org_id=' + window.LOGIN_INFO.org_id;

      // let _this = this;
      // $.ajax({
      //   url: window.REQUEST_PREFIX + '/sync/pb_ins/export_reviewed',
      //   data: {
      //     org_id: window.LOGIN_INFO.org_id
      //   },
      //   type: 'get',
      //   success: function({msg, code, data}){
      //     if (0 == code) {

      //     }else{
      //       $.omsAlert(msg);
      //     }
      //   },
      //   error: function(){
      //       $.omsAlert('网络异常');
      //   }
      // })
    },
    review_ajax: function review_ajax() {
      var self = this;
      if (!this.loading) {
        var url = (window.REQUEST_PREFIX || '') + '/sync/pb_ins/review_lists?status=' + this.status;
        self.loading = true;
        $.get(url, "").done(function (res) {
          if (res.code == 0) {
            if (!self.isObjectValueEqual(self.list_data, res.data.list)) {
              self.list_data = res.data.list;

              self.checkarr = new Array(self.list_data.length);
              for (var i = 0; i < self.checkarr.length; i++) {
                self.checkarr[i] = false;
              }
            }
          } else {
            $.omsAlert(res.msg);
          }
          self.loading = false;
        }).fail($.failNotice.bind(null, url)).always(function () {
          self.loading = false;
        });
      }
    },
    get_sec_with_th: function get_sec_with_th(list_item, th) {
      var route = th.split('.');
      var temp = list_item;
      route.forEach(function (ele) {
        temp = temp[ele];
      });
      if (th == "instruction.review_status") {
        if (temp == 0) {
          temp = "已撤销";
        }
        if (temp == 1) {
          temp = "审批通过";
        }
        if (temp == 2) {
          temp = "审批拒绝";
        }
        if (temp == 3) {
          temp = "待审批";
        }
      }

      return temp;
    },
    get_secStyle_with_th: function get_secStyle_with_th(list_item, th) {
      var route = th.split('.');
      var temp = list_item;
      route.forEach(function (ele) {
        temp = temp[ele];
      });

      if (th == "instruction.status_desc") {

        var result = list_item['instruction'].review_status;
        if (result == 0) {
          temp = "color: black;";
        }
        if (result == 1) {
          temp = "color: black;";
        }
        if (result == 2) {
          temp = "color: #F44336;";
        }
        if (result == 3) {
          temp = "color: #F44336;";
        }
      }
      return temp;
    },
    btn_click: function btn_click(status) {
      this.status = status;
      this.list_data = [];
      this.checkarr = new Array(this.list_data.length);
      for (var i = 0; i < this.checkarr.length; i++) {
        this.checkarr[i] = false;
      }
      this.review_ajax();
    },
    btn_refresh: function btn_refresh() {
      this.review_ajax();
    },
    btn_pass: function btn_pass() {
      var temp = [];
      var self = this;
      this.checkarr.forEach(function (ele, index) {
        if (ele) {
          temp.push(self.list_data[index].instruction.id);
        }
      });
      if (0 == temp.length) {
        $.omsAlert('请选择指令');
        return;
      }
      var result = temp.join(',');

      if (result) {
        var self = this;
        var url = (window.REQUEST_PREFIX || '') + '/sync/pb_ins/review';
        self.loading = true;
        $.post(url, {
          id: result,
          review_status: 1,
          refuse_reason: "",
          ins_amount: ''
        }).done(function (res) {
          if (res.code == 0) {
            $.omsAlert('指令审批成功');
          } else {
            $.omsAlert(res.msg);
          }
          self.loading = false;
          self.review_ajax();
        }).fail(function () {
          $.failNotice.bind(null, url).always(function () {
            $.omsAlert('指令审批失败');
            self.loading = false;
          });
        });
      }
    },
    btn_refuse: function btn_refuse() {
      var temp = [];
      var self = this;
      this.checkarr.forEach(function (ele, index) {
        if (ele) {
          temp.push(self.list_data[index].instruction.id);
        }
      });
      if (0 == temp.length) {
        $.omsAlert('请选择指令');
        return;
      }
      var result = temp.join(',');
      if (result) {
        var self = this;
        // clearTimeout(this.timer)
        var url = (window.REQUEST_PREFIX || '') + '/sync/pb_ins/review';
        self.loading = true;
        $.post(url, { id: result, review_status: 2, refuse_reason: "" }).done(function (res) {
          if (res.code == 0) {
            $.omsAlert('指令审批成功');
          } else {
            $.omsAlert(res.msg);
          }
          self.loading = false;
          self.review_ajax();
        }).fail(function () {
          $.failNotice.bind(null, url).always(function () {
            $.omsAlert('指令审批失败');
            self.loading = false;
          });
        });
      }
    },
    check_all: function check_all(event) {
      //全选按钮
      this.checkarr = new Array(this.list_data.length);
      for (var i = 0; i < this.checkarr.length; i++) {
        this.checkarr[i] = event.target.checked;
      }
    },
    check_one: function check_one() {
      //列表checkbox
      var bool = true;
      this.checkarr.forEach(function (ele) {
        if (ele == false) {
          bool = false;
        }
      });
      if (bool) {
        this.checkAll = true;
      } else {
        this.checkAll = false;
      }
    },
    isObjectValueEqual: function isObjectValueEqual(a, b) {
      return JSON.stringify(b) == JSON.stringify(a);
    }
  }
});
//# sourceMappingURL=review.js.map
