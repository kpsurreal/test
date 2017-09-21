{{-- 策略管理页面 --}}
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

  <style>
    .Zebra_DatePicker{width:200px;top:40px!important;line-height:1;}
    /*.Zebra_DatePicker table{width:100%!important;}
    button.Zebra_DatePicker_Icon_Inside_Right{top:13px!important;right:2px!important;}*/
    .Zebra_DatePicker_Icon_Wrapper{
      width: 100%;
    }
    .Zebra_DatePicker_Icon_Wrapper>input{
        cursor: pointer;
        height: 35px;
        width: 100%;
    }
    .Zebra_DatePicker_Icon_Wrapper>button{
        top: 9.5px;
    }
    .ms-choice{
      height: 35px;
      line-height: 35px;
      border-color: rgba(204, 204, 204, 0.7);
    }
    .ms-choice > div{
      top: 5px;
    }
    .ms-drop input[type="checkbox"]{
      vertical-align: baseline;
      margin-right: 5px;
    }
    .doBtnExport_bgd{
      background-color: #ccc;
    }
  </style>
@endsection

@section('content')
  <div class="main-container fc custom-main-container">
    <section class="section-container custom-main-container__section-container" id="report_list" v-cloak>
      <div class="queryData-title">
        <h2 class="queryData-title__h2">数据查询</h2>
        <div class="queryData-title__select">
          <vue-multiple_select :options="option" :init_obj="{}" :flag_check_all="true" v-on:multiple_select="multiple_select = $event"></vue-multiple_select>
        </div>
        <div v-show="active != 'assets' && org_info_theme != 3" class="queryData-title__select">
          <vue-multiple_select :options="options_stock_type" :init_obj="{placeholder: '请选择证券类别',allSelected:'全部证券类别'}" :flag_check_all="true" v-on:multiple_select="query_stock_type = $event"></vue-multiple_select>
          <!-- <vue-selectize :options="options_stock_type" v-model="query_stock_type" :place_holder="'请选择证券类别'"></vue-selectize> -->
        </div>
        <div v-show="active != 'assets' && org_info_theme != 3" class="queryData-title__select">
          <vue-multiple_select :options="options_market" :init_obj="{placeholder: '请选择交易市场',allSelected:'全部交易市场'}" :flag_check_all="true" v-on:multiple_select="query_market = $event"></vue-multiple_select>
          <!-- <vue-selectize :options="options_market" v-model="query_market" :place_holder="'请选择交易市场'"></vue-selectize> -->
        </div>
        <vue-stock-search style="width: 150px;" v-show="active != 'assets' && org_info_theme != 3" :custom_cls="'asset-out-popup-content-form-num'" :stock_input_id="stock_input_type_id" :placeholder="'请输入证券代码'" v-on:stock_id="stock_id = $event" v-on:stock_input="stock_input_type_id = $event"></vue-stock-search>

        <div v-show="active !== 'position'" class="queryData-title__datapicker" style="margin-right: 0;">
          <vue-zebra_date_picker :value="startDate" v-on:select="chgStartDate($event)" :min_date="minDate" :max_date="maxDate"></vue-zebra_date_picker>
        </div>

        <!-- <span v-show="active !== 'position' && (active !== 'assets' && org_info_theme != 3)" class="query-position-hide" style="margin: 0 4px;">-</span>
        <div v-show="active !== 'position' && (active !== 'assets' && org_info_theme != 3)" class="queryData-title__datapicker">
          <vue-zebra_date_picker :value="endDate" v-on:select="chgEndDate($event)" :min_date="minDate" :max_date="maxDate"></vue-zebra_date_picker>
        </div> -->

        <span v-show="active == 'entrust' || active == 'deal' || (active == 'assets' && org_info_theme == 3) || active == 'cashflow'" class="query-position-hide" style="margin: 0 4px;">-</span>
        <div v-show="active == 'entrust' || active == 'deal' || (active == 'assets' && org_info_theme == 3) || active == 'cashflow'" class="queryData-title__datapicker">
          <vue-zebra_date_picker :value="endDate" v-on:select="chgEndDate($event)" :min_date="minDate" :max_date="maxDate"></vue-zebra_date_picker>
        </div>

        <!-- <div v-show="false && org_info_theme != 3" style="margin-right: 15px;color: #4A4A4A;padding-left: 15px;">
          <input type="checkbox" name="" />
          汇总产品
        </div>
        <div v-show="active === 'position' && org_info_theme != 3" style="margin-right: 15px;color: #4A4A4A;padding-left: 15px;">
          <input v-model="division_stock" type="checkbox" name="" />
          汇总证券
        </div> -->
        <div v-show="active === 'position' && org_info_theme != 3" style="color: #4A4A4A;padding-left: 15px;">
          <input v-model="division_stock" type="checkbox" name="" />
          区分场外持仓
        </div>
        <div style="flex-grow: 1;"></div>
        <div v-show="active === 'position' && org_info_theme != 3" class="queryData-title__type1">
          <i></i>场外定增
        </div>
        <div v-show="active === 'position' && org_info_theme != 3" class="queryData-title__type2">
          <i></i>收益互换
        </div>
        <div v-show="active === 'position' && org_info_theme != 3" class="queryData-title__type3">
          <i></i>货币基金
        </div>

        <a class="custom-grey-btn custom-grey-btn__export" :class="{'doBtnExport_bgd': gridData.data == ''}"  v-on:click="doExport()">

        <!--<a v-if="org_info_theme == 3" class="custom-grey-btn custom-grey-btn__export" v-on:click="doExport()">-->

          <i class="oms-icon oms-icon-export"></i>导出
        </a>
        <a class="custom-grey-btn custom-grey-btn__refresh"  v-on:click="doRefresh();">
          <i class="oms-icon refresh"></i>刷新
        </a>
      </div>
      <div class="container-content custom-main-container__section-container--main">
        <div style="flex: 1; display: flex; flex-direction: column;">
          <div class="container-content-menuV2">
            <ul style="display: flex;">
              <li v-if="checkDisplay('assets')" v-on:click="goto($event, 'assets')" :class="[{active: active == 'assets'}]">
                <span>资产查询</span>
              </li>
              <li v-if="checkDisplay('instruction')" v-on:click="goto($event, 'instruction')" :class="[{active: active == 'instruction'}]">
                <span>指令查询</span>
              </li>
              <li v-if="checkDisplay('entrust')" v-on:click="goto($event, 'entrust')" :class="[{active: active == 'entrust'}]">
                <span>委托查询</span>
              </li>
              <li v-if="checkDisplay('deal')" v-on:click="goto($event, 'deal')" :class="[{active: active == 'deal'}]">
                <span>成交查询</span>
              </li>
              <li v-if="checkDisplay('position')" v-on:click="goto($event, 'position')" :class="[{active: active == 'position'}]">
                <span>持仓查询</span>
              </li>
              <li v-if="checkDisplay('cashflow') && 3 == org_info_theme" v-on:click="goto($event, 'cashflow')" :class="[{active: active == 'cashflow'}]">
                <span>清算查询</span>
              </li>
              <div style="flex-grow: 1"></div>
              <!-- 新增汇总维度 -->
              <div v-if="(active === 'position' || active === 'assets') && org_info_theme != 3" style="display: inline-flex;width: auto;line-height: 48px;font-size: 16px;">
                <!-- <label for="lined_type" style="width: 300px; display: flex; padding-right: 40px;margin-top: 7px;line-height: 35px;">
                  <span style="font-weight: normal;color: #333333;margin-right: 10px;width: 100px;">汇总维度</span>
                  <vue-multiple_select style="width: 100%; margin: 5px 0;" :options="[{label: '产品组',value: 'group'},{label: '单个账户',value: 'account'}]" :init_obj="{place_holder：'请选择证券类别'}" v-on:multiple_select="lined = $event"></vue-multiple_select> -->
                <label for="lined_type">
                  <span style="font-weight: normal;color: #333333;margin-right: 10px;">汇总维度</span>
                  <!-- <vue-multiple_select :options="[{label: e.name,value: e.id,type: 'group'}]" :init_obj="{}"></vue-multiple_select> -->
                  <select id="lined_type" v-model="lined" style="margin-right: 20px;width: 150px;height: 32px;">
                    <option :value="'group'">基金</option>
                    <!-- <option :value="'child_group'">子产品</option> -->
                    <option :value="'account'">交易单元</option>
                  </select>
                </label>
              </div>
            </ul>
          </div>
          <div class="container-content-grid" id="accountList" style="box-shadow: inset 0px -1px 0px #D7D5D5;height: 400px;overflow: auto;flex: 1;padding-top: 4px;">
            <!-- 资产查询 -->
            <vue-query-assets v-if="active == 'assets'" v-on:order="updateOrder($event)" :grid_data="gridData" :grid_data_code="gridDataCode" :org_info_theme="org_info_theme"></vue-query-assets>
            <!-- 委托查询 -->
            <vue-query-entrust v-if="active == 'entrust'" v-on:order="updateOrder($event)" :grid_data="gridData" :grid_data_code="gridDataCode" :org_info_theme="org_info_theme"></vue-query-entrust>
            <!-- 持仓查询 -->
            <vue-query-position v-if="active == 'position'" v-on:order="updateOrder($event)" :grid_data="gridData" :grid_data_code="gridDataCode" :org_info_theme="org_info_theme"></vue-query-position>
            <!-- 成交查询 -->
            <vue-query-deal v-if="active == 'deal'" v-on:order="updateOrder($event)" :grid_data="gridData" :grid_data_code="gridDataCode" :org_info_theme="org_info_theme"></vue-query-deal>
            <!-- 清算查询 -->
            <vue-query-cashflow v-if="active == 'cashflow' && 3 == org_info_theme" v-on:order="updateOrder($event)" :grid_data="gridData" :grid_data_code="gridDataCode" :org_info_theme="org_info_theme"></vue-query-cashflow>
            <!-- 指令查询 -->
            <vue-query-instruction v-if="active == 'instruction'" v-on:order="updateOrder($event)" :grid_data="gridData" :grid_data_code="gridDataCode" :org_info_theme="org_info_theme"></vue-query-instruction>
            <div class="gridPagination"></div>
            <!-- data_page_html -->
          </div>
          <div class="total-grid" v-if="active == 'position' && org_info_theme != 3">
            <span class="total-grid__left">汇总</span>
            <span class="total-grid__right">持仓数量：@{{ (gridData.collect && gridData.collect.total_stock_volume) || 0 }}</span>
            <span class="total-grid__right">持仓市值：@{{ (gridData.collect && gridData.collect.total_market_value) || 0 }}</span>
            <span class="total-grid__right">
            资产占比：@{{ ( gridData.collect && numeralPercent(gridData.collect.total_market_ratio)) || '0%' }}
              <prompt-language style="width: 15px;display: inline-block;left: 0;" :language_val="'资产占比=持仓市值/∑选中产品净资产*100%'"></prompt-language>
            </span>
          </div>
        </div>
      </div>
      <div class="custom-main-container__section-container--gather">
        <span>港股金额单位：HK$</span>
        <span>沪深金额单位：元</span>
        <span>股票单位：股</span>
        <span>期货单位：手</span>
      </div>
    </section>
    <span id="page_tip" class="hide"></span>
  </div>
