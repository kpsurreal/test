@extends('adminmanager_standard')

@section('content')

<script type="text/javascript" src="/js/jquery.min.js"></script>

<?php
use App\Models\AppFund\WindImport;
use App\Services\StockOrder;
?>
<table border="1" width="100%" cellpadding="1" cellspacing="1">
    <tr>
        <th>运行中的策略</th>
        <th>混合策略</th>
        <th>状态</th>
        <th>日期</th>
        <th>证券代码</th>
        <th>证券名称</th>
        <th>买卖标志</th>
        <th>成交数量</th>
        <th>成交时间</th>
        <th>成交价格</th>
        <th>成交金额</th>
        <th>印花税</th>
        <th>手续费</th>
        <th>代收规费</th>
        <th>过户费</th>
        <th>结算费</th>
        <th>交易费</th>
        <th>结算汇率</th>
        <th>委托编号</th>
        <th>股东代码</th>
        <th>交易所名称</th>
        <th>备注</th>
    </tr>
    @foreach($list as $i)
    <tr {!! $i['status'] == 1 ? 'style="background-color: red; color: #fff;"' : '' !!}>
        <td>
            <select class="sign_val" data-sign-id="{{$i['sign']}}" onchange="javascript: change_sign(this);" {!! $i['status'] == 1 ? 'disabled="disabled"' : '' !!}>
                <option value="">请选择策略</option>
                @foreach($products as $p)
                    <option value="{{$p['id']}}" @if($i['product_id'] == $p['id']) selected="selected" @endif>{{$p['name']}}</option>
                @endforeach
            </select>
        </td>
        <td>
            <select class="product_groups" data-sign-id="{{$i['sign']}}" {!! $i['status'] == 1 ? 'disabled="disabled"' : '' !!}>
                <option value="">请选择策略</option>
                @foreach($product_groups as $k => $p)
                    <option value="{{$k}}" @if($i['product_id'] == $k) selected="selected" @endif>{{$p['name']}}</option>
                @endforeach
            </select>
        </td>
        <?php
            $status_text = \App\Models\AppFund\StockImport::parse_status_msg($i['status']);
            $status_real_text = $i['status_real_text'];
        ?>
        <td width="200px;">
            {{$status_text}} -> {{$status_real_text}}<br />
            @if ($i['status'] == 1)
            <a href="{{ config('view.path_prefix','') }}/wind/check/{{$i['rid']}}/cancel?sign={{$i['sign']}}">C</a>
            @endif
        </td>
        <td width="80px;">{{date('Y-m-d', $i['datetime'])}}</td>
        <td>{{$i['zhengquandaima']}}</td>
        <td>{{$i['zhengquanmingcheng']}}</td>
        <td>{{$i['maimaibiaozhi']}}</td>
        <td>{{$i['chengjiaoshuliang']}}</td>
        <td>{{$i['chengjiaoshijian']}}</td>
        <td>{{$i['chengjiaojiage']}}</td>
        <td>{{$i['chengjiaojine']}}</td>
        <td>{{$i['yinhuashui']}}</td>
        <td>{{$i['shouxufei']}}</td>
        <td>{{$i['daishoufei']}}</td>
        <td>{{$i['guohufei']}}</td>
        <td>{{$i['jiesuanfei']}}</td>
        <td>{{$i['jiaoyifei']}}</td>
        <td>{{$i['jiesuanhuilu']}}</td>
        <td>{{$i['weituobianhao']}}</td>
        <td>{{$i['gudongdaima']}}</td>
        <td>{{$i['jiaoyisuo']}}</td>
        <td>{{$i['beizhu']}}</td>
    </tr>
    @endforeach
</table>
<br /><br /><br /><br />
<form action="/wind/check/{{$rid}}/allow" method="post" onsubmit="return do_submit(this);">
    <input type="submit" value="确认导入交易记录">
</form>
<form action="/wind/check/{{$rid}}/cancel" method="get">
    <input type="submit" value="取消本次导入的订单">
</form>

<hr>

@foreach($product_groups as $k => $p)
<div class="">
    <h5>{{$p['name']}}</h5>
    <ul>
        @foreach($p['ratio'] as $id => $ra)
        <li>{{$id}} : {{$ra * 100}}% </li>
        @endforeach
    </ul>
</div>
@endforeach



<script type="text/javascript">
function change_sign(dom) {
    var val = $(dom).val();
    var less = false;
    $('select.sign_val').each(function(k, v){
        if($(v).attr('disabled') == 'disabled') return ;
        if($(v).data('sign-id') == $(dom).data('sign-id'))
            less = true;

        if(less) $(v).val(val);
    });
}
function do_submit(dom) {
    $('select.sign_val').each(function(k, v){
        if($(v).attr('disabled') == 'disabled') return ;
        $(dom).append($('<input type="hidden" name="signs[' + $(v).data('sign-id') + ']">').val($(v).val()));
    });
    $('select.product_groups').each(function(k, v){
        if($(v).attr('disabled') == 'disabled') return ;
        $(dom).append($('<input type="hidden" name="product_groups[' + $(v).data('sign-id') + ']">').val($(v).val()));
    });
    return true;
}
</script>

@endsection
