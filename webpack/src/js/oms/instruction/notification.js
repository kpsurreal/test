/*
指令通知页面3.9.0
*/ 

//
let notificationSort = {
  order: '',
  order_by: '',
  display_rules: [
    {
      id: 'operation', // 变量id
      label: '指令操作',         // 变量显示名称
      format: '',               // 格式化处理函数，不能提前进行处理，因为数据还要用来排序什么的。此处的处理理解为只为显示，脱离于逻辑 （函数定义于vue中）
      class: '',           // 样式
      style: 'width:20%;text-align:left;',
      sub_style: 'padding-left:10px;'
    },
    {
      id: 'number',
      label: '指令编号',
      format: '',
      class: '',
      style: 'width:5%;text-align:left;',
      sub_style: 'padding-left:10px;'
    },
    {
      id: 'ins_status',
      label: '指令状态',
      format: '',
      class: '',
      style: 'width:6%;text-align:left;',
      sub_style: 'padding-left:10px;'
    },
    {
      id: 'investment_target',
      label: '证券',
      format: '',
      class: '',
      style: 'width:10%;text-align:left;',
      sub_style: 'padding-left:10px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;width:140px;display:inline-block;'
    },
    {
      id: 'product_position_list',
      label: '产品账户',
      format: '',
      class: '',
      style: 'width:18%;text-align:left;',
      sub_style: 'padding-left:10px;cursor:pointer;height:36px;'
    },
    {
      id: 'volume',
      label: '指令数量',
      format: '',
      class: '',
      style: 'width:10%;text-align:right;',
      sub_style: 'padding-right:60px;'
    },
    {
      id: 'direction',
      label: '买卖方向',
      format: '',
      class: '',
      style: 'width:6%;text-align:left;',
      sub_style: 'padding-left:10px;'
    },
    {
      id: 'price',
      label: '指令价格',
      format: '',
      class: '',
      style: 'width:5%;text-align:right;',
      sub_style: 'padding-right:10px;'
    },
    {
      id: 'fund_manager_memo',
      label: '备注',
      format: '',
      class: '',
      style: 'width:5%;text-align:left;',
      sub_style: 'padding-left:24px;width:140px;display:inline-block;line-height:18px;'
    },
    {
      id: 'created_at',
      label: '指令下达时间',
      format: '',
      class: '',
      style: 'width:15%;text-align:right;',
      sub_style: 'padding-right:10px;'
    }
  ]
}
//头部
Vue.component('vue-notification-header', {
  props: [],
  template: `
    <div class="notification-header">
      <h2 class="notification-header__name">指令通知</h2>
      <div style="flex-grow: 1"></div>
      <a v-on:click="refresh()" class="custom-grey-btn custom-grey-btn__refresh">
        <i class="oms-icon refresh"></i>刷新
      </a>
    </div>
  `,
  methods: {
    refresh: function () {
      let _this = this;
      //刷新页面,方便组件重复利用
      if ("[object Function]" == Object.prototype.toString.call(_this.$root.doRefresh)) {
        _this.$root.doRefresh(true);
      }
    }
  }
})

