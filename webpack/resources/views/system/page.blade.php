{{-- 系统运维页面 --}}
@extends('adminmanager_standard')

@section('asset-css')
  <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
  <script src="{{ asset('/js/plugin/vue/vue.js') }}"></script>
  <style>
    label>label.tips{
        float: right;
    }
    label.confirm-tips{
        color: #F44336;
        position: absolute;
        display: block;
        top: 0;
        left: 460px;
    }
    input.tips{
        border-color: #F44336!important;
    }
    input.confirm-tips{
        border-color: #F44336!important;
    }
  </style>
  <style>
    .jconfirm-box-container{
        /*margin-left: 33%;*/
        margin-left: auto;
        margin-right: auto;
        width: 680px;
        box-sizing: content-box;
        position: relative;
        min-height: 1px;
        padding-right: 15px;
        padding-left: 15px;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons button.btn-default,.jconfirm.jconfirm-white .jconfirm-box .buttons button.btn-default:hover{
        padding: 2px 4px;
        border-radius: 2px;
        /*background: #fff;
        color: #5b8cf1;*/
        font-weight: normal;

        font-size: 14px;
        color: #fff;
        background-color: #E74C3C;
        width: 100px;
        height: 30px;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons{
        float: none;
        text-align: center;
    }
    .jconfirm .jconfirm-box .buttons button+button{
        margin-left: 10px;
    }
    .jconfirm .jconfirm-box div.content-pane .content{
        padding-top: 5px;
        padding-bottom: 20px;
    }
    .confirm-class{
        width: 100px;
        height: 40px;
        background-color: #FFDE00;
        border-radius: 2px;
        color: #333!important;
        font-size: 16px!important;
    }
    .cancel-class{
        width: 100px;
        height: 40px;
        background-color: #f9f9f9;
        border-radius: 2px;
        border: 1px solid #ccc!important;
        color: #333!important;
        font-size: 16px!important;
    }
    a.jquery-confirm-ok:focus{
        background: #f0f0f0;
    }
    .jconfirm .jconfirm-scrollpane{
        background-color: rgba(0,0,0,.4);
    }
    .vue-log-confirm__log{
      height: 500px;
      overflow: auto;
    }
    .vue-log-confirm__log__desc{
      padding-top: 10px;
      padding-bottom: 10px;
      border-bottom: 1px solid #D7D5D5;
    }
    .vue-confirm .vue_page_ul>li span{
      right: 80px;
    }
    </style>
@endsection

@section('content')
  <div class="main-container fc">
    <section id="system_maintenance" class="section-container" style="padding-bottom: 120px;min-height: 640px;">
      <div class="container-title">
        <h2>系统运维</h2>
        <div style="clear:both;"></div>
      </div>
      <div class="btn-line">
        <vue-change-system-password :selected_account_arr="selected_account_arr"></vue-change-system-password>
        <vue-login-account :selected_account_arr="selected_account_arr"></vue-login-account>
        <a class="vue-btn" @click="addAccunt">添加账户</a>
        <vue-account-log></vue-account-log>
        <!-- <vue-create_account :selected_account_arr="selected_account_arr"></vue-create_account> -->
        <!-- <a class="btn-line__btn" v-on:click="">批量修改账户密码</a>
        <a class="btn-line__btn">批量登录账户</a>
        <a class="btn-line__btn">添加账户</a> -->
      </div>
      <div>
        <table class="custom-table">
          <thead>
            <tr style="height: 33px;" class="custom-table__tr">
              <th  class="custom-table__align-right">
                <input class="custom-table__input" v-model="checked_all" type="checkbox" name="system_checked">
              </th>
              <th class="custom-table__align-left">ID</th>
              <th class="custom-table__align-left">账户名称</th>
              <th class="custom-table__align-left">账户号码</th>
              <th class="custom-table__align-left">券商名称</th>
              <th class="custom-table__align-left">券商标识</th>
              <th class="custom-table__align-left">TB_IP</th>
              <th class="custom-table__align-left">TB_PORT</th>
              <th class="custom-table__align-left">资产类型</th>
              <th class="custom-table__align-left">市场区域</th>
              <th class="custom-table__align-left">系统类型</th>
              <th class="custom-table__align-left">登录状态</th>
              <th class="custom-table__align-left" style="position: relative;width: 80px;">
                自动登录                  
                <span class="dot-tip exclamation" style="position: absolute;top: 9px;left: 70px;right: initial;">
                  <div>
                    <em>i</em>
                    <span class="str">
                      <span class="msg">
                        <span>
                          开启定时登录，则每天9:00系统自动登录账户
                        </span>
                      </span>
                    </span>
                  </div>
                </span>
              </th>
              <th class="custom-table__align-left">锁定状态</th>
              <th style="padding-right: 23px;" class="custom-table__align-right"></th>
            </tr>
          </thead>
          <tbody>
            <template v-for="account,index in systemList">
              <tr v-if="systemList.length > 0"  style="height: 40px;" class="custom-table__tr" :class="{'not-login': !account.login_status}">
                <td class="custom-table__align-right">
                  <input class="custom-table__input" v-model="account.web_checked" type="checkbox" name="system_checked">
                </td>
                <td class="custom-table__align-left" v-text="account.id"></td>
                <td class="custom-table__align-left" v-text="account.name"></td>
                <td class="custom-table__align-left" v-text="account.account_id">
                </td>
                <td class="custom-table__align-left" v-text="account.securities_name">
                </td>
                <td class="custom-table__align-left" v-text="account.securities_id">
                </td>
                <td class="custom-table__align-left" v-text="account.server_host">
                </td>
                <td class="custom-table__align-left" v-text="account.server_port">
                </td>
                <td class="custom-table__align-left" v-text="showStockType(account.stock_type)">
                </td>
                <td class="custom-table__align-left" v-text="showMarket(account.market)">
                </td>
                <td class="custom-table__align-left" v-text="showChannel(account.channel)">
                </td>
                <!-- <td class="custom-table__align-left" v-text="getsecuritiesType(account.securities_id)">
                </td> -->
                <td class="custom-table__align-left" style="position: relative;">
                  <div style="display: inline-block;padding-right: 30px;" v-text="showLoginStatus(account.login_status)"></div>
                  <span class="dot-tip exclamation" v-if="!account.login_status" style="position: absolute;top: 12px;left: 56px;right: initial;">
                    <div>
                      <em>i</em>
                      <span class="str">
                        <span class="msg">
                          <span v-text="account.login_msg"></span>
                        </span>
                      </span>
                    </div>
                  </span>
                  <vue-single-login-account :selected_account_arr="[account]" :login_status="account.login_status"></vue-single-login-account>
                </td>
                 <!--<td class="custom-table__align-left">
                  <div style="display: inline-block;" v-text="showBaseStatus(account.auto_login)"></div>
                  <vue-base-account-auto-sign :selected_account_arr="[account]" :auto_login="account.auto_login"></vue-base-account-auto-sign>
                </td> -->
                <td>
                  <vue-common-switchbut :val=account.auto_login :data=account :show="autoLoginShow" :index=index @btn_click=doChgAutoLogin></vue-common-switchbut>
                </td>
<!--                 <td class="custom-table__align-left">
                  <div style="display: inline-block;" v-text="showBaseStatus(account.status)"></div>
                  <vue-base-account :selected_account_arr="[account]" :base_status="account.status"></vue-base-account>
                </td> -->
                <td>
                  <vue-common-switchbut :val=account.status :data=account :show="autoBaseShow" :index=index @btn_click=doChgStatus></vue-common-switchbut>
                </td>
                <td class="custom-table__align-right">
                  <div>
                    <a v-if="account.type == 'pb'" class="custom-table__btn" @click="setReportInfo(account)">报备信息</a>
                    <a v-else class="custom-table__btn" style="color:#2A2A2A">报备信息</a>
                  </div>
                </td>
                <td class="custom-table__align-right">
                  <div>
                    <a class="custom-table__btn" @click="setAccountInfo(account)">账户信息</a>
                  </div>
                </td>

                <td class="custom-table__align-right">
                  <div>

                    <a  v-if="account.channel == 0 || account.channel == 1 || account.channel == 2 || account.channel == 5 || account.channel == 3 || account.channel == 4" class="custom-table__btn" @click="setBrokerInfo(account)">券商信息</a>
                    <a  v-else class="custom-table__btn" style="color:#2A2A2A">券商信息</a>
                  </div>
                </td>
                <td class="custom-table__align-right">
                  <div>
                    <a class="custom-table__btn" @click="setPassword(account)">密码修改</a>
                  </div>
                </td>
                <td class="custom-table__align-right" style="padding-right:20px">
                  <div>
                    <a class="custom-table__btn" @click="setProductInfo(account)">产品信息</a>
                  </div>
                </td>


              </tr>
            </template>
          </tbody>
        </table>
      </div>
    </section>
  </div>
  <div id="vue-confirm">

  </div>
@endsection

@section('js-private')
  <script>
    //全局配置
    window.ENV = window.ENV || {};
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";

    //密码的显示与隐藏
    function add(name) {
      if ('password' == $("."+name+" .password-box__input").attr('type')) {
        $("."+name+" .password-box__input").attr('type', 'text');
        $("."+name+" .password-box__img").attr('src', '../images/welcome/showpassword_icon.png');
      } else {
        $("."+name+" .password-box__input").attr('type', 'password');
        $("."+name+" .password-box__img").attr('src', '../images/welcome/hidepassword_icon.png');
      }
    }
  </script>
  <script src="{{asset('/js/jquery.validate.min.js')}}" type="text/javascript"></script>
  <script src="{{asset('/js/oms/custom.validate.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
  <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
  <script src="{{ asset('/dist/js/system/page.js') }}"></script>
@endsection
