//场外资产页面js
function outsideAssetFn () {
  //头部  --  子组件
  Vue.component('asset-out-head', {
    props: ['product_list', 'product_info','product_id'],
    template: `
      <div class="asset_out_head">
        <ul class="asset_out_head_title">
          <li>
            <h1>场外资产</h1>
            <vue-selectize :options="options" :placeholder="'请先选择产品'" :value="value" v-on:input="chgSelected = ($event)"></vue-selectize>
          </li>
        </ul>
        <p class="asset_out_head_disc" v-if="product_list.length == 0">当前没有产品组，不支持场外资产录入</p>

      </div>
    `,
    data: function () {
      return {
        chgSelected: '',
        // popup: false,
        select_show: false,
        // sele_input_show: false,
        value: ''
      }
    },
    computed: {
      options: function(){  //将数据通过options添加到下拉框中
        var product_arr = [];
        this.product_list.forEach(function(e){
          var obj = {
            type: e.type,
            label: e.name,
            value: e.id
          }
          product_arr.push(obj);
        })
        return product_arr;
      },
      value: function () {//默认选中第一个账户
        return this.product_id;
      }
    },
    watch: { //数据监控
      chgSelected: function(){  //获取选中基金产品的id
        this.$emit('change_selected', this.chgSelected);
      }
    }
  })

  //录入弹窗
  Vue.component('asset-out-popup', {
    props: ['options_pro',"product_id", 'select_show', 'po_pup', 'product_name', 'chgTypeSelected', 'income_cash'],
    template: `
      <div class="asset-out-popup">
        <div class="asset-out-popup-content">
          <h2 class="asset-out-popup-content-title">{{getType()}}</h2>
          <p class="closeBtn" v-on:click="closeBtnFunc()">x</p>
          <table class="asset-out-popup-content-form">
            <thead>
            <tr>
              <td class="padd_bottom_20">所属产品组<span>*</span></td>
              <td style="position:relative;"><input type="text" disabled="disabled" :title="product_name" :value="product_name" class="change_product_input"/><span class="change_product_input_after"></span></td>
            </tr>
            </thead>
            <tbody v-if="chgTypeSelected == '1'">
              <tr>
                <td class="padd_bottom_10">定增股票<span>*</span></td>
                <td class="padd_bottom_10">
                  <vue-stock-search :custom_cls="'asset-out-popup-content-form-num'" :stock_input_id="stock_input_type_id" v-on:stock_id="stock_id = $event" v-on:stock_input="stock_input_type_id = $event"></vue-stock-search>
                </td>
              </tr>
              <tr>
                <td class="padd_bottom_10">数量<span>*</span></td>
                <td class="padd_bottom_10">
                  <div class="asset-out-popup-content-form-num"><input type="number" value="" placeholder="请输入数量" v-on:keydown="onlyParseIntNum()" class="stock_quantity_input"/>股</div>
                </td>
              </tr>
              <tr>
                <td class="padd_bottom_10">定增价格<span>*</span></td>
                <td class="padd_bottom_10">
                  <div class="asset-out-popup-content-form-num"><input type="number" value="" v-on:keydown="onlyParseFloatNum('.price_input')" placeholder="请输入价格" class="price_input"/>元</div>
                </td>
              </tr>
              <tr>
                <td class="padd_bottom_10">起始日期<span>*</span></td>
                <td class="padd_bottom_10">
                  <vue-zebra_date_picker v-on:clear="startDate = $event" :value="startDate" v-on:select="startDate = ($event)" ></vue-zebra_date_picker>
                </td>
              </tr>
              <tr>
                <td class="padd_bottom_10">解锁日期<span>*</span></td>
                <td class="padd_bottom_10">
                  <vue-zebra_date_picker :start_date_time="currentDate" :value="currentDate" v-on:select="currentDate = ($event)" ></vue-zebra_date_picker>
                </td>
              </tr>
              <tr>
                <td colspan="2" class="text-center-btn">
                  <button class="btn setByInputBtn"  v-on:click="setByInput()">确定</button>
                </td>
              </tr>
            </tbody>
            <tbody v-if="chgTypeSelected == '2'">
              <tr>
                <td class="padd_bottom_10">代码<span>*</span></td>
                <td class="padd_bottom_10"><input type="text" value="" placeholder="请输入证券代码" class="stock_code_input"/></td>
              </tr>
              <tr>
                <td class="padd_bottom_10">名称<span>*</span></td>
                <td class="padd_bottom_10"><input type="text" value="" placeholder="请输入名称" class="stock_name"/></td>
              </tr>
              <tr>
                <td class="padd_bottom_10">份额<span>*</span></td>
                <td class="padd_bottom_10"><input name="share" type="number" value="" placeholder="请输入份额" class="share"/></td>
              </tr>
              <tr>
                <td class="padd_bottom_10">市值<span>*</span></td>
                <td class="padd_bottom_10"><div class="asset-out-popup-content-form-num"><input type="number" value="" v-on:keydown="onlyParseFloatNum('.market_value')" placeholder="请输入市值" class="market_value"/>元</div></td>
              </tr>
              <tr>
                <td class="padd_bottom_10">浮盈率</td>
                <td class="padd_bottom_10"><div class="asset-out-popup-content-form-num"><input type="number" value="" v-on:keydown="onlyParseFloatNum('.profit_rate')" placeholder="请输入浮盈率" class="profit_rate"/>%</div></td>
              </tr>
              <tr>
                <td colspan="2" class="text-center-btn"><button class="btn" v-on:click="monetaryFundInput()">确定</button></td>
              </tr>
            </tbody>
            <tbody v-if="chgTypeSelected == '3'">
              <tr>
                <td class="padd_bottom_10">自动读取<span>*</span></td>
                <td class="padd_bottom_10">
                  <div class="asset-out-popup-content-form-num">
                    <form class="form_file">
                      <input style="display: block;" class="input-disabled-file" disabled="disabled" type="text" :value="income_cash && income_cash.read_url" placeholder="请录入估值表文件名"/>
                    </form>
                    <a class="input-btn" v-on:click="autoSwapInput()">读取</a>
                  </div>
                </td>
              </tr>
              <tr>
                <td class="padd_bottom_10">上传文件<span>*</span></td>
                <td class="padd_bottom_10">
                  <div class="asset-out-popup-content-form-num">
                    <form method="post" id="submit_file" target="iframeName" action="/task/uploadxls">
                      <input id="file-upload" name="file" type="file" value="" placeholder="请录入估值表文件名"/>
                    </form>
                    <a class="input-btn" v-on:click="incomeSwapInput()">上传</a>

                  </div>
                </td>
              </tr>
            </tbody>
            <tbody v-if="chgTypeSelected == '4'">
              <tr>
                <td class="padd_bottom_10">金额<span>*</span></td>
                <td class="padd_bottom_10"><div class="asset-out-popup-content-form-num"><input type="number" value="" v-on:keydown="onlyParseFloatNum('.amount')" placeholder="请录入金额" class="amount"/>元</div></td>
              </tr>
              <tr>
                <td>备注</td>
                <td><textarea placeholder="请录入备注" class="write_area"></textarea></td>
              </tr>
              <tr>
                <td colspan="2" class="text-center-btn"><button class="btn" v-on:click="cashInput()">确定</button></td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    `,
    data: function () {
      return {
        chgProSelected: '',
        // chgTypeSelected: 1,
        startDate: (function(){return moment().format('YYYY-MM-DD')})(),
        currentDate: '',
        stock_id: '', //股票id给后台传值
        stock_input_type_id: '', //辅助寻找input框中股票id的前6位
        options_type: [
          {label: '定增',value: '1'},
          {label: '场外货币基金', value: '2'},
          {label: '收益互换', value: '3'},
          {label: '现金', value: '4'}
        ]
      }
    },
    methods: {
      getType: function(){
        if (1 ==  this.chgTypeSelected) {
          return '定增录入'
        }else if(2 ==  this.chgTypeSelected){
          return '货币基金录入'
        }else if(3 ==  this.chgTypeSelected){
          return '收益互换录入'
        }else if(4 ==  this.chgTypeSelected){
          return '场外现金资产录入'
        }
        return '';
      },
      closeBtnFunc: function () {  //弹窗关闭按钮事件
        this.stock_id = '';
        this.stock_input_type_id = '';
        this.currentDate = '';
        if (this.po_pup == true) {
          this.$emit('change_popup', false);
        }
      },
      onlyParseIntNum: function () { //只可输入整数
        // if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8) {
        //   event.returnValue=true;
        // } else {
        //   event.returnValue=false;
        // }
      },
      onlyParseFloatNum: function (str) { //可输入整数和小数点，通过获取单独标签的value值来进行判断小数点的个数
        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 110 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {
          if (($(str).val().indexOf('.') != -1 && event.keyCode == 110) || ($(str).val().indexOf('.') != -1 && event.keyCode == 190)) {
            event.preventDefault();
            return;
          }
          event.returnValue=true;
        } else {
          event.returnValue=false;
        }
      },
      setByInput: function () {  //定增录入
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
        if (group_id == ''){
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
          success: function (res) {
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
          error: function () {
            $.omsAlert(res.msg);
          }
        })
      },
      monetaryFundInput: function () { //货币基金录入
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
        var profit_rate = $(".profit_rate").val()/100;
        var _this = this;
        if (group_id == ''){
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
          success: function (res) {
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
          error: function () {
            $.omsAlert(res.msg);
          }
        })
      },
      autoSwapInput: function(){//收益互换字段录入
        //产品组id
        if (this.product_id == '') {
          var group_id = this.chgProSelected;
        } else {
          var group_id = this.product_id;
        }
        var _this = this;
        //upload_file 标准上传数据流格式
        if (group_id == '') {
          $.omsAlert("产品组id不能为空")
          return false;
        }
        $.startLoading('正在读取');
        $.ajax({
          url: '/bms-pub/product/otc/income_swap/read',
          type: 'post',
          data: {
            group_id: group_id
          },
          success: function({code, msg, data}){
            if (0 == code) {
              _this.$root.doRefresh();
              $.clearLoading();
              $.omsAlert('读取成功');
            }else{
              $.clearLoading();
              $.omsAlert(msg);
            }
          },
          error: function(){
            $.clearLoading();
            $.omsAlert('网络异常，请重试')
          }
        })
      },
      incomeSwapInput: function () { //收益互换录入
        //产品组id
        if (this.product_id == '') {
          var group_id = this.chgProSelected;
        } else {
          var group_id = this.product_id;
        }
        var _this = this;
        //upload_file 标准上传数据流格式
        if (group_id == '') {
          $.omsAlert("产品组id不能为空")
          return false;
        }
        var form = new FormData(document.getElementById("submit_file"));

        var oFile = document.getElementById("submit_file").file.files[0];

        if (undefined == oFile) {
          $.omsAlert('请选择正确的文件');
          return false;
        }
        let reader = new FileReader();
        $.startLoading('正在读取');
        reader.onload = function (oFREvent) {
          $.ajax({
            url: '/task/uploadxls',
            // url: " {{ config('platform.utility_control_uri')}}"  + "/task/uploadxls",
            type: 'POST',
            data: form,
            processData: false,
            contentType: false,
            success: function (res) {
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
                  success: function (res) {
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
                  error: function () {
                    $.clearLoading();
                    $.omsAlert(res.msg);
                  }
                })
              } else {
                $.clearLoading();
                $.omsAlert(res.msg)
              }
            },
            error: function () {
              $.clearLoading();
              $.omsAlert('网络异常，请重试')
            }
          })
        };
        reader.onerror = function (oFREvent) {
          $.omsAlert('文件读取失败，请重试')
        };
        reader.readAsDataURL(oFile);
      },
      cashInput: function () { //现金录入
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
          success: function (res) {
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
          error: function () {
            $.omsAlert(res.msg);
          }
        });
      }
    },
    watch: { //数据监控
      chgProSelected: function(){  //获取选中基金产品的id
        this.$emit('change_pro_selected', this.chgProSelected);
      },
      chgTypeSelected: function(){  //获取选中基金产品的id
        this.$emit('change_type_selected', this.chgTypeSelected);
      },
      stock_id: function () { //定增股票id
        this.$emit('change_input_id', this.stock_id);
      }
    }
  })

  //主体  --  子组件
  Vue.component('asset-out-content', {
    mixins: [numberMixin], //在component.js中引入numberMixin插件名，就可以直接调用里面的插件内容numeralNumber
    props: ['product_info', 'product_id', 'product_name'],
    template: `
      <div class="asset_out_content">
        <div class="asset_out_content_set">
          <p>
            <span  v-html="'定增（市值：¥ '+ numeralNumber(set_by_markert(),2) + '）'"></span>
            <b class="trigale trigale_set" v-on:click="trigaleSet()"></b>
            <a v-on:click="clear_jconfirm = true;action_type = 1;" class="bem-ui-btn" style="float: right;margin-right: 20px;">清空</a>
            <a v-on:click="popup = true;chgTypeSelected = 1;" class="bem-ui-btn" style="float: right;margin-right: 10px;">录入资产</a>
          </p>
          <table class="asset_out_content_set_table" v-show="trigale_set_table">
            <thead>
              <tr>
                <td class="padd_left">定增股票</td>
                <td class="padd_right_100">数量</td>
                <td class="padd_right">定增价格</td>
                <td class="padd_right_150">市值</td>
                <td class="padd_left padd_right_60">起始日期</td>
                <td class="padd_left">解锁日期</td>
                <td class="padd_right"></td>
              </tr>
            </thead>
            <tbody  v-for="private_placement in product_info.private_placement" v-if="product_info.private_placement.length > 0">
              <tr>
                <td class="padd_left">{{private_placement.stock_id}}&nbsp;&nbsp;{{private_placement.stock_name}}</td>
                <td class="padd_right_100">{{private_placement.volume}}</td>
                <td class="padd_right">{{numeralNumber(private_placement.stock_price,3)}}</td>
                <td class="padd_right_150">{{numeralNumber(private_placement.market_value,2)}}</td>
                <td class="padd_left padd_right_60">{{private_placement.start_date}}</td>
                <td class="padd_left">{{private_placement.unlock_date}}</td>
                <td class="padd_right">
                  <a class="modify" v-on:click="changeModify(private_placement)">修改</a>
                  <a class="deleted" v-on:click="doSetByDelete(private_placement.id)">删除</a>
                </td>
              </tr>
              <tr class="asset_out_content_set_modify" v-show="change_id == private_placement.id">
                <td colspan="7">
                  <ul>
                    <li>
                      <span>数量</span>
                      <div>
                        <input type="number" v-model="change_val" v-on:keydown="onlyParseIntNum()"/>股
                      </div>
                    </li>
                    <li>
                      <span>定增价格</span>
                      <div>
                        <input type="number" v-model="change_price" v-on:keydown="onlyParseFloatNum(change_price)"/>元
                      </div>
                    </li>
                    <li>
                      <span>起始日期</span>
                      <vue-zebra_date_picker v-on:clear="change_start_time = $event" :value="change_start_time" v-on:select="change_start_time = ($event)"></vue-zebra_date_picker>
                    </li>
                    <li>
                      <span>解锁日期</span>
                      <vue-zebra_date_picker v-on:clear="change_unlock_time = $event" :value="change_unlock_time" v-on:select="change_unlock_time = ($event)" ></vue-zebra_date_picker>
                    </li>
                    <li>
                      <button class="preservation" v-on:click="setByPreser(private_placement.id)">保存</button>
                      <button class="cancel" v-on:click="change_id = ''">取消</button>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
            <tbody v-if="product_info.private_placement.length == 0">
              <tr>
                <td colspan="7" style="text-align:left;padding-left:10px;"><p>没有相关数据</p></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="asset_out_content_set">
          <p>
            <span v-html="'货币基金（市值：¥ ' + numeralNumber(currency_markert(),2) + '）'"></span>
            <b class="trigale trigale_currenty_table" v-on:click="trigaleCurrenty()"></b>
            <a v-on:click="clear_jconfirm = true;action_type = 2;" class="bem-ui-btn" style="float: right;margin-right: 20px;">清空</a>
            <a v-on:click="popup = true;chgTypeSelected = 2;" class="bem-ui-btn" style="float: right;margin-right: 10px;">录入资产</a>
          </p>
          <table class="asset_out_content_set_table" v-show="trigale_currenty_table">
            <thead>
              <tr>
                <td class="padd_left">代码</td>
                <td class="padd_left">名称</td>
                <td class="padd_right">份额</td>
                <td class="padd_right">市值</td>
                <td class="padd_right">浮盈率</td>
                <td class="padd_right"></td>
              </tr>
            </thead>
            <tbody  v-for="monetary_fund in product_info.monetary_fund" v-if="product_info.monetary_fund.length > 0">
              <tr>
                <td class="padd_left">{{monetary_fund.stock_id}}</td>
                <td class="padd_left">{{monetary_fund.stock_name}}</td>
                <td class="padd_right">{{numeralNumber(monetary_fund.volume,0)}}</td>
                <td class="padd_right">{{numeralNumber(monetary_fund.market_value,2)}}</td>
                <td class="padd_right" :class="{red: checkPositive(monetary_fund.profit_rate), green: checkNegative(monetary_fund.profit_rate)}">{{numeralNumber(monetary_fund.profit_rate*100,2)+ '%'}}</td>
                <td class="padd_right">
                  <a class="modify" v-on:click="change_asset_id = monetary_fund.id, change_asset_market = monetary_fund.market_value, change_asset_profit = monetary_fund.profit_rate*100, change_asset_volume = monetary_fund.volume">修改</a>
                  <a class="deleted" v-on:click="doMonetaryDelete(monetary_fund.id)">删除</a>
                </td>
              </tr>
              <tr class="asset_out_content_set_modify" v-show="change_asset_id == monetary_fund.id">
                <td colspan="7">
                  <ul>
                    <li>
                      <span>份额</span>
                      <div>
                        <input type="number" v-model="change_asset_volume" v-on:keydown="onlyParseFloatNum(change_asset_volume)"/>
                      </div>
                    </li>
                    <li>
                      <span>市值</span>
                      <div>
                        <input type="number" v-model="change_asset_market" v-on:keydown="onlyParseFloatNum(change_asset_market)"/>元
                      </div>
                    </li>
                    <li>
                      <span>浮盈率</span>
                      <div>
                        <input type="number" v-model="change_asset_profit" v-on:keydown="onlyParseFloatNum(change_asset_profit)"/>%
                      </div>
                    </li>
                    <li>
                      <button class="preservation" v-on:click="monetaryPreser(monetary_fund.id)">保存</button>
                      <button class="cancel" v-on:click="change_asset_id = ''">取消</button>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
            <tbody v-if="product_info.monetary_fund.length == 0">
              <tr>
                <td colspan="7" style="text-align:left;padding-left:10px;"><p>没有相关数据</p></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="asset_out_content_set">
          <p>
            <span v-html="'收益互换（市值：¥ ' + numeralNumber(income_swap_markert(),2) + '）'"></span>
            <b class="trigale trigale_income_table" v-on:click="trigaleIncome()"></b>
            <span class="dot-tip exclamation" v-show="product_info.income_cash && product_info.income_cash.err_info != '' && product_info.income_cash.err_info != undefined" style="margin-right: 10px;vertical-align: bottom;">
              <div v-on:mouseover="language_show()" v-on:mouseout="language_hide()">
                <em>i</em>
                <span class="str">
                  <span class="msg">
                    <span v-text="product_info.income_cash.err_info"></span>
                  </span>
                </span>
              </div>
            </span>
            <a v-on:click="clear_jconfirm = true;action_type = 3;" class="bem-ui-btn" style="float: right;margin-right: 20px;">清空</a>
            <a v-on:click="popup = true;chgTypeSelected = 3;" class="bem-ui-btn" style="float: right;margin-right: 10px;">录入资产</a>
          </p>
          <table class="asset_out_content_set_table asset_out_content_set_body" v-show="trigale_income_table">
            <thead>
              <tr>
                <td class="padd_left">客户号</td>
                <td class="padd_left">清单编号</td>
                <td class="padd_left">估值日期</td>
                <td class="padd_left">证券代码</td>
                <td class="padd_left">证券名称</td>
                <td class="padd_left">持仓类型</td>
                <td class="padd_right">标的数量</td>
                <td class="padd_right">交易货币</td>
                <td class="padd_right">期初价格</td>
                <td class="padd_right">当前价格</td>
                <td class="padd_right">涨跌幅</td>
                <td class="padd_right">总成本</td>
                <td class="padd_right">累计实现收益</td>
                <td class="padd_right">总浮动盈亏</td>
                <td class="padd_right">市值</td>
              </tr>
            </thead>
            <tbody v-for="income_swap in product_info.income_swap" v-if="product_info.income_swap.length > 0" >
              <tr>
                <td class="padd_left">{{income_swap.guest_id}}</td>
                <td class="padd_left">{{income_swap.list_number}}</td>
                <td class="padd_left">{{income_swap.valuation_date}}</td>
                <td class="padd_left">{{income_swap.security_id}}</td>
                <td class="padd_left">{{income_swap.security_name}}</td>
                <td class="padd_left" v-if="income_swap.position_type == ''">--</td>
                <td class="padd_left" v-else>{{income_swap.position_type}}</td>
                <td class="padd_right">{{income_swap.hold_volume}}</td>
                <td class="padd_right">{{income_swap.currency}}</td>
                <td class="padd_right">{{numeralNumber(income_swap.begin_price,3)}}</td>
                <td class="padd_right">{{numeralNumber(income_swap.current_price,3)}}</td>
                <td class="padd_right" :class="{red: checkPositive(income_swap.rise_fall_rate), green: checkNegative(income_swap.rise_fall_rate)}">{{numeralNumber(income_swap.rise_fall_rate*100,2)+ '%'}}</td>
                <td class="padd_right">{{numeralNumber(income_swap.total_cost,2)}}</td>
                <td class="padd_right">{{numeralNumber(income_swap.accumulate_profit,2)}}</td>
                <td class="padd_right">{{numeralNumber(income_swap.total_profit,2)}}</td>
                <td class="padd_right">{{numeralNumber(income_swap.market_value,2)}}</td>
              </tr>
            </tbody>
            <tbody v-if="product_info.income_swap.length == 0">
              <tr>
                <td colspan="15" style="text-align:left;padding-left:10px;"><p>没有相关数据</p></td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="asset_out_content_set">
          <p>
            <span>场外现金资产</span>
            <b class="trigale trigale_asset_table" v-on:click="trigaleAsset()"></b>
            <a v-on:click="clear_jconfirm = true;action_type = 4;" class="bem-ui-btn" style="float: right;margin-right: 20px;">清空</a>
            <a v-on:click="popup = true;chgTypeSelected = 4;" class="bem-ui-btn" style="float: right;margin-right: 10px;">录入资产</a>
          </p>
          <table class="asset_out_content_set_table" v-show="trigale_asset_table">
            <thead>
              <tr>
                <td class="padd_left">金额</td>
                <td class="padd_left">备注</td>
                <td class="padd_right"></td>
              </tr>
            </thead>
            <tbody v-for="cash in product_info.cash" v-if="product_info.cash.length > 0">
              <tr>
                <td class="padd_left">{{numeralNumber(cash.amount,2)}}</td>
                <td class="padd_left" v-if="cash.remark != ''">{{cash.remark}}</td>
                <td class="padd_left" v-else>--</td>
                <td class="padd_right"><a class="modify" v-on:click="change_cash_id = cash.id, change_cash_val = cash.amount, change_cash_remark = cash.remark">修改</a>   <a class="deleted" v-on:click="doCashDelete(cash.id)">删除</a></td>
              </tr>
              <tr class="asset_out_content_set_modify" v-show="change_cash_id == cash.id">
                <td colspan="7">
                  <ul>
                    <li>
                      <span>金额</span>
                      <div>
                        <input type="number" v-model="change_cash_val" v-on:keydown="onlyParseFloatNum(change_cash_val)"/>元
                      </div>
                    </li>
                    <li>
                      <span>备注</span>
                      <div style="width:350px;">
                        <input type="text" v-model="change_cash_remark" class="cash_remark" :placeholder="'最多不超过50个字'"/>
                      </div>
                    </li>
                    <li>
                      <button class="preservation" v-on:click="changePreser(cash.id)">保存</button>
                      <button class="cancel" v-on:click="change_cash_id = ''">取消</button>
                    </li>
                  </ul>
                </td>
              </tr>
            </tbody>
            <tbody v-if="product_info.cash.length == 0">
              <tr>
                <td colspan="7" style="text-align:left;padding-left:10px;"><p>没有相关数据</p></td>
              </tr>
            </tbody>
          </table>
        </div>
        <asset_jconfirm v-show="jconfirm"></asset_jconfirm>
        <clear_jconfirm v-show="clear_jconfirm" :product_name="product_name" :action_type="action_type" v-on:doHide="clear_jconfirm = false;" v-on:doClear="doClear()"></clear_jconfirm>
        <asset-out-popup v-show="popup" :income_cash="product_info.income_cash" :product_name="product_name" :po_pup="popup" :product_id="product_id" :chgTypeSelected="chgTypeSelected" v-on:change_popup="popup = $event"></asset-out-popup>
      </div>
    `,
    data: function () {
      return {
        clear_jconfirm: false,
        action_type: 1,
        chgTypeSelected: 1,
        popup: false,
        asset_show: false,
        change_id: '',
        change_cash_id: '',
        change_asset_id: '',
        change_start_time: '',//起始时间
        change_unlock_time: '',//解锁时间
        change_val: '',//定增数量
        change_price: '',//定增价格
        change_asset_market: '',//货币基金市值
        change_asset_profit: '', //货币基金浮盈率
        change_asset_volume: '',//货币基金份额
        change_cash_val: '',//场外现金
        change_cash_remark: '',
        trigale_set_table: true,
        trigale_currenty_table: true,
        trigale_income_table: true,
        trigale_asset_table: true,
        jconfirm: false
      }
    },
    methods: {
      language_show: function () {
        $(this.$el).find('.str').show();
        if ($(this.$el).find('.str .msg').css('width').split('px')[0] > 246) {
          $(this.$el).find('.str .msg').addClass('hover-tip-width');
        } else {
          $(this.$el).find('.str .msg').removeClass('hover-tip-width');
        }
      },
      language_hide: function () {
        $(this.$el).find('.str').hide();
        $(this.$el).find('.str .msg').removeClass('hover-tip-width');
      },
      doClear: function(){
        let _this = this;
        let url = '';
        if (1 == this.action_type) {
          url = '/bms-pub/product/otc/private_placement/clear';
        }else if(2 == this.action_type){
          url = '/bms-pub/product/otc/monetary_fund/clear';
        }else if(3 == this.action_type){
          url = '/bms-pub/product/otc/income_swap/clear';
        }else if(4 == this.action_type){
          url = '/bms-pub/product/otc/cash/clear';
        }

        $.ajax({
          url: url,
          type: 'post',
          data: {
            group_id: this.product_id
          },
          success: function({code, msg, data}){
            if (0 == code) {
              _this.clear_jconfirm = false;

              _this.$root.doRefresh();
            }else{
              $.omsAlert(msg)
            }
          },
          error: function(){
            $.omsAlert('网络异常，请重试')
          }
        })
      },
      checkPositive: function(num){  //比较数字大小
        return parseFloat(num) > 0;
      },
      checkNegative: function(num){ //比较数字大小
        return parseFloat(num) < 0;
      },
      onlyParseIntNum: function () { //只可输入整数
        // if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8) {
        //   event.returnValue=true;
        // } else {
        //   event.returnValue=false;
        // }
      },
      onlyParseFloatNum: function (str) { //可输入整数和小数点 ,直接通过input框中输入的数字的变化来进行小数点的数字判断
        //event.keyCode>=48 && event.keyCode<=57，代表主键盘0到9的数字
        //event.keyCode>=96 && event.keyCode<=105，代表小键盘0到9的数字
        //event.keyCode=8，代表BackSpace键
        //event.keyCode==110, event.keyCode==190，代表小键盘区和主键盘区的小数点
        var str = ''+str;
        if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105) || event.keyCode == 8 || event.keyCode == 110 || event.keyCode == 190 || event.keyCode == 189 || event.keyCode == 109) {
          //只允许输入一个小数点
          if ((str.indexOf('.') != -1 && event.keyCode == 110) || (str.indexOf('.') != -1 && event.keyCode == 190)) {
            event.preventDefault();
            return;
          }
          event.returnValue=true;
        } else {
          event.returnValue=false;
        }
      },
      changeModify: function (row) { //点击修改,传进一个数组，直接调用数组中的某些参数
        this.change_id = row.id;
        this.change_val = row.volume;
        this.change_price = row.stock_price;
        this.change_start_time = row.start_date;
        this.change_unlock_time = row.unlock_date;
      },
      trigaleSet: function () {  //定增点击展开与收缩
        if (this.trigale_set_table == true) {
          this.trigale_set_table = false;
          $(".trigale_set").css('transform', 'rotate(180deg)');
        } else if (this.trigale_set_table == false) {
          this.trigale_set_table = true;
          $(".trigale_set").css('transform', 'rotate(360deg)')
        }
      },
      trigaleCurrenty: function () { //货币 点击展开与收缩
        if (this.trigale_currenty_table == true) {
          this.trigale_currenty_table = false;
          $(".trigale_currenty_table").css('transform', 'rotate(180deg)');
        } else if (this.trigale_currenty_table == false) {
          this.trigale_currenty_table = true;
          $(".trigale_currenty_table").css('transform', 'rotate(360deg)')
        }
      },
      trigaleIncome: function () {  //收益互换点击  展开与收缩
        if (this.trigale_income_table == true) {
          this.trigale_income_table = false;
          $(".trigale_income_table").css('transform', 'rotate(180deg)');
        } else if (this.trigale_income_table == false) {
          this.trigale_income_table = true;
          $(".trigale_income_table").css('transform', 'rotate(360deg)')
        }
      },
      trigaleAsset: function () { //场外现金 点击  展开与收缩
        if (this.trigale_asset_table == true) {
          this.trigale_asset_table = false;
          $(".trigale_asset_table").css('transform', 'rotate(180deg)');
        } else if (this.trigale_asset_table == false) {
          this.trigale_asset_table = true;
          $(".trigale_asset_table").css('transform', 'rotate(360deg)')
        }
      },
      set_by_markert: function () {  //定增总市值
        var val = 0;
        this.product_info.private_placement.forEach(function (e) {
          val += parseFloat(e.market_value);
        })
        return val;
      },
      currency_markert: function () { //货币基金总市值
        var val = 0;
        this.product_info.monetary_fund.forEach(function (e) {
          val += parseFloat(e.market_value);
        })
        return val;
      },
      income_swap_markert: function () { //收益互换总市值
        var val = 0;
        this.product_info.income_swap.forEach(function (e) {
          if (e.exchange_rate != 0) {
            var market_value = e.exchange_rate * e.market_value;
            val += parseFloat(market_value);
          } else {
            val += parseFloat(e.market_value);
          }
        })
        return val;
      },
      doSetByDelete: function (id) { //定增删除
        var _this = this;
        _this.jconfirm = true;
        $('.custom-for-delete').off().on('click', '.closeIcon', function(){
          _this.clear_jconfirm = false;
          _this.jconfirm = false;
        }).on('click', '.vue-confirm__btns--submit', function(){
          _this.jconfirm = false;
          $.ajax({
            url: '/bms-pub/product/otc/private_placement/delete',
            type: 'POST',
            data: {
              id: id
            },
            success: function (res) {
              if (0 == res.code) {
                $.omsAlert('删除成功');
                asset_out.pageProductInfo(asset_out.product_id);
              } else {
                $.omsAlert(res.msg);
              }
            },
            error: function () {
              $.omsAlert('删除失败');
            }
          })
        });
      },
      doMonetaryDelete: function (id) { //货币删除
        var _this = this;
        _this.jconfirm = true;
        $('.custom-for-delete').off().on('click', '.closeIcon', function(){
          _this.clear_jconfirm = false;
          _this.jconfirm = false;
        }).on('click', '.vue-confirm__btns--submit', function(){
          _this.jconfirm = false;
          $.ajax({
            url: '/bms-pub/product/otc/monetary_fund/delete',
            type: 'POST',
            data: {
              id: id
            },
            success: function (res) {
              if (0 == res.code) {
                $.omsAlert('删除成功');
                asset_out.pageProductInfo(asset_out.product_id);
              } else {
                $.omsAlert(res.msg);
              }
            },
            error: function () {
              $.omsAlert('删除失败');
            }
          })
        })
      },
      doCashDelete: function (id) { //现金删除
        var _this = this;
        _this.jconfirm = true;
        $('.custom-for-delete').off().on('click', '.closeIcon', function(){
          _this.clear_jconfirm = false;
          _this.jconfirm = false;
        }).on('click', '.vue-confirm__btns--submit', function() {
          _this.jconfirm = false;
          $.ajax({
            url: '/bms-pub/product/otc/cash/delete',
            type: 'POST',
            data: {
              id: id
            },
            success: function (res) {
              if (0 == res.code) {
                $.omsAlert('删除成功');
                asset_out.pageProductInfo(asset_out.product_id);
              } else {
                $.omsAlert(res.msg);
              }
            },
            error: function () {
              $.omsAlert('删除失败');
            }
          })
        })
      },
      changePreser: function (id) {//现金资产保存
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
          success: function (res) {
            if (0 == res.code) {
              _this.change_cash_id = '';
              //重新获取当前选中基金的内容
              asset_out.pageProductInfo(asset_out.product_id);
              //刷新下拉列表
              // asset_out.pageProductList();
              $.omsAlert('修改成功');
            } else {
              $.omsAlert(res.msg)
            }
          },
          error: function () {
            $.omsAlert('网络异常')
          }
        })
      },
      monetaryPreser: function (id) {//货币基金资产保存
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
          success: function (res) {
            if (0 == res.code) {
              _this.change_asset_id = '';
              //重新获取当前选中基金的内容
              asset_out.pageProductInfo(asset_out.product_id);
              //刷新下拉列表
              // asset_out.pageProductList();
              $.omsAlert('修改成功');
            } else {
              $.omsAlert(res.msg)
            }
          },
          error: function () {
            $.omsAlert('网络异常');
          }
        })
      },
      setByPreser: function (id) {//定增保存
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
          success: function (res) {
            if (0 == res.code) {
              _this.change_id = '';
              //重新获取当前选中基金的内容
              asset_out.pageProductInfo(asset_out.product_id);
              //刷新下拉列表
              // asset_out.pageProductList();
              $.omsAlert('修改成功');
            } else {
              $.omsAlert(res.msg)
            }
          },
          error: function () {
            $.omsAlert('网络异常')
          }
        })
      }
    }
  })

  //确认删除的弹窗
  Vue.component('asset_jconfirm', {
    props: [],
    template: `
      <div class="jconfirm jconfirm-white custom-for-delete">
        <div class="jconfirm-bg seen" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); opacity: 0.2;"></div>
        <div class="jconfirm-scrollpane">
          <div class="container">
            <div class="row">
              <div class="jconfirm-box-container custom-window-width">
                <div class="jconfirm-box" role="dialog" aria-labelledby="jconfirm-box20474" tabindex="-1" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1.2); margin-top: 260px; transition-property: transform, opacity, box-shadow, margin;">
                  <div class="closeIcon" style="display: block;">×</div>
                  <div class="title-c"><span class="icon-c">确认删除</span><span class="title" id="jconfirm-box20474">确定删除该场外资产？</span></div>
                  <div class="buttons">
                    <button type="button" class="btn vue-confirm__btns--submit vue-confirm__btns--warn">确定</button>
                  </div>
                  <div class="jquery-clear">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `
  })

  //确认清空的弹窗
  // 从父组件获取到的props有：产品名称、场外资产类型
  // 上报给父组件的事件有：隐藏组件、确认清空
  Vue.component('clear_jconfirm', {
    props: ['product_name', 'action_type'],
    template: `
      <div class="jconfirm jconfirm-white custom-for-delete">
        <div class="jconfirm-bg seen" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); opacity: 0.2;"></div>
        <div class="jconfirm-scrollpane">
          <div class="container">
            <div class="row">
              <div class="jconfirm-box-container custom-window-width">
                <div class="jconfirm-box" role="dialog" aria-labelledby="jconfirm-box20474" tabindex="-1" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1.2); margin-top: 260px; transition-property: transform, opacity, box-shadow, margin;">
                  <div v-on:click="doHide" class="closeIcon" style="display: block;">×</div>
                  <div class="title-c">
                    <span class="icon-c">确认清空</span>
                    <span class="title" id="jconfirm-box20474">确认清空{{product_name}}的所有{{getActionTypeName}}资产？</span>
                  </div>
                  <div class="buttons">
                    <button v-on:click="doClear" type="button" class="btn vue-confirm__btns--warn">确定</button>
                  </div>
                  <div class="jquery-clear">
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `,
    data: function(){
      return {
        options_type: [
          {label: '定增',value: '1'},
          {label: '场外货币基金', value: '2'},
          {label: '收益互换', value: '3'},
          {label: '现金', value: '4'}
        ]
      }
    },
    computed: {
      getActionTypeName: function(){
        let _this = this;
        let rtn = '';
        this.options_type.forEach((e) => {
          if (e.value == _this.action_type) {
            rtn = e.label;
          }
        })

        return rtn;
      }
    },
    methods: {
      // 上报事件隐藏该组件
      doHide: function(){
        this.$emit('doHide')
      },
      // 上报事件清空
      doClear: function(){
        this.$emit('doClear')
      }
    }
  })

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
      doRefresh: function(){
        this.pageProductInfo(this.product_id);
      },
      //下拉列表
      pageProductList: function () {
        var _this = this;
        $.ajax({
          url: '/bms-pub/product/get_product_group?only_top=0',
          type: 'get',
          success: function(res){
            if (0 == res.code) {
              if (res.data != '') {
                res.data.lists.forEach(function(e){
                  e.type = 'group';
                })
                _this.product_list = res.data.lists;
                if (res.data.lists.length > 0) {
                  _this.product_id = res.data.lists[0].id; //默认选中第一个账户
                  _this.product_name = res.data.lists[0].name;
                }
              }
            }
          },
          error: function(res){
            $.omsAlert(res.msg);
          }
        })
      },
      pageProductInfo: function (id) {
        var _this = this;
        $.startLoading('正在查询');
        $.ajax({
          url: '/bms-pub/product/otc/list?group_id=' + id,
          type: 'GET',
          success: function (res) {
            if (0 == res.code) {
              _this.product_info = res.data;
            }
            $.clearLoading();
          },
          error: function (res) {
            $.omsAlert(res.msg);
            $.clearLoading();
          }
        })
      }
    },
    watch: {
      product_id: function () {
        let _this = this;
        this.pageProductInfo(this.product_id);
        this.product_list.forEach(function(e){
          if (e.id == _this.product_id) {
            _this.product_name = e.name;
          }
        });
      }
    }
  })
  asset_out.pageProductList();
}
