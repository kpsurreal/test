/**
 * author: liuzeyafzy
 * 账户管理页面
 */

function JS_base_lists(prefix){
  let str_page_title = '';
  if (FD.orgInfo.theme == 3) {
    str_page_title = '账户管理';
  }else{
    str_page_title = '基金列表';
  }
  let page_title = new Vue({
    el: '#page_title',
    data:{
      str_page_title: str_page_title
    }
  });
  let account_list = new Vue({
    el: '#account_list',
    data: {
      // selected_account_arr: [],
      filter: 'running',
      prefix: prefix,
      org_info: FD.orgInfo,
      accountsInfo: {},
      product_list: [],
      option_list: [],
      changeSeleteId: '',
      isdrag:true,
    },
    computed: {
      selected_account_arr: function(){
        let _this = this;
        let arr = [];
        this.accountsInfo.group && this.accountsInfo.group.forEach(function(e){
          if (e.web_checked) {
            arr.push(e.id)
          }
          e.child_product.forEach(function(el){
            if (el.web_checked) {
              arr.push(el.id);
            }
          });
          e.child_group.forEach(function(el){
            if (el.web_checked) {
              arr.push(el.id)
            }
            el.child_product.forEach(function(ele){
              if (ele.web_checked) {
                arr.push(ele.id);
              }
            })
          })
        });

        this.accountsInfo.product && this.accountsInfo.product.forEach(function(e){
          if (e.web_checked) {
            arr.push(e.id);
          }
          e.child_product.forEach(function(el){
            if (el.web_checked) {
              arr.push(el.id)
            }
          })
        })

        return arr;
      },
      selected_top_group_arr: function(){
        let _this = this;
        let arr = [];
        this.accountsInfo.group && this.accountsInfo.group.forEach(function(e){
          if (e.web_checked) {
            arr.push(e.id)
          }
        });
        return arr;
      },
      selected_top_base_arr: function(){
        let _this = this;
        let arr = [];
        this.accountsInfo.product && this.accountsInfo.product.forEach(function(e){
          if (e.web_checked) {
            arr.push(e.id)
          }
        });
        return arr;
      },
    },
    watch: {
      changeSeleteId: function () {
        var _this = this;
        this.getAccountList(this.changeSeleteId);
      },
      filter: function(){
        this.getAccountList(this.changeSeleteId);
      }
    },
    methods: {
      customRefreshAfterModified: function(){
        this.getAllData(true);
      },
      getAllData: function(flag){
        if (true == flag) {
          this.getAccountList({
            clear_cache: 1
          });
        }else{
          this.getAccountList();
        }
        this.getProductList();
        this.getOptionList();
      },
      searchSelected: function(){
        let _this = this;
        let id = '';
        let type = '';
        this.product_list.forEach(function(e){
          if (e.id == _this.changeSeleteId) {
            id = e.id;
            type = e.type;
          }
        });
        let obj = {};
        if (type == 'group') {
          obj.group_id = id;
        }else if(type == 'product'){
          obj.product_id = id;
        }else{
          obj = undefined;
        }
        this.getAccountList(obj);
      },
      getSearchList: function(){

      },
      getOptionList: function(){
        var _this = this;
        $.ajax({
          url: '/bms-pub/product/get_product_group?only_top=0',
          type: 'GET',
          success: function ({code, msg, data}) {
            if (0 == code) {
              data.lists && data.lists.forEach(function(e){
                e.type = 'group';
              })
              _this.option_list = data.lists;
              data.product && data.product.forEach(function (e) {
                e.type = 'product';
                _this.option_list.push(e)
              })
            }
          },
          error: function () {

          }
        })
      },
      getProductList: function () {
        var _this = this;
        $.ajax({
          url: '/bms-pub/product/get_product_group',
          type: 'GET',
          success: function ({code, msg, data}) {
            if (0 == code) {
              data.lists && data.lists.forEach(function(e){
                e.type = 'group';
              })
              _this.product_list = data.lists;
              data.product && data.product.forEach(function (e) {
                e.type = 'product';
                _this.product_list.push(e)
              })
              return _this.product_list;
            }
          },
          error: function () {

          }
        })
      },
      getAccountList: function(obj){
        let _this = this;
        if (obj == undefined) {
          obj = {}
        }
        $.startLoading('正在查询');

        let data_url = '';
        if (3 == this.org_info.theme) {
          data_url = '/omsv2/product/get_base_product';
        } else {
          data_url = '/bms-pub/product/get_group_product';
        }
        $.ajax({
          url: data_url,
          type: 'get',
          data: obj,
          success: function({code, msg, data}){
            $.clearLoading();
            // accountsInfo 包含base(底层账户)和group(产品组),产品组还可以包含一级产品组，而底层账户只能包含产品child_product
            if (0 == code) {
              // 初始化默认不选中
              data.product.forEach(function(e){
                e.web_hide_child = true;
                e.web_checked = false;
                e.showChildren = true;
                // console.log(e.child_product)
                // e.child_product.forEach(function(el){
                //   el.web_checked = false;
                // })
              });
              if (3 != _this.org_info.theme) {
                data.group.forEach(function(e){
                  e.web_hide_child = true;
                  e.web_checked = false;
                  e.child_product.forEach(function(el){
                    el.web_hide_child = true;
                    el.web_checked = false;
                  })
                  e.child_group && e.child_group.forEach(function(el){
                    el.web_hide_child = true;
                    el.web_checked = false;
                    el.child_product.forEach(function(ele){
                      ele.web_checked = false;
                    })
                  })
                })
              }
              _this.accountsInfo = data;
            }else{
              $.omsAlert(msg);
            }
          },
          error: function(){
            $.clearLoading();
            $.omsAlert('网络异常，请重试')
          }
        })
      },
      numeralNumber: function numeralNumber(arg, num) {
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
  account_list.getAllData();
}