@endsection

@section('js-private')
  <script>
    //全局配置
    window.ENV = window.ENV || {};
    window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
  </script>
  <script src="{{ asset('/3rd/datepicker/zebra_datepicker.js') }}"></script>
  <script src="{{ asset('/js/oms/oms.app.js') }}"></script>

  <script src="{{ asset('/js/plugin/vue/vue.js') }}"></script>
  <script src="{{ asset('/js/plugin/Sortable/Sortable.min.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/js/plugin/vue-draggable/vuedraggable.min.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
  <script src="{{asset('/js/jquery.validate.min.js')}}" type="text/javascript"></script>
  <script src="{{asset('/js/oms/custom.validate.js')}}" type="text/javascript"></script>
  <script src="{{asset('/js/plugin/doT.min.js')}}" type="text/javascript"></script>
  <script src="{{asset('/js/plugin/multiple-select/multiple-select.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
  <script type="text/javascript" src="{{ asset('/js/plugin/selectize/js/standalone/selectize.js') }}"></script>

  <script src="{{ asset('/dist/js/common/config.js') }}" type="text/javascript"></script>
  <script src="{{ asset('/dist/js/common/client.electron.js') }}"></script>
  <script src="{{ asset('/dist/js/common/localStorage.js') }}"></script>
  <script src="{{ asset('/dist/js/common/common.saveData.js') }}"></script>
  <script type="text/json" org-info-data >{!! isset($org_info) ? json_encode($org_info) : '' !!}</script>
  <script type="text/json" permission-info-data >{!! isset($permission) ? json_encode($permission) : '' !!}</script>
  <script type="text/javascript" src="{{ asset('/dist/js/oms/report/report_list.js') }}"></script>
@endsection

