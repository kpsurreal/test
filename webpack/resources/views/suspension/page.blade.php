{{-- 停牌估值调整页面 --}}
@extends('adminmanager_standard')

@section('asset-css')
  <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
  <script src="{{ asset('/js/plugin/vue/vue.js') }}"></script>
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
  </style>
@endsection

@section('content')
  <div class="main-container fc">
    <!-- 调用bms文件夹中的suspension文件下的page.html中 -->
  </div>
@endsection

@section('js-private')
    <script>
      //全局配置
      window.ENV = window.ENV || {};
      window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>
    <script src="{{ asset('/js/plugin/Sortable/Sortable.min.js')}}" type="text/javascript"></script>
    <script src="{{ asset('/js/plugin/vue-draggable/vuedraggable.min.js')}}" type="text/javascript"></script>
    <script src="{{ asset('/dist/js/common/client.electron.js') }}"></script>
    <script src="{{ asset('/dist/js/common/localStorage.js') }}"></script>
    <script src="{{ asset('/dist/js/common/common.saveData.js') }}"></script>
    <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
    <script src="{{ asset('/js/jquery-confirm/jquery-confirm.min.js') }}"></script>
    <script type="text/javascript">
      window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
    </script>
    <script src="{{ asset('/dist/js/suspension/page.js') }}"></script>
    <script>
      $.ajax({
        url: window.REQUEST_PREFIX + '/html/suspension/page.html',
        type: 'GET',
        success: function (data) {
          $(".main-container").html(data);
          suspensionFn(); //由于ajax的执行比较慢在上面js加载之后，所以要将suspension文件下的page.js中的内容用一个函数包裹起来当得到html之后再调用js
        }
      })
    </script>
@endsection
