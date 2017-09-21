@extends('adminmanager_standard')

@section('asset-css')
    <link href="{{ asset('/js/jquery-confirm/jquery-confirm.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/oms.min.css') }}" rel="stylesheet">
    <link href="{{ asset('/css/oms_v2/user.min.css') }}" rel="stylesheet">

@endsection

@section('content')

<div class="main-container fc" style="color:#324250;">

      <table class="table" style="width:50%;margin-top: 20px;">
          <thead>
                <tr>
                    <th>ID</th>
                    <th>组合名称</th>
                    <th>底层户列表</th>
                    <th>操作</th>
                </tr>
          </thead>
          <tbody>
          @foreach($lists as $list)
              <tr style="height: 30px">
                  <th>{{$list['id']}}</th>
                  <th>{{$list['name']}}</th>
                  <th>
                      <select id="base{{$list['id']}}">
                            @foreach($base_lists as $base)
                                <option value="{{$base['id']}}">{{$base['name']}}</option>
                            @endforeach
                      </select>
                  </th>
                  <th><button onclick="handleBase({{$list['id']}})">保存</button></th>
              </tr>
          @endforeach
          </tbody>
      </table>
</div>
<script>
    function handleBase(product_id){
        $.ajax({
            type: 'post',
            url: window.REQUEST_PREFIX + '/product/handle_nobase',
            data:{
                product_id: product_id,
                base_id: $("#base" + product_id).val()
            },
            success: function(res){
                if (0 == res.code) {
                    location.href = window.REQUEST_PREFIX + '/product/no_base_products';
                }else{
                    alert(res.msg)
                }
            }
        });
    }
</script>

@endsection
