@extends('adminmanager_standard')

@section('content')
<div class="jumbotron">
  <h1>Hello, GMF!</h1>
  <p>欢迎来到管理首页</p>
  <p>
    <a class="btn btn-primary btn-lg" href="{{ config('view.path_prefix','') }}/trader/check_apply" role="button">
        <span class="glyphicon glyphicon-user" aria-hidden="true"></span> 审核操盘手
    </a>

    <a class="btn btn-danger btn-lg" href="{{ config('view.path_prefix','') }}/product/check_apply" role="button">
        <span class="glyphicon glyphicon-list" aria-hidden="true"></span> 审核策略
    </a>
</p>
</div>

@endsection
