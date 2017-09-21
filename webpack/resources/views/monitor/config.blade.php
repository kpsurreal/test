<!DOCTYPE html>
<html style="height: 100%;background-color: #fff;">
<head>
    <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
    <title>后台配置中心</title>
    <link href="{{ asset('/3rd/jsoneditor/jsoneditor.min.css') }}" rel="stylesheet">
    <script type="text/javascript" src="{{ asset('/3rd/jsoneditor/jsoneditor.min.js') }}"></script>

    <style type="text/css">
        #jsoneditor {
            width: 50%;
        }
    </style>
</head>
<body>
<div id="jsoneditor" ></div>

<script>
    var container = document.getElementById('jsoneditor');
    var options = {
        mode: 'view'
    };
    var json = {!! $config !!}
    var editor = new JSONEditor(container, options, json);
</script>
</body>
</html>
