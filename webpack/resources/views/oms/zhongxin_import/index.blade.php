@extends('adminmanager_standard')

@section('content')

@if($type == 'trade_record')
<h1>中信交易记录</h1>
@endif
@if($type == 'delivery_order')
<h1>中信交割单</h1>
@endif

@if(isset($format_text))
    <p style="color: red">格式错误，正确的格式如下，请检查后重新导入：</p>
    <p>{{ $format_text }}</p>
@endif

<form method="post" action="" enctype="multipart/form-data">
    <input type="hidden" name="type" value="{{$type}}">
    <p>Excel 文件:<input type="file" name="excel_file" /></p>
    <input type="submit">
</form>

@endsection
