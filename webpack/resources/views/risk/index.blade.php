@extends('adminmanager_standard')

@section('asset-css')
  <!-- 风控监控 -->
  @if($host_theme == 'standard')
      <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
  {{-- @elseif($condition) --}}
  @else
      <link href="{{ asset('/css/theme1/oms.min.css') }}" rel="stylesheet">
  @endif
  <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/plugin/multiple-select/multiple-select.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/bms_product.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">
  <link href="{{ asset('/dist/css/static/risk.css') }}" rel="stylesheet">
  <!-- 风控管理页面新样式 -->
  <!-- <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">

  <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">

  <link href="{{ asset('/js/laydate/skins/molv/laydate.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/plugin/searchable/searchableOptionList.css') }}" rel="stylesheet">
  <link href="{{ asset('/3rd/datepicker/css/zebra_datepicker.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/plugin/multiple-select/multiple-select.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/rms/risk.min.css') }}" rel="stylesheet">

  <style>
    .ms-choice{
      height: 32px;
    }
    .ms-choice > span{
      top: 4px;
    }
    .ms-choice > div{
      top: 4px;
    }
    .new-oms-container .main-container{
      padding: 0;
    }
    .custom-grey-btn{
      line-height: 30px;
    }
    .custom-grey-btn{
      line-height: 30px;
      margin-right: 0;
    }
  </style> -->
  <style type="text/css">
    body{
      font-size: 14px;
    }
    .selectize-input > div.item{
      max-width: 120px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
      line-height: 20px;
      vertical-align: top;
    }
    .dot-tip.exclamation .str{
      top: inherit;
      bottom: 24px;
      text-align: left;
    }
    .hover-tip-width{
      display: block;
      width: 246px;
      white-space: normal;
      word-wrap: break-word;
    }
    .client-suggest{
      top: 37px!important;
      bottom: auto!important;
    }
    .selectize-control.single .selectize-input{
      width: 170px;
      height: 35px;
      border-radius: 4px;
    }
    .risk_ellispis__single{
      width: 300px;
      text-overflow: ellipsis;
      overflow: hidden;
    }
    .content__product__name{
      display: inline-block;
      width: 110px;
      white-space: nowrap;
      overflow: hidden;
      text-overflow: ellipsis;
      margin-top: 7px;
    }
  </style>

@endsection

@section('content')
<script>
  window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
