<!-- 指令管理页面3.9.0 -->
@extends('adminmanager_standard')

@section('asset-css')
  <link href="{{ asset('/dist/css/static/oms.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/selectize.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
  <link href="{{ asset('/js/laydate/skins/molv/laydate.css') }}" rel="stylesheet">
  <link href="{{ asset('/css/notification.min.css') }}" rel="stylesheet">

  <style>
  .review_top{
    padding: 22px 20px 22px 30px;
    display: inline-block;
    width: 100%;
  }
  .review_top h2{
    display: inline-table;
    margin-right: 40px;
    font-size: 26px;
  }
  .review_top>label{
    display: inline-block;
    margin-right: 30px;

  }
  .review_top>label>input{
    margin-right: 14px;
  }

  /*.review_top>.refresh{
    float: right;
  }*/

  .review_top button{
    display: inline-block;
    border:none;
    border-radius: 6px;
    outline: none;
  }
  .review_top>.btn-box{
    float: right;
  }
  .btn-box>label{
    line-height: 32px;
    margin-right: 10px;
  }
  .btn-box>label>input{
    margin-right: 5px;
  }
  .review_top button.pass{
    width: 80px;
    height: 32px;
    margin-right: 10px;
    background-color: #FFDE00;
    vertical-align: super;
  }  
  .review_top button.refuse{
    width: 80px;
    height: 32px;
    margin-right: 45px;
    background-color: #FFDE00;
    vertical-align: super;
  }
  .review_top a.refresh{
    width: 65px;
    height: 32px;
    background-color: #e8e9ed;
    text-align: center;
    line-height: 32px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  .review_top:afetr{
    display: block;
    content: "";
    width: 0;
    height: 0;
    clear: both;
  }

  .review_section table{
    width: 100%;
  }
  .review_section th,td{
    padding-right: 14px;
  }
  .review_section th{
    border-top: 1px solid #D7D5D5;
    border-bottom: 1px solid #D7D5D5;
    font-size: 12px;
    color: rgba(51,51,51,0.3);
  }
  .review_section td{
    border-bottom: 1px solid #D7D5D5;
    font-size: 12px;
    color: #333333;
  }
  .layout{
    display: flex;
  }
  .review_section>.newweb-common-grid>tbody>tr>th{
    color: rgba(51,51,51,.4);
  }
  .review_section>.newweb-common-grid input[type=checkbox]{
    vertical-align: middle;
  }
  .review_section>.newweb-common-grid span{
    vertical-align: middle;
  }
  .overhide{
    max-width:140px;
  }
  .overhide span{
    display: block;
    text-align: left;
  }
  </style>
@endsection

@section('content')
  <section  class="main-container layout" style="padding:0;">

    <div review_top></div>

  </section>

  <script>
  //全局配置
  window.ENV = window.ENV || {};
  window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
  </script>
  <script src="{{asset('/js/jquery.validate.min.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/js/plugin/vue/vue.js')}}" type="text/javascript"></script>
  <script src="{{ asset('/dist/js/oms/instruction/review.js') }}"></script>

  <script>

  </script>
@endsection
