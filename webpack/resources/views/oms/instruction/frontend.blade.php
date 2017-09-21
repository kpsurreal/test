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
  </style>
@endsection

@section('content')
  <section  class="main-container" style="padding:0;">
    <div class="instruction_notification" id="notification">
      <vue-notification-header></vue-notification-header>
      <vue-notification-content>no page</vue-notification-content>
    </div>
  </section>

  
@endsection