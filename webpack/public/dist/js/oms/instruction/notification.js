'use strict';

var _slicedToArray = function () { function sliceIterator(arr, i) { var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"]) _i["return"](); } finally { if (_d) throw _e; } } return _arr; } return function (arr, i) { if (Array.isArray(arr)) { return arr; } else if (Symbol.iterator in Object(arr)) { return sliceIterator(arr, i); } else { throw new TypeError("Invalid attempt to destructure non-iterable instance"); } }; }();

/*
指令通知页面3.9.0
*/

//
var notificationSort = {
  order: '',
  order_by: '',
  display_rules: [{
    id: 'operation', // 变量id
    label: '指令操作', // 变量显示名称
    format: '', // 格式化处理函数，不能提前进行处理，因为数据还要用来排序什么的。此处的处理理解为只为显示，脱离于逻辑 （函数定义于vue中）
    class: '', // 样式
    style: 'width:20%;text-align:left;',
    sub_style: 'padding-left:10px;'
  }, {
    id: 'number',
    label: '指令编号',
    format: '',
    class: '',
    style: 'width:5%;text-align:left;',
    sub_style: 'padding-left:10px;'
  }, {
    id: 'ins_status',
    label: '指令状态',
    format: '',
    class: '',
    style: 'width:6%;text-align:left;',
    sub_style: 'padding-left:10px;'
  }, {
    id: 'investment_target',
    label: '证券',
    format: '',
    class: '',
    style: 'width:10%;text-align:left;',
    sub_style: 'padding-left:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:140px;display:inline-block;'
  }, {
    id: 'product_position_list',
    label: '产品账户',
    format: '',
    class: '',
    style: 'width:18%;text-align:left;',
    sub_style: 'padding-left:10px;cursor:pointer;height:36px;'
  }, {
    id: 'volume',
    label: '指令数量',
    format: '',
    class: '',
    style: 'width:10%;text-align:right;',
    sub_style: 'padding-right:60px;'
  }, {
    id: 'direction',
    label: '买卖方向',
    format: '',
    class: '',
    style: 'width:6%;text-align:left;',
    sub_style: 'padding-left:10px;'
  }, {
    id: 'price',
    label: '指令价格',
    format: '',
    class: '',
    style: 'width:5%;text-align:right;',
    sub_style: 'padding-right:10px;'
  }, {
    id: 'fund_manager_memo',
    label: '备注',
    format: '',
    class: '',
    style: 'width:5%;text-align:left;',
    sub_style: 'padding-left:24px;width:140px;display:inline-block;line-height:18px;'
  }, {
    id: 'created_at',
    label: '指令下达时间',
    format: '',
    class: '',
    style: 'width:15%;text-align:right;',
    sub_style: 'padding-right:10px;'
  }]
  //头部
};Vue.component('vue-notification-header', {
  props: [],
  template: '\n    <div class="notification-header">\n      <h2 class="notification-header__name">\u6307\u4EE4\u901A\u77E5</h2>\n      <div style="flex-grow: 1"></div>\n      <a v-on:click="refresh()" class="custom-grey-btn custom-grey-btn__refresh">\n        <i class="oms-icon refresh"></i>\u5237\u65B0\n      </a>\n    </div>\n  ',
  methods: {
    refresh: function refresh() {
      var _this = this;
      //刷新页面,方便组件重复利用
      if ("[object Function]" == Object.prototype.toString.call(_this.$root.doRefresh)) {
        _this.$root.doRefresh(true);
      }
    }
  }
});

Vue.component('vue-product-sub', {
  props: ['item', 'notification_display', 'product_index', 'item_drop'],
  template: '\n    <div class="instruction-notifition__content">\n      <ul class="instruction-notifition__content__account">\n        <li v-bind:class="rule.class" v-bind:style="rule.style" v-for="rule in notification_display">\n          <form v-if="\'operation\' == rule.id" v-bind:style="rule.sub_style">\n            <input type="radio" name="change" :checked="2 == item.status" :class="\'product_\'+item.id" @click="change_status(item, \'1\')"/>\u5DF2\u6536\u5230\n            <input type="radio" name="change" style="margin-left:20px;" :checked="3 == item.status" :class="\'product_\'+item.id" @click="change_status(item, \'2\')"/>\u6267\u884C\u4E2D\n            <input type="radio" name="change" style="margin-left:20px;" :checked="4 == item.status" :class="\'product_\'+item.id" @click="change_status(item, \'3\')"/>\u5DF2\u5B8C\u6210\n          </form>\n          <div v-if="\'product_position_list\' == rule.id" @click="product_change()" v-bind:style="rule.sub_style">\n            <div class="display_hide_icon" :class="{display_show_icon: true == display_change}" style="vertical-align:top;margin-top:15px;"></div>\n            <div style="display:inline-block;width:200px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;">{{item.product_position_list}}</div>\n          </div>\n          <span v-bind:style="rule.sub_style" v-if="\'direction\' == rule.id" :class="{red: \'\u4E70\u5165\' == item.direction || \'\u4E70\u5165\u5F00\u4ED3\' == item.direction || \'\u5356\u51FA\u5E73\u4ED3\' == item.direction, blue: \'\u5356\u51FA\' == item.direction || \'\u5356\u51FA\u5F00\u4ED3\' == item.direction || \'\u4E70\u5165\u5E73\u4ED3\' == item.direction}">{{item.direction}}</span>\n          <span v-bind:style="rule.sub_style" v-if="\'ins_status\' == rule.id" :class="{status_submit: 1 == item.status, status_receive: 2 == item.status, status_execution: 3 == item.status, status_complete: 4 == item.status, status_complete: 5 == item.status, status_complete: 6 == item.status}">{{item.ins_status}}</span>\n          <span v-bind:style="rule.sub_style" v-if="\'investment_target\' == rule.id" :title="item.investment_target">{{item.investment_target}}</span>\n          <span v-bind:style="item.isNumBold ? rule.sub_style+\'fontWeight:bold;\' : rule.sub_style" v-if="\'price\' == rule.id" >{{item.price}}</span>\n          <span v-bind:style="rule.sub_style" v-if="\'fund_manager_memo\' == rule.id" :title="item.fund_manager_memo">{{item.fund_manager_memo}}</span>\n          <span v-bind:style="rule.sub_style" v-if="\'fund_manager_memo\' != rule.id &&\'price\' != rule.id && \'direction\' != rule.id && \'investment_target\' != rule.id && \'operation\' != rule.id && \'product_position_list\' != rule.id && \'ins_status\' != rule.id">{{displayValue(item, rule)}}</span>\n        </li>\n      </ul>\n      <ul class="instruction-notifition__content__sub" v-for="product_item in item.product_list" v-show="display_change">\n        <li style="width:20%;text-align:left;padding-left:10px;"></li>\n        <li style="width:5%;text-align:left;padding-left:10px;"></li>\n        <li style="width:6%;text-align:left;padding-left:10px;"></li>\n        <li style="width:10%;text-align:left;padding-left:10px;"></li>\n        <li style="width:18%;text-align:left;padding-left:10px;">{{product_item.product_name}}</li>\n        <li style="width:10%;text-align:right;padding-right:60px;" v-text="product_volume(product_item)"></li>\n        <li style="width:6%;text-align:left;padding-left:10px;" :class="{red: \'\u4E70\u5165\' == item.direction || \'\u4E70\u5165\u5F00\u4ED3\' == item.direction || \'\u5356\u51FA\u5E73\u4ED3\' == item.direction, blue: \'\u5356\u51FA\' == item.direction || \'\u5356\u51FA\u5F00\u4ED3\' == item.direction || \'\u4E70\u5165\u5E73\u4ED3\' == item.direction}">{{item.direction}}</li>\n        <li style="width:5%;text-align:right;padding-right:10px;">{{item.price}}</li>\n        <li style="width:5%;text-align:right;padding-right:10px;"></li>\n        <li style="width:15%;text-align:right;padding-right:10px;"></li>\n      </ul>\n    </div>\n  ',
  data: function data() {
    return {
      display_change: false, //显示产品账户
      change_num: -1
    };
  },
  watch: {
    change_num: function change_num() {
      this.display_change = false;
    },
    // item或者item_drop被修改时，都需要重新判断是否显示详细
    item: function item() {
      if (this.item_drop.indexOf(this.item.id) != -1) {
        this.display_change = true;
      } else {
        this.display_change = false;
      }
    },
    // item或者item_drop被修改时，都需要重新判断是否显示详细
    item_drop: function item_drop() {
      if (this.item_drop.indexOf(this.item.id) != -1) {
        this.display_change = true;
      } else {
        this.display_change = false;
      }
    }
  },
  methods: {
    product_volume: function product_volume(product) {
      if ('全部清仓' == product.volume) {
        return product.volume;
      } else {
        return this.numeralNumber(product.volume, 0);
      }
    },
    change_status: function change_status(item, status) {
      //修改指令
      var _this = this;
      var color_class = '';

      if ('买入' == item.direction || '买入开仓' == item.direction || '卖出平仓' == item.direction) {
        color_class = 'red';
      } else {
        color_class = 'blue';
      }
      if (2 == status) {
        var html = '';
        var all_account = '\n          <ul class="product-confirm__head" style="background-color:#BEBEBE;">\n            <li>\n              <div>                \n                <p style="display:inline-block;width:200px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;">' + item.product_position_list + '</p>\n              </div>\n            </li>\n            <li>' + item.investment_target + '</li>\n            <li class="' + color_class + '">' + item.direction + '</li>\n            <li style="font-weight: 600;">' + item.price + '</li>\n            <li>' + item.volume + '</li>\n          </ul>\n        ';
        var account_single = '';
        item.product_list.forEach(function (e) {
          var user_id = window.LOGIN_INFO.user_id;
          var id = item.id;
          var product_id = e.product_id;
          common_storage.getItem('notification_userid' + user_id + '_id' + id + '_productid' + product_id, function (rtn) {
            var customCls = 'normal_color';
            var pro_volume = 0;
            if (0 == rtn.code) {
              if (true == rtn.data) {
                customCls = 'start_color';
              }
            } else {
              ;
            }
            if ('全部清仓' == e.volume) {
              pro_volume = e.volume;
            } else {
              pro_volume = _this.numeralNumber(e.volume, 0);
            }
            account_single += '\n            <ul class="product-confirm__head">\n              <li><i class="single-color ' + customCls + '" data-id="' + item.id + '" data-product-id="' + e.product_id + '"></i>' + e.product_name + '</li>\n              <li>' + item.investment_target + '</li>\n              <li class="' + color_class + '">' + item.direction + '</li>\n              <li>' + item.price + '</li>\n              <li>' + pro_volume + '</li>\n            </ul>\n            ';
          });
        });
        // html = account_single + all_account;
        html = account_single;

        $.confirm({
          title: '执行中确认',
          content: '\n            <div class="product-confirm">\n              <ul class="product-confirm__head">\n                <li>\u4EA7\u54C1\u8D26\u6237</li>\n                <li>\u8BC1\u5238</li>\n                <li>\u4E70\u5356\u65B9\u5411</li>\n                <li>\u6307\u4EE4\u4EF7\u683C</li>\n                <li>\u6307\u4EE4\u6570\u91CF</li>\n              </ul>\n              <div class="product-confirm__content">\n                ' + html + '\n              </div>\n              <div>\n                ' + all_account + '\n              </div>\n            </div>\n          ',
          closeIcon: true,
          columnClass: 'custom-window-width',
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--cancel',
          confirm: function confirm() {
            $.ajax({
              url: '/omsv2/sync/instruction/notification_modify_status',
              type: 'POST',
              data: {
                id: item.id,
                action: status
              },
              success: function success(_ref) {
                var code = _ref.code,
                    msg = _ref.msg,
                    data = _ref.data;

                if (0 == code) {
                  //刷新页面,方便组件重复利用
                  if ("[object Function]" == Object.prototype.toString.call(_this.$root.doRefresh)) {
                    _this.$root.doRefresh(true);
                  }
                } else {
                  $.omsAlert('指令状态无法修改！');
                }
              },
              error: function error() {
                $.omsAlert('网络异常，请重试');
              }
            });
          },
          cancelButton: '取消'
        });
        $(".product-confirm .product-confirm__head:eq(0)").width($(".product-confirm__content .product-confirm__head:eq(0)").width());

        //产品标记的切换
        $('.product-confirm').off().on('click', '.single-color', function () {
          var user_id = window.LOGIN_INFO.user_id;
          var id = $(this).attr('data-id');
          var product_id = $(this).attr('data-product-id');

          if ($(this).hasClass('normal_color')) {
            $(this).removeClass('normal_color').addClass('start_color');
            common_storage.setItem('notification_userid' + user_id + '_id' + id + '_productid' + product_id, true);
          } else {
            $(this).removeClass('start_color').addClass('normal_color');
            common_storage.setItem('notification_userid' + user_id + '_id' + id + '_productid' + product_id, false);
          }
        });
      } else {
        $.ajax({
          url: '/omsv2/sync/instruction/notification_modify_status',
          type: 'POST',
          data: {
            id: item.id,
            action: status
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
            } else {
              $.omsAlert('指令状态无法修改！');
            }
          },
          error: function error() {
            $.omsAlert('网络异常，请重试');
          }
        });
      }
    },
    product_change: function product_change() {
      //产品账户的显示
      // 用户点击这一行时，this.display_change不应该被修改。this.display_change必须基于item和item_drop的值来变化的。也就是说，其它可以考虑把它放进computed
      // this.display_change = !this.display_change;
      this.$emit('displayType', [this.item.id, !this.display_change]);
    },
    displayValue: function displayValue(sub_value, rule) {
      //数据判断显示
      var value = sub_value[rule.id];
      if (rule.format != '' && rule.format instanceof Array && this[rule.format[0]] instanceof Function) {
        var args = [value].concat(rule.format.slice(1));
        value = this[rule.format[0]].apply(this, args);
      }
      if (rule.unit) {
        return value + rule.unit;
      } else {
        return value;
      }
    },
    numeralNumber: function numeralNumber(arg, num) {
      if ('--' == arg || '' === arg || undefined == arg) {
        return '--';
      }
      if (undefined != num) {
        var str = '0.';
        for (var i = num - 1; i >= 0; i--) {
          str += '0';
        }
        return numeral(arg).format('0,' + str);
      }
      return numeral(arg).format('0,0.00');
    }
  }
});

//内容
Vue.component('vue-notification-content', {
  props: ['instruction_data'],
  template: '\n  <div class="notification-content-menu">\n    <ul class="notification-content-menu__title">\n      <li v-on:click="goto(user_name,index)" :class="{active: index == idx}" v-for="(user_name,idx) in creatorList">\n        {{user_name.creator_name}}<span class="flash" v-if="user_name.submit_num > 0" v-html="user_name.submit_num"></span>\n      </li>\n      <div style="flex-grow: 1"></div>\n    </ul>\n    <div class="instruction-notifition">\n      <div class="instruction-notifition__head">\n        <ul class="instruction-notifition__head__name">\n          <li v-bind:class="rule.class" v-for="rule in notificationData.display_rules" v-bind:style="rule.style">\n            <span v-bind:style="rule.sub_style">{{rule.label}}</span>\n          </li>\n        </ul>\n      </div>\n      <vue-product-sub v-for="(product_item, indexnum) in noticeData" :key="product_item.id" :product_index="index" :item="product_item" :item_drop="itemDrop" :notification_display="notificationData.display_rules" v-on:displayType="changeItemShow($event)"></vue-product-sub>\n    </div>\n  </div>\n  ',
  data: function data() {
    return {
      active: '',
      notificationData: notificationSort, //table表头
      //user_data: '', //基金经理下的数据
      index: 0, //判断显示第几个基金经理下的产品,
      itemDrop: []
    };
  },
  watch: {
    index: function index() {}
  },
  computed: {
    user_data: function user_data() {
      // return this.user_data = this.instruction_data;
      return this.instruction_data;
    },
    creatorList: function creatorList() {
      var rtn = [];
      var _this = this;
      this.instruction_data.list && this.instruction_data.list.forEach(function (e, index) {
        var obj = {};
        var num = 0;
        obj.creator_name = e.creator_name; //基金经理名字
        e.list.forEach(function (i) {
          if (1 == i.ins_status) {
            num += 1;
          }
        });
        obj.submit_num = num;
        obj.creator_id = e.creator_id;
        rtn.push(obj);
      });

      rtn.sort(function (a, b) {
        //按照基金经理id的大小进行排序
        return a.creator_id - b.creator_id;
      });

      return rtn;
    },
    noticeData: function noticeData() {
      var rtn = [];
      var _this = this;

      if ('' != this.user_data && '' != this.user_data.list) {

        var lists = this.user_data.list.sort(function (a, b) {
          //按照基金经理id的大小进行排序
          return a.creator_id - b.creator_id;
        });

        lists[this.index].list && lists[this.index].list.forEach(function (e) {
          var obj = {};
          var volume = 0;
          var product_list = [];
          var isEmptytype = false;

          if (1 == e.ins_status) {
            obj.ins_status = '已提交'; //指令状态
          } else if (2 == e.ins_status) {
            obj.ins_status = '已收到'; //指令状态
          } else if (3 == e.ins_status) {
            obj.ins_status = '执行中'; //指令状态
          } else if (4 == e.ins_status) {
            obj.ins_status = '已完成'; //指令状态
          } else if (5 == e.ins_status) {
            obj.ins_status = '部分撤销'; //指令状态
          } else if (6 == e.ins_status) {
            obj.ins_status = '已撤销'; //指令状态
          }

          obj.status = e.ins_status; //获取指令状态，修改指令状态的颜色
          obj.investment_target = e.investment_target; //投资标的
          e.product_position_list && e.product_position_list.forEach(function (i) {
            product_list.push(i.product_name);
          });
          obj.id = e.id;
          obj.product_position_list = product_list.join(','); //产品账户
          obj.product_list = e.product_position_list;
          // 1:买入 2:卖出 3:买入开仓 4:卖出开仓 5:买入平仓 6卖出平仓
          obj.direction = e.direction; //买卖方向
          if (1 == e.direction) {
            obj.direction = '买入';
          } else if (2 == e.direction) {
            obj.direction = '卖出';
          } else if (3 == e.direction) {
            obj.direction = '买入开仓';
          } else if (4 == e.direction) {
            obj.direction = '卖出开仓';
          } else if (5 == e.direction) {
            obj.direction = '买入平仓';
          } else if (6 == e.direction) {
            obj.direction = '卖出平仓';
          }
          obj.price = _this.numeralNumber(e.price, 2); //指令价格
          obj.fund_manager_memo = e.fund_manager_memo;
          obj.isNumBold = e.price > 0;
          obj.created_at = e.created_at; //指令下达时间
          e.product_position_list && e.product_position_list.forEach(function (i) {
            if ('全部清仓' == i.volume) {
              isEmptytype = true;
            }
            volume += parseFloat(i.volume);
          });
          obj.volume = isEmptytype ? '全部清仓' : _this.numeralNumber(volume, 0);
          obj.number = _this.paddedNumber(e.number, 3);
          rtn.push(obj);
        });
      }
      return rtn;
    }
  },
  methods: {
    numeralNumber: function numeralNumber(arg, num) {
      if ('--' == arg || '' === arg || undefined == arg) {
        return '--';
      }
      if (0 == arg) {
        return '非限价';
      }
      if (undefined != num) {
        var str = '0.';
        for (var i = num - 1; i >= 0; i--) {
          str += '0';
        }
        return numeral(arg).format('0,' + str);
      }
      return numeral(arg).format('0,0.00');
    },
    paddedNumber: function paddedNumber(num) {
      var figures = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 3;

      var strNum = num.toString();
      if (strNum.length >= figures) {
        return num;
      } else {
        var fix = '';
        for (var i = 0; i < figures - strNum.length; i++) {
          fix += '0';
        }
        return fix + strNum;
      }
    },
    goto: function goto(creator, idx) {
      //点击产品经理切换
      var _this = this;
      this.user_data.list && this.user_data.list.forEach(function (e, index) {
        if (creator.creator_id == e.creator_id) {
          _this.index = index;
        }
      });
      this.itemDrop = [];
    },
    changeItemShow: function changeItemShow(event) {
      var _event = _slicedToArray(event, 2),
          id = _event[0],
          chgType = _event[1];

      if (chgType && this.itemDrop.indexOf(id) == -1) {
        this.itemDrop.push(id);
      } else {
        this.itemDrop.splice(this.itemDrop.indexOf(id), 1);
      }
    }
  }
});

var notification = new Vue({
  el: '#notification',
  data: {
    instruction_data: [],
    user_list: []
  },
  methods: {
    instructionLIst: function instructionLIst() {
      var _this = this;
      $.startLoading('正在加载');
      $.ajax({
        url: '/omsv2/sync/instruction/notification_list',
        type: 'GET',
        data: {
          direction_list: [1, 2],
          page_type: 'PC',
          count: 9999
        },
        success: function success(_ref3) {
          var code = _ref3.code,
              msg = _ref3.msg,
              data = _ref3.data;

          if (0 == code) {
            _this.instruction_data = data;
          } else {
            $.omsAlert(msg);
          }
          $.clearLoading();
        },
        error: function error() {
          $.clearLoading();
          $.omsAlert('网络异常，请重试');
        }
      });
    },
    doRefresh: function doRefresh() {
      this.instructionLIst();
    },
    refreshData: function refreshData() {
      var _this = this;
      $.ajax({
        url: '/omsv2/sync/instruction/notification_list',
        type: 'GET',
        data: {
          direction_list: [1, 2],
          page_type: 'PC',
          count: 9999
        },
        success: function success(_ref4) {
          var code = _ref4.code,
              msg = _ref4.msg,
              data = _ref4.data;

          if (0 == code) {
            _this.instruction_data = data;
          } else {
            $.omsAlert(msg);
          }
        },
        error: function error() {
          $.omsAlert('网络异常，请重试');
        }
      });
      // 指令提醒
      $.ajax({
        type: "GET",
        url: "/omsv2/oms/get_notice",
        data: {},
        dataType: "json",
        success: function success(_ref5) {
          var code = _ref5.code,
              msg = _ref5.msg,
              data = _ref5.data;

          if (code == 0 && data.today_not_finished_ins_count > 0) {
            $.omsSoundNotice(1000, '/sound/pulse');
          }
        }
      });
    }
  }
});

notification.instructionLIst();
// 5秒调一次接口
setInterval(function () {
  notification.refreshData();
}, 5000);
//# sourceMappingURL=notification.js.map
