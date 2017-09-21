<!-- 指令通知页面3.9.0 -->
@extends('adminmanager_standard')

@section('asset-css')
  <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/laydate/skins/molv/laydate.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/notification.min.css') }}" rel="stylesheet">

  <style>
    .custom-grey-btn{
      max-height: 32px;
      line-height: 32px;
    }
    /*已收到*/
    .status_receive{
      color: #2196F3;
    }
    /*执行中*/
    .status_execution{
      color: #FAA11F;
    }
    /*已提交*/
    .status_submit{
      color: #D0011B;
    }
    /*已完成*/
    .status_complete{
      color: #000;
    }
    input[name='change']{
      margin-right: 5px;
    }
    .container{
      width: 900px;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons{
      text-align: center;
      float: none;
      margin-top: 10px;
      padding-bottom: 40px;
    }
    .vue-confirm__btns--cancel, .btn-default{
      width: 118px;
      height: 32px;
      border-radius: 4px;
      line-height: 32px;
    }
    .btn-default{
      background-color: #FFDF1B;
    }
    .jconfirm.jconfirm-white .jconfirm-box .buttons button.btn-default:hover{
      background-color: #FFDF1B;
    }
    .jconfirm{
      background-color: rgba(51, 51, 51, .6);
    }
    .new-oms-container .main-container{
      background: #E8E9ED;
    }
    .journel-sheet-grid thead{
      color: rgba(51, 51, 51, 0.3);
      font-weight: bold;
    }
    .product-confirm{
      width: 800px;
      margin: 23px auto 0; 
    }
  </style>
@endsection

@section('content')
  <section  class="main-container" style="padding:0;">
    <div class="instruction_notification" id="notification">
      <vue-notification-header></vue-notification-header>
      <vue-notification-content :instruction_data="instruction_data"></vue-notification-content>
    </div>
  </section>

  <script>
  //全局配置
  window.ENV = window.ENV || {};
  window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
  </script>

  <script src="{{asset('/js/jquery.validate.min.js')}}" type="text/javascript"></script>
  <script src="{{asset('/js/oms/custom.validate.js')}}" type="text/javascript"></script>
  <script type="text/javascript" src="{{ asset('/js/plugin/selectize/js/standalone/selectize.js') }}"></script>
  <script src="{{ asset('/js/laydate/laydate.js') }}"></script>
  <script src="{{ asset('/js/plugin/searchable/sol-2.0.0.js')}}"></script>
  <script src="{{ asset('/3rd/datepicker/zebra_datepicker.js') }}"></script>
  <script src="{{ asset('/js/plugin/multiple-select/multiple-select.js') }}"></script>
  <script src="{{ asset('/js/plugin/vue/vue.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
  <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
  <script src="{{ asset('/dist/js/common/client.electron.js') }}"></script>
  <script src="{{ asset('/dist/js/common/localStorage.js') }}"></script>
  <script src="{{ asset('/dist/js/common/common.saveData.js') }}"></script>
  <script src="{{ asset('/dist/js/oms/instruction/notification.js') }}"></script>
  <script>

  </script>
@endsection