</script>
<script src="{{ asset('/js/oms/oms.app.js') }}"></script>
<script src="{{ asset('/js/plugin/vue/vue.js') }}"></script>

  <div class="main-container" style="padding: 0;">
    <div id="risk" v-cloak>
      {{-- Begin:导航栏 --}}
      <ul class="risk-nav clearfix">
        <risk-nav-li class="risk-nav_title fl"
          v-for="(list,index) in navlist"
          :key="index"
          v-if="checkPermission(index)"
          :current="current"
          :index="index"
          v-text="list"
          v-on:change="changeNav">
        </risk-nav-li>
      </ul>
      {{-- End:导航栏 --}}

      {{--  Begin:风险监控 --}}
      <div class="risk-monitoring" v-if="checkPermission(0)" v-show="0 == current">
        <div class="queryData-title__select_box clearfix">
          <div class="queryData-title__select fl">

          @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
            <vue-multiple_select
              :options="products"
              :init_obj="{placeholder: '请选择产品',allSelected:'全部产品',noMatchesFound: '未选择任何产品'}"
              :flag_check_all="true"
              :options_isnull_info="options_isnull_info"
              v-on:multiple_select="productSelected = $event">
            </vue-multiple_select>
          @else
            <vue-multiple_select
              :options="products"
              :init_obj="{placeholder: '请选择交易单元',allSelected:'全部交易单元',noMatchesFound: '未选择任何交易单元'}"
              :flag_check_all="true"
              v-on:multiple_select="productSelected = $event">
            </vue-multiple_select>
          @endif

            
          </div>
          <div class="queryData-title__select fl">
          @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
            <vue-multiple_select
              :options="warntypes"
              :init_obj="{placeholder: '请选择触警类别',allSelected:'全部触警类别',noMatchesFound: '未选择触警类别',}"
              :flag_check_all="true"
              v-on:multiple_select="warnSelected = $event">
            </vue-multiple_select>
          @else
            <vue-multiple_select
              :options="warntypes"
              :init_obj="{placeholder: '请选择触警类别',allSelected:'全部触警类别',noMatchesFound: '未选择触警类别',}"
              :flag_check_all="false"
              v-on:multiple_select="warnSelected = $event">
            </vue-multiple_select>
          @endif
            
          </div>
          <div class="queryData-title__corner fr" style="margin-right: 20px;">
            <a v-if="false" class="custom-btn" @click="setdozengo" style="width: 80px; margin-right: 44px;">批量设置</a>
            <a v-if="false" class="custom-grey-btn custom-grey-btn__export" style="display: inline-block;line-height: 32px;">
              <i class="oms-icon oms-icon-export"></i>导出
            </a>
            <a class="custom-grey-btn custom-grey-btn__refresh" v-bind:class="[{'loading': isRotate}]" @click="refresh" style="display: inline-block;line-height: 32px;margin-right: 0px;">
              <i></i>刷新
            </a>
          </div>
        </div>

        <div class="riks-monitoring_infos">
          <div class="risk-monitoring_thead" style="padding-left:0;">
            <div class="risk-monitor_td_first" style="width:12%;text-align:left;padding-left:32px;">
              <input v-if="false" type="checkbox" style="margin-right:5px"
                @click="checkall"
                :checked="checkallstatus">

                @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                    产品
                @else
                    交易单元
                @endif

            </div>
            <div class="risk-monitor_td al" style="width:7%;text-align:left;padding-left:30px;">基金经理</div>
            <div class="risk-monitor_td al" style="width:7%;text-align:right;">
              @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                净值
              @else
                基金预估净值
              @endif
            </div>
            <div class="risk-monitor_td ac" style="width:11%;text-align:right;padding-right:50px;">
              @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                仓位
              @else
                基金预估仓位
              @endif
            </div>
            <div class="risk-monitor_td ac" style="width:10%;text-align:right;padding-right:50px;">
              @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
                净资产
              @else
                基金预估净资产
              @endif
            </div>
            <div class="risk-monitor_td al" style="width:7%;text-align:right;">生效风控（条）</div>
            <div class="risk-monitor_td ac" style="width:15%;text-align:left;padding-left:50px;">触发风控类别</div>
            <div class="risk-monitor_td ac" style="width:25%;text-align:left;padding-left:20px;">触警描述</div>
          </div>

          <risk-monitoring-row
              v-for="(row, index) in product_change_list"
              :key="index"
              :row="row"
              :checkboxall="checkallstatus"
              :is-show-set="isShowSet"
              v-on:change="changeNav"
              v-on:setdozen="setdozenfn"
              v-on:setsingle="setsinglefn">
          </risk-monitoring-row>
          <div v-show="0 == product_change_list.length && 0 == productSelected.length" style="border-bottom: 1px solid rgb(215, 213, 213);height: 36px;line-height: 36px;font-size: 12px;padding-left: 30px;">
            @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
              请选择产品
            @else
              请选择交易单元
            @endif
          </div>
        </div>
      </div>
      {{--  End:风险监控 --}}

      {{--  Begin:独立风控设置 --}}
      <div class="risk-independent" v-if="checkPermission(1)" v-show="1 == current">
        <div style="padding-top: 30px;box-shadow: 1px 2px 2px 0 RGBA(119,151,178,.2);padding-bottom: 20px;">
        
          <h3 style="margin-left: 30px;margin-bottom: 20px;" class="vue-common-title">
            @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
              请选择产品
            @else
              请选择交易单元
            @endif
          </h3>
          <div style="margin-left: 30px;">
            @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
              <vue-selectize :options="products" :is_readonly="true" :place_holder="'请选择产品'" :value="independentSelected[0]" v-on:input="selectProduct($event)"></vue-selectize>
            @else
              <vue-selectize :options="products" :is_readonly="true" :place_holder="'选择交易单元'" :value="independentSelected[0]" v-on:input="selectProduct($event)"></vue-selectize>
            @endif
          </div>
        </div>

        <div v-if="false" v-bind:class="[{'slidedown':isSlideDown},'risk-independent_added_preview' , 'bx' ,'clearfix']">
          @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
            <h4 class="risk-independent_added_title">已选产品<span v-text="'（已选'+independentSelectedDataNum+'）'"></span></h4>
          @else
            <h4 class="risk-independent_added_title">已选交易单元<span v-text="'（已选'+independentSelectedDataNum+'）'"></span></h4>
          @endif
          <div class="risk-independent_added_detail_more"
            @click="productPreviewSilde"
            v-show="!isSlideDown">
            继续选择
          </div>
          <div class="risk-independent_added_detail_edit"
            v-show="isSlideDown">
            <span class="edit_ensure" @click="productPreviewEnsure">确定</span>
            <span class="edit_cancel" @click="productPreviewCancel">取消</span>
          </div>
          <div class="risk-independent_added_detail_edit_content">
            <div
              v-for="item in totals"
              :class="[{'product-selected':item.checked},'ellipsis','content_detail']"
              :title="item.product_name"
              v-show="isSlideDown || item.checked">
                <input type="checkbox"
                  :checked="item.checked"
                  v-show="isSlideDown"
                  @click="changeindependentSelectedData(item.product_id)" />
                <span v-text="item.product_name" :class="{'select-model':!isSlideDown}"></span>
            </div>
          </div>
        </div>

        <div v-if="independentSelected.length > 0" class="risk-independent_added bx">
          <div class="risk-independent_added_products">
            <h3 class="vue-common-title" style="margin-bottom: 20px;">已添加风控<span v-text="'（' + (getInSelectedRisk().length || 0) +'）'"></span></h3>
            <div class="risk-independent_controll fr">

              <a class="risk-independent_setdel" title="点击此按钮后，后续新建产品自动添加下方已添加风控列表中的风控规则" @click="doSaveTpl()" style="background-color: #FFDF1B;color:black" v-if="theme == 3">保存风控模版</a>
              <a class="risk-independent_setdel" @click="multiDeleteRule()">批量删除</a>
            </div>
            <div style="clear:both"></div>

            <div style="border: 1px solid #ccc;">
              <vue-risk-detail :in_selected_risk="getInSelectedRisk()" :independent_selected="independentSelected" @chg_select_rules="selected_rules = $event" :current="current"></vue-risk-detail>
            </div>
          </div>
        </div>

        <div v-if="independentSelected.length > 0">
          <h3 class="vue-common-title" style="margin-left: 30px;">新增风控</h3>
          <vue-single-addrisk ref="single-addrisk" :independent_selected="independentSelected" :in_selected_risk="inSelectedRisk" :display_rules_arr="[1, 2, 3, 4, 5]" :products="products"></vue-single-addrisk>
        </div>
      </div>
      {{--  End:独立风控设置 --}}

      {{--  Begin:联合风控设置 --}}
      <div class="risk-combined" v-if="checkPermission(2)" v-show="2 == current">
        <div id="risk-combined_added" class="bx" style="border-bottom: 10px solid #f1f3fa;padding-bottom: 20px;">
          <div class="risk-combined_top clearfix">
            <h3 class="vue-common-title">已添加联合风控</h3>
            <a class="risk-combined_del fr" @click="multiDeleteRule()">批量删除</a>
          </div>

          <div style="border: 1px solid #ccc;">
            <vue-risk-detail :in_selected_risk="displayUnionRisk" :independent_selected="independentSelected" @union_select_rules="union_selected_rules = $event" :current="current"></vue-risk-detail>
          </div>
        </div>

        <div class="risk-combined_added_news" style="padding-top: 20px;">
            <h3 class="vue-common-title" style="margin-left: 30px;">新增联合风控</h3>
            <vue-combined-addrisk ref="combined-addrisk" :independent_selected="[-1]" :in_selected_risk="displayUnionRisk" :display_rules_arr="[6, 7, 8]" :products="products"></vue-combined-addrisk>
            {{-- <vue-combined-addrisk ref="combined-addrisk" :independent_selected="[{}]"></vue-combined-addrisk> --}}
          </div>
      </div>
      {{--  End:联合风控设置 --}}
    </div>
  </div>

  <!-- 3.9.0将此页面改为风控管理页面（包含风险监控／独立风控设置／联合风控设置） -->
  <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
  <script type="text/javascript">
    var FD = {}
    FD.org_info = window.LOGIN_INFO.org_info;
  </script>
  <script src="{{ asset('/dist/js/common/client.electron.js') }}"></script>
  <script src="{{ asset('/dist/js/common/localStorage.js') }}"></script>
  <script src="{{ asset('/dist/js/common/common.saveData.js') }}"></script>

  <script src="{{ asset('/js/plugin/Sortable/Sortable.min.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/js/plugin/vue-draggable/vuedraggable.min.js')}}" type="text/javascript"></script>
  <script type="text/javascript" src="{{ asset('/js/plugin/selectize/js/standalone/selectize.js') }}"></script>
  <script src="{{ asset('/js/plugin/multiple-select/multiple-select.js') }}"></script>
  <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>

  @if(isset($logined_info) && isset($logined_info['org_info']) && isset($logined_info['org_info']['theme']) && 3 == $logined_info['org_info']['theme'])
    <script src="{{ asset('/dist/js/oms/risk/risk_special_edition.js') }}"></script>
  @else
    <script src="{{ asset('/dist/js/oms/risk/risk_institutional_edition.js') }}"></script>
  @endif

  
@endsection
