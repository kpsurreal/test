function reportFileCenterFn () {

  //页面头部
  Vue.component('file-center-head', {
    props: ['product_list', 'batch_down_list', 'product_data'],
    template: `
      <div class="file-center-head">
        <h1 class="file-center-head__title">文件中心</h1>
        <div class="file-center-head__report">
          <vue-multiple_select :options="options" :flag_check_all="true" :checked_arr="select_id" :init_obj="init_obj" v-on:multiple_select="select_id = ($event)"></vue-multiple_select>
        </div>
        <div class="file-center-head__data">
          <vue-zebra_date_picker :value="currentDate" v-on:select="currentDate = ($event)"  :min_date="'2015-01-01'" :max_date="currentDate"></vue-zebra_date_picker>
        </div>

        <div style="flex-grow: 1;"></div>

        <button class="file-center-head__botchDown" @click="batch_down()">批量下载</button>

        <a v-on:click="refresh()" class="custom-grey-btn custom-grey-btn__refresh">
          <i class="oms-icon refresh"></i>刷新
        </a>
      </div>
    `,
    data: function () {
      return {
        // options: '',
        select_id: '',
        currentDate: (function(){return moment().format('YYYY-MM-DD')})(),
        init_obj: {
          allSelected: '全部报表',
          noMatchesFound: '未选择任何报表',
          placeholder: '请先选择报表'
        },
        batch_down_fn: false
      }
    },
    computed: {
      options: function () {
        let report_file_center = [];
        //机构版专户版报表
        if (3 == window.LOGIN_INFO.org_info.theme) {
          report_file_center = [
            {
              value: '资产查询数据',
              label: '资产查询数据',
              num: '0'
            },
            {
              value: '持仓查询数据',
              label: '持仓查询数据',
              num: '1'
            },
            {
              value: '委托查询数据',
              label: '委托查询数据',
              num: '2'
            },
            {
              value: '成交查询数据',
              label: '成交查询数据',
              num: '3'
            },
            {
              value: '清算查询数据',
              label: '清算查询数据',
              num: '4'
            }
          ];
        } else {
          report_file_center = [
            {
              value: '产品报表',
              label: '产品报表',
              num: '0'
            },
            {
              value: '股票持仓报表',
              label: '股票持仓报表',
              num: '1'
            },
            {
              value: '资产查询数据',
              label: '资产查询数据',
              num: '2'
            },
            {
              value: '持仓查询数据',
              label: '持仓查询数据',
              num: '3'
            },
            {
              value: '委托查询数据',
              label: '委托查询数据',
              num: '4'
            },
            {
              value: '成交查询数据',
              label: '成交查询数据',
              num: '5'
            }
          ];
        }
        return report_file_center;
      }
    },
    watch: {
      select_id: function () {
        this.$emit('select_report_id', this.select_id);
      },
      currentDate: function () {
        this.$emit('current_date_change', this.currentDate);
      },
      batch_down_fn: function () {
        this.$emit('batch_down_change_click', this.batch_down_fn);
      }
    },
    methods: {
      refresh: function () {
        //刷新页面,方便组件重复利用
        if ("[object Function]" == Object.prototype.toString.call(this.$root.doRefresh)) {
          this.$root.doRefresh(true);
        }
      },
      batch_down: function () {
        let _this = this;
        this.batch_down_fn = true;
        // 如果没有选中的报表id,禁止点击
        if (undefined == this.batch_down_list || '' == this.batch_down_list) {
          $.omsAlert('请先选择报表');
          return false;
        }

        var down_url_arr = [];
        this.batch_down_list.forEach((e) => {
          _this.product_list.forEach((i) => {
            if (e == i.id) {
              let obj = '';
              obj = i.down_url.split('storage/')[1];
              down_url_arr.push(decodeURI(obj));
            }
          })
        })

        $.ajax({
          url: '/utility/downloadzip',
          type: 'GET',
          data: {
            user_id: window.LOGIN_INFO.user_id,
            file_name:down_url_arr.join(','),
            date: this.product_data.split('-').join('')
          },
          success: ({code,msg,data}) => {
            window.location.href = '/utility/downloadzip?user_id='+window.LOGIN_INFO.user_id+'&file_name='+down_url_arr.join(',')+'&date='+this.product_data.split('-').join('');
            return false;
          },
          error: () => {
            $.omsAlert('网络异常，请尝试');
          }
        })

      }
    }
  })
  //input 点击事件，方便传值全选
  Vue.component('report-input-checkout', {
    props: ['reportItem', 'reportAllSelected', 'change_selected_id'],
    template: `
      <div>
        <input type="checkbox" v-model="change_model" :disabled="disabledFn(reportItem)" @click="change_selected_model()"/>
        {{reportItem.category}}
      </div>
    `,
    data: function () {
      return {
        change_model: false,  //单个报表选中判断
        change_model_id: this.reportItem.id  //当前报表id
      }
    },
    watch: {
      change_model: function () {  //通过是否勾选来得到选中的报表id
        let _this = this;
        if (false == this.change_model) {
          this.change_selected_id.forEach((e,index) => {
            if (_this.reportItem.id == e) {
              _this.change_selected_id.splice(index,1);
            }
          })
        } else {
          this.change_selected_id.push(this.reportItem.id);
        }
        this.$emit('change_model_report', this.change_model);
      },
      change_model_id: function () {
        this.$emit('change_model_report_id', this.change_model_id);
      },
      reportAllSelected: function () { //通过是否勾选来判断是否全部选中报表
        if (1 != this.reportItem.status) {
          return false;
        }
        this.change_model = this.reportAllSelected;
      }
    },
    methods: {
      change_selected_model: function () {
        if (false == this.change_model) {
          return this.change_model = false;
        }
        return this.change_model = true;
      },
      disabledFn: function (reportItem) {
        if (1 != reportItem.status) {
          return 'disabled';
        }
      }
    }
  })

  Vue.component('file-center-content', {
    props: ['product_list', 'product_data'],
    template: `
      <table class="file-center-content">
        <tr>
          <th><input type="checkbox" v-model="reportAllSelected"/>类别</th>
          <th>报表名</th>
          <th>状态</th>
          <th>生成时间</th>
          <th></th>
          <th></th>
          <th></th>
        </tr>
        <tr v-for="reportItem in product_list">
          <td>
            <report-input-checkout :change_selected_id="change_selected_id" :reportAllSelected="reportAllSelected" :reportItem="reportItem"></report-input-checkout>
          </td>
          <td>{{reportItem.report_name}}</td>
          <td v-text="reportStatus(reportItem)"></td>
          <td>{{reportItem.down_time}}</td>
          <td><a :id="'report_id'+reportItem.id" :class="{click_change: 1==reportItem.status,no_click_change:1!=reportItem.status}" @click="reportDoenLoad(reportItem)">下载</a></td>
          <td><a class="file-center-content__reGenerate" :class="{click_change: 1!=reportItem.status,no_click_change:1==reportItem.status || 0 == reportItem.status}" @click="regenerate(reportItem)">重新生成</a></td>
          <td><a class="file-center-content__delete" @click="deleteReport(reportItem)">删除</a></td>
        </tr>
        <tr v-if="0 == product_list.length">
          <td colspan="7">该时段暂无匹配记录</td>
        </tr>
      </table>
    `,
    data: function(){
      return {
        reportAllSelected: false,  //全选
        change_selected_id: []
      }
    },
    watch: {
      change_selected_id: function () {
        this.$emit('batch_down_report_id', this.change_selected_id);
      }
    },
    methods: {
      reportStatus: function (itemId) {
        if (0 == itemId.status) {
          return '生成中';
        } else if (1 == itemId.status) {
          return '已生成';
        } else if (2 == itemId.status) {
          return '已失败';
        }
      },
      deleteReport: function (item) {  //删除报表文件
        let _this = this;
        $.confirm({
          title: '退出确认',
          content: `
            <div class="vue-confirm">
              <div style="font-size: 14px; text-align: center; color: #000000; padding: 60px 0;">确认删除该文件？</div>
            </div>
          `,
          closeIcon: true,
          columnClass: 'custom-window-width',
          confirmButton: '确定',
          confirmButtonClass: 'vue-confirm__btns--cancel',
          confirm: function(){
            $.startLoading();
            $.ajax({
              url: '/bms-pub/report/file_delete',
              type: 'POST',
              data: {
                id: item.id
              },
              success: ({code,msg,data}) => {
                if (0 == code) {
                  //刷新页面,方便组件重复利用
                  if ("[object Function]" == Object.prototype.toString.call(_this.$root.doRefresh)) {
                    _this.$root.doRefresh(true);
                  }
                  $.clearLoading();
                  $.omsAlert('删除成功');
                }
              },
              error: () => {
                $.omsAlert('网络异常');
              }
            })
          },
          cancelButton: false
        })

      },
      reportDoenLoad: function (reportItem) { //下载
        let _this = this;
        if (1 != reportItem.status) {  //如果是生成不成功的报表，下载不可点击
          return false;
        }
        window.location.href = reportItem.down_url+'?n='+reportItem.report_name;
      },
      regenerate: function (reportItem) {
        if (1 == reportItem.status || 0 == reportItem.status) { //如果是报表生成成功的时候，重新生成不可点
          return false;
        }
        //由于各种类型的报表的参数结构不一致，与后台确认，只能根据数据的类型来得到数据
        let  data = [];
        $.each(reportItem.request_url.data, (key, val) => {
          let str = '';
          if ('string' == (typeof val)) {
            str = key+'='+val;
            data.push(str);
          } else if ('object' == (typeof val)){
            $.each(val, (key1, val1) => {
              if ('string' == (typeof val1)) {
                str = key1 + '=' + val1;
                data.push(str);
              }
            })
          }
        })
        $.ajax({
          url: reportItem.request_url.url+'?'+data.join('&'),
          type: 'GET',
          data: {
            file_id: reportItem.id
          },
          success: ({code,msg,data}) => {
            if (0 == code) {
              $.omsAlert('重新生成成功');
              //刷新页面,方便组件重复利用
              if ("[object Function]" == Object.prototype.toString.call(this.$root.doRefresh)) {
                this.$root.doRefresh(true);
              }
            } else {
              $.omsAlert(msg);
            }
          },
          error: () => {
            $.omsAlert('网络异常，请重试');
          }
        })
      }
    }
  })

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
      product_data: (function(){return moment().format('YYYY-MM-DD')})()
    },
    methods: {
      //下拉列表中产品的数据
      getProductList: function(current_data,reportType){
        let _this = this;
        let date = current_data.split('-').join('');
        $.startLoading('正在查询');
        $.ajax({
          url: '/bms-pub/report/file_list?date='+ parseFloat(date)+'&category='+reportType,
          type: 'GET',
          success: ({code,msg,data}) => {
            if (0 == code) {
              _this.product_list = data;
            } else {
              $.omsAlert(msg);
            }
            $.clearLoading();
          },
          error: () => {
            $.omsAlert('网络异常');
            $.clearLoading();
          }
        })
      },
      doRefresh: function () { //刷新
        this.getProductList(this.product_data,this.chgSelected);
      }
    },
    watch: {
      chgSelected: function () {
        this.getProductList(this.product_data,this.chgSelected);
      },
      product_data: function () {
        this.getProductList(this.product_data,this.chgSelected);
      }
    }
  });
}