Vue.component('vue-product-sub', {
  props:['item', 'notification_display', 'product_index', 'item_drop'],
  template: `
    <div class="instruction-notifition__content">
      <ul class="instruction-notifition__content__account">
        <li v-bind:class="rule.class" v-bind:style="rule.style" v-for="rule in notification_display">
          <form v-if="'operation' == rule.id" v-bind:style="rule.sub_style">
            <input type="radio" name="change" :checked="2 == item.status" :class="'product_'+item.id" @click="change_status(item, '1')"/>已收到
            <input type="radio" name="change" style="margin-left:20px;" :checked="3 == item.status" :class="'product_'+item.id" @click="change_status(item, '2')"/>执行中
            <input type="radio" name="change" style="margin-left:20px;" :checked="4 == item.status" :class="'product_'+item.id" @click="change_status(item, '3')"/>已完成
          </form>
          <div v-if="'product_position_list' == rule.id" @click="product_change()" v-bind:style="rule.sub_style">
            <div class="display_hide_icon" :class="{display_show_icon: true == display_change}" style="vertical-align:top;margin-top:15px;"></div>
            <div style="display:inline-block;width:200px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;">{{item.product_position_list}}</div>
          </div>
          <span v-bind:style="rule.sub_style" v-if="'direction' == rule.id" :class="{red: '买入' == item.direction || '买入开仓' == item.direction || '卖出平仓' == item.direction, blue: '卖出' == item.direction || '卖出开仓' == item.direction || '买入平仓' == item.direction}">{{item.direction}}</span>
          <span v-bind:style="rule.sub_style" v-if="'ins_status' == rule.id" :class="{status_submit: 1 == item.status, status_receive: 2 == item.status, status_execution: 3 == item.status, status_complete: 4 == item.status, status_complete: 5 == item.status, status_complete: 6 == item.status}">{{item.ins_status}}</span>
          <span v-bind:style="rule.sub_style" v-if="'investment_target' == rule.id" :title="item.investment_target">{{item.investment_target}}</span>
          <span v-bind:style="item.isNumBold ? rule.sub_style+'fontWeight:bold;' : rule.sub_style" v-if="'price' == rule.id" >{{item.price}}</span>
          <span v-bind:style="rule.sub_style" v-if="'fund_manager_memo' == rule.id" :title="item.fund_manager_memo">{{item.fund_manager_memo}}</span>
          <span v-bind:style="rule.sub_style" v-if="'fund_manager_memo' != rule.id &&'price' != rule.id && 'direction' != rule.id && 'investment_target' != rule.id && 'operation' != rule.id && 'product_position_list' != rule.id && 'ins_status' != rule.id">{{displayValue(item, rule)}}</span>
        </li>
      </ul>
      <ul class="instruction-notifition__content__sub" v-for="product_item in item.product_list" v-show="display_change">
        <li style="width:20%;text-align:left;padding-left:10px;"></li>
        <li style="width:5%;text-align:left;padding-left:10px;"></li>
        <li style="width:6%;text-align:left;padding-left:10px;"></li>
        <li style="width:10%;text-align:left;padding-left:10px;"></li>
        <li style="width:18%;text-align:left;padding-left:10px;">{{product_item.product_name}}</li>
        <li style="width:10%;text-align:right;padding-right:60px;" v-text="product_volume(product_item)"></li>
        <li style="width:6%;text-align:left;padding-left:10px;" :class="{red: '买入' == item.direction || '买入开仓' == item.direction || '卖出平仓' == item.direction, blue: '卖出' == item.direction || '卖出开仓' == item.direction || '买入平仓' == item.direction}">{{item.direction}}</li>
        <li style="width:5%;text-align:right;padding-right:10px;">{{item.price}}</li>
        <li style="width:5%;text-align:right;padding-right:10px;"></li>
        <li style="width:15%;text-align:right;padding-right:10px;"></li>
      </ul>
    </div>
  `,
  data: function () {
    return {
      display_change: false, //显示产品账户
      change_num: -1
    }
  },
  watch: {
    change_num: function () {
      this.display_change = false;
    },
    // item或者item_drop被修改时，都需要重新判断是否显示详细
    item: function(){
      if (this.item_drop.indexOf(this.item.id) != -1) {
        this.display_change = true;
      }else{
        this.display_change = false;
      }
    },
    // item或者item_drop被修改时，都需要重新判断是否显示详细
    item_drop: function(){
      if (this.item_drop.indexOf(this.item.id) != -1) {
        this.display_change = true;
      }else{
        this.display_change = false;
      }
    }
  },
  methods: {
    product_volume: function (product) {
      if('全部清仓' == product.volume){
        return product.volume;
      }else{
        return this.numeralNumber(product.volume, 0);
      }
    },
    change_status: function (item, status) { //修改指令
      let _this = this;
      let color_class = '';

      if ('买入' == item.direction || '买入开仓' == item.direction || '卖出平仓' == item.direction) {
        color_class = 'red';
      } else {
        color_class = 'blue';
      }
      if (2 == status) {
        let html = '';
        let all_account = `
          <ul class="product-confirm__head" style="background-color:#BEBEBE;">
            <li>
              <div>                
                <p style="display:inline-block;width:200px;text-overflow:ellipsis;white-space:nowrap;overflow:hidden;">`+item.product_position_list+`</p>
              </div>
            </li>
            <li>`+item.investment_target+`</li>
            <li class="`+color_class+`">`+item.direction+`</li>
            <li style="font-weight: 600;">`+item.price+`</li>
            <li>`+item.volume+`</li>
          </ul>
        `;
        let account_single = '';
        item.product_list.forEach((e) => {
          var user_id = window.LOGIN_INFO.user_id;
          var id = item.id;
          var product_id = e.product_id;
          common_storage.getItem('notification_userid' + user_id + '_id' + id + '_productid' + product_id, function(rtn){
            let customCls = 'normal_color';
            let pro_volume = 0;
            if (0 == rtn.code) {
              if (true == rtn.data) {
                customCls = 'start_color'
              }
            }else{
              ;
            }
            if ('全部清仓' == e.volume) {
              pro_volume = e.volume
            }else {
              pro_volume = _this.numeralNumber(e.volume,0)
            }
            account_single += `
            <ul class="product-confirm__head">
              <li><i class="single-color `+ customCls +`" data-id="` + item.id + `" data-product-id="`+e.product_id+`"></i>`+e.product_name+`</li>
              <li>`+item.investment_target+`</li>
              <li class="`+color_class+`">`+item.direction+`</li>
              <li>`+item.price+`</li>
              <li>`+pro_volume+`</li>
            </ul>
            `;
          });
        })
        // html = account_single + all_account;
        html = account_single;

        $.confirm({
          title: '执行中确认',
          content: `
            <div class="product-confirm">
              <ul class="product-confirm__head">
                <li>产品账户</li>
                <li>证券</li>
                <li>买卖方向</li>
                <li>指令价格</li>
                <li>指令数量</li>
              </ul>
              <div class="product-confirm__content">
                `+html+`
              </div>
              <div>
                `+ all_account +`
              </div>
            </div>
          `,
          closeIcon: true,
          columnClass: 'custom-window-width',
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--cancel',
          confirm: function(){
            $.ajax({
              url: '/omsv2/sync/instruction/notification_modify_status',
              type: 'POST',
              data: {
                id: item.id,
                action: status
              },
              success: ({code, msg, data})=> {
                if (0 == code) {
                  //刷新页面,方便组件重复利用
                  if ("[object Function]" == Object.prototype.toString.call(_this.$root.doRefresh)) {
                    _this.$root.doRefresh(true);
                  }
                } else {
                  $.omsAlert('指令状态无法修改！');
                }
              },
              error: ()=> {
                $.omsAlert('网络异常，请重试');
              }
            })
          },
          cancelButton: '取消'
        })
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
        })
      } else {
        $.ajax({
          url: '/omsv2/sync/instruction/notification_modify_status',
          type: 'POST',
          data: {
            id: item.id,
            action: status
          },
          success: ({code, msg, data})=> {
            if (0 == code) {
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.doRefresh)) {
                _this.$root.doRefresh(true);
              }
            } else {
              $.omsAlert('指令状态无法修改！');
            }
          },
          error: ()=> {
            $.omsAlert('网络异常，请重试');
          }
        })
      }
    },
    product_change: function () { //产品账户的显示
      // 用户点击这一行时，this.display_change不应该被修改。this.display_change必须基于item和item_drop的值来变化的。也就是说，其它可以考虑把它放进computed
      // this.display_change = !this.display_change;
      this.$emit('displayType', [this.item.id, !this.display_change])
    }, 
    displayValue: function(sub_value, rule){ //数据判断显示
      let value = sub_value[rule.id];
      if ((rule.format != '') && (rule.format instanceof Array) && (this[rule.format[0]] instanceof Function)) {
        let args = [value].concat(rule.format.slice(1))
        value = this[rule.format[0]].apply(this, args);
      }
      if (rule.unit) {
        return value + rule.unit;
      }else{
        return value;
      }
    },
    numeralNumber: function(arg, num){
      if ('--' == arg || '' === arg || undefined == arg) {
        return '--'
      }
      if (undefined != num) {
        var str = '0.'
        for (var i = num - 1; i >= 0; i--) {
          str += '0';
        }
        return numeral(arg).format( '0,' + str );
      }
      return numeral(arg).format( '0,0.00' );
    },
  }
})

