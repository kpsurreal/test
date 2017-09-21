<!DOCTYPE html>
<html>

<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
</head>

<body style="font-family: 'pingFang SC'">
    <div style="background-color:#255B8E; height:1px;" >
    </div>
    <table style="width:100%;">
        <tr>
            <td style="width:55%;">
               <span id="label_company" style="color:#255B8E; font-size:10px;line-height: 13px;">{{$extra['company']}}</span>
              {{--  <span id="label_company" style="color:#255B8E; font-size:10px;line-height: 13px;"></span>--}}
            </td>
            <td style="width:25%">
                <span id="label_date" style="font-size:10px;line-height: 13px;">生成日期: 2015-07-11 12:30</span>
            </td>
            <td style="width:10%; text-align:right;">
                <span id="label_operator" style="font-size:10px;line-height: 13px;">操作人: {{$extra['username']}}</span>
            </td>
            <td style="width:10%; text-align:right;">
                <span id="label_page" style="font-size:10px;line-height: 13px;">第1页，共1页</span>
            </td>
        </tr>
    </table>
    <script type="text/javascript">
        Date.prototype.format = function (fmt) { //author: meizz
            var o = {
                "M+": this.getMonth() + 1, //月份
                "d+": this.getDate(), //日
                "H+": this.getHours(), //小时
                "m+": this.getMinutes(), //分
                "s+": this.getSeconds(), //秒
                "q+": Math.floor((this.getMonth() + 3) / 3), //季度
                "S": this.getMilliseconds() //毫秒
            };
            if (/(y+)/.test(fmt)) fmt = fmt.replace(RegExp.$1, (this.getFullYear() + "").substr(4 - RegExp.$1.length));
            for (var k in o)
                if (new RegExp("(" + k + ")").test(fmt)) fmt = fmt.replace(RegExp.$1, (RegExp.$1.length == 1) ? (o[k]) : (("00" + o[k]).substr(("" + o[k]).length)));
            return fmt;
        }

        var get_params_chunk = window.location.search.substring(1).split('&')
        var GETS = {}
        for (var idx in get_params_chunk) {
            var keyValue = get_params_chunk[idx].split('=', 2)
            GETS[keyValue[0]] = keyValue[1];
        }

        var date = new Date().format("yyyy-MM-dd HH:mm")
        var dateText = "生成日期: " + date.toString();
        var dateLabel = document.getElementById('label_date');
        dateLabel.innerText = dateText;

        // var operator = decodeURI(GETS['operator'])
        // var operatorText = "操作人: " + operator
        // var operatorLabel = document.getElementById('label_operator')
        // operatorLabel.innerText = operatorText

        var currentPage = GETS.page;
        var totalPage = GETS.topage;
        var pageText = "第" + currentPage + "页，共" + totalPage + "页";
        var pageLabel = document.getElementById('label_page');
        pageLabel.innerText = pageText;

/*        var companyName = GETS.company;
        var companyLabel = document.getElementById('label_company');
        companyLabel.innerText = companyName;*/
    </script>
</body>

</html>
