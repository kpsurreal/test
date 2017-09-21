@extends('adminmanager_standard')

@section('asset-css')
  <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/laydate/skins/molv/laydate.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/plugin/searchable/searchableOptionList.css') }}" rel="stylesheet">
  <link href="{{ asset('/3rd/datepicker/css/zebra_datepicker.css') }}" rel="stylesheet">
  <!-- <link href="{{ asset('/css/policy-create.min.css') }}" rel="stylesheet"> -->
  <link href="{{ asset('/js/plugin/multiple-select/multiple-select.css') }}" rel="stylesheet">

  <style media="screen">
    .sol-container{
      display: inline-block;
    }
    .sol-current-selection{
      display: none;
    }
    .msg{
      display: none;
    }
    .dot-tip.exclamation em:hover .msg{
      display: block;
    }
    .ms-drop ul{
      padding: 5px 0;
    }
    .ms-drop ul > li label{
      padding: 0 8px;
    }
    .Zebra_DatePicker{width:200px;top:40px!important;line-height:1;}
    /*.Zebra_DatePicker table{width:100%!important;}
    button.Zebra_DatePicker_Icon_Inside_Right{top:13px!important;right:2px!important;}*/
    .Zebra_DatePicker_Icon_Wrapper{
      width: 100%;
    }
    .Zebra_DatePicker_Icon_Wrapper>input{
        cursor: pointer;
        /*height: 35px;*/
        width: 100%;
    }
    .Zebra_DatePicker_Icon_Wrapper>button{
        top: 8px!important;
    }
    .ghost {
      opacity: .5;
      background: #C8EBFB;
    }
    .sortable-chosen .journel-sheet-content__detail{
      display: none;
    }
    .sortable-chosen .journel-sheet-grid{
      display: none;
    }
    .sortable-chosen .report_form_sub_funds{
      display: none;
    }
    .dot-tip.exclamation .str{
      top: inherit;
      bottom: 24px;
      text-align: left;
    }
    .hover-tip-width{
      display: block;
      width: 300px;
      white-space: normal;
      word-wrap: break-word;
    }
    .custom-dl .custom-modify{
      position: relative;
      z-index: 10;
      width: 140px;
    }
    .custom-modify__content--modify-value{
      width: 110px!important;
    }
    .custom-modify .custom-modify__content .custom-modify__content--display-value{
      max-width: 140px;
    }
    .journel-sheet-grid tr>td:last-child{
      padding-right: 0!important;
      text-align: left!important;
    }
    .ms-select-all__sign{
      width: 12px;
      height: 12px;
      display: inline-block;
      border-radius: 50%;
      margin-left: 5px;
      background-color: #ff0;
    }
    .journel-sheet-content__head .custom-dl .custom-dl__dd{
      float: left;
    }
    .selectize-dropdown{
      z-index: 11;
    }
    .selectize-input{
      height: 30px;
      line-height: 15px;
      border: none;
      background: none;
    }
    .selectize-dropdown [data-selectable], .selectize-dropdown .optgroup-header{
      height: 30px;
    }
    .dot-tip.exclamation .str{
      z-index: 12;
    }
    .doBtnExport_bgd{
      background-color: #ccc;
    }
    .custom-v2-modify .custom-v2-modify__window{
      left: 0;
      top: 22px;
    }
    /*给净资产和份额添加样式*/
    .custom-v2-modify .custom-v2-modify__window::before{
      content: "";
      display: block;
      width: 10px;
      height: 10px;
      bottom: 10px;
      position: absolute;
      left: 15px;
      top: -5px;
      border: 1px solid rgba(119,151,178,0.3);
      border-left: 0;
      border-bottom: 0;
      background-color: #fff;
      transform: rotate(-45deg);
    }
    .journel-sheet-sub-fund__header--main .modify-remark .modify-remark__describle{
      right: 70px;
    }
    .journel-sheet-content .journel-sheet-content__head{
      padding: 14px 14px 14px 30px;
    }
    .journel-sheet-content__head .modify-remark .modify-remark__content__value{
      max-width: 130px;
    }
    .width_30{
      width: 30%;
      text-align: left;
    }
    .width_30_left{
      width: 30%;
      text-align: left;
      padding-left: 100px;
    }
    .width_30_right{
      width: 30%;
      text-align: right;
      padding-right: 300px;
    }
    .width_10{
      width: 10%;
      text-align: left;
    }
  </style>
@endsection

@section('content')
  <section  class="main-container" style="padding:0;">
    <!-- 调用bms文件夹中的report_group.html中 -->
  </section>

  <script>
  //全局配置
  window.ENV = window.ENV || {};
  window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
  </script>

  <script src="{{asset('/js/jquery.validate.min.js')}}" type="text/javascript"></script>
  <script src="{{asset('/js/oms/custom.validate.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
  <script type="text/javascript" src="{{ asset('/js/plugin/selectize/js/standalone/selectize.js') }}"></script>
  <script src="{{ asset('/js/laydate/laydate.js') }}"></script>
  <script src="{{ asset('/js/plugin/searchable/sol-2.0.0.js')}}"></script>
  <script src="{{ asset('/3rd/datepicker/zebra_datepicker.js') }}"></script>
  <script src="{{ asset('/js/plugin/multiple-select/multiple-select.js') }}"></script>
  <script src="{{ asset('/js/plugin/vue/vue.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/js/plugin/Sortable/Sortable.min.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/js/plugin/vue-draggable/vuedraggable.min.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
  <script src="{{ asset('/dist/js/common/client.electron.js') }}"></script>
  <script src="{{ asset('/dist/js/common/localStorage.js') }}"></script>
  <script src="{{ asset('/dist/js/common/common.saveData.js') }}"></script>
  <script src="{{ asset('/dist/js/report_group/report_group.js') }}"></script>
  {{-- <script src="/bms-pub/dist/js/report_group/report_group.js"></script> --}}

  <script>
    $(function () {
      $.ajax({
        url: window.REQUEST_PREFIX + '/html/report_group/report_group.html',
        type: 'GET',
        success: function (data) {
          $(".main-container").html(data);
          reportGroupFn();  //由于ajax的执行比较慢在上面js加载之后，所以要将report_group.js中的内容用一个函数包裹起来当得到html之后再调用一次
        },
        error: function () {

        }
      })
    })
  </script>
@endsection