//内容
Vue.component('vue-notification-content', {
  props: ['instruction_data'],
  template: `
  <div class="notification-content-menu">
    <ul class="notification-content-menu__title">
      <li v-on:click="goto(user_name,index)" :class="{active: index == idx}" v-for="(user_name,idx) in creatorList">
        {{user_name.creator_name}}<span class="flash" v-if="user_name.submit_num > 0" v-html="user_name.submit_num"></span>
      </li>
      <div style="flex-grow: 1"></div>
    </ul>
    <div class="instruction-notifition">
      <div class="instruction-notifition__head">
        <ul class="instruction-notifition__head__name">
          <li v-bind:class="rule.class" v-for="rule in notificationData.display_rules" v-bind:style="rule.style">
            <span v-bind:style="rule.sub_style">{{rule.label}}</span>
          </li>
        </ul>
      </div>
      <vue-product-sub v-for="(product_item, indexnum) in noticeData" :key="product_item.id" :product_index="index" :item="product_item" :item_drop="itemDrop" :notification_display="notificationData.display_rules" v-on:displayType="changeItemShow($event)"></vue-product-sub>
    </div>
  </div>
  `,
  data: function () {
    return {
      active: '',
      notificationData: notificationSort, //table表头
      //user_data: '', //基金经理下的数据
      index: 0, //判断显示第几个基金经理下的产品,
      itemDrop: []
    }
  },
  watch: {
    index: function () {
    }
  },
  computed: {
    user_data: function () {
      // return this.user_data = this.instruction_data;
      return this.instruction_data;
    },
    creatorList: function () {
      let rtn = [];
      let _this = this;
      this.instruction_data.list && this.instruction_data.list.forEach((e, index) => {
        var obj = {};
        let num = 0;
        obj.creator_name = e.creator_name;//基金经理名字
        e.list.forEach((i) => {
          if (1 == i.ins_status) {
            num += 1;
          }
        })
        obj.submit_num = num;
        obj.creator_id = e.creator_id;
        rtn.push(obj);
      })

      rtn.sort((a, b) => { //按照基金经理id的大小进行排序
        return a.creator_id - b.creator_id;
      })

      return rtn;
    },
    noticeData: function () {
      let rtn = [];
      let _this = this;

      if ('' != this.user_data && '' != this.user_data.list) {

        let lists = this.user_data.list.sort(function (a, b) { //按照基金经理id的大小进行排序
          return a.creator_id - b.creator_id;
        })
 
        lists[this.index].list && lists[this.index].list.forEach((e) => {
          let obj = {};
          let volume = 0;
          let product_list = [];
          let isEmptytype = false;

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

          obj.status = e.ins_status;//获取指令状态，修改指令状态的颜色
          obj.investment_target = e.investment_target;  //投资标的
          e.product_position_list && e.product_position_list.forEach((i) => {
            product_list.push(i.product_name);
          })
          obj.id = e.id;
          obj.product_position_list = product_list.join(',');  //产品账户
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
          obj.price = _this.numeralNumber(e.price,2); //指令价格
          obj.fund_manager_memo = e.fund_manager_memo;
          obj.isNumBold = e.price > 0 ;
          obj.created_at = e.created_at; //指令下达时间
          e.product_position_list && e.product_position_list.forEach((i) => {
            if('全部清仓' == i.volume){
              isEmptytype = true;
            }
            volume += parseFloat(i.volume);
          })
          obj.volume = isEmptytype ? '全部清仓' : _this.numeralNumber(volume, 0);
          obj.number = _this.paddedNumber(e.number, 3);
          rtn.push(obj);
        })
      }
      return rtn;
    }
  },
  methods: {
    numeralNumber: function(arg, num){
      if ('--' == arg || '' === arg || undefined == arg) {
        return '--'
      }
      if (0 == arg){
        return '非限价'
      }
      if (undefined != num) {
        var str = '0.'
        for (var i = num - 1; i >= 0; i--) {
          str += '0';
        }
        return numeral(arg).format( '0,' + str );
      }
      return numeral(arg).format( '0,0.00' );
    },
    paddedNumber: function(num, figures=3){
      let strNum = num.toString();
      if(strNum.length >= figures){
        return num;
      }else{
        let fix = '';
        for(let i = 0; i < figures - strNum.length; i++){
          fix += '0';
        }
        return fix + strNum;
      }
    },
    goto: function (creator, idx) { //点击产品经理切换
      let _this = this;
      this.user_data.list && this.user_data.list.forEach((e,index)=>{
        if (creator.creator_id == e.creator_id) {
          _this.index = index;
        }
      });
      this.itemDrop = []
    },
    changeItemShow: function (event){
      let [id, chgType] = event;
      if(chgType && this.itemDrop.indexOf(id) == -1){
        this.itemDrop.push(id);
      }else{
        this.itemDrop.splice(this.itemDrop.indexOf(id),1)
      }
    }
  }
})

