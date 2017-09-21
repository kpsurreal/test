'use strict';

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

// 系统维护页面
var system = new Vue({
  el: '#system_maintenance',
  data: {
    systemList: [],
    checked_all: false, //是否全选
    // autoLoginShow:['开','关'],
    // autoBaseShow:['启用','禁用'],
    autoLoginShow: { true: { text: '开', value: 1 }, false: { text: '关', value: 0 } },
    autoBaseShow: { true: { text: '启用', value: 1 }, false: { text: '禁用', value: 0 } },
    isloarding: false, //判断当前页面是否发送请求  false 时未发送请求,
    securities_map_pb: {},
    securities_map_tdx: {}

  },
  computed: {
    selected_account_arr: function selected_account_arr() {
      var arr = [];
      this.systemList.forEach(function (e) {
        if (e.web_checked) {
          arr.push(e);
        }
      });
      return arr;
    }
  },
  watch: {
    checked_all: function checked_all() {
      if (true == this.checked_all) {
        this.systemList.forEach(function (e) {
          if (1 == e.status) {
            e.web_checked = true;
          }
        });
      } else {
        this.systemList.forEach(function (e) {
          e.web_checked = false;
        });
      }
    }
  },
  methods: {
    getSystemList: function getSystemList() {
      var self = this;
      if (!this.isloarding) {
        this.isloarding = true;
        $.ajax({
          // url: window.REQUEST_PREFIX + '/product/base_lists?format=json',
          url: '/bms-pub/product/base_list',
          type: 'get',
          data: {},
          success: function success(_ref) {
            var code = _ref.code,
                msg = _ref.msg,
                data = _ref.data;

            if (0 == code) {
              var base_ids_arr = [];
              data.forEach(function (e) {
                e.web_checked = false;
                base_ids_arr.push(e.id);
                //添加类型
                if (e.channel == 0) {
                  //通达信
                  e.type = "tdx";
                }
                if (e.channel == 1 || e.channel == 2 || e.channel == 3 || e.channel == 4 || e.channel == 5) {
                  //pb
                  e.type = "pb";
                }

                if (e.channel == 100) {
                  e.type = 'ctp';
                }
              });
              self.isloarding = false;
              self.getLoginStatus(data, base_ids_arr.join(','));
            } else {
              $.omsAlert(msg);
              self.isloarding = false;
            }
          },
          error: function error() {
            $.omsAlert('网络异常，请重试');
            self.isloarding = false;
          }
        });
      }
    },
    getModifyAccountName: function getModifyAccountName() {
      //修改账户名称时需要请求的ajax
      // if ($("#account_name").val().length > 10) {
      //   $.omsAlert('账户名称不得超过10个字');
      //   return false;
      // }
      return '/bms-pub/product/edit_account_name';
    },
    getLoginStatus: function getLoginStatus(systemList, base_ids) {
      var self = this;
      if (!this.isloarding) {
        this.isloarding = true;
        $.ajax({
          url: '/bms-pub/system/sec_login_status',
          type: 'get',
          data: {
            base_id: base_ids
          },
          success: function success(_ref2) {
            var code = _ref2.code,
                msg = _ref2.msg,
                data = _ref2.data;

            if (0 == code) {
              systemList.forEach(function (e) {
                e.login_status = data[e.id] ? !data[e.id].code : false;
                e.login_msg = data[e.id] ? data[e.id].msg : '';
              });
              self.systemList = systemList;
              self.isloarding = false;
            } else {
              // $.omsAlert(msg)
              // 尽管查询错误，也显示列表
              self.isloarding = false;
              systemList.forEach(function (e) {
                e.login_status = false;
                e.login_msg = msg;
              });
              self.systemList = systemList;
            }
          },
          error: function error() {
            $.omsAlert('网络异常，请重试');
            self.isloarding = false;
          }
        });
      }
    },
    showLoginStatus: function showLoginStatus(v) {
      return true == v ? '已登录' : '未登录';
    },
    // showBaseStatus: function(v){
    //   return (true == v) ? '已启用' : '已禁用';
    // },
    // checkStatus: function(){
    //   return v
    // },
    showStockType: function showStockType(v) {
      if (v == 0) {
        return "股票";
      }
      if (v == 1) {
        return "期货";
      }
    },
    showMarket: function showMarket(v) {
      if (v == 0) {
        return "A股";
      }
      if (v == 1) {
        return "港股通";
      }
    },
    showChannel: function showChannel(v) {
      if (v == 0) {
        return "通达信账户";
      }
      if (v == 1) {
        return "恒生PB";
      }
      if (v == 2) {
        return "金证";
      }
      if (v == 3) {
        return "IMS";
      }
      if (v == 4) {
        return "迅投";
      }
      if (v == 5) {
        return 'O32';
      }
      if (v == 100) {
        return "CTP";
      }
    },

    getsecuritiesType: function getsecuritiesType(id) {
      if (/pb/i.test(id)) {
        return 'PB账户';
      } else {
        return '账户';
      }
    },
    doChgAutoLogin: function doChgAutoLogin(auto_login, data, index) {

      if (!this.isloarding) {
        //切换当前账户的自动登录状态
        var self = this;
        $.startLoading();
        this.isloarding = true;
        $.ajax({
          url: '/bms-pub/product/set_auto_login',
          type: 'post',
          data: {
            base_id: data.id,
            auto_login: auto_login ? 1 : 0 //取反
          },
          success: function success(_ref3) {
            var msg = _ref3.msg,
                code = _ref3.code,
                data = _ref3.data;

            if (code == 0) {
              $.omsAlert('修改成功');
              $.clearLoading();
              self.isloarding = false;
            } else {
              $.omsAlert(msg);
              self.systemList[index].auto_login = !auto_login;
              $.clearLoading();
              self.isloarding = false;
            }
          },
          error: function error() {
            $.omsAlert('网络异常，请重试');
            self.systemList[index].auto_login = !auto_login;
            $.clearLoading();
            self.isloarding = false;
          }
        });
      }
    },
    doChgStatus: function doChgStatus(status, data, index) {
      var self = this;
      $.startLoading();
      $.ajax({
        url: '/bms-pub/product/update_base_status',
        type: 'post',
        data: {
          base_id: data.id,
          status: status ? 1 : 0 //取反
        },
        success: function success(_ref4) {
          var msg = _ref4.msg,
              code = _ref4.code,
              data = _ref4.data;


          if (code == 0) {
            $.omsAlert('修改成功');
            $.clearLoading();
          } else {
            $.omsAlert(msg);
            self.systemList[index].status = !status;
            $.clearLoading();
          }
        },
        error: function error() {
          $.clearLoading();
          $.omsAlert('网络异常，请重试');
        }
      });
    },
    setReportInfo: function setReportInfo(account) {
      var self = this;
      var contentChild = Vue.extend({
        data: function data() {
          return {
            base_id: account.id,
            account_name: account.account_name,
            vc_ip: '',
            vc_pc: '',
            vc_iip: '',
            vc_pi: '',
            vc_mac: '',
            vc_hd: '',
            vc_pcn: '',
            vc_cpu: '',
            vc_ser_no: '',
            vc_vol: '',
            vc_hostname: ''
          };
        },

        template: '\n         <form class="vue-form">\n            <table class="report">\n              <thead>\n                  <tr>\n                      <th>\u6240\u5C5E\u4E8E\u8D26\u6237</th>\n                      <th>{{account_name}}</th>\n                  </tr>\n              </thead>\n              <tbody>\n                  <tr>\n                      <td>vc_ip:</td>\n                      <td><input type="text" placeholder="\u8BF7\u8F93\u5165" v-model="vc_ip"/></td>\n                  </tr>\n                  <tr>\n                      <td>vc_pc:</td>\n                      <td><input type="text" placeholder="\u8BF7\u8F93\u5165" v-model="vc_pc"/></td>\n                  </tr>\n                  <tr>\n                      <td>vc_iip:</td>\n                      <td><input type="text" placeholder="\u8BF7\u8F93\u5165" v-model="vc_iip"/></td>\n                  </tr>\n                  <tr>\n                      <td>vc_pi:</td>\n                      <td><input type="text" placeholder="\u8BF7\u8F93\u5165" v-model="vc_pi"/></td>\n                  </tr>\n                  <tr>\n                      <td>vc_mac:</td>\n                      <td><input type="text" placeholder="\u8BF7\u8F93\u5165" v-model="vc_mac"/></td>\n                  </tr>\n                  <tr>\n                      <td>vc_hd:</td>\n                      <td><input type="text" placeholder="\u8BF7\u8F93\u5165" v-model="vc_hd"/></td>\n                  </tr>\n                  <tr>\n                      <td>vc_pcn:</td>\n                      <td><input type="text" placeholder="\u8BF7\u8F93\u5165" v-model="vc_pcn"/></td>\n                  </tr>\n                    <tr>\n                      <td>vc_cpu:</td>\n                      <td><input type="text" placeholder="\u8BF7\u8F93\u5165" v-model="vc_cpu"/></td>\n                  </tr>\n                    <tr>\n                      <td>vc_ser_no:</td>\n                      <td><input type="text" placeholder="\u8BF7\u8F93\u5165" v-model="vc_ser_no"/></td>\n                  </tr>\n                    <tr>\n                      <td>vc_vol:</td>\n                      <td><input type="text" placeholder="\u8BF7\u8F93\u5165" v-model="vc_vol"/></td>\n                  </tr>\n                    <tr>\n                      <td>vc_hostname:</td>\n                      <td><input type="text" placeholder="\u8BF7\u8F93\u5165" v-model="vc_hostname"/></td>\n                  </tr>\n              </tbody>\n          </table>\n            <div class="buttons">\n              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>\u53D6\u6D88</button>\n              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>\u786E\u5B9A</button>\n            </div>\n          </form>\n        ',
        methods: {
          btn_submit: function btn_submit() {
            var _this = this;
            $.startLoading('正在提交...');
            if (!self.isloarding) {
              self.isloarding = true;
              $.ajax({
                url: '/bms-pub/product/edit_record_info',
                type: 'post',
                data: {
                  base_id: account.id,
                  type: account.type,
                  vc_ip: this.vc_ip,
                  vc_pc: this.vc_pc,
                  vc_iip: this.vc_iip,
                  vc_pi: this.vc_pi,
                  vc_mac: this.vc_mac,
                  vc_hd: this.vc_hd,
                  vc_pcn: this.vc_pcn,
                  vc_cpu: this.vc_cpu,
                  vc_ser_no: this.vc_ser_no,
                  vc_vol: this.vc_vol,
                  vc_hostname: this.vc_hostname
                },
                success: function success(_ref5) {
                  var msg = _ref5.msg,
                      code = _ref5.code,
                      data = _ref5.data;


                  if (code == 0) {
                    self.isloarding = false;
                    $.omsAlert('修改成功');
                    $.clearLoading();
                    _this.$parent.close();
                  } else {
                    self.isloarding = false;
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function error() {
                  self.isloarding = false;
                  $.omsAlert('修改失败');
                  $.clearLoading();
                  _this.$parent.close();
                }
              });
            }
          },
          btn_cancel: function btn_cancel() {
            this.$parent.close();
          }
        },
        mounted: function mounted() {
          var _this = this;
          $.startLoading('正在获取...');
          if (!self.isloarding) {
            self.isloarding = true;
            $.ajax({
              url: "/bms-pub/product/get_record_info",
              type: 'get',
              data: {
                base_id: account.id,
                type: account.type
              },
              success: function success(_ref6) {
                var msg = _ref6.msg,
                    code = _ref6.code,
                    data = _ref6.data;

                if (code == 0) {
                  self.isloarding = false;
                  // $.omsAlert('获取成功');
                  for (var key in data) {
                    _this[key] = data[key];
                  }
                  $.clearLoading();
                } else {
                  self.isloarding = false;
                  //$.omsAlert(msg)
                  $.omsAlert(msg);
                  $.clearLoading();
                }
              },
              error: function error() {
                self.isloarding = false;
                $.omsAlert('获取失败');
                $.clearLoading();
              }
            });
          }
        }
      });

      this.$confirm({
        title: '客户数据修改',
        content: contentChild,
        closeIcon: true
      });
    },
    setAccountInfo: function setAccountInfo(account) {
      var self = this;
      var pb_options = [];
      var tdx_options = [];

      Object.keys(this.securities_map_pb).forEach(function (e) {
        pb_options.push({
          label: self.securities_map_pb[e],
          value: e
        });
      });
      Object.keys(this.securities_map_tdx).forEach(function (e) {
        tdx_options.push({
          label: self.securities_map_tdx[e],
          value: e
        });
      });
      var stockTypeOption = ['股票', '期货'];
      var marketOption = ['A股', '港股通'];
      var channelOption = [{ name: '通达信账户', value: 0 }, { name: '恒生PB', value: 1 }, { name: '金证', value: 2 }, { name: 'IMS', value: 3 }, { name: '迅投', value: 4 }, { name: 'CTP', value: 100 }];
      var contentChild = Vue.extend({
        data: function data() {
          return {
            pb_options: pb_options,
            tdx_options: tdx_options,
            stockTypeOption: stockTypeOption,
            marketOption: marketOption,
            channelOption: channelOption,
            channel: account.channel,
            stock_type: account.stock_type,
            market: account.market,
            security_id: account.securities_id,
            account_id: account.account_id,
            host: account.server_host,
            port: account.server_port,
            ctp_broker: account.ctp_broker,
            ctp_user: account.ctp_user,
            ctp_investor: account.ctp_investor,
            name: account.name,
            type: account.type,
            base_id: account.id
          };
        },

        template: '\n         <form class="vue-form">\n            <ul class="vue_page_ul">\n                <ul class="vue_page_ul">\n                  <li>\n                    <label for="channel" >\u7CFB\u7EDF\u7C7B\u578B</label>\n                    <select  name="channel" placeholder="\u8BF7\u8F93\u5165\u7CFB\u7EDF\u7C7B\u578B" v-model="channel">\n                      <option  v-for="item in channelOption" :value=item.value>{{item.name}}</option>\n                    </select>\n                  </li>\n                  <li>\n                    <label for="name" >\u8D26\u6237\u540D\u79F0</label>\n                    <input  id="name" placeholder="\u8BF7\u8F93\u5165\u8D26\u6237\u540D\u79F0" v-model="name">\n                  </li>\n                  <template v-if="channel !=100">\n                    <li>\n                        <label for="account_id" >\u8D26\u6237\u53F7\u7801</label>\n                        <input  id="account_id" v-model="account_id" placeholder="\u8BF7\u8F93\u5165\u8D26\u6237\u53F7\u7801">\n                    </li>\n                    <li>\n                      <label for="security_id" >\u5238\u5546\u540D\u79F0</label>\n                      <select name="security_id" placeholder="\u8BF7\u8F93\u5165\u5238\u5546\u540D\u79F0" v-model="security_id">\n                        <option   v-for="tdx,index in tdx_options" :value=tdx.value>{{tdx.label}}</option>\n                      </select>\n                    </li>\n                    <li>\n                      <label for="host" >TB_IP</label>\n                      <input  id="host" v-model="host" placeholder="\u8BF7\u8F93\u5165TB\u670D\u52A1\u5668ID">\n                    </li>\n                    <li>\n                      <label for="port" >TB_PORT</label>\n                      <input  id="port" v-model="port" placeholder="\u8BF7\u8F93\u5165TB\u670D\u52A1\u5668\u7AEF\u53E3">\n                    </li>\n                    <li>\n                      <label for="stock_type" >\u8D44\u4EA7\u7C7B\u578B</label>\n                      <select name="stock_type" placeholder="\u8BF7\u8F93\u5165\u8D44\u4EA7\u7C7B\u578B" v-model="stock_type" >\n                        <option  v-for="stockType,index in stockTypeOption" :value=index>{{stockType}}</option>\n                      </select>\n                    </li>\n                    <li>\n                      <label for="market" >\u5E02\u573A\u533A\u57DF</label>\n                      <select name="market" placeholder="\u8BF7\u8F93\u5165\u5E02\u573A\u533A\u57DF" v-model="market">\n                         <option  v-for="name,index in marketOption" :value=index>{{name}}</option>\n                      </select>\n                    </li> \n                  </template>\n                  <template v-else>\n                    <li>\n                      <label for="ctp_broker" >\u7ECF\u6D4E\u516C\u53F8\u4EE3\u7801</label>\n                      <input  id="ctp_broker" v-model="ctp_broker" placeholder="\u8BF7\u8F93\u5165\u7ECF\u6D4E\u516C\u53F8\u4EE3\u7801">\n                    </li>\n                    <li>\n                      <label for="ctp_user" >\u7528\u6237\u4EE3\u7801</label>\n                      <input  id="ctp_user" v-model="ctp_user">\n                    </li>\n                    <li>\n                      <label for="ctp_investor" >\u6295\u8D44\u8005ID</label>\n                      <input  id="ctp_investor" v-model="ctp_investor" placeholder="\u8BF7\u8F93\u5165\u6295\u8D44\u8005ID">\n                    </li>\n                    <li>\n                      <label for="host" >TB_IP</label>\n                      <input  id="host" v-model="host" placeholder="\u8BF7\u8F93\u5165TB\u670D\u52A1\u5668ID">\n                    </li>\n                    <li>\n                      <label for="port" >TB_PORT</label>\n                      <input  id="port" v-model="port" placeholder="\u8BF7\u8F93\u5165TB\u670D\u52A1\u5668\u7AEF\u53E3">\n                    </li>\n                  </template> \n                </ul>  \n            </ul>\n            <div class="buttons">\n              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>\u53D6\u6D88</button>\n              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>\u786E\u5B9A</button>\n            </div>\n          </form>\n        ',
        methods: {
          btn_submit: function btn_submit() {
            //获取最新type
            if (this.channel == 0) {
              //通达信
              this.type = "tdx";
            }
            if (this.channel == 1 || this.channel == 2 || this.channel == 3 || this.channel == 4) {
              //pb
              this.type = "pb";
            }
            if (this.channel == 100) {
              this.type = 'ctp';
            }
            var _this = this;
            $.startLoading('正在提交...');
            if (!self.isloarding) {
              self.isloarding = true;
              $.ajax({
                url: '/bms-pub/product/edit_base',
                type: 'post',
                data: {
                  base_id: _this.base_id,
                  channel: _this.channel,
                  security_id: _this.security_id,
                  name: _this.name,
                  account: _this.account_id,
                  market: _this.market,
                  stock_type: _this.stock_type,
                  host: _this.host,
                  port: _this.port,
                  ctp_broker: _this.ctp_broker,
                  ctp_user: _this.ctp_user,
                  ctp_investor: _this.ctp_investor,
                  type: _this.type
                },
                success: function success(_ref7) {
                  var msg = _ref7.msg,
                      code = _ref7.code,
                      data = _ref7.data;


                  if (code == 0) {
                    self.isloarding = false;
                    $.omsAlert('修改成功');
                    $.clearLoading();
                    _this.$parent.close();
                  } else {
                    self.isloarding = false;
                    //$.omsAlert(msg)
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function error() {
                  self.isloarding = false;
                  $.omsAlert('修改失败');
                  $.clearLoading();
                  _this.$parent.close();
                }
              });
            }
          },
          btn_cancel: function btn_cancel() {
            this.$parent.close();
          }
        }
      });

      this.$confirm({
        title: '账户信息',
        content: contentChild,
        closeIcon: true
      });
    },
    setBrokerInfo: function setBrokerInfo(account) {

      var self = this;
      var contentChild = Vue.extend({
        data: function data() {
          return {
            type: account.channel,
            jy_account: '',
            trader_id: '',
            account: '',
            sh_a_code: '',
            sz_a_code: '',
            seat_id_sh: '',
            seat_id_sz: '',
            host: '',
            port: '',
            sec_qry_type: '',
            base_id: account.id,
            ssl_level: '',
            cert_fiel: '',
            cert_pwd: '',
            server_name: '',
            send_q_name: '',
            reserved: '',
            receive_q_name: '',
            ssl: '',
            cert_user_name: '',
            isloarding: false
          };
        },

        template: '\n         <form class="vue-form">\n                <ul class="vue_page_ul">\n                  <template v-if="type == \'0\' ">\n                    <li>\n                      <label for="host" >Trade_host</label>\n                      <input  id="host" v-model="host" placeholder="\u8BF7\u8F93\u5165Trade_host">\n                    </li>\n                    <li>\n                      <label for="port" >Trade_port</label>\n                      <input  id="port" v-model="port" placeholder="\u8BF7\u8F93\u5165Trade_port">\n                    </li>\n                    <li>\n                        <label for="account" >\u767B\u5F55\u5E10\u53F7</label>\n                        <input  id="account" v-model="account" placeholder="\u8BF7\u8F93\u5165\u767B\u5F55\u5E10\u53F7">\n                    </li>\n                    <li>\n                      <label for="jy_account" >\u4EA4\u6613\u8D26\u6237</label>\n                      <input  id="jy_account" v-model="jy_account" placeholder="\u8BF7\u8F93\u5165\u4EA4\u6613\u8D26\u6237">\n                    </li>\n                    <li>\n                      <label for="sz_a_code" >\u6DF1\u5733\u80A1\u4E1C\u4EE3\u7801</label>\n                      <input  id="sz_a_code" v-model="sz_a_code" placeholder="\u8BF7\u8F93\u5165\u6DF1\u5733\u80A1\u4E1C\u4EE3\u7801">\n                    </li>\n                    <li>\n                      <label for="sh_a_code" >\u4E0A\u6D77\u80A1\u4E1C\u4EE3\u7801</label>\n                      <input  id="sh_a_code" v-model="sh_a_code" placeholder="\u8BF7\u8F93\u5165\u4E0A\u6D77\u80A1\u4E1C\u4EE3\u7801">\n                    </li>\n                  </template>\n                  <template v-if="type == \'1\' || type == 5 || type == 3 || type == 4">\n                    <li>\n                      <label for="host" >Host:TB</label>\n                      <input  id="host" v-model="host" placeholder="\u8BF7\u8F93\u5165Host:TB">\n                    </li>\n                    <li>\n                      <label for="port" >Port:TB</label>\n                      <input  id="port" v-model="port" placeholder="\u8BF7\u8F93\u5165Port:TB">\n                    </li>\n                    <li>\n                        <label for="account" >\u767B\u5F55\u5E10\u53F7</label>\n                        <input  id="account" v-model="account" placeholder="\u8BF7\u8F93\u5165\u767B\u5F55\u5E10\u53F7">\n                    </li>\n                    <li>\n                      <label for="trader_id" >Trader_id</label>\n                      <input  id="trader_id" v-model="trader_id" placeholder="\u8BF7\u8F93\u5165Trader_id">\n                    </li>\n                    <li>\n                      <label for="sz_a_code" >\u6DF1\u5733\u80A1\u4E1C\u4EE3\u7801</label>\n                      <input  id="sz_a_code" v-model="sz_a_code" placeholder="\u8BF7\u8F93\u5165\u6DF1\u5733\u80A1\u4E1C\u4EE3\u7801">\n                    </li>\n                    <li>\n                      <label for="sh_a_code" >\u4E0A\u6D77\u80A1\u4E1C\u4EE3\u7801</label>\n                      <input  id="sh_a_code" v-model="sh_a_code" placeholder="\u8BF7\u8F93\u5165\u4E0A\u6D77\u80A1\u4E1C\u4EE3\u7801">\n                    </li>\n                    <li>\n                      <label for="seat_id_sz" >\u6DF1\u5733\u5E2D\u4F4D\u4EE3\u7801</label>\n                      <input  id="seat_id_sz" v-model="seat_id_sz" placeholder="\u8BF7\u8F93\u5165\u6DF1\u5733\u5E2D\u4F4D\u4EE3\u7801">\n                    </li>\n                    <li>\n                      <label for="seat_id_sh" >\u4E0A\u6D77\u5E2D\u4F4D\u4EE3\u7801</label>\n                      <input  id="seat_id_sh" v-model="seat_id_sh" placeholder="\u8BF7\u8F93\u5165\u4E0A\u6D77\u5E2D\u4F4D\u4EE3\u7801">\n                    </li>\n                    <li>\n                      <label for="sec_qry_type" >Sec_qry_type</label>\n                      <input  id="sec_qry_type" v-model="sec_qry_type" placeholder="\u8BF7\u8F93\u5165Sec_qry_type">\n                    </li>\n                    <li>\n                      <label for="sec_qry_type" >\u8BC1\u4E66\u7C7B\u578B</label>\n                      <input  id="sec_qry_type" v-model="ssl_level" placeholder="\u8BF7\u8F93\u5165\u8BC1\u4E66\u7C7B\u578B">\n                    </li>\n                    <li>\n                      <label for="sec_qry_type" >\u8BC1\u4E66\u6587\u4EF6</label>\n                      <input  id="sec_qry_type" v-model="cert_fiel" placeholder="\u8BF7\u8F93\u5165\u8BC1\u4E66\u6587\u4EF6">\n                    </li>\n                    <li>\n                      <label for="sec_qry_type" >\u8BC1\u4E66\u5BC6\u7801</label>\n                      <input  id="sec_qry_type" v-model="cert_pwd" placeholder="\u8BF7\u8F93\u5165\u8BC1\u4E66\u5BC6\u7801">\n                    </li>\n                  </template>\n                  <template v-if="type == \'2\' ">\n                    <li>\n                      <label for="host" >Host:TB</label>\n                      <input  id="host" v-model="host" placeholder="\u8BF7\u8F93\u5165Host:TB">\n                    </li>\n                    <li>\n                      <label for="port" >Port:TB</label>\n                      <input  id="port" v-model="port" placeholder="\u8BF7\u8F93\u5165Port:TB">\n                    </li>\n                    <li>\n                        <label for="account" >\u767B\u5F55\u5E10\u53F7</label>\n                        <input  id="account" v-model="account" placeholder="\u8BF7\u8F93\u5165\u767B\u5F55\u5E10\u53F7">\n                    </li>\n                    <li>\n                      <label for="trader_id" >Trader_id</label>\n                      <input  id="trader_id" v-model="trader_id" placeholder="\u8BF7\u8F93\u5165Trader_id">\n                    </li>\n                    <li>\n                      <label for="sz_a_code" >\u6DF1\u5733\u80A1\u4E1C\u4EE3\u7801</label>\n                      <input  id="sz_a_code" v-model="sz_a_code" placeholder="\u8BF7\u8F93\u5165\u6DF1\u5733\u80A1\u4E1C\u4EE3\u7801">\n                    </li>\n                    <li>\n                      <label for="sh_a_code" >\u4E0A\u6D77\u80A1\u4E1C\u4EE3\u7801</label>\n                      <input  id="sh_a_code" v-model="sh_a_code" placeholder="\u8BF7\u8F93\u5165\u4E0A\u6D77\u80A1\u4E1C\u4EE3\u7801">\n                    </li>\n                    <li>\n                      <label for="seat_id_sz" >\u6DF1\u5733\u5E2D\u4F4D\u4EE3\u7801</label>\n                      <input  id="seat_id_sz" v-model="seat_id_sz" placeholder="\u8BF7\u8F93\u5165\u6DF1\u5733\u5E2D\u4F4D\u4EE3\u7801">\n                    </li>\n                    <li>\n                      <label for="seat_id_sh" >\u4E0A\u6D77\u5E2D\u4F4D\u4EE3\u7801</label>\n                      <input  id="seat_id_sh" v-model="seat_id_sh" placeholder="\u8BF7\u8F93\u5165\u4E0A\u6D77\u5E2D\u4F4D\u4EE3\u7801">\n                    </li>\n                    <li>\n                      <label for="sec_qry_type" >Sec_qry_type</label>\n                      <input  id="sec_qry_type" v-model="sec_qry_type" placeholder="\u8BF7\u8F93\u5165Sec_qry_type">\n                    </li>\n                    <li>\n                      <label for="sec_qry_type" >\u670D\u52A1\u540D\u79F0</label>\n                      <input  id="sec_qry_type" v-model="server_name" placeholder="\u8BF7\u8F93\u5165\u670D\u52A1\u540D\u79F0">\n                    </li>\n                    <li>\n                      <label for="sec_qry_type" >\u53D1\u9001\u670D\u52A1\u540D\u79F0</label>\n                      <input  id="sec_qry_type" v-model="send_q_name" placeholder="\u8BF7\u8F93\u5165\u53D1\u9001\u670D\u52A1\u540D\u79F0">\n                    </li>\n                    <li>\n                      <label for="sec_qry_type" >\u4FDD\u7559\u4FE1\u606F</label>\n                      <input  id="sec_qry_type" v-model="reserved" placeholder="\u8BF7\u8F93\u5165\u4FDD\u7559\u4FE1\u606F">\n                    </li>\n                    <li>\n                      <label for="sec_qry_type" >\u63A5\u6536\u670D\u52A1\u540D\u79F0</label>\n                      <input  id="sec_qry_type" v-model="receive_q_name" placeholder="\u8BF7\u8F93\u5165\u63A5\u6536\u670D\u52A1\u540D\u79F0">\n                    </li>\n                    <li>\n                      <label for="sec_qry_type" >SSL\u4FE1\u606F</label>\n                      <input  id="sec_qry_type" v-model="ssl" placeholder="\u8BF7\u8F93\u5165SSL\u4FE1\u606F">\n                    </li>\n                    <li>\n                      <label for="sec_qry_type" >\u8BC1\u4E66\u540D\u79F0</label>\n                      <input  id="sec_qry_type" v-model="cert_user_name" placeholder="\u8BF7\u8F93\u5165\u8BC1\u4E66\u540D\u79F0">\n                    </li>\n                  </template> \n                </ul>  \n            <div class="buttons">\n              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>\u53D6\u6D88</button>\n              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>\u786E\u5B9A</button>\n            </div>\n          </form>\n        ',
        methods: {
          btn_submit: function btn_submit() {
            var _this = this;
            $.startLoading('正在提交...');
            if (!_this.isloarding) {
              _this.isloarding = true;
              $.ajax({
                url: '/bms-pub/product/edit_sec_info',
                type: 'post',
                data: {
                  base_id: _this.base_id,
                  type: _this.type,
                  jy_account: _this.jy_account,
                  trader_id: _this.trader_id,
                  account: _this.account,
                  sh_a_code: _this.sh_a_code,
                  sz_a_code: _this.sz_a_code,
                  seat_id_sh: _this.seat_id_sh,
                  seat_id_sz: _this.seat_id_sz,
                  host: _this.host,
                  port: _this.port,
                  sec_qry_type: _this.sec_qry_type,
                  ssl_level: _this.ssl_level,
                  cert_fiel: _this.cert_fiel,
                  cert_pwd: _this.cert_pwd,
                  server_name: _this.server_name,
                  send_q_name: _this.send_q_name,
                  reserved: _this.reserved,
                  receive_q_name: _this.receive_q_name,
                  ssl: _this.ssl,
                  cert_user_name: _this.cert_user_name
                },
                success: function success(_ref8) {
                  var msg = _ref8.msg,
                      code = _ref8.code,
                      data = _ref8.data;


                  if (code == 0) {
                    _this.isloarding = false;
                    $.omsAlert('修改成功');
                    $.clearLoading();
                    _this.$parent.close();
                  } else {
                    _this.isloarding = false;
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function error() {
                  _this.isloarding = false;
                  $.omsAlert('修改失败');
                  $.clearLoading();
                  _this.$parent.close();
                }
              });
            }
          },
          btn_cancel: function btn_cancel() {
            this.$parent.close();
          }
        },
        mounted: function mounted() {
          var _this = this;
          $.startLoading('正在获取...');
          if (!_this.isloarding) {
            _this.isloarding = true;
            $.ajax({
              url: "/bms-pub/product/get_sec_info",
              type: 'get',
              data: {
                base_id: account.id,
                type: account.type
              },
              success: function success(_ref9) {
                var msg = _ref9.msg,
                    code = _ref9.code,
                    data = _ref9.data;

                if (code == 0) {
                  _this.isloarding = false;
                  // $.omsAlert('获取成功');
                  for (var key in data) {
                    _this[key] = data[key];
                  }
                  $.clearLoading();
                } else {
                  _this.isloarding = false;
                  //$.omsAlert(msg)
                  $.omsAlert(msg);
                  $.clearLoading();
                }
              },
              error: function error() {
                _this.isloarding = false;
                $.omsAlert('获取失败');
                $.clearLoading();
              }
            });
          }
        }
      });

      this.$confirm({
        title: '券商信息',
        content: contentChild,
        closeIcon: true
      });
    },
    setPassword: function setPassword(account) {

      var self = this;
      var contentChild = Vue.extend({
        data: function data() {
          return {
            new_passwd: '',
            tx_new_passwd: '',
            new_class: 'hide',
            new_type: 'password',
            tx_class: 'hide',
            tx_type: 'password',
            type: account.channel

          };
        },

        template: '\n         <form class="vue-form">\n            <ul class="vue_page_ul">\n              <li>\n                <label for="new_passwd">\u4EA4\u6613\u5BC6\u7801</label>\n                <input v-if="new_type == \'password\'" id="new_passwd"  type="password" v-model="new_passwd">\n                <input v-if="new_type == \'text\'" id="new_passwd"  type="text" v-model="new_passwd">\n                <span :class=new_class @click=toggleIconNew></span>\n              </li>\n              <li>\n                <label for="tx_new_passwd">\u901A\u4FE1\u5BC6\u7801</label>\n                <input v-if="tx_type == \'password\'" id="tx_new_passwd"  type="password" v-model="tx_new_passwd">\n                <input v-if="tx_type == \'text\'" id="tx_new_passwd"  type="text" v-model="tx_new_passwd">\n                <span :class=tx_class @click=toggleIconTx></span>\n              </li>   \n            </ul>\n            <div class="buttons">\n              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>\u53D6\u6D88</button>\n              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>\u786E\u5B9A</button>\n            </div>\n          </form>\n        ',
        methods: {
          toggleIconNew: function toggleIconNew() {

            if (this.new_class == 'hide') {
              this.new_class = 'show';
              this.new_type = 'text';
            } else if (this.new_class == 'show') {
              this.new_class = 'hide';
              this.new_type = 'password';
            }
          },
          toggleIconTx: function toggleIconTx() {
            if (this.tx_class == 'hide') {
              this.tx_class = 'show';
              this.tx_type = 'text';
            } else if (this.tx_class == 'show') {
              this.tx_class = 'hide';
              this.tx_type = 'password';
            }
          },
          btn_submit: function btn_submit() {
            var _this = this;
            $.startLoading('正在提交...');
            if (!self.isloarding) {
              self.isloarding = true;
              $.ajax({
                url: '/bms-pub/product/change_base_password',
                type: 'post',
                data: {
                  base_id: account.id,
                  new_passwd: _this.new_passwd,
                  tx_new_passwd: _this.tx_new_passwd,
                  type: _this.type
                },
                success: function success(_ref10) {
                  var msg = _ref10.msg,
                      code = _ref10.code,
                      data = _ref10.data;


                  if (code == 0) {
                    self.isloarding = false;
                    $.omsAlert('修改成功');
                    $.clearLoading();
                    _this.$parent.close();
                  } else {
                    self.isloarding = false;
                    //$.omsAlert(msg)
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function error() {
                  self.isloarding = false;
                  $.omsAlert('修改失败');
                  $.clearLoading();
                  _this.$parent.close();
                }
              });
            }
          },
          btn_cancel: function btn_cancel() {
            this.$parent.close();
          }
        }
      });

      this.$confirm({
        title: '修改密码',
        content: contentChild,
        closeIcon: true
      });
    },
    setProductInfo: function setProductInfo(account) {
      var self = this;
      var contentChild = Vue.extend({
        data: function data() {
          var _ref11;

          return _ref11 = {
            type: account.type,
            base_id: account.id,
            product_arr: [{}],
            name: '',
            product_id: ''
          }, _defineProperty(_ref11, 'base_id', account.id), _defineProperty(_ref11, 'isloarding', false), _ref11;
        },

        template: '\n         <form class="vue-form">\n            <template v-if="type != \'pb\'">\n            <ul class="vue_page_ul">\n                <ul class="vue_page_ul">\n                  <li>\n                    <label for="name" >\u4EA7\u54C1\u540D\u79F0</label>\n                    <input  id="name" v-model="name" placeholder="\u8BF7\u8F93\u5165\u4EA7\u54C1\u540D\u79F0">\n                  </li>\n                </ul>  \n            </ul>\n            </template>\n            <template v-else>\n              <table class="product">\n                <thead>\n                    <tr>\n                        <th>\u5E8F\u53F7</th>\n                        <th>\u4EA7\u54C1\u540D\u79F0</th>\n                        <th>\u4EA7\u54C1\u7F16\u53F7</th>\n                        <th>\u5355\u5143\u7F16\u53F7</th>\n                        <th>\u7EC4\u5408\u7F16\u53F7</th>\n                    </tr>\n                </thead>\n                <tbody>\n                    <template v-for="item,index in product_arr">\n                    <tr>\n                        <td>{{index+1}}</td>\n                        <td><input  v-model="item.name" placeholder="\u8BF7\u8F93\u5165\u4EA7\u54C1\u540D\u79F0"></td>\n                        <td><input  v-model="item.fund_id" placeholder="\u8BF7\u8F93\u5165\u4EA7\u54C1\u7F16\u53F7"></td>\n                        <td><input  v-model="item.unit_id" placeholder="\u8BF7\u8F93\u5165\u5355\u5143\u7F16\u53F7"></td>\n                        <td><input  v-model="item.combi_id" placeholder="\u8BF7\u8F93\u5165\u7EC4\u5408\u7F16\u53F7"></td>\n                    </tr>\n                    </template>\n                    <tr><td></td><td></td><td></td><td></td><td><span @click="add_product_info">\u65B0\u589E\u4EA7\u54C1\u4FE1\u606F</span></td></tr>\n                </tbody>\n              </table>\n            </template>\n            <div class="buttons">\n              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>\u53D6\u6D88</button>\n              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>\u786E\u5B9A</button>\n            </div>\n          </form>\n        ',
        methods: {
          btn_submit: function btn_submit() {
            var _this = this;
            var product_arr;
            if (this.type != "pb") {
              product_arr = { "product_id": this.base_id, "name": this.name };
              product_arr = JSON.stringify(product_arr);
            } else {
              product_arr = this.product_arr;
              product_arr = JSON.stringify(product_arr);
            }
            $.startLoading('正在提交...');
            if (!self.isloarding) {
              self.isloarding = true;
              $.ajax({
                url: '/bms-pub/product/modify_product',
                type: 'post',
                data: {
                  type: _this.type,
                  data: product_arr,
                  base_id: _this.base_id
                },
                success: function success(_ref12) {
                  var msg = _ref12.msg,
                      code = _ref12.code,
                      data = _ref12.data;

                  if (code == 0) {
                    self.isloarding = false;
                    $.omsAlert('修改成功');
                    $.clearLoading();
                    _this.$parent.close();
                  } else {
                    self.isloarding = false;
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function error() {
                  self.isloarding = false;
                  $.omsAlert('修改失败');
                  $.clearLoading();
                  _this.$parent.close();
                }
              });
            }
          },
          btn_cancel: function btn_cancel() {
            this.$parent.close();
          },
          add_product_info: function add_product_info() {
            this.product_arr.push({});
          }
        },
        mounted: function mounted() {
          var _this = this;
          $.startLoading('正在获取...');
          if (!self.isloarding) {
            self.isloarding = true;
            $.ajax({
              url: "/bms-pub/product/product_info",
              type: 'get',
              data: {
                base_id: account.id,
                type: account.type
              },
              success: function success(_ref13) {
                var msg = _ref13.msg,
                    code = _ref13.code,
                    data = _ref13.data;

                if (code == 0) {
                  self.isloarding = false;
                  // $.omsAlert('获取成功');

                  if (_this.type == 'tdx' || _this.type == "ctp") {
                    _this.name = data.name;
                    _this.product_id = data.product_id;
                  } else {
                    if (data.length > 0) {
                      _this.product_arr = data;
                    }
                  }
                  self.isloarding = false;
                  $.clearLoading();
                } else {
                  self.isloarding = false;
                  //$.omsAlert(msg)
                  $.omsAlert(msg);
                  $.clearLoading();
                }
              },
              error: function error() {
                self.isloarding = false;
                $.omsAlert('获取失败');
                $.clearLoading();
              }
            });
          }
        }
      });

      this.$confirm({
        title: '产品信息',
        content: contentChild,
        closeIcon: true
      });
    },
    addAccunt: function addAccunt() {

      var self = this;
      var pb_options = [];
      var tdx_options = [];

      Object.keys(this.securities_map_pb).forEach(function (e) {
        pb_options.push({
          label: self.securities_map_pb[e],
          value: e
        });
      });
      Object.keys(this.securities_map_tdx).forEach(function (e) {
        tdx_options.push({
          label: self.securities_map_tdx[e],
          value: e
        });
      });
      var stockTypeOption = ['股票', '期货'];
      var marketOption = ['A股', '港股通'];
      var channelOption = [{ name: '通达信账户', value: 0 }, { name: '恒生PB', value: 1 }, { name: '金证', value: 2 }, { name: 'IMS', value: 3 }, { name: '迅投', value: 4 }, { name: 'O32', value: 5 }, { name: 'CTP', value: 100 }];
      var contentChild = Vue.extend({
        data: function data() {
          return {
            pb_options: pb_options,
            tdx_options: tdx_options,
            stockTypeOption: stockTypeOption,
            marketOption: marketOption,
            channelOption: channelOption,
            channel: 0,
            stock_type: 0,
            market: 0,
            security_id: tdx_options[0].value,
            account: '',
            host: '',
            port: '',
            ctp_broker: '',
            ctp_user: '',
            ctp_investor: '',
            name: ''
          };
        },

        template: '\n         <form class="vue-form">\n            <ul class="vue_page_ul">\n                <ul class="vue_page_ul">\n                  <li>\n                    <label for="channel" >\u7CFB\u7EDF\u7C7B\u578B</label>\n                    <select  name="channel"  v-model="channel">\n                      <option  v-for="item in channelOption" :value=item.value>{{item.name}}</option>\n                    </select>\n                  </li>\n                  <li>\n                    <label for="name" >\u8D26\u6237\u540D\u79F0</label>\n                    <input  id="name" v-model="name">\n                  </li>\n                  <template v-if="channel !=100">\n                    <li>\n                      <label for="account" >\u8D26\u6237\u53F7\u7801</label>\n                      <input  id="account" v-model="account">\n                    </li>\n                    <li>\n                      <label for="security_id" >\u5238\u5546\u540D\u79F0</label>\n                      <select name="security_id"  v-model="security_id">\n                        <option   v-for="tdx,index in tdx_options" :value=tdx.value>{{tdx.label}}</option>\n                      </select>\n                    </li>\n                    <li>\n                      <label for="host" >TB_IP</label>\n                      <input  id="host" v-model="host">\n                    </li>\n                    <li>\n                      <label for="port" >TB_PORT</label>\n                      <input  id="port" v-model="port">\n                    </li>\n                    <li>\n                      <label for="stock_type" >\u8D44\u4EA7\u7C7B\u578B</label>\n                      <select name="stock_type"  v-model="stock_type">\n                        <option  v-for="stockType,index in stockTypeOption" :value=index>{{stockType}}</option>\n                      </select>\n                    </li>\n                    <li>\n                      <label for="market" >\u5E02\u573A\u533A\u57DF</label>\n                      <select name="market" v-model="market">\n                         <option  v-for="name,index in marketOption" :value=index>{{name}}</option>\n                      </select>\n                    </li> \n                  </template>\n                  <template v-else>\n                    <li>\n                      <label for="ctp_broker" >\u7ECF\u6D4E\u516C\u53F8\u4EE3\u7801</label>\n                      <input  id="ctp_broker" v-model="ctp_broker">\n                    </li>\n                    <li>\n                      <label for="ctp_user" >\u7528\u6237\u4EE3\u7801</label>\n                      <input  id="ctp_user" v-model="ctp_user">\n                    </li>\n                    <li>\n                      <label for="ctp_investor" >\u6295\u8D44\u8005ID</label>\n                      <input  id="ctp_investor" v-model="ctp_investor">\n                    </li>\n                    <li>\n                      <label for="host" >TB_IP</label>\n                      <input  id="host" v-model="host">\n                    </li>\n                    <li>\n                      <label for="port" >TB_PORT</label>\n                      <input  id="port" v-model="port">\n                    </li>\n                  </template> \n                </ul>  \n            </ul>\n            <div class="buttons">\n              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>\u53D6\u6D88</button>\n              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>\u786E\u5B9A</button>\n            </div>\n          </form>\n        ',
        methods: {
          btn_submit: function btn_submit() {
            var _this = this;
            $.startLoading('正在提交...');
            if (!self.isloarding) {
              self.isloarding = true;
              $.ajax({
                url: '/bms-pub/product/add_base',
                type: 'post',
                data: {
                  channel: _this.channel,
                  security_id: _this.security_id,
                  name: _this.name,
                  account: _this.account,
                  market: _this.market,
                  stock_type: _this.stock_type,
                  host: _this.host,
                  port: _this.port,
                  ctp_broker: _this.ctp_broker,
                  ctp_user: _this.ctp_user,
                  ctp_investor: _this.ctp_investor
                },
                success: function success(_ref14) {
                  var msg = _ref14.msg,
                      code = _ref14.code,
                      data = _ref14.data;

                  if (code == 0) {
                    self.isloarding = false;
                    $.omsAlert('添加成功');
                    $.clearLoading();
                    _this.$parent.close();
                  } else {
                    self.isloarding = false;
                    //$.omsAlert(msg)
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function error() {
                  self.isloarding = false;
                  $.omsAlert('添加失败');
                  $.clearLoading();
                  _this.$parent.close();
                },
                complete: function complete() {
                  system.getSystemList();
                }
              });
            }
          },
          btn_cancel: function btn_cancel() {
            this.$parent.close();
          }
        }
      });

      this.$confirm({
        title: '添加账户',
        content: contentChild,
        closeIcon: true
      });
    }
  },
  mounted: function mounted() {
    var self = this;
    $.ajax({
      url: '/bms-pub/product/securities_map',
      data: {
        type: 'pb'
      },
      success: function success(_ref15) {
        var code = _ref15.code,
            msg = _ref15.msg,
            data = _ref15.data;

        if (0 == code) {
          self.securities_map_pb = data;
        }
      },
      error: function error() {
        $.omsAlert('网络异常，请重试');
      }
    });
    $.ajax({
      url: '/bms-pub/product/securities_map',
      data: {
        type: 'tdx'
      },
      success: function success(_ref16) {
        var code = _ref16.code,
            msg = _ref16.msg,
            data = _ref16.data;

        if (0 == code) {
          self.securities_map_tdx = data;
        }
      },
      error: function error() {
        $.omsAlert('网络异常，请重试');
      }
    });
  }
});
system.getSystemList();
setInterval(function () {
  if (system.systemList.length > 0) {
    var base_ids_arr = [];
    system.systemList.forEach(function (e) {
      // e.web_checked = false;
      base_ids_arr.push(e.id);
    });
    system.getLoginStatus(system.systemList, base_ids_arr.join(','));
  } else {
    system.getSystemList();
  }
}, 1000 * 5);
//# sourceMappingURL=page.js.map
