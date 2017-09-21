@extends('adminmanager_standard')

@section('asset-css')
  <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/laydate/skins/molv/laydate.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/plugin/searchable/searchableOptionList.css') }}" rel="stylesheet">
  <link href="{{ asset('/3rd/datepicker/css/zebra_datepicker.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/plugin/multiple-select/multiple-select.css') }}" rel="stylesheet">
  <style>
    .file-center-head__report .ms-choice{
      height: 32px;
    }
    .file-center-head__report .ms-choice > span{
      top: 4px;
    }
    .file-center-head__report .ms-choice > div{
      top: 4px;
    }
    .Zebra_DatePicker_Icon_Wrapper input{
      width: 150px;
      height: 32px;
      border-radius: 3px;
      border: 1px solid #BEBEBE;
      outline: none;
      padding-left: 10px;
    }
    .Zebra_DatePicker{
      width: 200px;
      top: 35px!important;
    }
    .custom-grey-btn{
      line-height: 32px;
      height: 32px;
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
  </style>

@endsection

@section('content')
  <section  class="main-container" style="padding:0;">
    <!-- 调用bms文件夹中的file_center.page.html中 -->
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
  <script src="{{ asset('/dist/js/file_center/page.js') }}"></script>

  <script>
    $(function () {
      $.ajax({
        url: window.REQUEST_PREFIX + '/html/file_center/page.html',
        type: 'GET',
        success: function (data) {
          $(".main-container").html(data);
          reportFileCenterFn();  //由于ajax的执行比较慢在上面js加载之后，所以要将report_group.js中的内容用一个函数包裹起来当得到html之后再调用一次
        },
        error: function () {

        }
      })
    })
  </script>
@endsection
