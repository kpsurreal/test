{{-- 指令管理页面 --}}
@extends('adminmanager_standard')

@section('asset-css')
  <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/3rd/datepicker/css/zebra_datepicker.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/plugin/multiple-select/multiple-select.css') }}" rel="stylesheet">
  <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">
  @if($host_theme == 'standard')
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
    {{-- @elseif($condition) --}}
  @else
    <link href="{{ asset('/css/theme1/oms.min.css') }}" rel="stylesheet">
  @endif
  <style type="text/css">
    .trade-custom-tmp-class{
      font-size: 12px;width: 100%;max-width: 250px;height: 26px; padding: 4px 8px;border-radius: 2px;border: 1px solid #ccc;
    }
    .trade-custom-tmp-class>input{
      display: block;
      width: 100%;
      border: 0 none;
    }
    .trade-custom-tmp-class>span{
      line-height: 26px;
    }
    .client-suggest{
      top: 32px!important;
      bottom: auto!important;
    }
    /*body{
      padding-bottom: 415px;
      margin-bottom: 320px;
    }*/
  </style>

  <style>
    .jconfirm-box-container{
        /*margin-left: 33%;*/
        margin: 0 auto;
        width: 670px;
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

    .new-oms-container .main-container section.multi-product-head .oms-table.policy-table.nothing:before{
        content: '暂未分配任何策略，请联系管理员';
    }
  </style>
@endsection

@section('content')
  <div class="main-container fc custom-main-container">
    <div>
      <section class="section-container custom-main-container__section-container" id="instruction-manage" v-cloak>
        <vue-instruction-manage ref="instruction-manage"></vue-instruction-manage>
        <vue-product-list :ajax_product_list="ajaxProductList"></vue-product-list>
        <vue-product-position ref="product-position"></vue-product-position>
        <div style="height: 310px;"></div>
      </section>
      <div style="position: absolute; bottom: 0;width: 100%;" id="trade-controllor" v-cloak>
        <section class="create-order board black-turnoff fc fixed" style="bottom: 0px;margin-bottom:0;z-index: 50;" v-bind:style="'width:' + wholeWidth + 'px'">
          <div class="body">
            <vue-trade-menu @menu="chgMenu($event)" ref="trade-menu"></vue-trade-menu>
            <!-- <div class="right-board" style="padding-bottom: 0px;padding: 0;min-width: 1400px;" v-bind:style="'width:' + leftWidth + 'px'"> -->
            <div class="right-board" style="padding-bottom: 0px;padding: 0;min-width: 1400px;">
              <div v-if="true == showBoard && ('single-buy' == curActive || 'single-sell' == curActive)" style="display: flex;">
                <div>
                  <vue-trade-form :cur_active="curActive" v-on:stock_id="chgStockId($event)"></vue-trade-form>
                </div>
                <div>
                  <vue-trade-5 :stock_id="stock_id" :cur_active="curActive"></vue-trade-5>
                </div>
                <div style="flex: 1;display: flex;flex-direction: column;">
                  <vue-trade-preview :cur_active="curActive" ref="trade-preview"></vue-trade-preview>
                </div>
              </div>
            </div>
          </div>
          <vue-trade-foot :whole_width="wholeWidth" ref="trade-foot"></vue-trade-foot>
        </section>
      </div>
    </div>
    <!-- <span id="page_tip" class="hide"></span> -->
  </div>
@endsection

@section('js-private')
  <script>
    //全局配置
    window.ENV = window.ENV || {};
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";

  </script>
  <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

  <script src="{{ asset('/js/plugin/vue/vue.js') }}"></script>
  <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
  <script src="{{asset('/js/jquery.validate.min.js')}}" type="text/javascript"></script>
  <script src="{{asset('/js/oms/custom.validate.js')}}" type="text/javascript"></script>
  <script src="{{asset('/js/plugin/multiple-select/multiple-select.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
  <script type="text/javascript" src="{{ asset('/js/plugin/selectize/js/standalone/selectize.js') }}"></script>
  <script src="{{ asset('/dist/js/common/client.electron.js') }}"></script>
  <script src="{{ asset('/dist/js/common/localStorage.js') }}"></script>
  <script src="{{ asset('/dist/js/common/common.saveData.js') }}"></script>

  <script type="text/json" org-info-data >{!! isset($org_info) ? json_encode($org_info) : '' !!}</script>
  <script type="text/javascript" src="{{ asset('/dist/js/oms/instruction/manage.js') }}"></script>
@endsection