let notification = new Vue({
  el: '#notification',
  data: {
    instruction_data: [],
    user_list: []
  },
  methods: {
    instructionLIst: function () {
      let _this = this;
      $.startLoading('正在加载');
      $.ajax({
        url: '/omsv2/sync/instruction/notification_list',
        type: 'GET',
        data: {
          direction_list: [1,2],
          page_type: 'PC',
          count: 9999
        },
        success: ({code, msg, data}) => {
          if (0 == code) {
            _this.instruction_data = data;
          } else {
            $.omsAlert(msg);
          }
          $.clearLoading();
        },
        error: ()=> {
          $.clearLoading();
          $.omsAlert('网络异常，请重试');
        }
      })
    },
    doRefresh: function () {
      this.instructionLIst();
    },
    refreshData: function () {
      let _this = this;
      $.ajax({
        url: '/omsv2/sync/instruction/notification_list',
        type: 'GET',
        data: {
          direction_list: [1,2],
          page_type: 'PC',
          count: 9999
        },
        success: ({code, msg, data}) => {
          if (0 == code) {
            _this.instruction_data = data;
          } else {
            $.omsAlert(msg);
          }
        },
        error: ()=> {
          $.omsAlert('网络异常，请重试');
        }
      })
      // 指令提醒
      $.ajax({
        type: "GET",
        url: "/omsv2/oms/get_notice",
        data: {},
        dataType: "json",
        success: ({code, msg, data}) => {
          if (code == 0 && data.today_not_finished_ins_count > 0) {
            $.omsSoundNotice(1000, '/sound/pulse');
          }
        }
      });
    }
  }
})

notification.instructionLIst();
// 5秒调一次接口
setInterval(function () {
  notification.refreshData();
}, 5000)
