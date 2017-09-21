function reportGroupFn () {
  /*报表页面*/
  // 综合报表页面
  // Author: xueke.song, andrew.liu

  // 产品组排序的公共数据
  // 每一次ajax获取到产品组信息时，获取保存的排序规则进行排序       已实现
  // 每一次用户拖动之后，计算出交换的步骤，修改后保存               保存已实现，但是计算过程还没有
  let productSortData = {
    field_sort: []
  };
  // 表格列拖动的公共数据
  // 每一次ajax获取到产品组信息时，获取保存的排序规则进行排序       已实现
  // 每一次用户拖动之后（或者点击排序方式修改），修改保存           已实现
  let comGridSortData = {
    // field_sort 变量在显示时无用，只是保存及与后端交互时需要用到该变量名。保存的field_sort是要用来决定display_rules的数组元素顺序的。
    // 譬如，可以在浏览器console中执行“comGridSortData.display_rules.shift()”，可以看到表格的动态变化
    // field_sort: ['security_type_name', 'security_id', 'security_name', 'security_market', 'pos_direction_name', 'hold_volume', 'market_value', 'contract_value', 'profit_rate', 'weight'],
    order: '',
    order_by: '',
    display_rules: [{
      id: 'security_type_name', // 变量id
      label: '证券类别',         // 变量显示名称
      format: '',               // 格式化处理函数，不能提前进行处理，因为数据还要用来排序什么的。此处的处理理解为只为显示，脱离于逻辑 （函数定义于vue中）
      class: 'left60'           // 样式
    },{
      id: 'security_id',
      label: '证券代码',
      format: '',
      class: 'left60'
    },{
      id: 'security_name',
      label: '证券名称',
      format: '',
      class: 'left60'
    },{
      id: 'pos_direction_name',
      label: '持仓方向',
      format: '',
      class: 'left60'
    },{
      id: 'hold_volume',
      label: '持仓数量',
      format: '',
      class: 'right60'
    },{
      id: 'market_value',
      label: '持仓市值',
      format: ['numeralNumber', 2],
      addition_icon: 'market_value_icon',
      class: 'right60'
    },{
      id: 'contract_value',
      label: '合约价值',
      format: ['numeralNumber', 2],
      class: 'right60'
    },{
      id: 'profit_rate',
      label: '浮盈率',
      format: ['numeralNumber', 2],
      class: 'right60',
      unit: '%'
    },{
      id: 'weight',
      label: '权重',
      format: ['numeralNumber', 2],
      class: 'right60',
      unit: '%'                   // 附带后缀单位
    },
    {
      id: 'remark_change',
      label: '备注',
      class: 'remark_left'
    }]
  };

  //持仓股票 完整模式,含有positionModel:1代表是精简模式
  let positionSortData = {
    order: 'desc',  //默认按降序排列，desc降序，asc升序
    order_by: 'proportion_capital',  //默认按照什么进行排序，这儿填写的是display_rules下的某一个id名
    display_rules: [{
      id: 'stock_code',
      label: '证券代码',
      format: '',
      class: 'left60',
      style: 'padding-left:40px;'
    },{
      id: 'stock_name',
      label: '证券名称',
      format: '',
      class: 'left60',
      positionModel: 1,
      style: 'padding-left:40px;'
    },{
      id: 'hold_volume',
      label: '持仓数量',
      format: '',
      class: 'right60',
      style: 'padding-right:40px;'
    },{
      id: 'market_value',
      label: '持仓市值',
      format: ['numeralNumber', 2],
      addition_icon: 'market_value_icon',
      class: 'right60',
      style: 'padding-right:40px;'
    },
    {
      id: 'proportion_capital',
      label: '占总股本',
      format: ['numeralNumber', 2],
      class: 'right60',
      unit: '%',
      positionModel: 1,
      style: ''
    },
    {
      id: 'position_capital_5',
      label: '5%总股本',
      format: ['numeralNumber', 2],
      class: 'right60',
      style: 'padding-right:40px;'
    },
    {
      id: 'total_share_capital',
      label: '总股本量',
      format: ['numeralNumber', 2],
      class: 'right60',
      style: 'padding-right:40px;'
    },
    {
      id: 'position_placards',
      label: '举牌差值',
      format: ['numeralNumber', 2],
      addition_icon: 'market_value_icon',
      class: 'right60',
      style: 'padding-right:40px;'
    },
    {
      id: 'remark',
      label: '备注',
      class: 'remark_left ',
      positionModel: 1
    }]
  };

  let positionGridSortData = {
    field_sort: []
  }

  let reportActive = '';
  if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_PISITION_REPORT_VIEW']]) {  //持仓报表
    reportActive = 'position';
  }
  if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_REPORT_VIEW']]) {  //产品报表
    reportActive = 'product';
  }
  //修改备注新样式
  Vue.component('vue-remark-modify',{
    props: ['remark', 'ajax_url', 'ajax_data', 'remark_name'],
    template: `
      <div class="modify-remark">
        <div class="modify-remark__content">
          <span class="modify-remark__content__value" v-text="security_remark()" :title="remark"></span>
          <a class="modify-remark__content__icon" v-on:click="toggle()"></a>
        </div>
        <div class="modify-remark__describle" v-show="show_remark">
    	    <input type="text" :value="remark_modify" v-on:input="remark_modify = $event.target.value" class="modify-remark__describle__input" v-on:blur="onBlur()"/>
    	    <a v-on:mousedown="save()" class="modify-remark__describle__determine">确定</a>
    	    <a v-on:click="change_show()" class="modify-remark__describle__cancel">取消</a>
    	  </div>
      </div>
    `,
    data: function () {
    	return {
    	  show_remark: false,
        remark_modify: ''
    	}
    },
    methods: {
    	toggle: function () { //当点击输入文字的icon时，应该只能显示修改框，不能隐藏
    	  this.show_remark = true;
        let _this = this;
        if ('' == this.remark || undefined == this.remark) {
          this.remark_modify = '';
        } else {
          this.remark_modify = this.remark;
        }
        this.$nextTick(function(){
          $(_this.$el).find('input.modify-remark__describle__input').focus();
        })
    	},
    	change_show: function () {
        this.show_remark = false;
    	},
      onBlur: function () {
        this.show_remark = false;
      },
      security_remark: function () {
        if ('' == this.remark || undefined == this.remark) {
          return '--';
        } else {
          return this.remark;
        }
      },
    	save: function () {
        var _this = this;
        if (this.remark_modify.length > 200) {
          $.omsAlert('最多支持输入200个字');
          return false;
        }

        $.startLoading('正在查询');

    	  $.ajax({
    	    url: this.ajax_url+'?'+this.remark_name+'=' + this.remark_modify,
    	    type: 'POST',
    	    data: this.ajax_data,
    	  	success:function ({code,msg,data}) {
            if (0 == code) {
              _this.show_remark = false;
              $.omsAlert('修改成功');

              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
                _this.$root.customRefreshAfterModified(true);
              }
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.positionDoRefresh)) {
                _this.$root.positionDoRefresh(true);
              }
            } else {
              $.omsAlert(msg);
            }
            $.clearLoading();
    	  	},
    	  	error:function () {
            $.omsAlert('网络异常，请重试');
            $.clearLoading();
    	  	}
    	  })
    	}
    }
  })

  // 下拉框插件 selectize  专属于产品标记
  Vue.component('vue-selectize-sign', {
    props: ['options', 'value', 'place_holder'],
    template: `
        <select>
          <slot></slot>
        </select>
    `,
    mounted: function () {
      var vm = this;
      var selectize = $(this.$el).selectize({
        delimiter: ',',
        persist: true,
        placeholder: this.place_holder,
        valueField: 'value',
        labelField: 'label',
        onChange: function(v){
          vm.$emit('input', v);
        },
        render: {
          option: function (item,escape) {
            let label = item.label;
            return '<div class="option select_sign">' +
                '<span class="select_sign_icon '+item.color+'"></span>'+
                '<span class="label">'+escape(label)+'</span>'+
                '</div>';
          }
        }
      })[0].selectize;
      selectize.addOption(this.options);
      selectize.setValue('all');
      selectize = null;
    },
    watch: {
      value: function (value) {
        // update value
        $(this.$el).selectize()[0].selectize.setValue(value);
      },
      options: function (options) {
        // // update options
        var value = this.value;
        var selectize = $(this.$el).selectize()[0].selectize;
        selectize.clearOptions(true);
        selectize.clearOptions(true);
        selectize.addOption(this.options);
        selectize.setValue(value);
        selectize = null;
      }
    }
  });

  //子基金产品详细内容
  Vue.component('report-table-sub-funds', {
    props: ['position_list', 'pos_total', 'product_info', 'current_product_remark'],
    template: `
    <table class="journel-sheet-grid">
      <draggable :list="display_rules" element="tr" :options="dragOptions" :move="onMove" @end="onEnd">
        <th v-bind:class="rule.class" v-for="rule in display_rules">
          <span>{{rule.label}}</span>
          <a class="icon-sortBy" v-on:click="chgSort(rule.id)" v-if="rule.label != '备注'">
            <i class="icon-asc" :class="{active: (order_by == rule.id && order == 'asc')}"></i>
            <i class="icon-desc" :class="{active: (order_by == rule.id && order == 'desc')}"></i>
          </a>
        </th>
      </draggable>
      <tbody>
        <tr v-for="sub_value in display_position" :class="{lavender: sub_value.security_type==5&&pos_total==true, light_blue: sub_value.security_type==2&&pos_total==true, asset_yellow: sub_value.security_type==4&&pos_total==true}" :title="onmousePromit(sub_value)">
          <td v-for="rule in display_rules" v-bind:class="rule.class">
            <vue-remark-modify v-if="rule.class=='remark_left'" :remark_name="'remark'" :remark="getReportRemark(product_info.id,sub_value.security_id,product_info.type)" :ajax_url="getRemarksUrl()" :ajax_data="{stock_id:sub_value.security_id,product_id:product_info.id,type:product_info.type}"></vue-remark-modify>
            <span v-else>
              {{displayValue(sub_value, rule)}}
              <prompt-language v-if="'market_value_icon' == rule.addition_icon && 1== sub_value.market_status" :language_val="'系统已对其中'+sub_value.hold_volume+'股进行停牌股票估值调整，停牌日市值为'+numeralNumber(sub_value.market_value_before,2)+'，调整后市值为'+numeralNumber(sub_value.market_value,2)" style="width: 15px;display: inline-block;left: 0;"></prompt-language>
            </span>
          </td>
        </tr>
      </tbody>
    </table>
    `,
    data: function () {
      return comGridSortData;
    },
    computed: {
      // 可拖动插件的入参
      dragOptions () {
        return  {
          animation: 0,
          // group: 'description',
          // disabled: !this.editable,
          ghostClass: 'ghost'
        };
      },
      // 显示数据准备
      display_position: function(){
        let _this = this;
        let rtn = [];
        this.position_list.forEach(function(e){
          let obj = {};
          obj.security_type = e.security_type;

          // 证券类别
          obj.security_type_name = e.security_type_name;
          // 证券代码
          let arrSecurityId = e.security_id.split(/\..*/);
          obj.security_id = arrSecurityId[0];
          // 证券名称
          obj.security_name = e.security_name;
          // 持仓方向
          obj.pos_direction_name = e.pos_direction_name
          // 持仓数量
          obj.hold_volume = _this.parseIntNumber(e.exclude_sub && e.exclude_sub.hold_volume);

          // 持仓市值 针对股票，需要判断是否计算停牌股票
          if (e.security_type_name == '期货') {
            obj.market_value = '--';
          }else{
            if(e.exclude_sub.suspension_info.status == 1){
              obj.market_value = e.exclude_sub && e.exclude_sub.suspension_info.valuation;  //停牌估值后的市值
              obj.market_status = e.exclude_sub.suspension_info.status;  //是否停牌估值1停牌估值
              obj.market_value_before = e.exclude_sub && e.exclude_sub.market_value;
            }else{
              obj.market_value = e.exclude_sub && e.exclude_sub.market_value;
            }
          }

          // 合约价值
          // obj.contract_value = e.exclude_sub && e.exclude_sub.contract_value;
          if (e.security_type_name == '期货') {
            obj.contract_value = e.exclude_sub && e.exclude_sub.market_value;
          }else{
            obj.contract_value = '--';
          }

          // 浮盈率
          if (e.exclude_sub.profit_rate == '--') {
            obj.profit_rate = '--';
          }else{
            obj.profit_rate = e.exclude_sub.profit_rate*100;
          }

          // 权重
          if (1 == e.exclude_sub.suspension_info.status == 1) {
            obj.weight = e.exclude_sub.suspension_info.weight*100;
          }else{
            obj.weight = e.exclude_sub.weight*100;
          }

          rtn.push(obj);
        });

        // 步骤2，根据排序逻辑进行排序
        rtn = VUECOMPONENT.sort(rtn, _this.order, _this.order_by);
        return rtn;
      }
    },
    methods: {
      getRemarksUrl: function(){
        return '/bms-pub/report/remark/add_remark';
      },
      getReportRemark: function (remark_id,security_id,type) {  //通过方法得到相对应的备注  remark_id是产品id security_id是股票id
        var get_remark;
        this.current_product_remark.forEach(function (e) {
          if (remark_id == e.product_id && security_id == e.stock_id && type == e.type) {
            get_remark = e.remark;
          }
        })
        return get_remark;
      },
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
          return e.id;
        });
        obj.order_by = this.order_by;
        obj.order = this.order;
        common_storage.setItem('report_group__grid_order', obj);
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
        if ('备注' == draggedContext.element.label) {
          return false;
        }
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;

        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      },
      onEnd ({}){
        // 用户切换表格排序，需要保存新的排序
        let obj = {};
        obj.field_sort = this.display_rules.map(function(e){
          return e.id
        });
        obj.order_by = this.order_by;
        obj.order = this.order;
        common_storage.setItem('report_group__grid_order', obj);
      },
      getDescInfo: function () { //备注
        var _this = this;
        this.product_info.sub_product.forEach(function (e) {
          _this.id = e.id;
          if (_this.id == e.id) {
            _this.ajax_url = window.REQUEST_PREFIX + 'omsv2/report/product_group_report_remark?id='+e.id+'&type='+e.type+'&stock_id='+e.net_pos.stock_id+'&desc='+_this.value
          }
        })
      },
      parseIntNumber: function (num) { //将数字变为整数
        return parseInt(num);
      },
      onmousePromit: function (sub_value) { //
        if (this.pos_total == false) {
          return false;
        } else {
          if (sub_value.security_type == 5) {
            return '定增持仓';
          } else if (sub_value.security_type == 2) {
            return '收益互换持仓';
          } else if (sub_value.security_type == 4) {
            return '场外货币基金';
          }
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
      checkPositive: function(num){
        return parseFloat(num) > 0;
      },
      checkNegative: function(num){
        return parseFloat(num) < 0;
      }
    }
  })

  //基金产品详情
  Vue.component('report-table-securities', {
    props: ['product_info', 'show', 'pos_total', 'current_product_remark'],
    template: `
      <table class="journel-sheet-grid">
        <draggable :list="display_rules" element="tr" :options="dragOptions" :move="onMove" @end="onEnd">
          <th v-bind:class="rule.class" v-for="rule in display_rules">
            <span>{{rule.label}}</span>
            <a class="icon-sortBy" v-on:click="chgSort(rule.id)" v-if="rule.label != '备注'">
              <i class="icon-asc" :class="{active: (order_by == rule.id && order == 'asc')}"></i>
              <i class="icon-desc" :class="{active: (order_by == rule.id && order == 'desc')}"></i>
            </a>
          </th>
        </draggable>
        <tbody>
          <tr v-for="fund_content in display_position" :class="{lavender:  fund_content.security_type==5&&pos_total==true, light_blue: fund_content.security_type==2&&pos_total==true, asset_yellow: fund_content.security_type==4&&pos_total==true}" :title="onmousePromit(fund_content)" v-if="show || (!show && !(fund_content.hold_volume == 0 && fund_content.market_value == 0))">
            <td v-for="rule in display_rules" v-bind:class="rule.class">
              <vue-remark-modify  v-if="rule.class=='remark_left'" :remark_name="'remark'" :remark="getReportRemark(product_info.id,fund_content.security_id,product_info.type)" :ajax_url="getRemarksUrl()" :ajax_data="{stock_id:fund_content.security_id,product_id:product_info.id,type:product_info.type}"></vue-remark-modify>
              <span v-else>
                {{displayValue(fund_content, rule)}}
                <prompt-language v-if="'market_value_icon' == rule.addition_icon && 1== fund_content.market_status" :language_val="'系统已对其中'+fund_content.hold_volume+'股进行停牌股票估值调整，停牌日市值为'+numeralNumber(fund_content.market_value_before,2)+'，调整后市值为'+numeralNumber(fund_content.market_value,2)" style="width: 15px;display: inline-block;left: 0;"></prompt-language>
              </span>
            </td>
          </tr>
        </tbody>
      </table>
    `,
    data: function () {
      return comGridSortData
    },
    computed: {
      // 可拖动插件的入参
      dragOptions () {
        return  {
          animation: 0,
          // group: 'description',
          // disabled: !this.editable,
          ghostClass: 'ghost'
        };
      },
      // 显示数据准备
      display_position: function(){
        let _this = this;
        let rtn = [];
        let subData_str = '';
        if (this.show) {
          subData_str = 'include_sub';
        }else{
          subData_str = 'exclude_sub';
        }

        // 步骤1，根据接口数据进行准备
        this.product_info.position_list.forEach(function(e){
          let obj = {};
          obj.security_type = e.security_type;

          // 证券类别
          obj.security_type_name = e.security_type_name;
          // 证券代码
          let arrSecurityId = e.security_id.split(/\..*/);
          obj.security_id = arrSecurityId[0];
          // 证券名称
          obj.security_name = e.security_name;
          // 持仓方向
          obj.pos_direction_name = e.pos_direction_name
          // 持仓数量
          obj.hold_volume = _this.parseIntNumber(e[subData_str] && e[subData_str].hold_volume);

          // 持仓市值 针对股票，需要判断是否计算停牌股票
          if (e.security_type_name == '期货') {
            obj.market_value = '--';
          }else{
            if(e[subData_str].suspension_info.status == 1){
              obj.market_value = e[subData_str] && e[subData_str].suspension_info.valuation;
              obj.market_status = e[subData_str] && e[subData_str].suspension_info.status;
              obj.market_value_before = e[subData_str] && e[subData_str].market_value;
            }else{
              obj.market_value = e[subData_str] && e[subData_str].market_value;
            }
          }

          // 合约价值
          // obj.contract_value = e[subData_str].market_value;
          if (e.security_type_name == '期货') {
            obj.contract_value = e[subData_str].market_value;
          }else{
            obj.contract_value = '--';
          }

          // 浮盈率
          if (e[subData_str].profit_rate == '--') {
            obj.profit_rate = '--';
          }else{
            obj.profit_rate = e[subData_str].profit_rate*100;
          }

          // 权重
          if (1 == e[subData_str].suspension_info.status == 1) {
            obj.weight = e[subData_str].suspension_info.weight*100;
          }else{
            obj.weight = e[subData_str].weight*100;
          }

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
        //     if (x == '--') {
        //       return -1
        //     }
        //     if (y == '--') {
        //       return 1
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
      getRemarksUrl: function(){
        return '/bms-pub/report/remark/add_remark';
      },
      getReportRemark: function (remark_id,security_id,type) {  //通过方法得到相对应的备注  remark_id是产品id security_id是股票id
        var get_remark;
        this.current_product_remark.forEach(function (e) {
          if (remark_id == e.product_id && security_id == e.stock_id && type == e.type) {
            get_remark = e.remark;
          }
        })
        return get_remark;
      },
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
        common_storage.setItem('report_group__grid_order', obj);
      },
      displayValue: function(sub_value, rule){
        let value = sub_value[rule.id];
        if ((rule.format != '') && (rule.format instanceof Array) && (this[rule.format[0]] instanceof Function)) {
          // value = this[rule.format].call(this, value, )
          let args = [value].concat(rule.format.slice(1))
          value = this[rule.format[0]].apply(this, args);

        }
        if (rule.unit) {  //针对浮盈率和权重
          if ('--' == value) {
            return value;
          } else {
            return value + rule.unit
          }
        }else{
          return value;
        }
      },
      onMove ({relatedContext, draggedContext}) {
        if ('备注' == draggedContext.element.label) {
          return false;
        }
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;

        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      },
      onEnd (){
        // 用户切换排序命令，需要保存新的排序
        let obj = {};
        obj.field_sort = this.display_rules.map(function(e){
          return e.id
        });
        obj.order_by = this.order_by;
        obj.order = this.order;
        common_storage.setItem('report_group__grid_order', obj);
      },
      getDescInfo: function () {
        var _this = this;
        this.product_info.forEach(function (e) {
          _this.id = e.id;
          if (_this.id == e.id) {
            _this.ajax_url = window.REQUEST_PREFIX + 'omsv2/report/product_group_report_remark?id='+e.id+'&type='+e.type+'&stock_id='+e.net_pos.stock_id+'&desc='+_this.value;
          }
        })
      },
      onmousePromit: function (fund_content) {  //判断基金类型
        if (this.pos_total == false) {
          return false;
        } else {
          if (fund_content.security_type == 5) {
              return '定增持仓';
          } else if (fund_content.security_type == 2) {
              return '收益互换持仓';
          } else if (fund_content.security_type == 4) {
              return '场外货币基金';
          }
        }
      },
      parseIntNumber: function (num) {
        return parseInt(num);
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
      checkPositive: function(num){
        return parseFloat(num) > 0;
      },
      checkNegative: function(num){
        return parseFloat(num) < 0;
      }
    }
  })

  //hover提示语
  Vue.component('prompt-language', {
    props: ['language_val'],
    template: `<span class="dot-tip exclamation">
      <div v-on:mouseover="language_show()" v-on:mouseout="language_hide()">
        <em>i</em>
        <div class="str" style="display:none;">
          <span class="msg">
            <span>{{language_val}}</span>
          </span>
        </div>
      </div>
    </span>`,
    methods: {
      language_show: function () {
        $(this.$el).find('.str').show();
        if ($(this.$el).find('.str .msg').css('width').split('px')[0] > 300) {
          $(this.$el).find('.str .msg').addClass('hover-tip-width');
        } else {
          $(this.$el).find('.str .msg').removeClass('hover-tip-width');
        }
      },
      language_hide: function () {
        $(this.$el).find('.str').hide();
        $(this.$el).find('.str .msg').removeClass('hover-tip-width');
      }
    }
  })

  //页面头部
  Vue.component('report-table-head', {
    props: ['product_list', 'current_data', 'current_procut_id', 'product_info_arr', 'product_current_sign', 'product_sign_pole_all', 'product_sign_arr'],  //slot 具名标签
    template: `
      <div class="journel_sheet_head" style="display:block;padding-bottom:10px;">
        <div style="display:flex;">
            <select name="product_type" class="journel_sheet_head--select" v-model="show_type">
              <option value="running">运行中</option>
              <option value="end">已结束</option>
              <option value="">全部状态</option>
            </select>
          <div class="journel_sheet_head--select">
            <vue-multiple_select :options="options" :flag_check_all="true" :chg_opt_flag_check_all="true" :checked_arr="chgSelected" :init_obj="init_obj" v-on:multiple_select="chgSelected = ($event)"></vue-multiple_select>
          </div>
          <div class="journel_sheet_head--date">
            <vue-zebra_date_picker :value="currentDate" v-on:select="currentDate = ($event)"  :min_date="'2015-01-01'" :max_date="currentDate"></vue-zebra_date_picker>
          </div>
          <div class="report_form_head_security">
            <input id="pos_total" type="checkbox" v-model="pos_total" style="margin-right: 5px;" /><label v-on:click="checkbox_pos_total()" style="margin-right:10px;">区分场外持仓</label>
            <template v-if="!disabled_type">
              <input id="cal_expect" type="checkbox" v-model="cal_expect" style="margin-right: 5px;" /><label v-on:click="checkbox_cal_expect()" style="margin-right:10px;">展示预估值</label>
            </template>
            <template v-else>
              <div style="display: inline-block;" @mouseenter="show_tip" @mouseleave="hide_tip">
                <input id="cal_expect" type="checkbox" v-model="cal_expect" style="margin-right: 5px;" disabled /><label style="margin-right:10px;position: relative;"  >展示预估值
                  <div v-show="tip_show" style="position: absolute;width: 160px;border: 1px solid  #d7d5d5;text-align: center;border-radius: 4px;left: -20px;position: absolute;diplay:block">仅支持查看当天预估值</div>
                </label>
              </div>
            </template> 
          </div>
          <div style="flex-grow: 1;"></div>
          <div class="journel_sheet_head--select">
            <vue-selectize-sign :options="sign_arr" :placeholder="'请选择标记产品'" :value="select_id" v-on:input="select_id = ($event)"></vue-selectize-sign>
          </div>
          <a v-on:click="export_report()" :class="'custom-grey-btn custom-grey-btn__export'" style="margin-right:15px;">
            <i class="oms-icon oms-icon-export"></i>导出
          </a>
          <a v-on:click="refresh()" class="custom-grey-btn custom-grey-btn__refresh">
            <i class="oms-icon refresh"></i>刷新
          </a>
        </div>
        <div class="journel_sheet_head__types">
          <div class="journel_sheet_head__type3">
            <i></i>货币基金
          </div>
          <div class="journel_sheet_head__type2">
            <i></i>收益互换
          </div>
          <div class="journel_sheet_head__type1">
            <i></i>场外定增
          </div>
        </div>
        <div class="open-close" v-on:click="all_show()">
          <span class="open-close__icon">
            <i class="open-close__icon__bgd"></i>
          </span>
          <p class="open-close__describle" v-text="all_show_describle"></p>
        </div>
      </div>
    `,
    data: function(){
      return {
        currentDate: (function(){return moment().format('YYYY-MM-DD')})(),
        chgSelected: '',
        checked_arr: '',
        chgSignSelected: '',
        checked_sign_arr: '',
        pos_total: true,
        cal_expect: false,
        end_product: true,  //是否隐藏已结束产品
        all_show_describle: '收起全部',
        show_open_close: true,  //是否全部展开
        // init_obj: {
        //   allSelected: '全部产品',
        //   noMatchesFound: '未选择任何产品',
        //   placeholder: '请选择产品'
        // },
        select_id: '',
        show_type: this.$root.end_product,
        disabled_type:false,
        tip_show:false,
      }
    },
    computed: {
      options: function(){
        var rtn = [];
        this.product_list.forEach(function(e){
          var obj = {
            type: e.type,
            label: e.name,
            status: e.status,
            value: e.id+'&'+e.type
          }
          rtn.push(obj);
        })
        if (this.$root.end_product === 'running') {
          rtn = rtn.filter(function(item) {
            if (item.status == 5) {
              return item;
            }
          })
        } else if (this.$root.end_product === 'end') {
          rtn = rtn.filter(function(item) {
            if (item.status == 6) {
              return item;
            }
          })
        }
        return rtn;
      },
      sign_arr: function () {
        var sign_arr = [{'value':'all','label':'查看"全部标记"','color':'hide'}];
        this.product_current_sign.forEach((e) => {
          var obj = {
            type: e.status,
            label: '查看"'+e.keyword+'"标记',
            value: e.sign_id,
            color: e.sign_color
          }
          if (1 == obj.value) {
            obj.label = '查看"'+e.keyword+'"';
          }
          sign_arr.push(obj);
        })
        return sign_arr;
      },
      init_obj: function() {
        var obj = {
          allSelected: '全部基金',
          noMatchesFound: '未选择任何基金',
          placeholder: '请选择基金'
        }
        if (this.$root.end_product === 'running') {
          obj['allSelected'] = '全部运行中基金';
        } else if (this.$root.end_product === 'end') {
          obj['allSelected'] = '全部已结束基金';
        }
        return obj;
      }
    },
    methods: {
      show_tip(){
        this.tip_show = true;
      },
      hide_tip(){
        this.tip_show = false;
      },
      all_show: function () {
        if (true == this.show_open_close) {
          this.show_open_close = false;
          this.all_show_describle = '展开全部';
          $(".open-close__icon__bgd").css('transform','rotate(180deg)');
        } else {
          this.show_open_close = true;
          this.all_show_describle = '收起全部';
          $(".open-close__icon__bgd").css('transform','rotate(0deg)');
        }
      },
      export_report: function(){
        //导出
        var _this = this;
        if ( this.current_procut_id.length == 0) {
          $.omsAlert('请先选择产品组或账户');
        } else {
          var _change_id_type = '';
          //lists下面的id存储数组
          var lists_id = [];
          //base下面的id存储数组
          var product_id = [];
          //根据到处按钮的背景色来判断是否导出报表
          if ($(".custom-grey-btn__export").hasClass('doBtnExport_bgd')) {
            return false;
          }
          //是否汇总证券
          var _security_summary;
          if (_this.pos_total == false) {
            _security_summary = 1;
          } else if (_this.pos_total == true) {
            _security_summary = 0;
          }

          var cal_expect; //是否掺看预期变化
          if (false == this.cal_expect) {
            cal_expect = 0;
          }else{
            cal_expect = 1;
          }

          var end_product;  //是否隐藏已结束产品
          if (false == this.end_product) {
            end_product = '';
          } else {
            end_product = 'running';
          }

          let product_sign;//由于标记筛选需要特殊处理
          let productAarr = [];
          this.product_sign_arr.forEach((e) => {
            if (1 == e.type) {
              productAarr.push(e.id+"&group");
            } else if (2 == e.type) {
              productAarr.push(e.id+"&base");
            }
          })
          //如果标记为空或者all时，导出所选中的产品id
          if (this.select_id == '' || 'all' == this.select_id) {
            product_sign = _this.current_procut_id;
          } else {
            product_sign = productAarr;
          }
          product_sign.forEach(function (i) {
            if ('group' == i.split('&')[1]) {
              lists_id.push(i.split('&')[0]);
            }
            if ('base' == i.split('&')[1]) {
              product_id.push(i.split('&')[0])
            }
          })
          if (lists_id.length === 0) {
            _change_id_type = 'product_id=' + product_id.join(',');
          }
          if (product_id.length === 0) {
            _change_id_type = 'group_id=' + lists_id.join(',');
          }

          if (lists_id.length > 0 && product_id.length > 0) {
            _change_id_type ='group_id=' + lists_id.join(',') + '&product_id=' + product_id.join(',');
          }

          //
          let sorted = {};
          sorted.field_sort = comGridSortData.display_rules.map(function(e){
            return e.id
          });
          sorted.order = comGridSortData.order;
          sorted.order_by = comGridSortData.order_by;
          sorted.include_sub = 1; //是否包含子产品
          let arr = [];
          this.product_info_arr.forEach((e) => {
            let id = '';
            if (e.type == 1) {
              id += 'g';    // group 产品组
            }else if(e.type == 2){
              id += 'b';    // base 底层账户
            }else{
              ;             // 匹配失败，不带前缀
            }

            id += e.id;
            arr.push(id);
          });
          sorted.group = arr;

          //筛选标记
          let product_sign_id;
          if ('all' == this.select_id) {
            product_sign_id = '';
          } else {
            product_sign_id = this.select_id;
          }
          $.startLoading();
          $.ajax({
            url: '/bms-pub/report/export_product_group_report?'+_change_id_type+'&date='+this.currentDate +
              '&sorted[field_sort]='+ sorted.field_sort.join(',') +'&sorted[order]=' + sorted.order +
              '&sorted[order_by]=' + sorted.order_by + '&sorted[group]=' + sorted.group.join(','),
            type: 'GET',
            data: {
              date: _this.currentDate,
              cal_expect: cal_expect,
              security_summary: _security_summary,
              end_product: this.show_type,
              product_sign_id: product_sign_id
            },
            success: ({code,msg,data}) => {
              $.clearLoading();
              $.omsAlert('正为您生成报表，成功后可进入文件中心下载');
            },
            error: () => {
              $.omsAlert('网络异常，请重试');
            }
          })
        }
      },
      refresh: function(){  //刷新
        if ($('.refresh-btn').hasClass('loading')) {
          return;
        }
        $('.refresh-btn').addClass('loading');
        //刷新页面,方便组件重复利用
        if ("[object Function]" == Object.prototype.toString.call(this.$root.customRefreshAfterModified)) {
          this.$root.customRefreshAfterModified(true);
        }
      },
      checkbox_pos_total: function () { //汇总证券的点击区域扩大
        if (true == this.pos_total) {
          this.pos_total = false;
        } else {
          this.pos_total = true;
        }
      },
      checkbox_cal_expect: function(){  //展示预期变化
        if (true == this.cal_expect) {
          this.cal_expect = false;
        } else {
          this.cal_expect = true;
        }
      },
      judge_date(){
        //判断是否当前时间 
        let date = new Date;
        let arr = this.currentDate.split('-');
        if(date.getFullYear() == arr[0] && (date.getMonth()+1) == arr[1] && date.getDate() == arr[2]){
          //时间为当前时间
          return true;
        }else{
          return false;
        }
      }
    },
    watch: {  //监听数据变化
      currentDate: function(){  //获取时间
        if(!this.judge_date()){
          this.disabled_type = true;
          this.cal_expect = false;
        }else{
          this.disabled_type = false;

        }
        this.$emit('change_begin_data', this.currentDate);
      },
      chgSelected: function(){  //获取选中基金产品的id
        this.$emit('change_selected', this.chgSelected);
      },
      pos_total: function () {  //是否汇总基金
        this.$emit('change_total', this.pos_total);
      },
      cal_expect: function(){
        //是否按预期汇总
        this.$emit('cal_expect', this.cal_expect);
      },
      end_product: function () { //是否隐藏已结束产品
        this.$emit('change_end_product', this.end_product);
      },
      show_open_close() {
        this.$emit('control_show_hide', this.show_open_close);
      },
      select_id: function () {
        this.$emit('select_sign_id',this.select_id);
      },
      show_type(val){
        //显示产品的状态  running 运行中 空 所有   end结束
        this.end_product = val;
      }
    }
  })
  //基金自身
  Vue.component('report-table-content', {
    props: ['product_info', 'current_data','pos_total', 'moving', 'control_show', 'cal_expect', 'current_product_remark', 'product_current_sign', 'curren_sign_pole', 'product_sign_pole_all', 'product_info_arr'],
    template: `
    <div>
      <div class="journel-sheet-content__head" style="position: relative;" :class="{'journel-sheet-content__head--display': display_detail}">
        <dl style="width:22%;">
          <dt>
            <span :title="product_info.name">{{product_info.name}}(<span v-text="currentData()">{{current_data}}</span>)</span>
            <a class="icon-display-hide" :class="{'icon-display-hide__display': display_detail, 'icon-display-hide__hide': !display_detail}" v-on:click="toggleDisplay()"><i></i></a>
          </dt>
          <dd>数据更新时间：{{product_info.update_time}}</dd>
        </dl>

        <div style="width:16%;">
          <vue-custom_v2-dl-modify v-if="cal_expect" :name="'预估净资产'" :adjust_value="product_info.adjust_assets" :current_value="product_info.total_assets" :value="product_info.estimate_asset" :id="'adjust_assets'" :ajax_url="getAdjustAssetsUrl()" :ajax_data="{group_id: product_info.id, type: (1==product_info.type)?'group':'base'}"></vue-custom_v2-dl-modify>
          <vue-custom-dl v-else :name="'净资产'" :value="numeralNumber(product_info.total_assets,2)"></vue-custom-dl>
        
        </div>
        <div style="width:14%;">
          <vue-custom_v2-dl-modify v-if="cal_expect" :name="'预估份额'" :adjust_value="product_info.adjust_volume" :current_value="product_info.volume" :value="product_info.estimate_volume" :id="'adjust_volume'" :ajax_url="getAdjustVolumeUrl()" :ajax_data="{group_id: product_info.id, type: (1==product_info.type)?'group':'base'}"></vue-custom_v2-dl-modify>
          <vue-custom-dl v-else :name="'份额'" :value="numeralNumber(product_info.volume,0)" v-if=""></vue-custom-dl>
        
        </div>
        <div style="width:8%;">
          <vue-custom-dl  v-if="cal_expect" :name="'预估净值'" :value="numeralNumber(product_info.estimate_net_value,4)"></vue-custom-dl>
          <vue-custom-dl v-else :name="'单位净值'" :value="numeralNumber(product_info.net_value,4)"></vue-custom-dl>
        </div>
        <div style="width:7%;">
          <vue-custom-dl :name="'股票仓位'" :value="numeralNumber(product_info.stock_position*100,2)+'%'"></vue-custom-dl>
        </div>
        <div style="width:6%;">
          <vue-custom-dl :name="'净多头'" v-if="product_info.type == '1'" :value="numeralNumber(product_info.net_bullish*100,2)+'%'"></vue-custom-dl>
          <vue-custom-dl :name="'净多头'" v-if="product_info.type == '2'" :value="'--'"></vue-custom-dl>
        </div>
        <div style="width:8%;">
          <vue-custom-dl :name="'偏离度'" :value="poleDeviation(product_info.deviation_degree)">
            <div class="start-sign">
              <span v-if="undefined != curren_sign_pole.sign_color" :class="'start-sign__product productInfoId_'+product_info.id+' '+curren_sign_pole.sign_color" v-on:click="change_sign_list()" @mouseenter="product_scrible_hover=true" @mouseleave="product_scrible_hover=false"></span>
              <span v-if="undefined == curren_sign_pole.sign_color" :class="'start-sign__product productInfoId_'+product_info.id+' sign_normal'" v-on:click="change_sign_list()" @mouseenter="product_scrible_hover=true" @mouseleave="product_scrible_hover=false"></span>

              <span v-if="1 == curren_sign_pole.is_benchmarking" :class="'start-sign__pole pole_start_light'" v-on:click="product_sign_pole(curren_sign_pole.sign_id,curren_sign_pole.is_benchmarking)"></span>
              <span v-else :class="'start-sign__pole pole_normal'" v-on:click="product_sign_pole(curren_sign_pole.sign_id,curren_sign_pole.is_benchmarking)"></span>

              <p class="start-sign__hover" v-show="product_scrible_hover" v-text="product_scrible_content(curren_sign_pole.sign_id)"></p>
              <div class="start-sign__change" v-show="change_sign_show">
                <ul class="start-sign__change__list" @mouseleave="change_sign_show=false">
                  <li>选择标记<a class="start-sign__change__list__management" v-on:click="add_sign_popup=true,change_sign_show=false">标记管理</a></li>
                  <li v-for="signItem in product_current_sign" v-on:click="change_sign_color(signItem)"><span :class="'start-sign__change__list__type '+signItem.sign_color"></span><span v-text="signItem_describle(signItem,curren_sign_pole.is_benchmarking)"></span></li>
                </ul>
              </div>
            </div>
          </vue-custom-dl>
        </div>
        <div style="width:11%;">
          <vue-custom-dl-slot-modify :name="'备注'">
            <vue-remark-modify :remark_name="'remarks'" :remark="product_info.remarks" :ajax_url="getRemarksUrl()" :ajax_data="{group_id:product_info.id,type:(1 == product_info.type)?'group':'base'}"></vue-remark-modify>
          </vue-custom-dl-slot-modify>
        </div>
        <div style="text-align: right;width:8%;z-index:10;position:relative;">
          <label :for="'showSubProduct_' + product_info.id">
            <input v-model="show" type="checkbox" :id="'showSubProduct_' + product_info.id" />含子产品
          </label>
        </div>

        <div class="journel-sheet-content__head--move"></div>
      </div>
      <div v-show="display_detail && (true != moving)" class="journel-sheet-content__detail" :class="{'journel-sheet-content__detail--display': display_detail}">
        <!-- <vue-custom-dl :name="'场内期货资产'" :value="numeralNumber(product_info.futures_assets,2)"></vue-custom-dl> -->
        <vue-custom-dl :name="'股票市值'" :value="numeralNumber(product_info.stock_market_value,2)"></vue-custom-dl>
        <vue-custom-dl :name="'A股仓位'" :value="numeralNumber(product_info.stock_A_position*100,2)+ '%'"></vue-custom-dl>

        <vue-custom-dl :name="'A股净多头'" v-if="product_info.type == '1'" :value="numeralNumber(product_info.A_net_bullish*100,2)+'%'"></vue-custom-dl>
        <vue-custom-dl :name="'A股净多头'" v-if="product_info.type == '2'" :value="'--'"></vue-custom-dl>

        <vue-custom-dl :name="'风险度'" :value="numeralNumber(product_info.risk_degree*100,2)+'%'"></vue-custom-dl>

        <vue-custom-dl :name="'收益互换资产'" v-if="product_info.type == '1'" :value="numeralNumber(product_info.income_swap_assets,2)">
          <prompt-language v-show="'' != product_info.income_swap_error_tip" :language_val="product_info.income_swap_error_tip"></prompt-language>
        </vue-custom-dl>
        <vue-custom-dl :name="'收益互换资产'" v-if="product_info.type == '2'" :value="'--'">
          <prompt-language v-show="'' != product_info.income_swap_error_tip" :language_val="product_info.income_swap_error_tip"></prompt-language>
        </vue-custom-dl>

        <vue-custom-dl :name="'收益互换仓位'" v-if="product_info.type == '1'" :value="numeralNumber(product_info.income_swap_position*100,2)+'%'">
          <prompt-language v-show="'' != product_info.income_swap_error_tip" :language_val="product_info.income_swap_error_tip"></prompt-language>
        </vue-custom-dl>
        <vue-custom-dl :name="'收益互换仓位'" v-if="product_info.type == '2'" :value="'--'">
          <prompt-language v-show="'' != product_info.income_swap_error_tip" :language_val="product_info.income_swap_error_tip"></prompt-language>
        </vue-custom-dl>

        <vue-custom-dl :name="'场外货币基金'" v-if="product_info.type == '1'" :value="numeralNumber(product_info.monetary_fund_assets,2)"></vue-custom-dl>
        <vue-custom-dl :name="'场外货币基金'" v-if="product_info.type == '2'" :value="'--'"></vue-custom-dl>

        <vue-custom-dl :name="'场外货币基金仓位'" v-if="product_info.type == '1'" :value="numeralNumber(product_info.monetary_fund_position*100,2)+'%'"></vue-custom-dl>
        <vue-custom-dl :name="'场外货币基金仓位'" v-if="product_info.type == '2'" :value="'--'"></vue-custom-dl>
      </div>
      <report-table-securities :current_product_remark="current_product_remark" v-show="display_detail && (true != moving)" :product_info="product_info" v-if="product_info.position_list.length > 0" :pos_total="pos_total" :show="show"></report-table-securities>
      <div v-if="0 == product_info.position_list.length" v-show="display_detail && (true != moving)" class="journel-sheet-content__no-detail">
        <span>该时段暂无匹配记录</span>
      </div>
      <div class="report-sign-popup" v-show="add_sign_popup">
        <div class="report-sign-popup__content">
          <h2 class="report-sign-popup__content__title">标记管理</h2>
          <span class="report-sign-popup__content__closeBtn" v-on:click="signPupManager()">x</span>
          <div class="report-sign-popup__content__describle">
            <dl class="report-sign__modify">
              <dt class="report-sign__modify__dt">标记符号</dt>
              <dd class="report-sign__modify__dd">标记名称</dd>
            </dl>
            <div class="report-sign-popup__content__describle__auto">
              <dl class="report-sign__modify" v-for="signManager in product_current_sign">
                <dt class="report-sign__modify__dt" v-if="signManager.sign_id > 1">
                  <span :class="'report-sign__modify__dt_color '+signManager.sign_color "></span>
                </dt>
                <dd class="report-sign__modify__dd" v-if="signManager.sign_id > 1">
                  <input type="text" :value="signManager.keyword" v-on:input="modify_sign_value = $event.target.value" @focus="signDelete(signManager.sign_id,signManager.keyword)" @blur="modifyPole(signManager.sign_id,signManager.keyword)" :class="'report-sign__modify__dd__describle modifyPole_'+signManager.sign_id"/>
                  <a v-if="signManager.sign_id > 100" :class='"hide report-sign__modify__dd__delete signManager_"+signManager.sign_id' v-on:mousedown="productSignDelete(signManager.sign_id)">删除</a>
                  <p :class='" hide signPole_"+signManager.sign_id'></p>
                </dd>
              </dl>
              <dl class="report-sign__modify addReport" v-show="addCustomShow">
                <dt class="report-sign__modify__dt">
                  <span class="report-sign__modify__dt_color sign_product_add"></span>
                </dt>
                <dd class="report-sign__modify__dd">
                  <input type="text" v-model="customDescrible" class="report-sign__modify__dd__describle addReportDescrible" v-on:focus="customFocus()" v-on:blur="customBlur()"/>
                  <a class="report-sign__modify__dd__delete addReportDelete" v-on:mousedown="customDelete()">删除</a>
                  <p class="addReportName" style="color:#F44048;">请输入标记名称</p>
                </dd>
              </dl>
              <dl class="report-sign__modify addReportSign">
                <dt class="report-sign__modify__dt"></dt>
                <dd class="report-sign__modify__dd"><button class="report-sign-popup__content__describle__add" v-on:click="addProductSign()">添加新标记</button></dd>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </div>`,
    data: function () {
      return {
        display_detail: true,
        show: true,
        chang_sub_id: '',
        change_sign_show: false, //产品标记选择列表是否显示
        add_sign_popup: false,  //标记管理的弹窗，可增加标记
        product_scrible_hover: false,  //当hover当前产品标记的时候显示文案
        is_pole: false,
        addCustomShow: false,  //是否自定义添加的
        customDescrible: '',    //自定义添加的input内容
        modify_sign_value: ''
      }
    },
    watch: {
      control_show(){
        this.display_detail = this.control_show;
      },
      show: function () {
        this.$emit('change_sub_fund', this.show);
      },
      chang_sub_id: function () {
        this.$emit('change_sub_fund_id', this.chang_sub_id);
      },
      cal_expect(){
      }
    },
    methods: {
      signPupManager: function () {
        this.add_sign_popup = false;
        //刷新页面,方便组件重复利用
        if ("[object Function]" == Object.prototype.toString.call(this.$root.customRefreshAfterModified)) {
          this.$root.customRefreshAfterModified(true);
        }
      },
      currentData: function () {  //数据更新时间处理
        return this.current_data.split('-').join('/');
      },
      poleDeviation: function (deviation) {  //得到偏离度
        if (-1 == deviation) {
          return '--';
        } else {
          return this.numeralNumber(deviation*100,1)+'%';
        }
      },
      signDelete: function (sign_id,keyword) {
        $(".signManager_"+sign_id).show();
        this.modify_sign_value = keyword;
      },
      product_scrible_content: function (sign_id) {  //标记产品的hover内容
        let _this = this;
        if (1 == sign_id) {
          return '点击可对产品进行标记';
        } else {
          let sign_keyword = '';
          this.product_current_sign.forEach((e) => {
            if (sign_id == e.sign_id) {
              sign_keyword = e.keyword;
            }
          })
          let signProductArr = [];  //通过判断标记id是否相同得到一致的产品id和type
          this.product_sign_pole_all.forEach((e) => {
            let obj = {};
            if (e.sign_id == sign_id) {
              obj.product_id = e.product_id;
              obj.type = e.type;
            }
            signProductArr.push(obj);
          })

          let signTotal = 0;  //相同标记的总资产
          signProductArr.forEach((i) => {
            _this.product_info_arr.forEach((e) => {
              if (i.product_id == e.id && i.type == e.type) {
                signTotal += e.total_assets;
              }
            })
          })
          //需要获取相同标记id下的所有产品的id和type类型，然后获取他们各自的总资产
          return '"'+sign_keyword+'"，该标记所有产品总资产为'+this.numeralNumber(signTotal,2);
        }
      },
      product_sign_pole: function (sign_id, is_benchmarking) {  //标杆产品
        let _this = this;
        let str = '';

        if (1 == sign_id || undefined == sign_id) {
          $.omsAlert('请先选择产品标记');
          return false;
        }
        let product_type_id = {};
        if (1 == _this.product_info.type) {
          product_type_id = {
            'group_id': _this.product_info.id,
            'type': _this.product_info.type,
            'sign_id': sign_id,
            'is_benchmarking': (0 == is_benchmarking) ? 1 : 0
          }
        } else if (2 == _this.product_info.type){
          product_type_id = {
            'product_id': _this.product_info.id,
            'type': _this.product_info.type,
            'sign_id': sign_id,
            'is_benchmarking': (0 == is_benchmarking) ? 1 : 0
          }
        }
        $.startLoading('正在修改');
        $.ajax({
          url: '/bms-pub/report/add_sign',
          type: 'POST',
          data: product_type_id,
          success: ({code,msg,data}) => {
            if (0 == code) {
              if (0 == is_benchmarking) {  //0不是标杆产品，1是标杆产品
                str = '标杆产品设置成功';
              } else if (1 == is_benchmarking){
                str = '标杆产品取消成功';
              }
              $.omsAlert(str);
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
                _this.$root.customRefreshAfterModified(true);
              }
              $.clearLoading();
            }
          },
          error: ({code,msg,data}) => {
            $.omsAlert(msg);
          }
        })
      },
      addProductSign: function () {  //用户自定义添加产品
        let _this = this;
        $(".report-sign__modify__dd__describle").each(function () {
          if ('' == $(this).val() || undefined == $(this).val()) {
            return false;
          }
        })
        this.addCustomShow = true;

        this.$nextTick(function(){
          $(_this.$el).find('input.addReportDescrible').focus();
        })
        this.customDescrible = '';
        $(".addReportName").html('请输入标记名称').show();
      },
      customFocus: function () {  //自定义添加的input的focus
        $(".addReportDelete").show();
      },
      customBlur: function () {  //自定义添加的input 的blur
        $(".addReportDelete").hide();
        let val = this.customDescrible;
        let _this = this;
        if ('' == val || undefined == val) {
          $(".addReportName").html('请输入标记名称');
          $(".addReportDescrible").css('border','1px solid #F44048');
          return false;
        }

        let currentKeyword; //判断是否重名
        this.product_current_sign.forEach(function (e) {
          if (e.keyword == val) {
            currentKeyword = e.keyword;
          }
        })

        if (val == currentKeyword) {
          $(".addReportName").html('标记不得重名');
          $(".addReportDescrible").css('border','1px solid #F44048');
          return false;
        }
        //标记成功
        $(".addReportName").hide();
        $(".addReportDescrible").css('border','1px solid #BEBEBE');
        $.ajax({
          url: '/bms-pub/report/add_sign_group',
          type: 'POST',
          data: {
            keyword: val
          },
          success: ({code,msg,data}) => {
            $.omsAlert('标记创建成功');
            //刷新页面,方便组件重复利用
            if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
              _this.$root.customRefreshAfterModified(true);
            }
            _this.addCustomShow = false;
          }
        })
      },
      modifyPole: function (sign_id,sign_keyword) {  //修改标记的信息
        let val = this.modify_sign_value;
        let _this = this;
        let currentKeyword;
        $(".signManager_"+sign_id).hide();

        if ('' == val || undefined == val) {
          $(".signPole_"+sign_id).html('请输入标记名称').css('color', '#F44048').show();
          $(".modifyPole_"+sign_id).css('border', '1px solid #F44048');
          return false;
        }

        if (val == sign_keyword) {
          return false;
        }

        if (val.length > 20) {
          $.omsAlert('最多支持输入20个字');
          $(".modifyPole_"+sign_id).css('border', '1px solid #F44048');
          $(".signPole_"+sign_id).html('最多支持输入20个字').css('color', '#F44048').show();
          return false;
        }

        this.product_current_sign.forEach(function (e) {
          if (val == e.keyword) {
            currentKeyword = e.keyword;
          }
        })

        if (val == currentKeyword) {
          $(".signPole_"+sign_id).html('标记不得重名').css('color', '#F44048').show();
          $(".modifyPole_"+sign_id).css('border', '1px solid #F44048');
          return false;
        }
        $(".modifyPole_"+sign_id).css('border', '1px solid #BEBEBE');
        $(".signPole_"+sign_id).hide();
        $.ajax({
          url: '/bms-pub/report/add_sign_group',
          type: 'POST',
          data: {
            sign_id: sign_id,
            keyword: val
          },
          success: ({code,msg,data}) => {
            if (0 == code) {
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
                _this.$root.customRefreshAfterModified(true);
              }

              $(".signPole_"+sign_id).show().html('标记"'+val+'"修改成功').css({'color':'#FB8927'});//成功
              setTimeout(function () {
                $(".signPole_"+sign_id).hide();
              },3000);
            } else {
              $(".modifyPole_"+sign_id).show().css({'border':'1px solid #F44048'});
              $(".signPole_"+sign_id).html('<span class="sign_error"></span>标记"'+val+'"修改失败').css({'color':'#FC2727'}); //失败
            }
          },
          error: function () {

          }
        })
      },
      productSignDelete: function (sign_id) {  //删除用户添加的标记
        var _this = this;
        $.ajax({
          url: '/bms-pub/report/del_sign_group',
          type: 'POST',
          data: {
            sign_id: sign_id
          },
          success: ({code,msg,data}) => {
            if (0 == code) {
              $.omsAlert('标记删除成功');
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
                _this.$root.customRefreshAfterModified(true);
              }
            }
          }
        })
      },
      customDelete: function () {  //自定义删除
        this.addCustomShow = false;
        //刷新页面,方便组件重复利用
        if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
          _this.$root.customRefreshAfterModified(true);
        }
      },
      change_sign_list: function () {
        if (false == this.change_sign_show) {
          this.change_sign_show = true;
        } else {
          this.change_sign_show = false;
        }
        this.product_scrible_hover = false;
      },
      signItem_describle: function (signItem) {
        if (1 == signItem.id) {
          return signItem.keyword;
        } else {
          return '"'+signItem.keyword+'"标记';
        }
      },
      change_sign_color: function (signItem) {  //修改产品的标记
        $.startLoading('正在修改');
        let _this = this;

        let product_type_id = {};
        if (1 == _this.product_info.type) {
          product_type_id = {
            'group_id': _this.product_info.id,
            'type': _this.product_info.type,
            sign_id: signItem.sign_id,
            is_benchmarking: 0
          }
        } else if (2 == _this.product_info.type){
          product_type_id = {
            'product_id': _this.product_info.id,
            'type': _this.product_info.type,
            sign_id: signItem.sign_id,
            is_benchmarking: 0
          }
        }

        $.ajax({
          url: '/bms-pub/report/add_sign',
          type: 'POST',
          data: product_type_id,
          success: ({code,msg,data}) => {
            $.clearLoading();

            if (0 == code) {
              this.change_sign_show = false;
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(_this.$root.customRefreshAfterModified)) {
                _this.$root.customRefreshAfterModified(true);
              }
              $.omsAlert('标记修改成功');
            } else {
              $.omsAlert(msg);
            }
          },
          error: ({code,msg,data}) => {
            $.clearLoading();
            $.omsAlert(msg);
          }
        })
      },
      getAdjustValue: function () { //当前净资产
        // if (true == this.cal_expect) {
        //   return this.product_info.total_assets-this.product_info.adjust_assets;
        // }
        // if (false == this.cal_expect){
        //   return this.product_info.total_assets;
        // }
      },
      getAdjustVolume: function () { //当前份额
        // if (true == this.cal_expect) {
        //   return parseFloat(this.product_info.volume)-parseFloat(this.product_info.adjust_volume);
        // }
        // if (false == this.cal_expect){
        //   return this.product_info.volume;
        // }
      },
      getAdjustAssetsUrl: function(){
        return '/bms-pub/report/modify_product_assets';
      },
      getAdjustVolumeUrl: function(){
        return '/bms-pub/report/modify_product_volume';
      },
      getRemarksUrl: function(){
        return '/bms-pub/report/modify_product_remarks';
      },
      toggleDisplay: function(){
        this.display_detail = !this.display_detail;
        this.$emit('display_detail', this.display_detail);
      },
      numeralNumber: function(arg, num){
        if (undefined != num) {
          var str = '0.'
          for (var i = num - 1; i >= 0; i--) {
            str += '0';
          }
          return numeral(arg).format( '0,' + str );
        }
        return numeral(arg).format( '0,0.00' );
      },
      showSubFund: function () {
        if (this.show == true) {
          this.show = false;
          $(".closebtn .show_sub_fund"+(this.product_info.id)).css('transform', 'rotate(180deg)');
        } else {
          this.show = true;
          $(".closebtn .show_sub_fund"+(this.product_info.id)).css('transform', 'rotate(360deg)');
        }
      }
    }
  })
  //基金子基金部分
  Vue.component('report-sub-content', {
    props: ['product_info', 'pos_total', 'current_product_remark', 'cal_expect'],
    template: `<div class="report_form_sub_funds" v-if="product_info.sub_product != ''">
      <ul class="report_form_sub_funds_content journel-sheet-sub-funds">
        <li v-for="fund in product_info.sub_product" class="journel-sheet-sub-fund">
          <div class="journel-sheet-sub-fund__header">
            <div class="journel-sheet-sub-fund__header--main">
              <div style="width: 250px;">
                <div class="journel-sheet-sub-fund__header--title" style="overflow:hidden;text-overflow: ellipsis;white-space: nowrap;" :title="fund.name">{{fund.name}}</div>
              </div>
              <vue-custom_v2-dl-modify v-if="cal_expect" :name="'预估净资产'" :adjust_value="fund.adjust_assets" :current_value="fund.estimate_asset" :value="fund.estimate_asset" :id="'adjust_assets'" :ajax_url="getAdjustAssetsUrl()" :ajax_data="{group_id: fund.id, type: (1==fund.type)?'group':'base'}"></vue-custom_v2-dl-modify>
              <vue-custom-dl v-else :name="'净资产'" :value="numeralNumber(fund.total_assets,2)"></vue-custom-dl>
             
              <vue-custom_v2-dl-modify v-if="cal_expect" :name="'预估份额'" :adjust_value="fund.adjust_volume" :current_value="fund.volume" :value="fund.estimate_volume"  :id="'adjust_volume'" :ajax_url="getAdjustVolumeUrl()" :ajax_data="{group_id: fund.id, type: (1==fund.type)?'group':'base'}"></vue-custom_v2-dl-modify>
              <vue-custom-dl v-else :name="'份额'" :value="numeralNumber(fund.volume,0)" v-if=""></vue-custom-dl>
            

              <vue-custom-dl v-if="cal_expect" :name="'预估净值'" :value="numeralNumber(fund.estimate_net_value,4)"></vue-custom-dl>
              <vue-custom-dl :name="'单位净值'" :value="numeralNumber(fund.net_value,4)"></vue-custom-dl>
              <vue-custom-dl :name="'股票仓位'" :value="numeralNumber(fund.stock_position*100,2)+'%'"></vue-custom-dl>
              <vue-custom-dl :name="'净多头'" :value="numeralNumber(fund.net_bullish*100,2)+'%'"></vue-custom-dl>

              <!-- <vue-custom-dl :name="'备注'" :value="fund.remark"></vue-custom-dl> -->
              <!-- <vue-custom-dl-modify :name="'备注'" :value="fund.remarks" :id="'remarks'" :ajax_url="getRemarksUrl()" :ajax_data="{group_id: fund.id, type: (1==fund.type)?'group':'base'}"></vue-custom-dl-modify> -->
              <vue-custom-dl-slot-modify :name="'备注'">
                <vue-remark-modify :remark_name="'remarks'" :remark="fund.remarks" :ajax_url="getRemarksUrl()" :ajax_data="{group_id:fund.id,type:(1 == fund.type)?'group':'base'}"></vue-remark-modify>
              </vue-custom-dl-slot-modify>

              <div style="visibility: hidden;">
                <label>
                  <input type="checkbox" />含子产品
                </label>
              </div>
            </div>
            <div class="journel-sheet-sub-fund__header--detail">
              <vue-custom-dl :name="'股票市值'" :value="numeralNumber(fund.stock_market_value,2)"></vue-custom-dl>
              <vue-custom-dl :name="'A股仓位'" :value="numeralNumber(fund.stock_A_position*100,2)+'%'"></vue-custom-dl>
              <vue-custom-dl :name="'A股净多头'" :value="numeralNumber(fund.A_net_bullish*100,2)+'%'"></vue-custom-dl>
              <vue-custom-dl :name="'风险度'" :value="numeralNumber(fund.risk_degree*100,2)+'%'"></vue-custom-dl>
              <vue-custom-dl :name="'收益互换资产'" :value="numeralNumber(fund.income_swap_assets,2)">
                <prompt-language v-show="'' != fund.income_swap_error_tip" :language_val="fund.income_swap_error_tip"></prompt-language>
              </vue-custom-dl>
              <vue-custom-dl :name="'收益互换仓位'" :value="numeralNumber(fund.income_swap_position*100,2)+ '%'">
                <prompt-language v-show="'' != fund.income_swap_error_tip" :language_val="fund.income_swap_error_tip"></prompt-language>
              </vue-custom-dl>
              <vue-custom-dl :name="'场外货币基金'" :value="numeralNumber(fund.monetary_fund_assets,2)"></vue-custom-dl>
              <vue-custom-dl :name="'场外货币基金仓位'" :value="numeralNumber(fund.monetary_fund_position*100,2)+'%'"></vue-custom-dl>
            </div>
          </div>

          <report-table-sub-funds :current_product_remark="current_product_remark" :product_info="product_info" :position_list="fund.position_list" v-if="fund.position_list != ''" :pos_total="pos_total"></report-table-sub-funds>
        </li>
      </ul>
    </div>`,
    methods: {
      getAdjustAssetsUrl: function(){
        return '/bms-pub/report/modify_product_assets';
      },
      getAdjustVolumeUrl: function(){
        return '/bms-pub/report/modify_product_volume';
      },
      getRemarksUrl: function(){
        return '/bms-pub/report/modify_product_remarks';
      },
      getAdjustValue: function (fund) { //当前净资产
        if (true == this.cal_expect) {
          return fund.total_assets-fund.adjust_assets;
        }
        if (false == this.cal_expect){
          return fund.total_assets;
        }
      },
      getAdjustVolume: function (fund) { //当前份额
        if (true == this.cal_expect) {
          return parseFloat(fund.volume)-parseFloat(fund.adjust_volume);
        }
        if (false == this.cal_expect){
          return fund.volume;
        }
      },
      numeralNumber: function(arg, num){
        if (undefined != num) {
          var str = '0.'
          for (var i = num - 1; i >= 0; i--) {
            str += '0';
          }
          return numeral(arg).format( '0,' + str );
        }
        return numeral(arg).format( '0,0.00' );
      }
    }
  })

  //基金主体
  Vue.component('report-content', {
    props: ['product_info', 'current_data', 'pos_total', 'moving', 'control_show', 'cal_expect', 'current_product_remark', 'product_current_sign', 'product_sign_pole_all','product_select_sign', 'product_info_arr'],
    template: `
      <div class="journel-sheet-content" v-show="productSelectShow()">
        <report-table-content :curren_sign_pole="curren_sign_pole" :product_current_sign="product_current_sign" :product_sign_pole_all="product_sign_pole_all" :current_product_remark="current_product_remark" :product_info_arr="product_info_arr" :cal_expect="cal_expect" :control_show="control_show" :moving="moving" :product_info="change_sub_data()" :current_data="current_data" v-on:change_sub_fund="sub_show = $event" v-on:change_sub_fund_id="sub_fund_id = $event" :pos_total="pos_total" v-on:display_detail="display_detail = $event"></report-table-content>
        <report-sub-content :cal_expect="cal_expect" :current_product_remark="current_product_remark" :control_show="control_show" v-show="display_detail && sub_show && (true !== moving)" :product_info="product_info" v-if="product_info.sub_product != ''" :pos_total="pos_total"></report-sub-content>
      </div>
    `,
    data: function () {
      return {
        display_detail: true,
        sub_show: true,
        sub_fund_id: '',
        // curren_sign_pole: {}
      }
    },
    computed: {
      curren_sign_pole: function () {
        var _this = this;
        var obj = {'sign_id': 1};
        this.product_sign_pole_all.forEach((e) => {
          if (e.product_id == _this.product_info.id && e.type == _this.product_info.type) {
            obj = e;
            if (e.sign_id <= 100) {
              if (1 == e.sign_id) {
                obj.sign_color = 'sign_normal';
              } else if (2 == e.sign_id) {
                obj.sign_color = 'sign_red';
              } else if (3 == e.sign_id) {
                obj.sign_color = 'sign_pink';
              } else if (4 == e.sign_id) {
                obj.sign_color = 'sign_citrus';
              } else if (5 == e.sign_id) {
                obj.sign_color = 'sign_orange';
              } else if (6 == e.sign_id) {
                obj.sign_color = 'sign_yellow';
              } else if (7 == e.sign_id) {
                obj.sign_color = 'sign_dlackish_green';
              } else if (8 == e.sign_id) {
                obj.sign_color = 'sign_green';
              } else if (9 == e.sign_id) {
                obj.sign_color = 'sign_indigo';
              } else if (10 == e.sign_id) {
                obj.sign_color = 'sign_blue';
              } else if (11 == e.sign_id) {
                obj.sign_color = 'sign_cyan';
              } else if (12 == e.sign_id) {
                obj.sign_color = 'sign_purple';
              } else if (13 == e.sign_id) {
                obj.sign_color = 'sign_brown';
              } else if (14 == e.sign_id) {
                obj.sign_color = 'sign_gray';
              } else if (15 == e.sign_id) {
                obj.sign_color = 'sign_black';
              }
            } else if (e.sign_id > 100) {
              obj.sign_color = 'sign_product_add';
            }
            if (0 == e.is_benchmarking) {
              obj.pole_style = 'pole_normal';
            } else if (1 == e.is_benchmarking) {
              obj.pole_style = 'pole_start_light';
            }
          }
        });
        if ('' == obj) {
          obj.sign_id = 1;
        }
        return obj;
      }
    },
    watch: {
      control_show: function () {
        this.display_detail = this.control_show;
      }
    },
    methods: {
      productSelectShow: function () {
        if (('' == this.product_select_sign || 'all' == this.product_select_sign) || (this.product_select_sign == this.curren_sign_pole.sign_id)) {
          return true;
        } else {
          return false;
        }
      },
      change_sub_data: function () {
        if (true == this.sub_show) {
          return this.product_info;
        } else {
          //由于底层账户是不存在子产品的，所以再次要加一个判断（查看是否包含main_product）
          if (2 == this.product_info.type) {
            return this.product_info;
          } else {
            this.product_info.main_product.update_time = this.product_info.update_time;
            return this.product_info.main_product;
          }
        }
      }
    }
  })


  // 上面部分是产品报表，下面是持仓报表
  //单选，默认选中某一个
  Vue.component('vue-selectize-radio-selected', {
    props: ['options', 'value', 'place_holder', 'defaultSelected'],
    template: `
        <select>
          <slot></slot>
        </select>
    `,
    mounted: function () {
      var vm = this;
      var selectize = $(this.$el).selectize({
        delimiter: ',',
        persist: true,
        placeholder: this.place_holder,
        valueField: 'value',
        labelField: 'label',
        onChange: function(v){
          vm.$emit('input', v);
        }
      })[0].selectize;
      selectize.addOption(this.options);
      selectize.setValue(this.defaultSelected);  //默认选中某一个,填写相对应的value
      selectize = null;
    },
    watch: {
      value: function (value) {
        // update value
        $(this.$el).selectize()[0].selectize.setValue(value);
      },
      options: function (options) {
        // // update options
        var value = this.value;
        var selectize = $(this.$el).selectize()[0].selectize;
        selectize.clearOptions(true);
        selectize.clearOptions(true);
        selectize.addOption(this.options);
        selectize.setValue(value);
        selectize = null;
      }
    }
  });

  //各基金经理持仓股票
  Vue.component('report-position-stock', {
    props: ['managerItem','totalCapitalOptions', 'is_starter','position_show','position_stock_data', 'position_user_display_detail', 'moving', 'select_id', 'positionDataShowSort'],
    template: `
      <div class="journel-sheet-content">
        <div class="journel-sheet-content__head" :class="{'journel-sheet-content__head--display': user_stock_display}" style="position: relative;">
          <dl style="width:22%;">
            <dt>
              <span v-text="position_user_name(managerItem)"></span>
              <a class="icon-display-hide" :class="{'icon-display-hide__display': user_stock_display, 'icon-display-hide__hide': !user_stock_display}" v-on:click="togglePositionUserDisplay()"><i></i></a>
            </dt>
            <dd>数据更新时间：<span v-text="componey_upDate(managerItem)"></span></dd>
          </dl>

          <div>
            <vue-custom-dl :name="'股票持仓（只）'" :value="stock_total.length"></vue-custom-dl>
          </div>
          <div v-for="stock_num in totalCapitalOptions">
            <vue-custom-dl v-if="stock_num.value > 0" :name="'持仓超过'+stock_num.value+'%总股本（只）'" :value="position_stock_volume(managerItem,stock_num.value)"></vue-custom-dl>
          </div>
          <div class="journel-sheet-content__head--move"></div>
        </div>
        <report-position-securities v-show="user_stock_display && (true !== moving)" :is_starter="is_starter" :user_id="user_id" :select_id="select_id" :managerItem="managerItem" :position_user_display_detail="position_user_display_detail" :moving="moving" :position_stock_data="position_stock_data" :positionDataShowSort="positionDataShowSort"></report-position-securities>
      </div>
    `,
    data: function () {
      return {
        user_stock_display: true,
        user_id: '',
        stock_total: []
      }
    },
    watch: {
      position_show: function () {
        this.user_stock_display = this.position_show;
      },
      user_stock_display: function () {
        this.$emit('display_stock_change', this.user_stock_display);
      }
    },
    methods: {
      position_user_name: function (user_name) {  //基金经理名称处理
        let _this = this;
        this.user_id = user_name.id;
        if ('total' == user_name.id) {
          return '公司持仓';
        } else {
          return user_name.name+'持仓';
        }
      },
      componey_upDate: function (managerItem) {
        let userId = managerItem.id;  //相对应的基金经理
        let stock_arr = this.position_stock_data; //所有基金经理的股票
        let upDate = ''; // 数据更新时间
        $.each(stock_arr, (key, value) => {
          if (userId == key) {
            upDate = value.updated_time;  //只需要获取第一只股票下的时间就可以
          }
        })
        //时间处理
        let dataTime = new Date(upDate*1000);
        let hour = (dataTime.getHours() < 10) ? '0'+dataTime.getHours() : dataTime.getHours();
        let minutes = (dataTime.getMinutes() < 10) ? '0'+dataTime.getMinutes() : dataTime.getMinutes();
        let seconds = (dataTime.getSeconds() < 10) ? '0'+dataTime.getSeconds() : dataTime.getSeconds();
        return hour+':'+minutes+':'+seconds;
      },
      position_stock_volume: function (managerItem,item) {  //item代表持仓超过item%总股本，item没传值为undefined代表股票之和
        let userId = managerItem.id;  //相对应的基金经理
        let stock_arr = this.position_stock_data; //所有基金经理的股票
        let position_user_stock = [];  //各个基金经理自己名下的股票
        let _this = this;
        let position_acc_1 = 0,
            position_acc_2 =  0,
            position_acc_3 = 0,
            position_acc_4 = 0,
            position_acc_5 = 0;
        $.each(stock_arr, (key, val) => {
          if (userId == key) {
            position_user_stock = val.stocks;
            _this.stock_total = val.stocks;
          }
        })
        position_user_stock.forEach((e) => {
          if (e.position_acc_1 <= 0) {
            position_acc_1 += 1;
          }
          if (e.position_acc_2 <= 0) {
            position_acc_2 += 1;
          }
          if (e.position_acc_3 <= 0) {
            position_acc_3 += 1;
          }
          if (e.position_acc_4 <= 0) {
            position_acc_4 += 1;
          }
          if (e.position_acc_5 <= 0) {
            position_acc_5 += 1;
          }
        })

        if (1 == item) {
          return position_acc_1;
        } else if (2 == item) {
          return position_acc_2;
        } else if (3 == item) {
          return position_acc_3;
        } else if (4 == item) {
          return position_acc_4;
        } else if (5 == item) {
          return position_acc_5;
        }

      },
      togglePositionUserDisplay: function () {
        this.user_stock_display = !this.user_stock_display;
      }
    }
  })

  Vue.component('report-position-securities', {
    props: ['moving', 'position_stock_data','managerItem', 'is_starter', 'position_user_display_detail', 'select_id', 'positionDataShowSort', 'user_id'],
    template: `
      <div>
        <table class="journel-sheet-grid" v-if="position_data_display.length>0">
          <draggable :list="positionDataShowSort.display_rules" element="tr" :options="dragOptions" :move="onMove" @end="onEnd">
            <th v-bind:class="rule.class" v-for="rule in positionDataShowSort.display_rules" v-if="(1 == select_id && rule.positionModel) || (0 == select_id)" :class="styleType(select_id,rule)" v-bind:style="rule.style">
              <span>{{rule.label}}</span>
              <a class="icon-sortBy" @click="positionSort(rule.id)" v-if="rule.label != '备注'">
                <i class="icon-asc" :class="{active: (positionDataShowSort.order_by == rule.id && positionDataShowSort.order == 'asc')}"></i>
                <i class="icon-desc" :class="{active: (positionDataShowSort.order_by == rule.id && positionDataShowSort.order == 'desc')}"></i>
              </a>
              <prompt-language v-if="'position_placards' == rule.id" :language_val="'举牌差值＝5%总股本－持仓数量'" style="width: 15px;display: inline-block;left: 0;"></prompt-language>
            </th>
            <th v-if="true == is_starter" style="width:10%;"></th>
          </draggable>
          <tbody>
            <tr v-for="sub_value in position_data_display">
              <td v-for="rule in positionDataShowSort.display_rules" v-bind:class="rule.class" v-if="(1 == select_id && rule.positionModel) || (0 == select_id)"  :class="styleType(select_id,rule)" v-bind:style="rule.style">
                <vue-remark-modify  v-if="'remark' == rule.id" :remark_name="'msg'" :remark="sub_value.remark" :ajax_url="getPositionRemarksUrl()" :ajax_data="{stock_code:sub_value.stock_code_full_name,target_id:user_id}"></vue-remark-modify>
                <span v-else>{{displayValue(sub_value, rule)}}</span>
              </td>
              <td  v-if="true == is_starter" style="width:10%;" class="leftRightPadding"><button style="margin-right:20px;" :class="{'add_follow':0 ==sub_value.is_star,'cancel_follow':1 ==sub_value.is_star}" v-text="follow_text(sub_value.is_star)" @click="followFn(sub_value.stock_code_full_name,user_id,sub_value.is_star)"></button></td>
            </tr>
          </tbody>
        </table>
        <div v-if="0 == position_data_display.length" class="journel-sheet-content__no-detail">
          <span>该时段暂无匹配记录</span>
        </div>
      </div>
    `,
    data: function () {
      return {

      }
    },
    computed: {
      // 可拖动插件的入参
      dragOptions: function () {
        return  {
          animation: 0,
          // group: 'description',
          // disabled: !this.editable,
          ghostClass: 'ghost'
        };
      },
      // 显示数据准备
      position_data_display: function(){
        let _this = this;
        let rtn = [];
        let userId = this.managerItem.id;
        let stock_arr = this.position_stock_data; //所有基金经理的股票
        let position_user_stock = [];  //各个基金经理自己名下的股票
        $.each(stock_arr, (key, value) => {
          if (userId == key) {
            position_user_stock = value.stocks;
          }
        })
        position_user_stock.forEach((e) => {
          let obj = {};
          //证券名称
          obj.stock_name = e.stock_name;
          //持仓数量
          obj.hold_volume = e.hold_volume;
          //持仓市值
          obj.market_value = e.market_value;
          //证券代码
          let stockCode = (''+e.stock_code).split(/\..*/);
          obj.stock_code = stockCode[0];

          obj.stock_code_full_name = e.stock_code;
          obj.position_acc = e.position_acc;
          obj.position_acc_1 = e.position_acc_1;
          obj.position_acc_2 = e.position_acc_2;
          obj.position_acc_3 = e.position_acc_3;
          obj.position_acc_4 = e.position_acc_4;
          obj.position_acc_5 = e.position_acc_5;
          obj.is_star = e.is_star;
          //总股本量
          obj.total_share_capital = e.total_share_capital;
          //占总股本
          obj.proportion_capital = e.proportion_capital;
          //5%总股本
          obj.position_capital_5 = e.position_capital_5;
          //备注
          obj.remark = e.remark;
          //举牌差值
          obj.position_placards = obj.position_acc_5;
          rtn.push(obj);
        })

        // 步骤2，根据排序逻辑进行排序
        rtn = VUECOMPONENT.sort(rtn, _this.positionDataShowSort.order, _this.positionDataShowSort.order_by);
        return rtn;
      }
    },
    methods: {
      styleType: function (select_id, rule) {
        if (1 == select_id && 1 == rule.positionModel) {
          if ('stock_name' == rule.id) {
            return 'width_30';
          }
          if ('proportion_capital' == rule.id) {
            return 'width_30_right';
          }
          if ('remark' == rule.id) {
            return 'width_30_left';
          }
        } else {
          return rule.class;
        }
      },
      getPositionRemarksUrl: function () {
        return '/bms-pub/report/stats/set_stock_position_remark';
      },
      follow_text: function (is_star) {
        if (1 == parseFloat(is_star)) {
          return '取消关注';
        } else {
          return '添加关注';
        }
      },
      followFn: function (stock_code,target_id,is_star) {
        let _this = this;
        let _is_val;
        if (0 == is_star) {
          _is_val = 1;
        } else {
          _is_val = 0;
        }
        let stock_arr = [target_id+'-'+stock_code];
        $.ajax({
          url: '/bms-pub/report/stats/set_stock_position_star',
          type: 'POST',
          data: {
            target_id: stock_arr,
            val: _is_val
          },
          success: ({code,msg,data}) => {
            if (0 == code) {
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(this.$root.positionDoRefresh)) {
                this.$root.positionDoRefresh(true);
              }
            }
          },
          error: ({code,msg,data}) => {

          }
        })
      },
      positionSort: function(id){
        if (id == this.positionDataShowSort.order_by) {
          if ('asc' == this.positionDataShowSort.order) {
            this.positionDataShowSort.order = 'desc';
          }else if('desc' == this.positionDataShowSort.order){
            this.positionDataShowSort.order = '';
          }else{
            this.positionDataShowSort.order = 'asc'
          }
        }else{
          this.positionDataShowSort.order_by = id;
          this.positionDataShowSort.order = 'asc';
        }
        // 用户切换排序命令，需要保存新的排序
        let obj = {};
        obj.field_sort = this.positionDataShowSort.display_rules.map(function(e){
          return e.id;
        });
        obj.order_by = this.positionDataShowSort.order_by;
        obj.order = this.positionDataShowSort.order;
        common_storage.setItem('report_position__grid_order', obj);
      },
      displayValue: function(sub_value, rule){
        let value = sub_value[rule.id];
        if ((rule.format != '') && (rule.format instanceof Array) && (this[rule.format[0]] instanceof Function)) {
          // value = this[rule.format].call(this, value, )
          let args = [value].concat(rule.format.slice(1))
          value = this[rule.format[0]].apply(this, args);

        }
        if (rule.unit) {  //针对浮盈率和权重
          if ('--' == value) {
            return value;
          } else {
            return value + rule.unit
          }
        }else{
          return value;
        }
      },
      onMove: function ({relatedContext, draggedContext}) {
        if ('备注' == draggedContext.element.label) {
          return false;
        }
        //目前暂时先把拖动去掉
        return false;

        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      },
      onEnd: function () {
        // 用户切换排序命令，需要保存新的排序
        let obj = {};
        obj.field_sort = this.positionDataShowSort.display_rules.map(function(e){
          return e.id;
        });

        obj.order_by = this.positionDataShowSort.order_by;
        obj.order = this.positionDataShowSort.order;
        common_storage.setItem('report_position__grid_order', obj);
      },
      togglePositionUserDisplay: function () {
        this.position_user_display_detail = !this.position_user_display_detail;
      },
      numeralNumber: function(arg, num){
        if (undefined != num) {
          var str = '0.'
          for (var i = num - 1; i >= 0; i--) {
            str += '0';
          }
          return numeral(arg).format( '0,' + str );
        }
        return numeral(arg).format( '0,0.00' );
      }
    }
  })

  //持仓报表汇总
  Vue.component('report-position-form', {
    props: ['position_real_name', 'position_stock_data', 'is_starter', 'change_position_users','position_data_show_sort', 'position_form_data'],
    template: `
      <div class="report-position-form">
        <div class="report-position-form__header">
          <div class="report-position-form__header__selecte">
            <vue-selectize-radio-selected :options="modelOptions" :place_holder="'请选择模式'" :defaultSelected="'0'" :value="select_id" v-on:input="select_id = $event"></vue-selectize-radio-selected>
          </div>
          <div class="report-position-form__header__selecte">
            <vue-multiple_select :options="managerOptions" :flag_check_all="true" :checked_arr="managerSelected" :init_obj="init_manager_obj" v-on:multiple_select="managerSelected = ($event)"></vue-multiple_select>
          </div>
          <div class="report-position-form__header__selecte">
            <vue-selectize-radio-selected :options="totalCapitalOptions" :place_holder="'请选择持仓量'" :defaultSelected="'0'" :value="totalSelected" v-on:input="totalSelected = $event"></vue-selectize-radio-selected>
          </div>
          <div class="report-position-form__header__label">
            <input id="concern" type="checkbox" v-model="concernStock"/><label @click="isConcernStock()">只展示关注股票</label>
          </div>

          <div style="flex-grow: 1;"></div>

          <a @click="positionExpert()" :class="'custom-grey-btn custom-grey-btn__export'" style="margin-right:15px;line-height:34px;">
            <i class="oms-icon oms-icon-export"></i>导出
          </a>
          <a @click="positionRefresh()" class="custom-grey-btn custom-grey-btn__refresh" style="line-height:34px;">
            <i class="oms-icon refresh"></i>刷新
          </a>
        </div>
        <div class="report-position-form__banner">
          <div class="report-position-form__banner__products">
            <div class="open-close" @click="position_all_show()">
              <span class="open-close__icon">
                <i class="open-close__icon__bgd"></i>
              </span>
              <p class="open-close__describle" v-text="position_describle"></p>
            </div>
          </div>

          <div style="flex-grow: 1;"></div>

          <button v-if="true == is_starter" class="report-position-form__banner__concern add_concern" @click="add_follow_all('1')">全部添加关注</button>
          <button v-if="true == is_starter" class="report-position-form__banner__concern cancel_concern" @click="add_follow_all('0')">全部取消关注</button>
        </div>
        <!-- <draggable :list="change_position_users" :options="dragOptions" @start="startFn" :move="onMove" @end="onEnd"> -->
          <div class="journel-sheet-content" style="margin-bottom:10px;" v-for="managerItem in change_position_users">
            <report-position-stock :moving="moving" :is_starter="is_starter" :select_id="select_id" :positionDataShowSort="position_data_show_sort" :position_user_display_detail="position_user_display_detail" :position_show="position_show" :managerItem="managerItem" :position_stock_data="position_stock_data" :totalCapitalOptions="totalCapitalOptions"></report-position-stock>
          </div>
        <!-- </draggable> -->
      </div>
    `,
    data: function () {
      return {
        modelOptions: [{  //模式筛选
          value: '0',
          label: '详细数据'
        },{
          value: '1',
          label: '精简数据'
        }],
        moving: false,
        managerOptions: [],  //基金经理筛选
        totalCapitalOptions: [  //总股本筛选
          {
            value: '0',
            label: '不限持仓量'
          },
          {
            value: '1',
            label: '持仓≥1%总股本股票'
          },
          {  //总股本筛选
            value: '2',
            label: '持仓≥2%总股本股票'
          },
          {  //总股本筛选
            value: '3',
            label: '持仓≥3%总股本股票'
          },
          {  //总股本筛选
            value: '4',
            label: '持仓≥4%总股本股票'
          },
          {  //总股本筛选
            value: '5',
            label: '持仓≥5%总股本股票'
          }
        ],
        init_capital_obj: {
          allSelected: '不限持仓量',
          noMatchesFound: '未选择任何股本股票',
          placeholder: '请选择股本股票'
        },
        init_manager_obj: {
          allSelected: '全部基金经理',
          noMatchesFound: '未选择任何基金经理',
          placeholder: '请选择基金经理'
        },
        select_id: '',  //模式选中id
        managerSelected: '',  //基金经理选中id
        totalSelected: '',  //持仓占股本
        concernStock: false, //是否关注股票
        position_show: true,
        position_describle: '收起全部产品',
        // componey_stock: [], //公司股票   持仓报表
        position_display_detail: true,  //股票收起与展示 公司
        position_user_display_detail: true,  //基金经理的股票收起与展示
        componeyUpDate: ''  //公司数据更新时间
      }
    },
    computed: {
      // managerOptions: function () {  //下拉框－－基金经理
      //   let userArr = [];
      //   let _this = this;
      //   let real_name = _this.position_real_name;
      //   if (undefined == real_name) {
      //     return userArr;
      //   }
      //   $.each(real_name, (key, val) => {
      //     let obj = {
      //       value: key+'&'+val.real_name,
      //       label: val.real_name,
      //       type: key
      //     }
      //     userArr.push(obj);
      //   })
      //   return userArr;
      // },
      componey_stock: function () {
        let commoney_data = this.position_stock_data.total;
        return commoney_data;
      },
      dragOptions: function () {  //拖动的详细设置
        return {
          animation: 150,
          scroll: true,
          scrollSensitivity: 100,
          handle: '.journel-sheet-content__head--move',  //拖动句柄选择器
          ghostClass: 'ghost'
        }
      }
    },
    watch: {
      position_real_name: function(){
        if (undefined == this.position_real_name) {
          return [];
        }
        // 规避循环刷新的问题，options只需要查到一次就可以了。
        if (this.managerOptions.length > 0) {
          return;
        }
        let userArr = [];
        $.each(this.position_real_name, (key, val) => {
          let obj = {
            value: key+'&'+val.real_name,
            label: val.real_name,
            type: key
          }
          userArr.push(obj);
        })
        this.managerOptions = userArr;
      },
      select_id: function () {
        this.$emit('select_position_id',this.select_id);
      },
      managerSelected: function(){  //获取选中基金产品的id
        this.$emit('change_manager_selected', this.managerSelected);
      },
      totalSelected: function(){  //获取选中基金产品的id
        this.$emit('change_total_selected', this.totalSelected);
      },
      position_show: function () {  //全部展开与收起
        this.position_display_detail = this.position_show;  //公司
        this.position_user_display_detail = this.position_show;  //基金经理
      },
      concernStock: function () {  // 是否显示全部股票
        this.$emit('change_concern_stock', this.concernStock);
      }
    },
    methods: {
      isConcernStock: function () { //是否关注股票
        this.concernStock = !this.concernStock;
      },
      positionExpert: function () {  //导出
        $.startLoading();
        let ManagerSelectedArr = ['total'];
        let _this = this;
        this.managerSelected.forEach((e) => {
          ManagerSelectedArr.push(e.split('&')[0]);
        })
        //totalSelected持仓比例筛选
        //ManagerSelectedArr选中的基金经理id
        //concernStock  只显示关注股票
        let only_star = 0;
        if (true == this.concernStock) {
          only_star = 1;
        } else {
          only_star = 0;
        }

        let sorted = {};
        sorted.field_sort = this.position_data_show_sort.display_rules.map(function(e){
          return e.id
        });
        sorted.order = this.position_data_show_sort.order;
        sorted.order_by = this.position_data_show_sort.order_by;
        let arr = [];
        this.change_position_users.forEach((e) => {
          let id = '';
          id = e.id;
          arr.push(id);
        });
        sorted.user_id = arr;

        $.ajax({
          //当产品可以拖动的时候导出需要传值
          // url: '/bms-pub/report/stats/get_stock_position?sorted[field_sort]=' +
          //   sorted.field_sort.join(',') + '&sorted[order]=' + sorted.order + '&sorted[order_by]=' + sorted.order_by + '&sorted[user_id]=' + sorted.user_id.join(','),
          url: '/bms-pub/report/stats/get_stock_position?sorted[order]=' + sorted.order + '&sorted[order_by]=' + sorted.order_by,
          type: 'GET',
          data: {
            user_id: ManagerSelectedArr.join(','),
            position_rate: _this.totalSelected,
            is_only_star: only_star,
            is_tiny: _this.select_id,
            is_explode_mode: 1
          },
          success: ({code,msg,data}) => {  //因为在文件中心不管文件生成与否都会显示，故再次不需要判断0==code
            $.clearLoading();
            $.omsAlert('正为您生成报表，成功后可进入文件中心下载');
          },
          error: () => {
            $.omsAlert('网络异常，请重试');
          }
        })
      },
      positionRefresh: function () { //刷新
        if ($('.refresh-btn').hasClass('loading')) {
          return;
        }

        //刷新页面,方便组件重复利用
        if ("[object Function]" == Object.prototype.toString.call(this.$root.positionDoRefresh)) {
          this.$root.positionDoRefresh(true);
        }

        $('.refresh-btn').addClass('loading');
      },
      position_all_show: function () {  //展开／收起全部产品
        if (true == this.position_show) {
          this.position_show = false;
          this.position_describle = '展开全部产品';
          $(".open-close__icon__bgd").css('transform','rotate(180deg)');
        } else {
          this.position_show = true;
          this.position_describle = '收起全部产品';
          $(".open-close__icon__bgd").css('transform','rotate(0deg)');
        }
      },
      togglePositionDisplay: function () {  //是否展示公司股票
        this.position_display_detail = !this.position_display_detail;
      },
      togglePositionUserDisplay: function () {  //基金经理股票是否收缩
        this.position_user_display_detail = !this.position_user_display_detail;
      },
      add_follow_all: function (val) {  //全部添加关注
        let manager_follow_id = ['total'];
        this.managerOptions.forEach((e) => {
          manager_follow_id.push(e.type);
        })
        let _this = this;
        let stocks_arr = [];
        $.each(this.position_stock_data, (key, val) => {
          if (val.stocks.length > 0) {
            val.stocks.forEach((e) => {
              stocks_arr.push(key+'-'+e.stock_code);
            })
          }
        })
        //分批处理
        let temp_arr = [];
        let temp_len = Math.ceil(stocks_arr.length/200);
        for(let i = 0; i<temp_len;i++){
          if ( ( i+1 ) * 200 > stocks_arr.length ) {
            temp_arr.push( stocks_arr.slice( i*200, stocks_arr.length));
          }else{
            temp_arr.push( stocks_arr.slice( i*200, (i+1) *200));
          }
        }
        for(let n = 0 ;n<temp_arr.length;n++){
          $.ajax({
            url: '/bms-pub/report/stats/set_stock_position_star',
            type: 'POST',
            data: {
              target_id: temp_arr[n],
              val: val
            },
            success: ({code,msg,data}) => {
              if (0 == code) {
                //刷新页面,方便组件重复利用
                // if ("[object Function]" == Object.prototype.toString.call(this.$root.positionDoRefresh)) {
                //   this.$root.positionDoRefresh(true);
                // }
                _this.$root.positionDoRefresh(true);
              }
            },
            error: ({code,msg,data}) => {
              $.omsAlert('网络异常');
            }
          })
        }
      },
      startFn: function () {
        this.moving = true;
      },
      onMove: function ({relatedContext, draggedContext}) {
        return true;
      },
      onEnd: function ({oldIndex, newIndex}){
        this.moving = false;
        // onEnd函数执行时，this.product_info_arr已经是调整过后的数组。
        // 判断oldIndex与newIndex的大小值，决定是如何修改
        let moveId ='';
        let cursorId = ''
        moveId += this.change_position_users[newIndex].id;

        if (oldIndex == newIndex) {
          return;
        }

        if (oldIndex > newIndex) {
          cursorId += this.change_position_users[newIndex + 1].id;
        }else{
          cursorId += this.change_position_users[newIndex - 1].id;
        }

        // 因为每次修改都会保存，所以当成this.product_info_arr 与 productSortData.field_sort 的差别只是修改内容的差别。如果有this.product_info_arr拥有更多数据的情况，在 field_sort 后面push进去即可。

        let cursorIndex = positionGridSortData.field_sort.indexOf(cursorId);
        if (-1 == cursorIndex) {
          // 当标尺不存在时，列表中删除需要移动的节点，再将其添加到队列头或者尾部
          let moveIndex = positionGridSortData.field_sort.indexOf(moveId);
          if (-1 == moveIndex) {
            if (oldIndex > newIndex) {
              positionGridSortData.field_sort.unshift(cursorId);
              positionGridSortData.field_sort.unshift(moveId);
            }else{
              positionGridSortData.field_sort.push(moveId);
              positionGridSortData.field_sort.push(cursorId);
            }
          }else{
            if (oldIndex > newIndex) {
              positionGridSortData.field_sort.splice(moveIndex, 1);
              positionGridSortData.field_sort.unshift(moveId);
            }else{
              positionGridSortData.field_sort.splice(moveIndex, 1);
              positionGridSortData.field_sort.push(moveId);
            }
          }
        }else{
          let moveIndex = positionGridSortData.field_sort.indexOf(moveId);
          if (-1 == moveIndex) {
            // positionDataShowSort.field_sort.splice(moveIndex, 1);
            // 重新计算cursorIndex
            cursorIndex = positionGridSortData.field_sort.indexOf(cursorId);
            if (oldIndex > newIndex) {
              positionGridSortData.field_sort.splice(cursorIndex, 0, moveId)
            }else{
              positionGridSortData.field_sort.splice(cursorIndex + 1, 0, moveId)
            }
          }else{
            positionGridSortData.field_sort.splice(moveIndex, 1);
            // 重新计算cursorIndex
            cursorIndex = positionGridSortData.field_sort.indexOf(cursorId);
            if (oldIndex > newIndex) {
              positionGridSortData.field_sort.splice(cursorIndex, 0, moveId)
            }else{
              positionGridSortData.field_sort.splice(cursorIndex + 1, 0, moveId)
            }
          }
        }

        let arr = [].concat(positionGridSortData.field_sort);

        this.change_position_users.forEach((e) => {
          let id = e.id;

          if (arr.indexOf(id) == -1) {
            arr.push(id);
          }
        });
        common_storage.setItem('report_position_group_order', {field_sort: arr});
      },
      componey_stock_volume: function (item) {  //item代表持仓超过item%总股本，item没传值为undefined代表股票之和
        let stock_arr = this.componey_stock; //所有基金经理的股票
        let num = 0;
        stock_arr.forEach((e) => {
          if (parseFloat(e.position_acc_+item) <= 0) {
            num ++;
          }
        })
        if (undefined == item) {
          num = stock_arr.length;
        }
        return num;
      },
      componeyDate: function () {
        let upDate = this.componey_stock[0].updated_time; // 数据更新时间
        //时间处理
        let dataTime = new Date(upDate*1000);
        let hour = (dataTime.getHours() < 10) ? '0'+dataTime.getHours() : dataTime.getHours();
        let minutes = (dataTime.getMinutes() < 10) ? '0'+dataTime.getMinutes() : dataTime.getMinutes();
        let seconds = (dataTime.getSeconds() < 10) ? '0'+dataTime.getSeconds() : dataTime.getSeconds();
        return hour+':'+minutes+':'+seconds;
      }
    }
  })

  var ajaxTime = null;

  var report_form = new Vue({
    el: '#report_form',
    data: {
      moving: false,
      // 产品组列表数据
      product_list: [],
      // 查询日期
      current_data: (function(){return moment().format('YYYY-MM-DD')})(),
      // 当前选中产品id
      current_procut_id: [],
      // 当前产品信息
      product_info_arr: [],
      //是否汇总基金  0 不汇总   1  汇总
      pos_total: true,
      //是否查看预期变化  0 否   1  是
      cal_expect: false,
      //是否全部收起/展开
      control_show: true,
      //是否隐藏已结束产品
      end_product: "running",
      //根据当前选中的产品id获取备注信息
      current_product_remark: [],
      //获取最新的产品标记
      product_current_sign: [],
      //获取所有的产品的标杆和标记信息
      product_sign_pole_all: [],
      //筛选标记产品
      product_select_sign: '',
      //标记筛选之后的产品数组
      product_sign_arr: [],
      //active 控制显示哪份报表  //此处为分界线   以上的变量是产品报表的，，active以下是持仓列表的
      active: reportActive,
      position_form_data: {},  //持仓报表获取数据
      changeManagerSelected: [],  //基金经理选中id
      modelPositionId: '',  //模式id
      position_rate: '',  //持仓比例筛选
      is_only_star: '',  //是否显示全部股票
      change_position_users: [],  //选中的基金经理名称，为了排序
      is_starter: true,  //是否有关注股票权限
      position_data_show_sort: positionSortData,  //由于模式不同数据展示不同，故需要一个变量来接收下面的判断
      // product_promise: false, //产品报表权限
      // position_promise: false //持仓报表权限
    },
    computed: {
      dragOptions: function () {
        return  {
          animation: 150,
          scroll: true,
          scrollSensitivity: 100,
          // group: 'description',
          // disabled: !this.editable,
          handle: '.journel-sheet-content__head--move',
          ghostClass: 'ghost'
        };
      },
      // 虽然没有用到product_promise，但是里面的处理逻辑修改了active和is_starter，所以暂时不能去掉
      product_promise: function () {
        if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_REPORT_VIEW']]) {  //产品报表
          // this.product_promise = true;
          this.active = 'product';
        }
        if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_PISITION_REPORT_VIEW']]) {  //持仓报表
          // this.position_promise = true;
          this.active = 'position';
          if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_CONCERN_STOCK']]) {  //关注股票
            this.is_starter = true;
          } else {
            this.is_starter = false;
          }
        }
      }
    },
    methods: {
      checkDisplay: function (active) {
        if ('product' == active) {
          return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_REPORT_VIEW']];
        }
        if ('position' == active) {
          if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_CONCERN_STOCK']]) {  //关注股票
            this.is_starter = true;
          } else {
            this.is_starter = false;
          }
          return window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_PISITION_REPORT_VIEW']];
        }
      },
      reportChange: function (change) {  //报表页面切换模式
        if (change) {
          $.startLoading('正在查询');
          this.active = change;
          if ('product' == change) {
            this.doRefresh();
          } else {
            if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_PISITION_REPORT_VIEW']]) {  //持仓报表
              // this.position_promise = true;
              this.active = 'position';
              if (window.LOGIN_INFO.role_permission[GV.permissions['PERMISSION_CONCERN_STOCK']]) {  //关注股票
                this.is_starter = true;
              } else {
                this.is_starter = false;
              }
            }
            this.positionDoRefresh();
          }
          $.clearLoading();
        }
      },
      onStart: function(){
        this.moving = true;
      },
      onMove ({relatedContext, draggedContext}) {
        const relatedElement = relatedContext.element;
        const draggedElement = draggedContext.element;
        return (!relatedElement || !relatedElement.fixed) && !draggedElement.fixed
      },
      onEnd ({oldIndex, newIndex}){
        this.moving = false;
        // onEnd函数执行时，this.product_info_arr已经是调整过后的数组。
        // 判断oldIndex与newIndex的大小值，决定是如何修改
        let moveId ='';
        let cursorId = ''
        if (this.product_info_arr[newIndex].type == 1) {
          moveId += 'g';
        }else if(this.product_info_arr[newIndex].type == 2){
          moveId += 'b';
        }else{
          ;
        }
        moveId += this.product_info_arr[newIndex].id;

        if (oldIndex == newIndex) {
          return;
        }

        if (oldIndex > newIndex) {
          if (this.product_info_arr[newIndex + 1].type == 1) {
            cursorId += 'g';
          }else if(this.product_info_arr[newIndex + 1].type == 2){
            cursorId += 'b';
          }else{
            ;
          }
          cursorId += this.product_info_arr[newIndex + 1].id;
        }else{
          if (this.product_info_arr[newIndex - 1].type == 1) {
            cursorId += 'g';
          }else if(this.product_info_arr[newIndex - 1].type == 2){
            cursorId += 'b';
          }else{
            ;
          }
          cursorId += this.product_info_arr[newIndex - 1].id;
        }

        // 因为每次修改都会保存，所以当成this.product_info_arr 与 productSortData.field_sort 的差别只是修改内容的差别。如果有this.product_info_arr拥有更多数据的情况，在 field_sort 后面push进去即可。

        let cursorIndex = productSortData.field_sort.indexOf(cursorId);
        if (-1 == cursorIndex) {
          // 当标尺不存在时，列表中删除需要移动的节点，再将其添加到队列头或者尾部
          let moveIndex = productSortData.field_sort.indexOf(moveId);
          if (-1 == moveIndex) {
            if (oldIndex > newIndex) {
              productSortData.field_sort.unshift(cursorId);
              productSortData.field_sort.unshift(moveId);
            }else{
              productSortData.field_sort.push(moveId);
              productSortData.field_sort.push(cursorId);
            }
          }else{
            if (oldIndex > newIndex) {
              productSortData.field_sort.splice(moveIndex, 1);
              productSortData.field_sort.unshift(moveId);
            }else{
              productSortData.field_sort.splice(moveIndex, 1);
              productSortData.field_sort.push(moveId);
            }
          }
        }else{
          let moveIndex = productSortData.field_sort.indexOf(moveId);
          if (-1 == moveIndex) {
            // productSortData.field_sort.splice(moveIndex, 1);
            // 重新计算cursorIndex
            cursorIndex = productSortData.field_sort.indexOf(cursorId);
            if (oldIndex > newIndex) {
              productSortData.field_sort.splice(cursorIndex, 0, moveId)
            }else{
              productSortData.field_sort.splice(cursorIndex + 1, 0, moveId)
            }
          }else{
            productSortData.field_sort.splice(moveIndex, 1);
            // 重新计算cursorIndex
            cursorIndex = productSortData.field_sort.indexOf(cursorId);
            if (oldIndex > newIndex) {
              productSortData.field_sort.splice(cursorIndex, 0, moveId)
            }else{
              productSortData.field_sort.splice(cursorIndex + 1, 0, moveId)
            }
          }
        }

        let arr = [].concat(productSortData.field_sort);
        this.product_info_arr.forEach((e) => {
          let id = '';
          if (e.type == 1) {
            id += 'g';    // group 产品组
          }else if(e.type == 2){
            id += 'b';    // base 底层账户
          }else{
            ;             // 匹配失败，不带前缀
          }

          id += e.id;

          if (arr.indexOf(id) == -1) {
            arr.push(id);
          }
        });

        common_storage.setItem('report_group__group_order', {field_sort: arr});
      },
      //下拉列表中产品标记的信息
      getProductSign: function () {
        let _this = this;
        $.ajax({
          url: '/bms-pub/report/get_sign_group',  //用户新增加的标记接口
          type: 'GET',
          success: ({code,msg,data}) => {
            if (0 == code) {
              _this.product_current_sign = data;
              _this.product_current_sign.forEach((e) => {
                if (e.sign_id <= 100) {
                  if (1 == e.sign_id) {
                    e.sign_color = 'sign_normal';
                  } else if (2 == e.sign_id) {
                    e.sign_color = 'sign_red';
                  } else if (3 == e.sign_id) {
                    e.sign_color = 'sign_pink';
                  } else if (4 == e.sign_id) {
                    e.sign_color = 'sign_citrus';
                  } else if (5 == e.sign_id) {
                    e.sign_color = 'sign_orange';
                  } else if (6 == e.sign_id) {
                    e.sign_color = 'sign_yellow';
                  } else if (7 == e.sign_id) {
                    e.sign_color = 'sign_dlackish_green';
                  } else if (8 == e.sign_id) {
                    e.sign_color = 'sign_green';
                  } else if (9 == e.sign_id) {
                    e.sign_color = 'sign_indigo';
                  } else if (10 == e.sign_id) {
                    e.sign_color = 'sign_blue';
                  } else if (11 == e.sign_id) {
                    e.sign_color = 'sign_cyan';
                  } else if (12 == e.sign_id) {
                    e.sign_color = 'sign_purple';
                  } else if (13 == e.sign_id) {
                    e.sign_color = 'sign_brown';
                  } else if (14 == e.sign_id) {
                    e.sign_color = 'sign_gray';
                  } else if (15 == e.sign_id) {
                    e.sign_color = 'sign_black';
                  }
                } else if (e.sign_id > 100) {
                  e.sign_color = 'sign_product_add';
                }
              })
            } else {
              $.omsAlert(msg);
            }
          },
          error: ({code,msg,data}) => {
            $.omsAlert(msg);
          }
        })
      },
      //下拉列表中产品的数据
      getProductList: function(){
        let _this = this;
        $.ajax({
          //47 报表权限
          url: window.REQUEST_PREFIX + '/user/get_products_by_permissions',
          data: {
            permission_id: 47
          },
          type: 'get',
          success: function(res){
            if (0 == res.code) {
              if (res.data != '') {
                res.data.group.forEach(function(e){
                  e.type = 'group';
                })
                _this.product_list = res.data.group;
                res.data.product.forEach(function (e) {
                  e.type = 'base';
                  _this.product_list.push(e);//获取下拉列表的信息
                })
              }
            }

            $('.refresh-btn').removeClass('loading');
          },
          error: function(){
            $('.refresh-btn').removeClass('loading');
          }
        })
      },
      product_report_info: function (_data, _security_summary, cal_expect, end_product) { //通过下拉列表选择的产品获取产品的详细信息
        clearTimeout(ajaxTime);
        var _this = this;
        //产品id 的类型
        var _change_id_type = '';
        //lists下面的id存储数组
        var lists_id = [];
        //base下面的id存储数组
        var product_id = [];
        _this.current_procut_id.forEach(function (i) {
          if ('group' == i.split('&')[1]) {
            lists_id.push(i.split('&')[0]);
          }
          if ('base' == i.split('&')[1]) {
            product_id.push(i.split('&')[0])
          }
        })

        if (lists_id.length === 0) {
          _change_id_type = 'product_id=' + product_id.join(',');
        }
        if (product_id.length === 0) {
          _change_id_type = 'group_id=' + lists_id.join(',');
        }
        if (lists_id.length > 0 && product_id.length > 0) {
          _change_id_type ='group_id=' + lists_id.join(',') + '&product_id=' + product_id.join(',');
        }
        
        // 优化 综合报表 - 产品列表 ajax 请求次数，切换下拉框时，请求次数太多。导致数据不正确。
        ajaxTime = setTimeout(() => {
          $.startLoading('正在查询');
          $.ajax({
            url: '/bms-pub/report/get_product_group_report?'+_change_id_type+'&date='+_data+'&security_summary=' + _security_summary + '&cal_expect=' + cal_expect + '&end_product=' + end_product,
            type: 'GET',
            success: function (res) {
              if (0 == res.code) {
                _this.product_info_arr = res.data;
                if (0 == _this.product_info_arr.length) {
                  $(".custom-grey-btn__export").addClass('doBtnExport_bgd');
                } else {
                  $(".custom-grey-btn__export").removeClass('doBtnExport_bgd');
                }
                // 同时获取保存的排序规则。
                common_storage.getItem('report_group__group_order', (rtn) => {
                  if (0 == rtn.code) {
                    productSortData.field_sort = rtn.data.field_sort;
  
                    for (let i = productSortData.field_sort.length - 1; i >= 0; i--) {
                      for (let j = 0, length = _this.product_info_arr.length; j < length; j++) {
                        let verify_id = '';
                        let cur_info = _this.product_info_arr[j];
                        if (cur_info.type == '1') {
                          verify_id += 'g';
                        }
                        if (cur_info.type == '2') {
                          verify_id += 'b';
                        }
                        verify_id += cur_info.id;
                        if (verify_id == productSortData.field_sort[i]) {
                          let obj = _this.product_info_arr[j]
                          _this.product_info_arr.splice(j, 1);
                          _this.product_info_arr.unshift(obj)
                        }
                      }
                    }
                  }else{
                    // 否则覆盖排序信息
                    let arr = [];
                    _this.product_info_arr.forEach((e) => {
                      let id = '';
                      if (e.type == 1) {
                        id += 'g';    // group 产品组
                      }else if(e.type == 2){
                        id += 'b';    // base 底层账户
                      }else{
                        ;             // 匹配失败，不带前缀
                      }
  
                      id += e.id;
                      arr.push(id);
                    });
                    common_storage.setItem('report_group__group_order', {field_sort: arr});
                  }
  
                  common_storage.getItem('report_group__grid_order', (rtn) => {
                    if (0 == rtn.code) {
                      comGridSortData.order = rtn.data.order;
                      comGridSortData.order_by = rtn.data.order_by;
                      // display_rules 根据保存的field_sort进行排序
                      // rtn.data.field_sort 从尾到头遍历，一旦匹配则unshift添加到display_rules数组前面，且删除原来那个元素。（注意，display_rules长度及元素位置在变化，所以应该从0开始计数）
                      for (let i = rtn.data.field_sort.length - 1; i >= 0; i--) {
                        for (let j = 0, length = comGridSortData.display_rules.length; j < length; j++) {
                          if (comGridSortData.display_rules[j].id == rtn.data.field_sort[i]) {
                            let obj = comGridSortData.display_rules[j];
                            comGridSortData.display_rules.splice(j, 1);
                            comGridSortData.display_rules.unshift(obj);
                          }
                        }
                      }
                    }
                  });
                });
              }
              $.clearLoading();
            },
            error: function () {
              $.clearLoading();
            }
          })
  
          //下面是为了获取备注信息
          $.ajax({
            url: '/bms-pub/report/remark/get_report_remark?'+_change_id_type,
            type: 'GET',
            success: ({code,msg,data}) => {
              if (0 == code) {
                _this.current_product_remark = data;
              }
            }
          })
  
          //下面是为了获取所有产品的标记标杆信息
          $.ajax({
            url: '/bms-pub/report/get_sign?'+_change_id_type,
            type: 'GET',
            success: ({code,msg,data}) => {
              _this.product_sign_pole_all = data;
            }
          })
        }, 100)
        
      },
      customRefreshAfterModified: function(){
        this.doRefresh();
      },
      doRefresh: function(){
        if (this.current_procut_id.length > 0) {
          var _security_summary, cal_expect, end_product;
          if (this.pos_total == false) {
            _security_summary = 1;
          } else if (this.pos_total == true) {
            _security_summary = 0;
          }

          if (this.cal_expect == false) {
            cal_expect = 0;
          } else if (this.cal_expect == true) {
            cal_expect = 1;
          }

          //是否隐藏已结束产品
          // if (false == this.end_product) {
          //   end_product = '';
          // } else {
          //   end_product = 'running';
          // }

          this.getProductSign();
          this.product_report_info(this.current_data, _security_summary, cal_expect, this.end_product);

          //获取标记筛选下的产品，每次筛选之前首先要清空原有产品
          let sign_product_arr = [];
          let _this = this;
          _this.product_sign_arr = [];
          let all_sign_arr0 = _this.product_info_arr;
          let atr_sign = _this.product_sign_pole_all;
          //特殊情况 0
          if (1 == _this.product_select_sign) {
            _this.product_sign_pole_all.forEach( (j, index) => {
              if (1 == j.sign_id) {
                atr_sign.splice(index,1);
              }
            })
            all_sign_arr0.forEach(function (e, index) {
              atr_sign.forEach( (j) => {
                if (parseFloat(e.id) == parseFloat(j.product_id) && parseFloat(e.type) == parseFloat(j.type)) {
                  all_sign_arr0.splice(index,1);
                }
              })
            });
            _this.product_sign_arr = all_sign_arr0;
          } else {
            _this.product_info_arr.forEach( (e) => {
              atr_sign.forEach((ele) => {
                if (_this.product_select_sign == ele.sign_id && e.id == ele.product_id && e.type == ele.type) {
                  _this.product_sign_arr.push(e);
                }
              })
            })
          }
        }
      },
      getPositionData: function (position_rate,is_only_star,is_tiny,user_id) {
        //position_rate持仓比例筛选条件,is_only_star关注股票筛选条件,is_tiny展示模式,user_id展示指定基金经理的持仓报表
        let _this = this;
        $.startLoading('正在查询');
        $.ajax({
          url: '/bms-pub/report/stats/get_stock_position?position_rate='+position_rate+'&is_only_star='+is_only_star+'&is_tiny='+is_tiny+'&user_id='+user_id,
          type: 'GET',
          success: ({code, msg, data}) => {
            if (0 == code) {
              _this.position_form_data = data;
              if ('' == data.users) {
                _this.change_position_users = [];
              } else {
                _this.change_position_users = [{'id': 'total', 'name': '公司'}];
              }

              $.each(data.reports, (key, val) => {
                $.each(data.users, (key1, val1) => {
                  if (key == key1) {
                    let obj = {
                      id: key1,
                      name: val1.real_name
                    };
                    _this.change_position_users.push(obj);
                  }
                })
              })
              //排序
              common_storage.getItem('report_position_group_order', (rtn) => {
                if (0 == rtn.code) {
                  positionGridSortData.field_sort = rtn.data.field_sort;

                  for (let i = positionGridSortData.field_sort.length - 1; i >= 0; i--) {
                    for (let j = 0, length = _this.change_position_users.length; j < length; j++) {
                      let verify_id = '';
                      let cur_info = _this.change_position_users[j].id;
                      verify_id += cur_info;

                      if (verify_id == positionGridSortData.field_sort[i]) {
                        let obj = _this.change_position_users[j]
                        _this.change_position_users.splice(j, 1);
                        _this.change_position_users.unshift(obj);
                      }
                    }
                  }
                } else{
                  // 否则覆盖排序信息
                  let arr = [];
                  let reportData = _this.change_position_users;
                  reportData.forEach((e) => {
                    let id = e.id;
                    arr.push(id);
                  });

                  common_storage.setItem('report_position_group_order', {field_sort: arr});
                }

                common_storage.getItem('report_position__grid_order', (rtn) => {
                  if (0 == rtn.code) {
                    _this.position_data_show_sort.order = rtn.data.order;
                    _this.position_data_show_sort.order_by = rtn.data.order_by;
                    // display_rules 根据保存的field_sort进行排序
                    // rtn.data.field_sort 从尾到头遍历，一旦匹配则unshift添加到display_rules数组前面，且删除原来那个元素。（注意，display_rules长度及元素位置在变化，所以应该从0开始计数）
                    for (let i = rtn.data.field_sort.length - 1; i >= 0; i--) {
                      for (let j = 0, length = _this.position_data_show_sort.display_rules.length; j < length; j++) {
                        if (_this.position_data_show_sort.display_rules[j].id == rtn.data.field_sort[i]) {
                          let obj = _this.position_data_show_sort.display_rules[j];
                          _this.position_data_show_sort.display_rules.splice(j, 1);
                          _this.position_data_show_sort.display_rules.unshift(obj);
                        }
                      }
                    }
                  }
                });
              })
            } else {
              $.omsAlert(msg);
            }

            $.clearLoading();
          },
          error: ({code, msg, data}) => {
            $.omsAlert(msg);
            $.clearLoading();
          }
        })
      },
      positionDoRefresh: function () {
        // if ('' == this.position_form_data.users) {
        //   return false;
        // }
        let position_rate = this.position_rate;  //持仓比例筛选条件
        let is_only_star;  //是否显示全部股票
        if (false == this.is_only_star) {
          is_only_star = 0;
        } else {
          is_only_star = 1;
        }
        let selectedArr = [];
        this.changeManagerSelected.forEach((e) => {
          selectedArr.push(e.split('&')[0]);
        })
        let is_tiny = this.modelPositionId;  //模式筛选id
        let user_id = selectedArr.join(',');  //基金经理
        this.getPositionData(position_rate, is_only_star, is_tiny, user_id);
      }
    },
    watch: {
      //当current_procut_id和current_data改变的时候，里面的函数调用
      current_procut_id: function () {
        this.doRefresh();
      },
      //当日期变化的时候调用该函数
      current_data: function () {
        this.doRefresh();
      },
      //当判断是否汇总证券的时候调用该函数
      pos_total: function () {
        this.doRefresh();
      },
      //查看预期变化
      cal_expect: function(){
        this.doRefresh();
      },
      //是否隐藏已结束产品
      end_product: function () {
        this.doRefresh();
      },
      product_select_sign: function () {
        this.doRefresh();
      },
      is_only_star: function () {
        this.positionDoRefresh();
      },
      position_rate: function () {
        this.positionDoRefresh();
      },
      modelPositionId: function () {
        this.positionDoRefresh();
      },
      changeManagerSelected: function () {
        this.positionDoRefresh();
      }
    }
  });

  //获取下拉列表
  if (report_form.checkDisplay('position')) {
    report_form.getPositionData(0,0,0,'');
  }
  if (report_form.checkDisplay('product')) {
    report_form.getProductList();
  }
}
