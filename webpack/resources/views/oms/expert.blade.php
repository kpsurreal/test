<!DOCTYPE html>
<html style="height: 100%;background-color: #fff;">
<head>
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
  <title>账户</title>
  <link href="{{ asset('/3rd/datepicker/css/zebra_datepicker.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/file-center.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/plugin/multiple-select/multiple-select.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">

  <script src="{{asset('/js/jquery.min.js')                       }}"></script>
  <script src="{{ asset('/js/jquery.cookie.js')                   }}"></script>
  <script src="{{ asset('/js/oms/oms.utilities.js')                     }}"></script>
  <script src="{{ asset('/js/oms/oms.app.js')                     }}"></script>
  <script src="{{ asset('/js/oms/oms.notice.js')                     }}"></script>
  <script src="{{ asset('/js/moment.min.js')                      }}"></script>
  <script src="{{ asset('/js/numeral.min.js')                     }}"></script>
  <script src="{{ asset('/js/jquery.magnific-popup.min.js')       }}"></script>
  <script src="{{ asset('/3rd/datepicker/zebra_datepicker.js') }}"></script>
  <script src="{{ asset('/js/plugin/multiple-select/multiple-select.js') }}"></script>
  <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
  <script src="{{ asset('/js/plugin/vue/vue_2.0.7.js') }}"></script>
  <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
  <script type="text/json" logined-info-data >{!! isset($logined_info) ? json_encode($logined_info) : '' !!}</script>
  <script>
  try{//全局用户信息 LOGIN_INFO
      window.LOGIN_INFO = JSON.parse( $('[logined-info-data]').html() );
  }catch(e){}
  </script>

  <script src="{{ asset('/dist/js/common/risk_rules.js')               }}"></script>
  <script src="{{ asset('/dist/js/common/risk_controller.js')          }}"></script>
  <style>
    .Zebra_DatePicker{width:200px;top:40px!important;line-height:1;}
    /*.Zebra_DatePicker table{width:100%!important;}
    button.Zebra_DatePicker_Icon_Inside_Right{top:13px!important;right:2px!important;}*/
    .Zebra_DatePicker_Icon_Wrapper>input{
        cursor: pointer;
        border-radius: 2px;
        border: 0 none;
        padding: 0 5px;
        /*height: 35px;*/
    }
    .Zebra_DatePicker_Icon_Wrapper>button{
        top: 11.5px!important;
        margin-top: 4px;
    }
    .ms-choice{
      /*height: 35px;*/
      /*line-height: 35px;*/
      border-color: rgba(204, 204, 204, 0.7);
    }
    .ms-choice > div{
      top: 1px;
    }
    .ms-drop input[type="checkbox"]{
      margin-right: 5px;
    }
    .file-center-head .Zebra_DatePicker_Icon_Wrapper input{
      width: 150px;
      height: 24px;
      border-radius: 3px;
      border: 1px solid #BEBEBE;
      outline: none;
      padding-left: 10px;
    }
    .file-center-head .Zebra_DatePicker{
      width: 200px;
      top: 27px!important;
    }
    .file-center-head .custom-grey-btn{
      line-height: 32px;
      height: 32px;
    }
    .file-center-head .Zebra_DatePicker_Icon_Wrapper>button{
      margin-top: 0;
      top: 5px!important;
    }
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
    .file-center-content tr{
      border-bottom: 1px solid rgba(74, 144, 226, .3);
      height: 26px;
    }
    .file-center-content tr th{
      background-color: #E8E9ED;
    }
    .file-center-content tr:last-child{
      border-bottom: .5px solid #232E3E;
    }
  </style>
