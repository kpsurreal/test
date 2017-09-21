<!DOCTYPE html>
<html>
    <head>
        <meta charset="utf-8">
        <title></title>
    </head>
    <body>
        <script>
            setInterval(function(){
                (window.common || window).nativeopen("cmd=orderStatusChanged");
            },5000);
        </script>
    </body>
</html>
