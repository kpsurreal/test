// 系统维护页面
let system = new Vue({
  el: '#system_maintenance',
  data: {
    systemList: [],
    checked_all: false, //是否全选
    // autoLoginShow:['开','关'],
    // autoBaseShow:['启用','禁用'],
    autoLoginShow:{true:{text:'开',value:1},false:{text:'关',value:0}},
    autoBaseShow:{true:{text:'启用',value:1},false:{text:'禁用',value:0}},
    isloarding:false, //判断当前页面是否发送请求  false 时未发送请求,
    securities_map_pb:{},
    securities_map_tdx:{}

  },
  computed: {
    selected_account_arr: function(){
      let arr = [];
      this.systemList.forEach(function(e){
        if (e.web_checked) {
          arr.push(e);
        }
      })
      return arr;
    }
  },
  watch: {
    checked_all: function () {
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
    getSystemList: function(){
      var self = this;
      if(!this.isloarding){
        this.isloarding = true;
        $.ajax({
          // url: window.REQUEST_PREFIX + '/product/base_lists?format=json',
          url: '/bms-pub/product/base_list',
          type: 'get',
          data: {
          },
          success: function({code, msg, data}){
            if (0 == code) {
              let base_ids_arr = [];
              data.forEach(function(e){
                e.web_checked = false;
                base_ids_arr.push(e.id);
                //添加类型
                if(e.channel==0){//通达信
                  e.type = "tdx";
                }
                if(e.channel == 1 || e.channel == 2 || e.channel == 3 || e.channel == 4 || e.channel == 5){//pb
                  e.type = "pb";
                }

                if(e.channel == 100){
                  e.type = 'ctp';
                }
              });
              self.isloarding = false;
              self.getLoginStatus(data, base_ids_arr.join(','));
            }else{
              $.omsAlert(msg);
              self.isloarding = false;
            }
          },
          error: function(){
            $.omsAlert('网络异常，请重试');
            self.isloarding = false;
          }
        })
      }
    },
    getModifyAccountName: function () { 
      //修改账户名称时需要请求的ajax
      // if ($("#account_name").val().length > 10) {
      //   $.omsAlert('账户名称不得超过10个字');
      //   return false;
      // }
      return '/bms-pub/product/edit_account_name';
    },
    getLoginStatus: function(systemList, base_ids){
      var self = this;
      if(!this.isloarding){
        this.isloarding = true;
        $.ajax({
          url: '/bms-pub/system/sec_login_status',
          type: 'get',
          data: {
            base_id: base_ids
          },
          success: function({code, msg, data}){
            if (0 == code) {
              systemList.forEach(function(e){
                e.login_status = data[e.id] ? !data[e.id].code : false;
                e.login_msg = data[e.id] ? data[e.id].msg : '';
              })
              self.systemList = systemList;
              self.isloarding = false;
            }else{
              // $.omsAlert(msg)
              // 尽管查询错误，也显示列表
              self.isloarding = false;
              systemList.forEach(function(e){
                e.login_status = false;
                e.login_msg = msg;
              })
              self.systemList = systemList;
            }
          },
          error: function(){
            $.omsAlert('网络异常，请重试')
            self.isloarding = false;
          }
        })
      }
    },
    showLoginStatus: function(v){
      return (true == v) ? '已登录' : '未登录';
    },
    // showBaseStatus: function(v){
    //   return (true == v) ? '已启用' : '已禁用';
    // },
    // checkStatus: function(){
    //   return v
    // },
    showStockType(v){
      if(v == 0){
        return "股票";
      }
      if(v == 1){
        return "期货";
      }
    },
    showMarket(v){
      if(v == 0){
        return "A股";
      }
      if(v == 1){
        return "港股通";
      }
    },
    showChannel(v){
      if(v == 0){
        return "通达信账户";
      }
      if(v == 1){
        return "恒生PB";
      }
      if(v == 2){
        return "金证";
      }
      if(v == 3){
        return "IMS";
      }
      if(v == 4){
        return "迅投";
      }
      if(v == 5){
        return 'O32'
      }
      if(v == 100){
        return "CTP";
      }
    },
    getsecuritiesType: function(id){
      if (/pb/i.test(id)) {
        return 'PB账户';
      }else{
        return '账户';
      }
    },
    doChgAutoLogin: function(auto_login,data,index){

      if(!this.isloarding){
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
          success: function({msg, code, data}){
            if(code == 0 ){
              $.omsAlert('修改成功');
              $.clearLoading();
              self.isloarding = false;
            }else{
              $.omsAlert(msg);
              self.systemList[index].auto_login = !auto_login;
              $.clearLoading();
              self.isloarding = false;
            }

          },
          error: function(){
            $.omsAlert('网络异常，请重试');
            self.systemList[index].auto_login = !auto_login;
            $.clearLoading();
            self.isloarding = false;
          }
        });
      }
    },
    doChgStatus: function(status,data,index){
      let self = this;
      $.startLoading();
      $.ajax({
        url: '/bms-pub/product/update_base_status',
        type: 'post',
        data: {
          base_id: data.id,
          status: status  ? 1 : 0 //取反
        },
        success: function({msg, code, data}){

          if(code == 0 ){
            $.omsAlert('修改成功');
            $.clearLoading();
          }else{
            $.omsAlert(msg);
            self.systemList[index].status = !status;
            $.clearLoading();
          }
        },
        error: function(){
          $.clearLoading();
          $.omsAlert('网络异常，请重试');
        }
      });
    },
    setReportInfo(account){
      let self = this;
      let contentChild = Vue.extend({
        data(){
          return {
            base_id:account.id,
            account_name:account.account_name,
            vc_ip:'',
            vc_pc:'',
            vc_iip:'',
            vc_pi:'',
            vc_mac:'',
            vc_hd:'',
            vc_pcn:'',
            vc_cpu:'',
            vc_ser_no:'',
            vc_vol:'',
            vc_hostname:'',
          }
        },
        template:`
         <form class="vue-form">
            <table class="report">
              <thead>
                  <tr>
                      <th>所属于账户</th>
                      <th>{{account_name}}</th>
                  </tr>
              </thead>
              <tbody>
                  <tr>
                      <td>vc_ip:</td>
                      <td><input type="text" placeholder="请输入" v-model="vc_ip"/></td>
                  </tr>
                  <tr>
                      <td>vc_pc:</td>
                      <td><input type="text" placeholder="请输入" v-model="vc_pc"/></td>
                  </tr>
                  <tr>
                      <td>vc_iip:</td>
                      <td><input type="text" placeholder="请输入" v-model="vc_iip"/></td>
                  </tr>
                  <tr>
                      <td>vc_pi:</td>
                      <td><input type="text" placeholder="请输入" v-model="vc_pi"/></td>
                  </tr>
                  <tr>
                      <td>vc_mac:</td>
                      <td><input type="text" placeholder="请输入" v-model="vc_mac"/></td>
                  </tr>
                  <tr>
                      <td>vc_hd:</td>
                      <td><input type="text" placeholder="请输入" v-model="vc_hd"/></td>
                  </tr>
                  <tr>
                      <td>vc_pcn:</td>
                      <td><input type="text" placeholder="请输入" v-model="vc_pcn"/></td>
                  </tr>
                    <tr>
                      <td>vc_cpu:</td>
                      <td><input type="text" placeholder="请输入" v-model="vc_cpu"/></td>
                  </tr>
                    <tr>
                      <td>vc_ser_no:</td>
                      <td><input type="text" placeholder="请输入" v-model="vc_ser_no"/></td>
                  </tr>
                    <tr>
                      <td>vc_vol:</td>
                      <td><input type="text" placeholder="请输入" v-model="vc_vol"/></td>
                  </tr>
                    <tr>
                      <td>vc_hostname:</td>
                      <td><input type="text" placeholder="请输入" v-model="vc_hostname"/></td>
                  </tr>
              </tbody>
          </table>
            <div class="buttons">
              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>取消</button>
              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>确定</button>
            </div>
          </form>
        `,
        methods:{
          btn_submit(){
            var _this = this;
            $.startLoading('正在提交...');
            if(!self.isloarding){
                self.isloarding = true;
                $.ajax({
                url: '/bms-pub/product/edit_record_info',
                type: 'post',
                data: {
                  base_id: account.id,
                  type:account.type,
                  vc_ip:this.vc_ip,
                  vc_pc:this.vc_pc,
                  vc_iip:this.vc_iip,
                  vc_pi:this.vc_pi,
                  vc_mac:this.vc_mac,
                  vc_hd:this.vc_hd,
                  vc_pcn:this.vc_pcn,
                  vc_cpu:this.vc_cpu,
                  vc_ser_no:this.vc_ser_no,
                  vc_vol:this.vc_vol,
                  vc_hostname:this.vc_hostname,
                },
                success: function({msg, code, data}){

                  if(code == 0){
                    self.isloarding = false;
                    $.omsAlert('修改成功')
                    $.clearLoading();
                    _this.$parent.close();
                  }else{
                    self.isloarding = false;
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function(){
                  self.isloarding = false;
                  $.omsAlert('修改失败')
                  $.clearLoading();
                  _this.$parent.close();
                }
              })
            }

          },
          btn_cancel(){
            this.$parent.close();
          }
        },
        mounted(){
            var _this = this;
            $.startLoading('正在获取...');
            if(!self.isloarding){
                self.isloarding = true;
                $.ajax({
                url: "/bms-pub/product/get_record_info",
                type: 'get',
                data: {
                  base_id: account.id,
                  type:account.type
                },
                success: function({msg, code, data}){
                  if(code == 0){
                    self.isloarding = false;
                    // $.omsAlert('获取成功');
                    for(let key in data){
                      _this[key] = data[key];
                    }
                    $.clearLoading();
                  }else{
                    self.isloarding = false;
                    //$.omsAlert(msg)
                    $.omsAlert(msg);
                    $.clearLoading();
                  }

                },
                error: function(){
                  self.isloarding = false;
                  $.omsAlert('获取失败')
                  $.clearLoading();
                }
              })
            }
        }
      });

      this.$confirm({
          title: '客户数据修改',
          content:contentChild,
          closeIcon: true,
      });
    },
    setAccountInfo(account){
      let self = this;
      let pb_options = [];
      let tdx_options = [];

      Object.keys(this.securities_map_pb).forEach(function(e){
        pb_options.push({
          label: self.securities_map_pb[e],
          value: e
        });
      });
      Object.keys(this.securities_map_tdx).forEach(function(e){
        tdx_options.push({
          label: self.securities_map_tdx[e],
          value: e
        });

      });
      let stockTypeOption = ['股票','期货'];
      let marketOption = ['A股','港股通'];
      let channelOption = [{name:'通达信账户',value:0},{name:'恒生PB',value:1},{name:'金证',value:2},{name:'IMS',value:3},{name:'迅投',value:4},{name:'CTP',value:100}];
      let contentChild = Vue.extend({
        data(){
          return {
            pb_options:pb_options,
            tdx_options:tdx_options,
            stockTypeOption:stockTypeOption,
            marketOption:marketOption,
            channelOption:channelOption,
            channel:account.channel,
            stock_type:account.stock_type,
            market:account.market,
            security_id:account.securities_id,
            account_id:account.account_id,
            host:account.server_host,
            port:account.server_port,
            ctp_broker:account.ctp_broker,
            ctp_user:account.ctp_user,
            ctp_investor:account.ctp_investor,
            name:account.name,
            type:account.type,
            base_id:account.id,
          }
        },
        template:`
         <form class="vue-form">
            <ul class="vue_page_ul">
                <ul class="vue_page_ul">
                  <li>
                    <label for="channel" >系统类型</label>
                    <select  name="channel" placeholder="请输入系统类型" v-model="channel">
                      <option  v-for="item in channelOption" :value=item.value>{{item.name}}</option>
                    </select>
                  </li>
                  <li>
                    <label for="name" >账户名称</label>
                    <input  id="name" placeholder="请输入账户名称" v-model="name">
                  </li>
                  <template v-if="channel !=100">
                    <li>
                        <label for="account_id" >账户号码</label>
                        <input  id="account_id" v-model="account_id" placeholder="请输入账户号码">
                    </li>
                    <li>
                      <label for="security_id" >券商名称</label>
                      <select name="security_id" placeholder="请输入券商名称" v-model="security_id">
                        <option   v-for="tdx,index in tdx_options" :value=tdx.value>{{tdx.label}}</option>
                      </select>
                    </li>
                    <li>
                      <label for="host" >TB_IP</label>
                      <input  id="host" v-model="host" placeholder="请输入TB服务器ID">
                    </li>
                    <li>
                      <label for="port" >TB_PORT</label>
                      <input  id="port" v-model="port" placeholder="请输入TB服务器端口">
                    </li>
                    <li>
                      <label for="stock_type" >资产类型</label>
                      <select name="stock_type" placeholder="请输入资产类型" v-model="stock_type" >
                        <option  v-for="stockType,index in stockTypeOption" :value=index>{{stockType}}</option>
                      </select>
                    </li>
                    <li>
                      <label for="market" >市场区域</label>
                      <select name="market" placeholder="请输入市场区域" v-model="market">
                         <option  v-for="name,index in marketOption" :value=index>{{name}}</option>
                      </select>
                    </li> 
                  </template>
                  <template v-else>
                    <li>
                      <label for="ctp_broker" >经济公司代码</label>
                      <input  id="ctp_broker" v-model="ctp_broker" placeholder="请输入经济公司代码">
                    </li>
                    <li>
                      <label for="ctp_user" >用户代码</label>
                      <input  id="ctp_user" v-model="ctp_user">
                    </li>
                    <li>
                      <label for="ctp_investor" >投资者ID</label>
                      <input  id="ctp_investor" v-model="ctp_investor" placeholder="请输入投资者ID">
                    </li>
                    <li>
                      <label for="host" >TB_IP</label>
                      <input  id="host" v-model="host" placeholder="请输入TB服务器ID">
                    </li>
                    <li>
                      <label for="port" >TB_PORT</label>
                      <input  id="port" v-model="port" placeholder="请输入TB服务器端口">
                    </li>
                  </template> 
                </ul>  
            </ul>
            <div class="buttons">
              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>取消</button>
              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>确定</button>
            </div>
          </form>
        `,
        methods:{

          btn_submit(){
            //获取最新type
            if(this.channel==0){//通达信
              this.type = "tdx";
            }
            if(this.channel == 1 || this.channel == 2 || this.channel == 3 || this.channel == 4){//pb
              this.type = "pb";
            }
            if(this.channel == 100){
              this.type = 'ctp';
            }
            var _this = this;
            $.startLoading('正在提交...');
            if(!self.isloarding){
                self.isloarding = true;
                $.ajax({
                url: '/bms-pub/product/edit_base',
                type: 'post',
                data: {
                  base_id:_this.base_id,
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
                  type:_this.type
                },
                success: function({msg, code, data}){

                  if(code == 0){
                    self.isloarding = false;
                    $.omsAlert('修改成功')
                    $.clearLoading();
                    _this.$parent.close();
                  }else{
                    self.isloarding = false;
                    //$.omsAlert(msg)
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function(){
                  self.isloarding = false;
                  $.omsAlert('修改失败')
                  $.clearLoading();
                  _this.$parent.close();
                }
              })
            }

          },
          btn_cancel(){
            this.$parent.close();
          }
        }
      });

      this.$confirm({
          title: '账户信息',
          content:contentChild,
          closeIcon: true,
      });

    },
    setBrokerInfo(account){

      let self = this;
      let contentChild = Vue.extend({
        data(){
          return {
            type:account.channel,
            jy_account:'',
            trader_id:'',
            account:'',
            sh_a_code:'',
            sz_a_code:'',
            seat_id_sh:'',
            seat_id_sz:'',
            host:'',
            port:'',
            sec_qry_type:'',
            base_id:account.id,
            ssl_level:'',
            cert_fiel:'',
            cert_pwd:'',
            server_name:'',
            send_q_name:'',
            reserved:'',
            receive_q_name:'',
            ssl:'',
            cert_user_name:'',
            isloarding:false,
          }
        },
        template:`
         <form class="vue-form">
                <ul class="vue_page_ul">
                  <template v-if="type == '0' ">
                    <li>
                      <label for="host" >Trade_host</label>
                      <input  id="host" v-model="host" placeholder="请输入Trade_host">
                    </li>
                    <li>
                      <label for="port" >Trade_port</label>
                      <input  id="port" v-model="port" placeholder="请输入Trade_port">
                    </li>
                    <li>
                        <label for="account" >登录帐号</label>
                        <input  id="account" v-model="account" placeholder="请输入登录帐号">
                    </li>
                    <li>
                      <label for="jy_account" >交易账户</label>
                      <input  id="jy_account" v-model="jy_account" placeholder="请输入交易账户">
                    </li>
                    <li>
                      <label for="sz_a_code" >深圳股东代码</label>
                      <input  id="sz_a_code" v-model="sz_a_code" placeholder="请输入深圳股东代码">
                    </li>
                    <li>
                      <label for="sh_a_code" >上海股东代码</label>
                      <input  id="sh_a_code" v-model="sh_a_code" placeholder="请输入上海股东代码">
                    </li>
                  </template>
                  <template v-if="type == '1' || type == 5 || type == 3 || type == 4">
                    <li>
                      <label for="host" >Host:TB</label>
                      <input  id="host" v-model="host" placeholder="请输入Host:TB">
                    </li>
                    <li>
                      <label for="port" >Port:TB</label>
                      <input  id="port" v-model="port" placeholder="请输入Port:TB">
                    </li>
                    <li>
                        <label for="account" >登录帐号</label>
                        <input  id="account" v-model="account" placeholder="请输入登录帐号">
                    </li>
                    <li>
                      <label for="trader_id" >Trader_id</label>
                      <input  id="trader_id" v-model="trader_id" placeholder="请输入Trader_id">
                    </li>
                    <li>
                      <label for="sz_a_code" >深圳股东代码</label>
                      <input  id="sz_a_code" v-model="sz_a_code" placeholder="请输入深圳股东代码">
                    </li>
                    <li>
                      <label for="sh_a_code" >上海股东代码</label>
                      <input  id="sh_a_code" v-model="sh_a_code" placeholder="请输入上海股东代码">
                    </li>
                    <li>
                      <label for="seat_id_sz" >深圳席位代码</label>
                      <input  id="seat_id_sz" v-model="seat_id_sz" placeholder="请输入深圳席位代码">
                    </li>
                    <li>
                      <label for="seat_id_sh" >上海席位代码</label>
                      <input  id="seat_id_sh" v-model="seat_id_sh" placeholder="请输入上海席位代码">
                    </li>
                    <li>
                      <label for="sec_qry_type" >Sec_qry_type</label>
                      <input  id="sec_qry_type" v-model="sec_qry_type" placeholder="请输入Sec_qry_type">
                    </li>
                    <li>
                      <label for="sec_qry_type" >证书类型</label>
                      <input  id="sec_qry_type" v-model="ssl_level" placeholder="请输入证书类型">
                    </li>
                    <li>
                      <label for="sec_qry_type" >证书文件</label>
                      <input  id="sec_qry_type" v-model="cert_fiel" placeholder="请输入证书文件">
                    </li>
                    <li>
                      <label for="sec_qry_type" >证书密码</label>
                      <input  id="sec_qry_type" v-model="cert_pwd" placeholder="请输入证书密码">
                    </li>
                  </template>
                  <template v-if="type == '2' ">
                    <li>
                      <label for="host" >Host:TB</label>
                      <input  id="host" v-model="host" placeholder="请输入Host:TB">
                    </li>
                    <li>
                      <label for="port" >Port:TB</label>
                      <input  id="port" v-model="port" placeholder="请输入Port:TB">
                    </li>
                    <li>
                        <label for="account" >登录帐号</label>
                        <input  id="account" v-model="account" placeholder="请输入登录帐号">
                    </li>
                    <li>
                      <label for="trader_id" >Trader_id</label>
                      <input  id="trader_id" v-model="trader_id" placeholder="请输入Trader_id">
                    </li>
                    <li>
                      <label for="sz_a_code" >深圳股东代码</label>
                      <input  id="sz_a_code" v-model="sz_a_code" placeholder="请输入深圳股东代码">
                    </li>
                    <li>
                      <label for="sh_a_code" >上海股东代码</label>
                      <input  id="sh_a_code" v-model="sh_a_code" placeholder="请输入上海股东代码">
                    </li>
                    <li>
                      <label for="seat_id_sz" >深圳席位代码</label>
                      <input  id="seat_id_sz" v-model="seat_id_sz" placeholder="请输入深圳席位代码">
                    </li>
                    <li>
                      <label for="seat_id_sh" >上海席位代码</label>
                      <input  id="seat_id_sh" v-model="seat_id_sh" placeholder="请输入上海席位代码">
                    </li>
                    <li>
                      <label for="sec_qry_type" >Sec_qry_type</label>
                      <input  id="sec_qry_type" v-model="sec_qry_type" placeholder="请输入Sec_qry_type">
                    </li>
                    <li>
                      <label for="sec_qry_type" >服务名称</label>
                      <input  id="sec_qry_type" v-model="server_name" placeholder="请输入服务名称">
                    </li>
                    <li>
                      <label for="sec_qry_type" >发送服务名称</label>
                      <input  id="sec_qry_type" v-model="send_q_name" placeholder="请输入发送服务名称">
                    </li>
                    <li>
                      <label for="sec_qry_type" >保留信息</label>
                      <input  id="sec_qry_type" v-model="reserved" placeholder="请输入保留信息">
                    </li>
                    <li>
                      <label for="sec_qry_type" >接收服务名称</label>
                      <input  id="sec_qry_type" v-model="receive_q_name" placeholder="请输入接收服务名称">
                    </li>
                    <li>
                      <label for="sec_qry_type" >SSL信息</label>
                      <input  id="sec_qry_type" v-model="ssl" placeholder="请输入SSL信息">
                    </li>
                    <li>
                      <label for="sec_qry_type" >证书名称</label>
                      <input  id="sec_qry_type" v-model="cert_user_name" placeholder="请输入证书名称">
                    </li>
                  </template> 
                </ul>  
            <div class="buttons">
              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>取消</button>
              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>确定</button>
            </div>
          </form>
        `,
        methods:{
          btn_submit(){
            var _this = this;
            $.startLoading('正在提交...');
            if(!_this.isloarding){
                _this.isloarding = true;
                $.ajax({
                url: '/bms-pub/product/edit_sec_info',
                type: 'post',
                data: {
                  base_id:_this.base_id,
                  type:_this.type,
                  jy_account:_this.jy_account,
                  trader_id:_this.trader_id,
                  account:_this.account,
                  sh_a_code:_this.sh_a_code,
                  sz_a_code:_this.sz_a_code,
                  seat_id_sh:_this.seat_id_sh,
                  seat_id_sz:_this.seat_id_sz,
                  host:_this.host,
                  port:_this.port,
                  sec_qry_type:_this.sec_qry_type,
                  ssl_level:_this.ssl_level,
                  cert_fiel:_this.cert_fiel,
                  cert_pwd:_this.cert_pwd,
                  server_name:_this.server_name,
                  send_q_name:_this.send_q_name,
                  reserved:_this.reserved,
                  receive_q_name:_this.receive_q_name,
                  ssl:_this.ssl,
                  cert_user_name:_this.cert_user_name,
                },
                success: function({msg, code, data}){

                  if(code == 0){
                    _this.isloarding = false;
                    $.omsAlert('修改成功')
                    $.clearLoading();
                    _this.$parent.close();
                  }else{
                    _this.isloarding = false;
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function(){
                  _this.isloarding = false;
                  $.omsAlert('修改失败')
                  $.clearLoading();
                  _this.$parent.close();
                }
              })
            }

          },
          btn_cancel(){
            this.$parent.close();
          }
        },
        mounted(){
            var _this = this;
            $.startLoading('正在获取...');
            if(!_this.isloarding){
                _this.isloarding = true;
                $.ajax({
                url: "/bms-pub/product/get_sec_info",
                type: 'get',
                data: {
                  base_id: account.id,
                  type:account.type
                },
                success: function({msg, code, data}){
                  if(code == 0){
                    _this.isloarding = false;
                    // $.omsAlert('获取成功');
                    for(let key in data){
                      _this[key] = data[key];
                    }
                    $.clearLoading();
                  }else{
                    _this.isloarding = false;
                    //$.omsAlert(msg)
                    $.omsAlert(msg);
                    $.clearLoading();
                  }

                },
                error: function(){
                  _this.isloarding = false;
                  $.omsAlert('获取失败')
                  $.clearLoading();
                }
              })
            }
        }
      });

      this.$confirm({
          title: '券商信息',
          content:contentChild,
          closeIcon: true,
      });

    },
    setPassword(account){

      let self = this;
      let contentChild = Vue.extend({
        data(){
          return {
            new_passwd:'',
            tx_new_passwd:'',
            new_class:'hide',
            new_type:'password',
            tx_class:'hide',
            tx_type:'password',
            type:account.channel,

          }
        },
        template:`
         <form class="vue-form">
            <ul class="vue_page_ul">
              <li>
                <label for="new_passwd">交易密码</label>
                <input v-if="new_type == 'password'" id="new_passwd"  type="password" v-model="new_passwd">
                <input v-if="new_type == 'text'" id="new_passwd"  type="text" v-model="new_passwd">
                <span :class=new_class @click=toggleIconNew></span>
              </li>
              <li>
                <label for="tx_new_passwd">通信密码</label>
                <input v-if="tx_type == 'password'" id="tx_new_passwd"  type="password" v-model="tx_new_passwd">
                <input v-if="tx_type == 'text'" id="tx_new_passwd"  type="text" v-model="tx_new_passwd">
                <span :class=tx_class @click=toggleIconTx></span>
              </li>   
            </ul>
            <div class="buttons">
              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>取消</button>
              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>确定</button>
            </div>
          </form>
        `,
        methods:{
          toggleIconNew(){

            if(this.new_class == 'hide'){
              this.new_class = 'show';
              this.new_type = 'text';
            }else if(this.new_class == 'show'){
              this.new_class = 'hide';
              this.new_type = 'password';
            }
          },
          toggleIconTx(){
            if(this.tx_class == 'hide'){
              this.tx_class = 'show';
              this.tx_type = 'text';
            }else if(this.tx_class == 'show'){
              this.tx_class = 'hide';
              this.tx_type = 'password';
            }
          },
          btn_submit(){
            var _this = this;
            $.startLoading('正在提交...');
            if(!self.isloarding){
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
                success: function({msg, code, data}){

                  if(code == 0){
                    self.isloarding = false;
                    $.omsAlert('修改成功')
                    $.clearLoading();
                    _this.$parent.close();
                  }else{
                    self.isloarding = false;
                    //$.omsAlert(msg)
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function(){
                  self.isloarding = false;
                  $.omsAlert('修改失败')
                  $.clearLoading();
                  _this.$parent.close();
                }
              })
            }

          },
          btn_cancel(){
            this.$parent.close();
          }
        }
      });

      this.$confirm({
          title: '修改密码',
          content:contentChild,
          closeIcon: true,
      });


    },
    setProductInfo(account){
      let self = this;
      let contentChild = Vue.extend({
        data(){
          return {
            type:account.type,
            base_id:account.id,
            product_arr:[{}],
            name:'',
            product_id:'',
            base_id:account.id,
            isloarding:false,
          }
        },
        template:`
         <form class="vue-form">
            <template v-if="type != 'pb'">
            <ul class="vue_page_ul">
                <ul class="vue_page_ul">
                  <li>
                    <label for="name" >产品名称</label>
                    <input  id="name" v-model="name" placeholder="请输入产品名称">
                  </li>
                </ul>  
            </ul>
            </template>
            <template v-else>
              <table class="product">
                <thead>
                    <tr>
                        <th>序号</th>
                        <th>产品名称</th>
                        <th>产品编号</th>
                        <th>单元编号</th>
                        <th>组合编号</th>
                    </tr>
                </thead>
                <tbody>
                    <template v-for="item,index in product_arr">
                    <tr>
                        <td>{{index+1}}</td>
                        <td><input  v-model="item.name" placeholder="请输入产品名称"></td>
                        <td><input  v-model="item.fund_id" placeholder="请输入产品编号"></td>
                        <td><input  v-model="item.unit_id" placeholder="请输入单元编号"></td>
                        <td><input  v-model="item.combi_id" placeholder="请输入组合编号"></td>
                    </tr>
                    </template>
                    <tr><td></td><td></td><td></td><td></td><td><span @click="add_product_info">新增产品信息</span></td></tr>
                </tbody>
              </table>
            </template>
            <div class="buttons">
              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>取消</button>
              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>确定</button>
            </div>
          </form>
        `,
        methods:{
          btn_submit(){
            var _this = this;
            var product_arr;
            if(this.type != "pb"){
              product_arr = {"product_id":this.base_id,"name":this.name}
              product_arr = JSON.stringify(product_arr);
            }else{
              product_arr = this.product_arr;
              product_arr = JSON.stringify(product_arr);
            }
            $.startLoading('正在提交...');
            if(!self.isloarding){
                self.isloarding = true;
                $.ajax({
                url: '/bms-pub/product/modify_product',
                type: 'post',
                data: {
                  type:_this.type,
                  data:product_arr,
                  base_id:_this.base_id
                },
                success: function({msg, code, data}){
                  if(code == 0){
                    self.isloarding = false;
                    $.omsAlert('修改成功')
                    $.clearLoading();
                    _this.$parent.close();
                  }else{
                    self.isloarding = false;
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function(){
                  self.isloarding = false;
                  $.omsAlert('修改失败')
                  $.clearLoading();
                  _this.$parent.close();
                }
              })
            }

          },
          btn_cancel(){
            this.$parent.close();
          },
          add_product_info(){
            this.product_arr.push({})
          }
        },
        mounted(){
            var _this = this;
            $.startLoading('正在获取...');
            if(!self.isloarding){
                self.isloarding = true;
                $.ajax({
                url: "/bms-pub/product/product_info",
                type: 'get',
                data: {
                  base_id: account.id,
                  type:account.type
                },
                success: function({msg, code, data}){
                  if(code == 0){
                    self.isloarding = false;
                    // $.omsAlert('获取成功');

                    if(_this.type == 'tdx' || _this.type == "ctp"){
                      _this.name = data.name;
                      _this.product_id = data.product_id
                    }else{
                      if(data.length>0){
                        _this.product_arr = data;
                      }
                    }
                    self.isloarding = false;
                    $.clearLoading();
                  }else{
                    self.isloarding = false;
                    //$.omsAlert(msg)
                    $.omsAlert(msg);
                    $.clearLoading();
                  }

                },
                error: function(){
                  self.isloarding = false;
                  $.omsAlert('获取失败')
                  $.clearLoading();
                }
              })
            }
        }
      });

      this.$confirm({
          title: '产品信息',
          content:contentChild,
          closeIcon: true,
      });
    },
    addAccunt(){

      let self = this;
      let pb_options = [];
      let tdx_options = [];

      Object.keys(this.securities_map_pb).forEach(function(e){
        pb_options.push({
          label: self.securities_map_pb[e],
          value: e
        });
      });
      Object.keys(this.securities_map_tdx).forEach(function(e){
        tdx_options.push({
          label: self.securities_map_tdx[e],
          value: e
        });

      });
      let stockTypeOption = ['股票','期货'];
      let marketOption = ['A股','港股通'];
      let channelOption = [{name:'通达信账户',value:0},{name:'恒生PB',value:1},{name:'金证',value:2},{name:'IMS',value:3},{name:'迅投',value:4},{name:'O32',value:5},{name:'CTP',value:100}];
      let contentChild = Vue.extend({
        data(){
          return {
            pb_options:pb_options,
            tdx_options:tdx_options,
            stockTypeOption:stockTypeOption,
            marketOption:marketOption,
            channelOption:channelOption,
            channel:0,
            stock_type:0,
            market:0,
            security_id:tdx_options[0].value,
            account:'',
            host:'',
            port:'',
            ctp_broker:'',
            ctp_user:'',
            ctp_investor:'',
            name:''
          }
        },
        template:`
         <form class="vue-form">
            <ul class="vue_page_ul">
                <ul class="vue_page_ul">
                  <li>
                    <label for="channel" >系统类型</label>
                    <select  name="channel"  v-model="channel">
                      <option  v-for="item in channelOption" :value=item.value>{{item.name}}</option>
                    </select>
                  </li>
                  <li>
                    <label for="name" >账户名称</label>
                    <input  id="name" v-model="name">
                  </li>
                  <template v-if="channel !=100">
                    <li>
                      <label for="account" >账户号码</label>
                      <input  id="account" v-model="account">
                    </li>
                    <li>
                      <label for="security_id" >券商名称</label>
                      <select name="security_id"  v-model="security_id">
                        <option   v-for="tdx,index in tdx_options" :value=tdx.value>{{tdx.label}}</option>
                      </select>
                    </li>
                    <li>
                      <label for="host" >TB_IP</label>
                      <input  id="host" v-model="host">
                    </li>
                    <li>
                      <label for="port" >TB_PORT</label>
                      <input  id="port" v-model="port">
                    </li>
                    <li>
                      <label for="stock_type" >资产类型</label>
                      <select name="stock_type"  v-model="stock_type">
                        <option  v-for="stockType,index in stockTypeOption" :value=index>{{stockType}}</option>
                      </select>
                    </li>
                    <li>
                      <label for="market" >市场区域</label>
                      <select name="market" v-model="market">
                         <option  v-for="name,index in marketOption" :value=index>{{name}}</option>
                      </select>
                    </li> 
                  </template>
                  <template v-else>
                    <li>
                      <label for="ctp_broker" >经济公司代码</label>
                      <input  id="ctp_broker" v-model="ctp_broker">
                    </li>
                    <li>
                      <label for="ctp_user" >用户代码</label>
                      <input  id="ctp_user" v-model="ctp_user">
                    </li>
                    <li>
                      <label for="ctp_investor" >投资者ID</label>
                      <input  id="ctp_investor" v-model="ctp_investor">
                    </li>
                    <li>
                      <label for="host" >TB_IP</label>
                      <input  id="host" v-model="host">
                    </li>
                    <li>
                      <label for="port" >TB_PORT</label>
                      <input  id="port" v-model="port">
                    </li>
                  </template> 
                </ul>  
            </ul>
            <div class="buttons">
              <button type="button" class="vue-confirm__btns--cancel" style="float: right; background-color: rgb(204, 204, 204);" @click=btn_cancel>取消</button>
              <button type="button" class="vue-confirm__btns--submit" style="float: right; background-color: rgb(255, 222, 0);" @click=btn_submit>确定</button>
            </div>
          </form>
        `,
        methods:{
          btn_submit(){
            var _this = this;
            $.startLoading('正在提交...');
            if(!self.isloarding){
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
                success: function({msg, code, data}){
                  if(code == 0){
                    self.isloarding = false;
                    $.omsAlert('添加成功')
                    $.clearLoading();
                    _this.$parent.close();
                  }else{
                    self.isloarding = false;
                    //$.omsAlert(msg)
                    $.omsAlert(msg);
                    $.clearLoading();
                    _this.$parent.close();
                  }
                },
                error: function(){
                  self.isloarding = false;
                  $.omsAlert('添加失败')
                  $.clearLoading();
                  _this.$parent.close();
                },
                complete(){
                  system.getSystemList();
                }
              })
            }
          },
          btn_cancel(){
            this.$parent.close();
          }
        }
      });

      this.$confirm({
          title: '添加账户',
          content:contentChild,
          closeIcon: true,
      });
    }
  },
  mounted(){
    let self = this;
    $.ajax({
      url: '/bms-pub/product/securities_map',
      data: {
        type: 'pb'
      },
      success: function({code, msg, data}){
        if (0 == code) {
          self.securities_map_pb = data;
        }
      },
      error: function(){
        $.omsAlert('网络异常，请重试')
      }
    });
    $.ajax({
      url: '/bms-pub/product/securities_map',
      data: {
        type: 'tdx'
      },
      success: function({code, msg, data}){
        if (0 == code) {
          self.securities_map_tdx = data;
        }
      },
      error: function(){
        $.omsAlert('网络异常，请重试')
      }
    });
  },
  // components:{
  //   'vue-confirm-password':{
  //     template:`div`
  //   }

  // }
})
system.getSystemList();
setInterval(function(){
  if (system.systemList.length > 0) {
    let base_ids_arr = [];
    system.systemList.forEach(function(e){
      // e.web_checked = false;
      base_ids_arr.push(e.id);
    });
    system.getLoginStatus(system.systemList, base_ids_arr.join(','))
  }else{
    system.getSystemList();
  }
}, 1000 * 5);