</head>
<body class="client-body">
  <div id="client-body" class="client-body">
    <client-header :product_list="product_list" :cur_product_id="cur_product_info.id" :cur_nav="cur_nav" v-on:select_product="changeSelectProduct($event)" v-on:refresh="refresh()" :begin_date="beginDate" :end_date="endDate" :query_stock="queryStock"></client-header>
    <main class="client-body__main">
      <client-nav :cur_nav="cur_nav" v-on:input="cur_nav = $event"></client-nav>

      <client-grid v-if="cur_nav != 'changePassword'" :cur_nav="cur_nav" :cur_product_info="cur_product_info" :need_show_arr="need_show_arr" :profit_of_today_v2="profit_of_today_v2" :profit_of_today_v2_id="profit_of_today_v2_id" v-on:change_begin_date="beginDate = $event" v-on:change_end_date="endDate = $event" v-on:change_query_stock="queryStock = $event" @tr_click="tr_click" @select_report_id="chgSelected = $event" @current_date_change="current_data = $event" :center_list="center_list">
        <client-trader :cur_nav="cur_nav" :enable_cash="cur_product_info.enable_cash" :cur_product_id="cur_product_info.id" :need_show_arr="need_show_arr" :position_realtime="position_realtime" ref="client_trader"></client-trader>
      </client-grid>
      <client-form-password v-if="cur_nav == 'changePassword'"></client-form-password>
    </main>
    <client-footer :security="productInfo.security" :security="productInfo.security" :total_assets="productInfo.total_assets" :right_capital="cur_product_info.right_capital"></client-footer>
  </div>
  <div class="custom-confirm hide">
    <div class="custom-confirm__bg"></div>
    <div class="custom-confirm__content">

    </div>
  </div>

  <!-- <div class="custom-confirm">
    <div class="custom-confirm__bg"></div>
    <div class="custom-confirm__content">
      <article class="custom-confirm__body">
        <main>
          <form class="custom-confirm-form">
            <div class="custom-confirm__status">
              <i></i> 提交成功
            </div>
            <div class="custom-confirm-form__item">
              <label class="custom-confirm-form__label">股票代码/名称</label>
              <div class="custom-confirm-form__value"></div>
            </div>
            <div class="custom-confirm-form__item">
              <label class="custom-confirm-form__label">交易价格<span>(元/股)</span></label>
              <div class="custom-confirm-form__value"></div>
            </div>
            <div class="custom-confirm-form__item">
              <label class="custom-confirm-form__label">交易数量<span>(股)</span></label>
              <div class="custom-confirm-form__value"></div>
            </div>
            <div class="custom-confirm-form__item">
              <label class="custom-confirm-form__label">交易金额<span>(元)</span></label>
              <div class="custom-confirm-form__value"></div>
            </div>
            <div class="custom-confirm-form__button">
              <a class="custom-confirm-form__btn--close">关闭</a>
            </div>
         </form>
        </main>
      </article>
    </div>
  </div> -->

  <!-- <div class="custom-confirm">
    <div class="custom-confirm__bg"></div>
    <div class="custom-confirm__content">
      <article class="custom-confirm__body">
        <main>
          <form class="custom-confirm-form">
            <div class="custom-confirm__status custom-confirm__status--failure">
              <i></i> 提交失败
              <span class="custom-confirm__status--failure-reason">当前不支持提单，请于后天16:00后提交</span>
            </div>
            <div class="custom-confirm-form__item">
              <label class="custom-confirm-form__label">股票代码/名称</label>
              <div class="custom-confirm-form__value"></div>
            </div>
            <div class="custom-confirm-form__item">
              <label class="custom-confirm-form__label">交易价格<span>(元/股)</span></label>
              <div class="custom-confirm-form__value"></div>
            </div>
            <div class="custom-confirm-form__item">
              <label class="custom-confirm-form__label">交易数量<span>(股)</span></label>
              <div class="custom-confirm-form__value"></div>
            </div>
            <div class="custom-confirm-form__item">
              <label class="custom-confirm-form__label">交易金额<span>(元)</span></label>
              <div class="custom-confirm-form__value"></div>
            </div>
            <div class="custom-confirm-form__button">
              <a class="custom-confirm-form__btn--close">关闭</a>
            </div>
         </form>
        </main>
      </article>
    </div>
  </div> -->

  <!-- <div class="custom-confirm">
    <div class="custom-confirm__bg"></div>
    <div class="custom-confirm__content">
      <article class="custom-confirm__body" style="width: 390px;">
        <header class="custom-confirm__header">
          <h2>撤单确认</h2>
        </header>
        <main>
          <form class="custom-confirm-form">
            <div class="custom-confirm-form__title">待撤单委托：2条，确定撤销以下委托？</div>
            <table class="custom-confirm-form__table">
              <tbody>
                <tr>
                  <td>股票代码</td>
                  <td>股票名称</td>
                  <td>买卖方向</td>
                  <td>委托编号</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>300168</td>
                  <td>万达信息</td>
                  <td>买入</td>
                  <td>750545</td>
                </tr>
                <tr>
                  <td>300168</td>
                  <td>万达信息</td>
                  <td>买入</td>
                  <td>750545</td>
                </tr>
              </tbody>
            </table>
            <div class="custom-confirm-form__button">
              <a class="custom-confirm-form__btn custom-confirm-form__btn--doCancel">确认撤单</a>
            </div>
         </form>
        </main>
        <button class="custom-confirm__cancel-icon">X</button>
      </article>
    </div>
  </div> -->

  <!-- <div class="custom-confirm">
    <div class="custom-confirm__bg"></div>
    <div class="custom-confirm__content">
      <article class="custom-confirm__body" style="width: 552px;">
        <main>
          <form class="custom-confirm-form">
            <div class="custom-confirm-form__title">当前<span>1</span>条撤单成功，<span>1</span>条撤单失败</div>
            <table class="custom-confirm-form__table">
              <tbody>
                <tr>
                  <td>股票代码</td>
                  <td>股票名称</td>
                  <td>买卖方向</td>
                  <td>委托编号</td>
                  <td>备注</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>300168</td>
                  <td>万达信息</td>
                  <td>买入</td>
                  <td>750545</td>
                  <td>无</td>
                </tr>
                <tr>
                  <td>300168</td>
                  <td>万达信息</td>
                  <td>买入</td>
                  <td>750545</td>
                  <td>该委托状态不支持撤单</td>
                </tr>
              </tbody>
            </table>
            <div class="custom-confirm-form__button">
              <a class="custom-confirm-form__btn custom-confirm-form__btn--doCancel">关闭</a>
            </div>
         </form>
        </main>
      </article>
    </div>
  </div> -->

  <!-- <div class="custom-confirm">
    <div class="custom-confirm__bg"></div>
    <div class="custom-confirm__content">
      <article class="custom-confirm__body" style="width: 552px;">
        <main>
          <form class="custom-confirm-form">
          <div>
            <div>
              <a></a>
              <span>@{{value}}</span>
            </div>
            <div>
              <input v-model="modify_value" />
              <a></a>
            </div>
          </div>
            <table class="custom-confirm-form__table" id="display_table">
              <tbody>
                <tr>
                  <td>股票代码</td>
                  <td>股票名称</td>
                  <td>买卖方向</td>
                  <td>委托编号</td>
                  <td>备注</td>
                </tr>
              </tbody>
              <tbody>
                <tr>
                  <td>300168</td>
                  <td>万达信息</td>
                  <td>买入</td>
                  <td>750545</td>
                  <td>
                    <vue-custom-modify :id="id" :value="value" :ajax_url="ajax_url" :ajax_data="ajax_data"></vue-custom-modify>
                  </td>
                </tr>
                <tr>
                  <td>300168</td>
                  <td>万达信息</td>
                  <td>买入</td>
                  <td>750545</td>
                  <td>该委托状态不支持撤单</td>
                </tr>
              </tbody>
            </table>
            <div class="custom-confirm-form__button">
              <a class="custom-confirm-form__btn custom-confirm-form__btn--doCancel">关闭</a>
            </div>
         </form>
        </main>
      </article>
    </div>
  </div> -->


  <div class="error_tip_wrapper">
      <span id="error_tip" class="hide"></span>
  </div>
  <script>
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    window.APP_NAME = "{{ config('custom.app_name','') }}";

    //全局 ajax 意外处理
    $(window).ajaxComplete(function(event, xhr, settings) {
      if(
        /您还未登录/.test(xhr.responseText)
        || ( xhr.responseJSON && xhr.responseJSON.code===10000 )
        || /您还未登录/.test(xhr.responseJSON && xhr.responseJSON.msg)
      ){
        // $.omsAlert('登录已经过期，需要重新登录！',false,5000);
        $.omsAlertDisable();
        setTimeout(function(){
          location.href = window.REQUEST_PREFIX+"/user/login?alert=timeout&back_url="+encodeURIComponent((window.REQUEST_PREFIX||'')+'/oms');
        },2000);
      }
    });

    //全局退出登录方法
    function LogOut(isAsync){
      if (undefined === isAsync) {
        isAsync = true;
      }

      $.ajax({
        type: 'post',
        async: isAsync,
        url: '/bms-pub/user/logout',
        complete: function(){
          $.removeCookie('app_token', {path: '/'});
          $.removeCookie('sns_token', {path: '/'});
          location.href = (window.REQUEST_PREFIX||'') + "/user/login";
        }
      })
    }
  </script>
  <script type="text/javascript" src="{{ asset('/dist/js/client.expert.js') }}"></script>
</body>
</html>
