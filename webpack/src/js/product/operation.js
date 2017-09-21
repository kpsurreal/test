/**
 * Author: jiangjian; jiangjian@gmail.com
 * 运营管理
 */

var tableData= [{
  th: "name", //证劵代码
  show_type: "text",
  name: "基金",
  class_name: "vue-product-table__align-left xc__function--ellipsis",
  style: {
    width: '220px',
    'line-height': '36px',
    'display': 'block',
    'margin-left': '0px'
  }
}, {
  th: "net_value",
  show_type: "text",
  decimal_places: 4,
  name: "单位净值",
  class_name: "vue-product-table__align-right",
}, {
  th: "total_assets",
  show_type: "text",
  decimal_places: 2,
  name: "总资产",
  class_name: "vue-product-table__align-right",
}, {
  th: "net_assets",
  show_type: "text",
  decimal_places: 2,
  name: "净资产",
  class_name: "vue-product-table__align-right",
},{
  th: "begin_capital",
  show_type: "text",
  decimal_places: 2,
  name: "期初规模",
  class_name: "vue-product-table__align-right",
}, {
  th: "volume",
  show_type: "modify-number",
  decimal_places: 4,
  name: "份额",
  class_name: "vue-product-table__align-right",
  tip:'请输入份额',
  ajax_url:'/bms-pub/product/modify_product_group',//ajax 请求地址
  ajax_data(value){
    return {group_id:value}
  },//ajax默认字段,
  ajax_type:'POST',
}, {
  th: "total_assets_sec",
  show_type: "text",
  decimal_places: 2,
  name: "证券账户总资产",
  class_name: "vue-product-table__align-right",
}, {
  th: "total_assets_ctp",
  show_type: "text",
  decimal_places: 2,
  name: "期货账户总资产",
  class_name: "vue-product-table__align-right",
// }, {
//   th: "total_assets_otc",
//   show_type: "modify",
//   name: "场外总资产",
//   class_name: "custom-table__align-right",
}, {
  th: "cash_bank",
  show_type: "modify-number",
  decimal_places: 2,
  name: "银行存款",
  class_name: "vue-product-table__align-right",
  tip:'请输入银行存款',
  ajax_url:'/bms-pub/estimate/modify_cash',//ajax 请求地址
  ajax_data(value){
    return {group_id:value}
  },//ajax默认字段,
  ajax_type:'POST',
}, {
  th: "accumulated_receive",
  show_type: "text",
  decimal_places: 2,
  name: "累计应收",
  class_name: "vue-product-table__align-right",
}, {
  th: "accumulated_pay",
  show_type: "text",
  decimal_places: 2,
  name: "累计应付",
  class_name: "vue-product-table__align-right",
}];
//产品估值列表
Vue.component('vue-operation-table', {
  props:['tableData'],
  mixins: [numberMixin],
  data(){
    return {
      table_list:[],
      isLogining:false,
    }
  },
  template:`
    <table class="newweb-common-grid vue-product-table">
      <thead>
        <tr style="height:36px;border-bottom:1px solid #D7D5D5">
          <template v-for="header in tableData">
            <th :class="header.class_name" :style="header.style" style="height:30px;padding-left:20px;padding-right:20px;">{{header.name}}</th>
          </template>
        </tr>
      </thead>
      <tbody>
      <template v-if="table_list.length != 0">
        <tr v-for="group in table_list" style="border-bottom:1px solid #D7D5D5">
          <template v-for="header in tableData">
            
            <td v-if="header.show_type=='text'" :class="header.class_name" :style="header.style" style="height:36px;padding-left:20px;padding-right:20px;" :title="numeralNumber(group[header.th], header.decimal_places)">{{numeralNumber(group[header.th], header.decimal_places)}}</td>

            <td v-if="header.show_type=='modify-number'" :class="header.class_name" style="height:36px;padding-left:20px;padding-right:20px;">
              <vue-modify-product-number @modify_value="modify_value($event,group,header.th)" :label="header.name" :tip="header.tip" :value_down="numeralNumber(group[header.th],header.decimal_places)"  :ajax_url="header.ajax_url"  :ajax_data="header.ajax_data(group.id)" :id="header.th" :ajax_type="header.ajax_type"></vue-modify-product-number>
            </td>
            <td v-if="header.show_type=='modify'" :class="header.class_name" style="height:30px;padding-left:20px;padding-right:20px;">{{group[header.th]}}<a class="modify-remark__content__icon" @click="show_setting(group.id)"></a></td>
          </template>
        </tr>
      </template>
      <template  v-if="table_list.length == 0">
        <tr>
          <td style="height:30px;padding-left:20px;padding-right:20px;">暂无基金估值</td>
        </tr>
      </template>

      </tbody>
    </table>
  `,
  mounted(){
    this.update_list();
  },
  watch:{
    // table_list:{
    //   handler(value,old){
    //     console.log(value,old);
    //     this.update_list();
    //   },
    //   deep:true,
    // }
    // table_list(){
    //    this.update_list();
    // }
  },
  methods:{
    show_setting(id){
      this.$root.show_setting(id);//修改root的 id并调整
    },
    modify_value(value,group,name){
      //自定义事件，修改表格数据
      // group[name] = value;
      this.update_list();
    },
    update_list(){
      if(this.isLogining){
        return
      }
      this.isLogining  = true;
      let _this = this;
      $.ajax({
        url: '/bms-pub/estimate/get_list',
        type: 'GET',
      })
      .done(function(res) {
        if(res.code == 0){
          _this.table_list = res.data;
        }else{
           $.omsAlert(res.msg);
        }
      })
      .fail(function() {
         $.omsAlert('网络异常，请重试');
      })
      .always(function() {
        _this.isLogining  = false;
      });
    }
  }
})
//产外资产
Vue.component('vue-operation-outside', {
  props:['option_list','group_id','product_info'],
  data(){
    return {
      isLogining:false,
    }
  },
  template:`
    <div style="background: white;color:black;" id="outside_asset">
      <vue-operation-search :option_list=option_list :group_id=group_id></vue-operation-search>
      <asset-out-content :product_info="product_info" :product_name="product_info.name" :product_id="group_id" v-if="product_info.cash"></asset-out-content>
    </div>
  `,
  watch:{
    group_id(){
      this.$root.pageProductInfo();
    }
  },
  methods:{
    // pageProductInfo() {
    //   var _this = this;
    //   if(this.isLogining){
    //     return
    //   }
    //   this.isLogining = true;
    //   $.ajax({
    //     url: '/bms-pub/product/otc/list?group_id=' + this.group_id,
    //     type: 'GET',
    //     success: function success(res) {
    //       if (0 == res.code) {
    //         _this.product_info = res.data;
    //       }
    //     },
    //     error: function error(res) {
    //       $.omsAlert(res.msg);
    //     }
    //   }).always(function() {
    //   _this.isLogining  = false;
    // });;
    // }
  },
  mounted(){
   // this.pageProductInfo();
  }
});
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
    props: ['options_pro',"product_id", 'select_show', 'po_pup', 'product_name', 'chgTypeSelected', 'income_cash'],
    template: `
      <div class="asset-out-popup">
        <div class="asset-out-popup-content">
          <h2 class="asset-out-popup-content-title">{{getType()}}</h2>
          <p class="closeBtn" v-on:click="closeBtnFunc()">x</p>
          <table class="asset-out-popup-content-form">
            <thead>
            <tr v-if="false">
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
        //volume   持仓数量
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
                _this.$root.pageProductInfo(group_id);
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
        //market_value   市值
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
                _this.$root.pageProductInfo(group_id);
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
        //amount   资金
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
                _this.$root.pageProductInfo(group_id);
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
                _this.$root.pageProductInfo(_this.$root.group_id);
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
                _this.$root.pageProductInfo(_this.$root.product_id);
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
                _this.$root.pageProductInfo(_this.$root.group_id);
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
              _this.$root.pageProductInfo(_this.$root.group_id);
              //刷新下拉列表
              // asset_out.pageProductList();
              $.omsAlert('修改成功');
            } else {
              $.omsAlert(res.msg);
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
            volume: volume,
          },
          success: function (res) {
            if (0 == res.code) {
              _this.change_asset_id = '';
              //重新获取当前选中基金的内容
              _this.$root.pageProductInfo(_this.$root.group_id);
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
              _this.$root.pageProductInfo(_this.$root.group_id);
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
  props: ['delete_name'],
  template: `
    <div class="jconfirm jconfirm-white custom-for-delete">
      <div class="jconfirm-bg seen" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); opacity: 0.2;"></div>
      <div class="jconfirm-scrollpane">
        <div class="container">
          <div class="row">
            <div class="jconfirm-box-container custom-window-width">
              <div class="jconfirm-box" role="dialog" aria-labelledby="jconfirm-box20474" tabindex="-1" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1.2); margin-top: 260px; transition-property: transform, opacity, box-shadow, margin;">
                <div class="closeIcon" style="display: block;">×</div>
                <div class="title-c" style="text-align: left;">
                  <span class="icon-c"></span>
                  <span class="title" id="jconfirm-box20474">确认删除</span>
                </div>
                <div class="content-pane" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); height: 168px;">
                  <div class="content" style="clip: rect(0px 750px 168px -100px);">
                    <div class="vue-confirm">
                      <div style="font-size: 14px; text-align: center; color: #000000; padding: 60px 0;">确认删除该{{delete_name}}资产？</div>
                    </div>
                  </div>
                </div>
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
  `,
});
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
                <div class="title-c" style="text-align: left;">
                  <span class="icon-c"></span>
                  <span class="title" id="jconfirm-box20474">确认清空</span>
                </div>
                <div class="content-pane" style="transition-duration: 0.5s; transition-timing-function: cubic-bezier(0.36, 1.1, 0.2, 1); height: 168px;">
                  <div class="content" style="clip: rect(0px 750px 168px -100px);">
                    <div class="vue-confirm">
                      <div style="font-size: 14px; text-align: center; color: #000000; padding: 60px 0;">确认清空{{product_name}}所有的{{getActionTypeName}}资产？</div>
                    </div>
                  </div>
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

//费用设置
Vue.component('vue-operation-cost', {
  props:['option_list','group_id'],
  template:`
    <div style="background: white;color:black;">
      <vue-operation-search :option_list=option_list :group_id=group_id></vue-operation-search>
      <vue-operation-cost-list :group_id=group_id></vue-operation-cost-list>
    </div>
  `
});

//费用设置列表
Vue.component('vue-operation-cost-list', {
  props:['group_id'],
  data(){
    return {
      isLogining:false,
      fee_list:[],
      collection:{
        pay:{
          down:true,
          hide:true,
        },
        charge:{
          down:true,
          hide:true,
        }
      },
      exempt:{
        pay:{
          down:true,
          hide:true,
        },
        charge:{
          down:true,
          hide:true,
        }
      },
      temp_row:{},
      modify_hide:false,
    }
  },
  template:`
      <div class="operation-cost">
        <template v-if="root_product_id">
          <div class="operation-cost__title"><span>征收费用({{fee_list_collection.length}})</span></div>
          <div class="operation-cost__list">
            <template v-if="pay_num(fee_list_collection) > 0">
              <div class="operation-cost__list-title">
                <span>产品应付费（{{pay_num(fee_list_collection)}}）</span><i :class="['operation-cost__list-icon',{down:collection.pay.down}]" @click="change_icon(collection.pay)"></i>
              </div>
              <ul class="operation-cost__list-ul" v-show="collection.pay.hide">
                <template v-for="row ,index in fee_list_pay(fee_list_collection)">
                  <li class="operation-cost__list-li">
                    <div class="operation-cost__list-cell">{{show_index(index)}}</div>
                    <div class="operation-cost__list-cell">{{show_fee_type(row)}}</div>
                    <div class="operation-cost__list-cell">
                      {{show_fee_charging_depend(row.charging_depend)}}<span style="margin-left: 5px;">{{row.fee_rate*100}}%</span>
                    </div>
                    <div class="operation-cost__list-cell">{{show_fee_charging_type(row)}}</div>
                    <div class="operation-cost__list-op operation-cost__list-cell">
                      <span class="util__cp" @click="modify_row(row)">修改</span>
                      <span class="util__cp" style="color: red;margin-left: 30px;" @click="set_type(row)">设为免征</span>
                    </div>
                  </li>
                </template>
              </ul>
            </template>
            <template v-if="charge_num(fee_list_collection) > 0">
              <div class="operation-cost__list-title">
                <span>产品应收费（{{charge_num(fee_list_collection)}}）</span><i :class="['operation-cost__list-icon',{down:collection.charge.down}]" @click="change_icon(collection.charge)"></i>
              </div>
              <ul class="operation-cost__list-ul" v-show="collection.charge.hide">
                <template v-for="row ,index in fee_list_charge(fee_list_collection)">
                  <li class="operation-cost__list-li">
                    <div class="operation-cost__list-cell">{{show_index(index)}}</div>
                    <div class="operation-cost__list-cell">{{show_fee_type(row)}}</div>
                    <div class="operation-cost__list-cell">
                      {{show_fee_charging_depend(row.charging_depend)}}<span style="margin-left: 5px;">{{row.fee_rate*100}}%</span>
                    </div>
                    <div class="operation-cost__list-cell">{{show_fee_charging_type(row)}}</div>
                    <div class="operation-cost__list-op operation-cost__list-cell">
                      <span class="util__cp" @click="modify_row(row)">修改</span>
                      <span class="util__cp" style="color: red;margin-left: 30px;" @click="set_type(row)">设为免征</span>
                    </div>
                  </li>
                </template>
              </ul>
            </template>
          </div>
          <div class="operation-cost__title"><span>免征费用({{fee_list_exempt.length}})</span></div>
          <div class="operation-cost__list">
            <template v-if="pay_num(fee_list_exempt) > 0">
              <div class="operation-cost__list-title">
                <span>产品应付费（{{pay_num(fee_list_exempt)}}）</span><i :class="['operation-cost__list-icon',{down:exempt.pay.down}]" @click="change_icon(exempt.pay)"></i>
              </div>
              <ul class="operation-cost__list-ul" v-show="exempt.pay.hide">
                <template v-for="row ,index in fee_list_pay(fee_list_exempt)">
                  <li class="operation-cost__list-li">
                    <div class="operation-cost__list-cell">{{show_index(index)}}</div>
                    <div class="operation-cost__list-cell">{{show_fee_type(row)}}</div>
                    <div class="operation-cost__list-cell">
                      {{show_fee_charging_depend(row.charging_depend)}}<span style="margin-left: 5px;">{{row.fee_rate*100}}%</span>
                    </div>
                    <div class="operation-cost__list-cell">{{show_fee_charging_type(row)}}</div>
                    <div class="operation-cost__list-op operation-cost__list-cell">
                      <span class="util__cp" @click="modify_row(row)">修改</span>
                      <span class="util__cp" style="margin-left: 30px;" @click="set_type(row)">设为征收</span>
                    </div>
                  </li>
                </template>
              </ul>
            </template>
            <template v-if="charge_num(fee_list_exempt) > 0">
            <div class="operation-cost__list-title">
              <span>产品应收费（{{charge_num(fee_list_exempt)}}）</span><i :class="['operation-cost__list-icon',{down:exempt.charge.down}]" @click="change_icon(exempt.charge)"></i>
            </div>
            <ul class="operation-cost__list-ul" v-show="exempt.charge.hide">
              <template v-for="row ,index in fee_list_charge(fee_list_exempt)">
                <li class="operation-cost__list-li">
                  <div class="operation-cost__list-cell">{{show_index(index)}}</div>
                  <div class="operation-cost__list-cell">{{show_fee_type(row)}}</div>
                  <div class="operation-cost__list-cell">
                    {{show_fee_charging_depend(row.charging_depend)}}<span style="margin-left: 5px;">{{row.fee_rate*100}}%</span>
                  </div>
                  <div class="operation-cost__list-cell">{{show_fee_charging_type(row)}}</div>
                  <div class="operation-cost__list-op operation-cost__list-cell">
                    <span class="util__cp" @click="modify_row(row)">修改</span>
                    <span class="util__cp" style="margin-left: 30px;" @click="set_type(row)">设为征收</span>
                  </div>
                </li>
              </template>
            </ul>
            </template>
          </div>
          <div class="operation-cost__modify" v-if="modify_hide">
            <label for="rate">费率
              <input type="text" name="rate" v-model="temp_row.fee_rate" style="text-indent: 9px;" />
              <span style="position: relative;left: -27px;;color: gray;">%</span>
            </label>
            <label for="charging_basis">计费依据
              <select name="charging_basis" v-model="temp_row.charging_depend">
                <option value=1>期初规模</option>
                <option value=2>净资产</option>
              </select>
            </label>
            <label for="layout_method">计提方式
              <select name="layout_method" v-model="temp_row.charging_type">
                <option value=1>按日计费按月计提</option>
                <option value=2>按日计费按季计提</option>
                <option value=3>按日计费按年计提</option>
              </select>
            </label>
            <div class="operation-cost__modify-btn">
              <button class="operation-cost__modify-submit" @click="set_setting">{{ temp_row.status == 0 ? '保存' : '保存为征收' }}</button>
              <button class="operation-cost__modify-cancel" @click="hide">取消</button>
            </div>
          </div>
        </template>
      </div>
  `,
  methods:{
    set_setting(){
      if(this.isLogining){
        return
      }

      if(!this.temp_row.fee_rate) {
        $.omsAlert('请输入费率');
        return;
      }

      this.isLogining  = true;
      let _this = this;
      $.ajax({
        url: '/bms-pub/portfolio/fee-modify',
        type: 'POST',
        data: {
          id: _this.temp_row.id,
          fee_rate:_this.temp_row.fee_rate/100,
          charging_depend:_this.temp_row.charging_depend,
          charging_type:_this.temp_row.charging_type,
        },
      })
      .done(function(res) {
        _this.isLogining  = false;
        if(res.code == 0){
          _this.get_fee_list();
          $.omsAlert('修改成功');
        }else{
          $.omsAlert(res.msg);
        }
      })
      .fail(function() {
        _this.isLogining  = false;
         $.omsAlert('网络错误，请重试')

      })
      .always(function() {
         _this.modify_hide = false;
      });
    },
    set_type(row){
      if(this.isLogining){
        return
      }
      this.isLogining  = true;
      let _this = this;
      let status;
      if(row.status == 0){
        status = 1;
      }
      if(row.status == 1){
        status = 0;
      }
      $.ajax({
        url: '/bms-pub/portfolio/fee-update-status',
        type: 'POST',
        data: {
          id: row.id,
          status:status
        },
      })
      .done(function(res) {
        if(res.code == 0){
          row.status = status;
          $.omsAlert('保存成功');
        }else{
          $.omsAlert(res.msg)
        }
      })
      .fail(function() {
        $.omsAlert('网络错误，请重试')
      })
      .always(function() {
        _this.isLogining  = false;
      });
      
    },
    hide(){
      this.modify_hide = false;
    },
    modify_row(row,index){
      this.temp_row = Object.assign({},row);
      this.temp_row.fee_rate = this.temp_row.fee_rate*100;
      this.modify_hide = true;
    },
    get_fee_list(){
      if(this.isLogining){
        return
      }
      //获取所有的基金费用信息
      this.isLogining  = true;
      let _this = this;
      if(!this.$root.group_id){
        _this.isLogining  = false;
        return
      }
      $.ajax({
        url: '/bms-pub/portfolio/fee_list/'+this.group_id,
        type: 'GET',
      })
      .done(function(res) {
        if (0 == res.code) {

          _this.fee_list = res.data;

        }else{
          $.omsAlert(res.msg);
        }
      })
      .fail(function() {
        $.omsAlert('网络错误，请重试');
      })
      .always(function() {
        _this.isLogining  = false;
        // _this.fee_list = [
        //   {
        //       "id": 10026, //id
        //       "fee_rate": 1.000,   //费率,
        //       "fee_type": 1, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 0,//0征收，1免征
        //        "earning_type": 2,//1应付，2应收          
        //       "charging_depend": 1,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 1,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,   //费率,
        //       "fee_type": 2, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 1,//0征收，1免征
        //        "earning_type": 1,//1应付，2应收          
        //       "charging_depend": 2,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 3,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,    //费率,
        //       "fee_type": 3, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 0,//0征收，1免征
        //       "earning_type": 1,//1应付，2应收          
        //       "charging_depend": 1,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 2,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,   //费率,
        //       "fee_type": 4, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 0,//0征收，1免征
        //        "earning_type": 2,//1应付，2应收          
        //       "charging_depend": 2,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 1,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,  //费率,
        //       "fee_type": 5, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 0,//0征收，1免征
        //        "earning_type": 2,//1应付，2应收          
        //       "charging_depend": 1,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 3,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,   //费率,
        //       "fee_type": 1, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 1,//0征收，1免征
        //       "earning_type": 1,//1应付，2应收          
        //       "charging_depend": 1,        //计费依据，1期初规模，2前一日净资产
        //       "charging_type": 2,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },{
        //       "id": 10026, //id
        //       "fee_rate": 1.000,    //费率,
        //       "fee_type": 2, //费用类型，1管理费，2退出费，3风控顾问费，4信托通道费，5其他应付费
        //       "status": 0,//0征收，1免征
        //       "earning_type": 2,//1应付，2应收          
        //       "charging_depend":1,//计费依据，1期初规模，2前一日净资产
        //       "charging_type": 1,//1按日计费按月计提、2按日计费按季计提、3按日计费按年计提
        //   },
        // ];

      });
    },
    pay_num(arr){
      let temp = arr.filter(function(ele) {
        return ele.earning_type == 1;
      });
      return temp.length
    },
    charge_num(arr){
      let temp = arr.filter(function(ele) {
        return ele.earning_type == 2;
      });
      return temp.length;
    },
    show_index(index){
      index = index+1;
      if(index<10){
        return '0'+index;
      }else{
        return index;
      }
    },
    change_icon(ele){
      ele.down = !ele.down;
      ele.hide = !ele.hide;
    },
    fee_list_charge(list){
      return list.filter((ele)=>{
        return ele.earning_type == 2
      }) || []
    },
    fee_list_pay(list){
      return list.filter((ele)=>{
        return ele.earning_type == 1
      }) || []
    },
    show_fee_type(row){
      let type = row.fee_type;
      let earning_type = row.earning_type;

      if(earning_type == 1){
        switch(type)
        {
          case '1':
            return '管理费';
          case '2':
            return '托管费';
          case '3':
            return '投顾费';
          case '4':
            return '风控顾问费';
          case '5':
            return '信托报酬';
          case '6':
            return '销售服务费';
          case '7':
            return '其他应付费';
          default:
            break
        }
      }else if(earning_type == 2){
        switch(type)
        {
          case '1':
            return '信保';
          case '2':
            return '其他应收费';
          default:
            break
        }
      }
    },
    show_fee_charging_type(row){
      let temp = (+row.fee_rate)*100;
      switch(row.charging_type)
        {
        case '1':
          return '按日计费按月计提【每日费用＝（'+this.show_fee_charging_depend(row.charging_depend)+'×'+temp+'%）÷当年天数】';
        case '2':
          return '按日计费按季计提【每日费用＝（'+this.show_fee_charging_depend(row.charging_depend)+'×'+temp+'%）÷当年天数】';
        case '3':
          return '按日计费按年计提【每日费用＝（'+this.show_fee_charging_depend(row.charging_depend)+'×'+temp+'%）÷当年天数】';
        default:
          break
        }
    },
    show_fee_charging_depend(type){
      switch(type)
        {
        case '1':
          return '期初规模';
        case '2':
          return '净资产';
        default:
          break
        }
    }
  },
  computed:{
    fee_list_exempt(){
      return this.fee_list.filter(function(ele) {
        return ele.status == 1; //免征
      });
    },
    fee_list_collection(){
      return this.fee_list.filter(function(ele) {
        return ele.status == 0; //征收
      });
    },
    root_product_id(){
      return this.$root.group_id;
    }
  },
  watch:{
    group_id(){
      this.get_fee_list();
    }
  },
  mounted(){
    this.get_fee_list();
  }
})
 //下拉框
Vue.component('vue-operation-search', {
  props:['option_list','group_id'],
  data(){
    return {
      select:'',
      isLogining:false,
    }
  },
  template:`
  <div class="operation-header">
    <h2 class="operation-header__h2">选择基金</h2>
    <select class="operation-header__select" multiple placeholder="请选择基金"></select>
  </div>
  `,
  methods:{
    select_init(){
      let self = this;
      let options = this.option_list;
      this.select = $(this.$el).find('.operation-header__select').selectize({
        maxItems: 1,
        valueField: 'id',
        labelField: 'name',
        searchField: 'name',
        options: options,
        create: false,
        onChange(){
          self.$root.group_id = this.getValue()[0];
        }
      });
      //设置默认值
      if(this.$root.group_id){
        this.select[0].selectize.setValue([this.$root.group_id]);
      }
    }
  },
  watch:{
    group_id(val){
      this.select[0].selectize.setValue([val]);
      this.$root.pageProductInfo(val);
    },
    // option_list(){

    //   this.select_init();;
    // }
    option_list:{
      handler(){
        this.select[0].selectize.clearOptions();
        this.select[0].selectize.addOption(this.option_list);
        if(this.$root.group_id){
          this.select[0].selectize.setValue([this.$root.group_id]);
        }
      },
      deep:true,
    }
  },
  mounted: function () {
    this.select_init();
  }

})
//停牌估值
//数据
let comGridSortData = {
  order: '',
  order_by: '',
  display_rules: [{
    id: 'name', // 变量id
    label: '持仓产品',         // 变量显示名称
    format: '',               // 格式化处理函数，不能提前进行处理，因为数据还要用来排序什么的。此处的处理理解为只为显示，脱离于逻辑 （函数定义于vue中）
    class: 'left20'           // 样式
  },{
    id: 'operator',
    label: '基金经理',
    hideSort: true,
    format: '',
    class: 'left20'
  },{
    id: 'stock_display',           // stock_id和stock_name拼起来
    label: '停牌股票',
    format: '',
    class: 'left20'
  },{
    id: 'influence_rate',
    label: '指数变动对净值影响比例',
    format: ['numeralPercent'],
    class: 'right20'
  },{
    id: 'weight',
    label: '持仓权重',
    format: ['numeralPercent'],
    class: 'right20'
  },{
    id: 'suspend_date',
    label: '停牌日',
    hideSort: true,
    format: '',                 //['numeralNumber', 2],
    class: 'right20'
  },{
    id: 'market_value',
    label: '停牌日市值',
    hideSort: true,
    format: ['numeralNumber', 2],
    class: 'right20'
  },{
    id: 'amac_display',           // amac_name和amac_index拼起来
    label: '行业代码',
    hideSort: true,
    format: '',
    class: 'left20'
  },{
    id: 'amac_price',
    label: '今日指数',
    hideSort: true,
    format: ['numeralNumber', 4],
    class: 'left20',
    unit: ''                   // 附带后缀单位
  },{
    id: 'amac_last_price',
    label: '停牌日指数',
    hideSort: true,
    format: ['numeralNumber', 4],
    class: 'left20',
    unit: ''                   // 附带后缀单位
  },{
  //   id: 'adjust_market_value',
  //   label: '调整前市值',
  //   hideSort: true,
  //   format: ['numeralNumber', 2],
  //   class: 'left20',
  //   unit: ''                   // 附带后缀单位
  // },{
    id: 'modify_market_value',
    label: '调整后市值',
    hideSort: true,
    // format: ['numeralNumber', 2],
    class: 'left20',
    modify_component: true,
    unit: ''                   // 附带后缀单位
  }]
}
//控件
Vue.component('vue-operation-suspension',{
  props:['product_info'],
  data(){
    return {
    active_stock: '',
      display_rules: comGridSortData.display_rules,
      order: comGridSortData.order,
      order_by: comGridSortData.order_by,
      stock_list: []
    }
  },
  template:`
    <section v-cloak id="suspension" class="section-container" style="padding-bottom: 120px;">
    <table class="journel-sheet-grid">
      <thead>
        <tr>
        <!-- <draggable :list="display_rules" element="tr" :options="dragOptions" @move="onMove" @end="onEnd"> -->
          <th v-bind:class="rule.class" v-for="rule in display_rules">
            <span v-html="rule.label"></span>
            <a v-if="!rule.hideSort" class="icon-sortBy" v-on:click="chgSort(rule.id)">
              <i class="icon-asc" :class="{active: (order_by == rule.id && order == 'asc')}"></i>
              <i class="icon-desc" :class="{active: (order_by == rule.id && order == 'desc')}"></i>
            </a>
          </th>
        <!-- </draggable> -->
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-if="display_stocks.length > 0" v-for="sub_value in display_stocks">
          <td v-for="rule in display_rules" v-bind:class="rule.class">
            <span v-if="sub_value.is_adjust == 0 || rule.modify_component != true" v-text="displayValue(sub_value, rule)"></span>
            <vue-custom-modify v-if="(sub_value.is_adjust == 1 || sub_value.is_adjust == 2) && rule.modify_component == true" :id="'market_value'" :value="displayValue(sub_value, rule)" :ajax_url="getAjaxUrl()" :ajax_data="{id: sub_value.id}" :digital_num="2" v-on:modify_value="modify_value($event)"></vue-custom-modify>
          </td>
          <td>
            <a v-if="sub_value.is_adjust == 0" v-on:click="doConfigAdjust(sub_value.id, true)" class="newweb-common-grid__config-btn">估值调整</a>
            <a v-if="sub_value.is_adjust == 1 || sub_value.is_adjust == 2" v-on:click="doConfigAdjust(sub_value.id, false)" class="newweb-common-grid__cancel-btn">取消调整</a>
          </td>
        </tr>
        <tr v-if="display_stocks.length == 0">
          <td colspan="999">暂无停牌股票</td>
        </tr>
      </tbody>
    </table>

    <div class="left-right-grid">
    <!--
      <dl class="left-right-grid__left">
        <dt class="left-right-grid__sub-grid--title" v-text="'第一步：选择停牌股票'"></dt>
        <dd v-show="stock_list.length > 0" v-for="stock in stock_list" v-on:click="setActiveStock(stock.stock_id)" class="left-right-grid__sub-grid--content" :class="active_stock == stock.stock_id ? 'left-right-grid__sub-grid--active' : ''">
          <div>
            <span class="left-right-grid__font--active" v-text="stock.stock_id"></span>
            <span class="left-right-grid__font--active" v-text="stock.stock_name"></span>
          </div>
          <div>
            <span class="left-right-grid__font--grey" v-text="'行业代码'"></span>
            <span class="left-right-grid__font--normal" v-text="stock.industry_code"></span>
            <span class="left-right-grid__font--normal" v-text="stock.industry_class"></span>
          </div>
          <div>
            <span class="left-right-grid__font--grey" v-text="'停牌日'"></span>
            <span class="left-right-grid__font--normal" v-text="stock.suspension_date"></span>
          </div>
        </dd>
        <dd v-show="stock_list.length == 0">
          <div style="font-size: 14px; color: #000; padding: 15px 35px;" v-text="'没有停牌股票'"></div>
        </dd>
      </dl>
      <dl class="left-right-grid__right">
        <dt class="left-right-grid__sub-grid--title" v-text="'第二步：选择需作估值调整的该股持仓产品'"></dt>
        <dd v-if="active_stock != ''" v-for="fund in cur_fund_list" class="left-right-grid__sub-grid--content left-right-grid__sub-grid--active">
          <div>
            <input :disabled="fund.web_disabled" v-model="fund.is_adjust" class="left-right-grid__sub-grid--checkbox" type="checkbox" />
            <span class="left-right-grid__font--normal" v-text="fund.fund_name"></span>
          </div>
          <div>
            <span class="left-right-grid__font--grey" v-text="'持仓权重'"></span>
            <span class="left-right-grid__font--normal" v-text="numeralPercent(fund.position_weight)"></span>
          </div>
          <div>
            <span class="left-right-grid__font--grey" v-text="'指数变动对净值影响比例'"></span>
            <span class="left-right-grid__font--normal" v-text="numeralPercent(fund.susp_factor)"></span>
          </div>
        </dd>
        <dd v-if="active_stock == ''">
          <div style="font-size: 14px; color: #000; padding: 15px 35px;" v-text="'请先在左侧点选需要调整估值的停牌股票'"></div>
        </dd>
      </dl>

    -->
    </div>
    <div class="word-tip">
      <p class="word-tip__content">1.以上数据仅含场内A股部分，其他资产停牌估值调整暂不支持</p>
      <p class="word-tip__content">2.指数变动对净值影响比例=停牌股今日行业指数/停牌日行业指数*权重</p>
      <p class="word-tip__content">3.系统将对选中产品指定停牌股进行估值调整，调整后该股市值=停牌日市值*今日行业指数/停牌日行业指数，若要取消估值调整，请去掉勾选后提交</p>
    </div>
    <!--
    <div style="display: flex; justify-content: flex-end;">
      <a style="margin-right: 60px;" class="custom-btn" v-on:click="doSave">确定</a>
    </div>
    -->
  </section>
  `,
  methods:{

  },
  computed: {
    dragOptions () {
      return  {
        animation: 0,
        // group: 'description',
        // disabled: !this.editable,
        ghostClass: 'ghost'
      };
    },

    display_stocks: function(){
      let _this = this;
      let rtn = [];
      // 步骤1，根据接口数据进行准备
      this.stock_list.forEach(function(e){
        let obj = {};
        // 是否估值调整，1为是，0为否
        obj.is_adjust = e.is_adjust;
        // id
        obj.id = e.id;
        // 持仓产品
        obj.name = e.name;
        // 基金经理
        obj.operator = e.operator;
        // 停牌股票
        obj.stock_display = e.stock_name + ' ' + e.stock_id;
        // 指数变动对净值影响比例
        obj.influence_rate = e.influence_rate;
        // 持仓权重
        obj.weight = e.weight;
        // 停牌日
        obj.suspend_date = e.suspend_date;
        // 停牌日市值
        obj.market_value = e.market_value;
        // 行业代码
        obj.amac_display = e.amac_name + ' ' + e.amac_index
        // 今日指数
        obj.amac_price = e.amac_price;
        // 停牌日指数
        obj.amac_last_price = e.amac_last_price;
        // 调整前市值
        obj.adjust_market_value = e.adjust_market_value;
        // 调整后市值
        obj.modify_market_value = e.modify_market_value;

        rtn.push(obj);
      });

      // 步骤2，根据排序逻辑进行排序
      rtn = VUECOMPONENT.sort(rtn, _this.order, _this.order_by);
      return rtn;
      // if (_this.order == 'asc' || _this.order == 'desc') {
      //   rtn.sort((a, b) => {
      //     let x = a[_this.order_by];
      //     let y = b[_this.order_by];
      //     if ( !isNaN(parseFloat(x)) && !isNaN(parseFloat(y)) ) {
      //       x = parseFloat(x);
      //       y = parseFloat(y);
      //     }
      //     if (x > y) {
      //       return 1;
      //     }
      //     if (x < y) {
      //       return -1;
      //     }
      //     return 0;
      //   })

      //   if ('desc' == _this.order) {
      //     rtn.reverse();
      //   }
      //   return rtn;
      // }else{
      //   return rtn;
      // }
    }
  },
  methods: {
    chgSort: function(id){
      if (id == this.order_by) {
        if (this.order == 'asc') {
          this.order = 'desc';
        }else if(this.order == 'desc'){
          this.order = '';
        }else{
          this.order = 'asc'
        }
      }else{
        this.order_by = id;
        this.order = 'asc';
      }
      // 用户切换排序命令，需要保存新的排序
      let obj = {};
      obj.field_sort = this.display_rules.map(function(e){
        return e.id
      });
      obj.order_by = this.order_by;
      obj.order = this.order;
      common_storage.setItem('suspension_page__grid_order', obj);
    },
    getAjaxUrl: function(){
      return '/bms-pub/suspension/edit_market_value';
    },
    modify_value: function(v){
      this.getStockList();
    },
    displayValue: function(sub_value, rule){
      let value = sub_value[rule.id];
      if ((rule.format != '') && (rule.format instanceof Array) && (this[rule.format[0]] instanceof Function)) {
        // value = this[rule.format].call(this, value, )
        let args = [value].concat(rule.format.slice(1))
        value = this[rule.format[0]].apply(this, args);
      }
      if (rule.unit) {
        return value + rule.unit;
      }else{
        return value;
      }
    },
    onMove ({relatedContext, draggedContext}) {
      const relatedElement = relatedContext.element;
      const draggedElement = draggedContext.element;
      return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
    },
    onEnd ({}){
      // // 用户切换表格排序，需要保存新的排序
      // let obj = {};
      // obj.field_sort = this.display_rules.map(function(e){
      //   return e.id
      // });
      // obj.order_by = this.order_by;
      // obj.order = this.order;
      // common_storage.setItem('report_group__grid_order', obj);
    },
    numeralNumber: function(arg, num){
      if ('--' == arg || '' == arg || undefined == arg) {
        return '--'
      }
      if (undefined != num) {
        var str = '0.'
        for (let i = num - 1; i >= 0; i--) {
          str += '0';
        }
        return numeral(arg).format( '0,' + str );
      }
      return numeral(arg).format( '0,0.00' );
    },
    numeralPercent: function(arg){
      return numeral(arg).format( '0.00%' );
    },
    doConfigAdjust: function(id, adjustFlag){
      let _this = this;
      $.ajax({
        url: '/bms-pub/suspension/set_market_value',
        type: 'post',
        data: {
          id: id,
          is_adjust: adjustFlag == true ? 1 : 0
        },
        success: function({code, msg, data}){
          if (0 == code) {
            $.omsAlert('提交成功')
            _this.getStockList();
          }else{
            $.omsAlert(msg);
          }
        },
        error: function(){
          $.omsAlert('网络异常，请重试。')
        }
      })
    },
    customRefreshAfterModified: function(){
      this.getStockList();
    },
    getStockList: function(){
      let _this = this;
      $.ajax({
        url: '/bms-pub/suspension/stock_list',
        type: 'get',
        data: {

        },
        success: function({code, msg, data}){
          if (0 == code) {
            data.forEach(function(e){
              e.fund_list = [];
            })
            _this.stock_list = data;

            // 同时获取保存的排序规则
            common_storage.getItem('suspension_page__grid_order', ({code, msg, data}) => {
              if (0 == code) {
                comGridSortData.order = data.order;
                comGridSortData.order_by = data.order_by;
                _this.order = data.order;
                _this.order_by = data.order_by;
                // comGridSortData.field_sort = data.field_sort;
                for (let i = data.field_sort.length - 1; i >= 0; i--) {
                  for (var j = 0, length = comGridSortData.display_rules.length; j < length; j++) {
                    if (comGridSortData.display_rules[j].id == data.field_sort[i]) {
                      let obj = comGridSortData.display_rules[j];
                      comGridSortData.display_rules.splice(j, 1);
                      comGridSortData.display_rules.unshift(obj);
                    }
                  }
                }
              }
            });
          }else{
            $.omsAlert(msg)
          }
        },
        error: function(){
          $.omsAlert('网络异常，请重试。')
        }
      })
    }
  },
  mounted(){
    this.getStockList();
  }

})
var review_vm = new Vue({
  el:'[operation]',
  data:{
    tab_index:'base',// base 产品估值    cost 费用设置  suspension 停牌估值   outside 产外资产,
    tableData:tableData,
    group_id:'',
    option_list:[],
    product_info:{}
  },
  template:`
  <div id="operation_form" class="report_form">
    <div class="report-form-type">
      <ul class="report-form-type__content">
        <li :class="['report-form-type__content__describle',{active: tab_index == 'base'}]" @click="reportChange('base')" style="margin-left: 10px;" v-if="base_type">基金估值</li> 
        <li :class="['report-form-type__content__describle',{active: tab_index == 'cost'}]" @click="reportChange('cost')" v-if="cost_type">费用设置</li>
        <li :class="['report-form-type__content__describle',{active: tab_index == 'suspension'}]" @click="reportChange('suspension')"  v-if="suspension_type">停牌估值</li>
        <li :class="['report-form-type__content__describle',{active: tab_index == 'outside'}]" @click="reportChange('outside')" v-if="outside_type">场外资产</li>
      </ul>
    </div>
    <template v-if="tab_index == 'base'">
      <div style="background: white;color:black"  v-if="base_type">
        <vue-operation-table  :tableData=tableData></vue-operation-table>
      </div>
    </template>
    <template v-if="tab_index == 'cost'">
        <vue-operation-cost :option_list=option_list :group_id=group_id v-if="cost_type"></vue-operation-cost>
    </template>
    <template v-if="tab_index == 'outside'">
        <vue-operation-outside :option_list=option_list :group_id=group_id :product_info=product_info v-if="outside_type"></vue-operation-outside>
    </template>
    <template v-if="tab_index == 'suspension'" :product_info=product_info>
      <vue-operation-suspension v-if="suspension_type"></vue-operation-suspension>
    </template>
  </div>
  `,
  watch:{
  },
  methods:{
    reportChange(val){
      this.tab_index = val;
    },
    get_groups(){
      if(this.isLogining){
        return
      }
      //初始化下拉列表
      this.isLogining  = true;
      let _this = this;
      $.ajax({
        url: '/bms-pub/product/get_product_group',
        type: 'GET',
        data: {
              only_top: 0
        },
      })
      .done(function(res) {
        if (0 == res.code) {
          if (res.data != '') {
            _this.option_list = res.data.lists;
          }

        }
      })
      .fail(function() {

      })
      .always(function() {
        _this.isLogining  = false;

      });
    },
    show_setting(id){
     //修改root的 id并调弹框
      let self = this;
      let contentChild = Vue.extend({
        data(){
          return {
            id:id
          }
        },
        template:`
         <form class="vue-form">
            <div class="operation-confirm">
              场外资产需要前往【场外资产】页面修改
            </div>
            <div class="buttons" style="text-align: center;    float: inherit;">
              <button type="button" class="vue-confirm__btns--submit" style="background-color: rgb(255, 222, 0);" @click=btn_submit>前往修改</button>
              <button type="button" class="vue-confirm__btns--cancel" style=" background-color: rgb(204, 204, 204);" @click=btn_cancel>取消</button>
            </div>
          </form>
        `,
        methods:{
          btn_submit(){
            self.group_id = this.id;
            self.tab_index = "cost";
            this.$parent.close();
          },
          btn_cancel(){
            this.$parent.close();
          }
        }
      });
      this.$confirm({
          title: '场外总资产修改',
          content:contentChild,
          closeIcon: true,
      });
    },
    doRefresh: function(){
      this.pageProductInfo(this.group_id);
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
  computed: {
    base_type(){
      return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_FUND_VALUATION']];
    },
    cost_type(){
      return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_COST_SET']];
    },
    suspension_type(){
      return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_SUSPENSION']];
    },
    outside_type(){
      return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_OTC_CAPITAL']];
    },
  },
  mounted(){
    this.get_groups();
    this.pageProductInfo(this.group_id);
    if(this.base_type){
      this.tab_index = 'base';
    }else if(this.cost_type){
      this.tab_index = 'cost';
    }else if(this.suspension_type){
      this.tab_index = 'suspension';
    }else if(this.outside_type){
      this.tab_index = 'outside';
    }
  }
});