<!DOCTYPE html>
<html style="height: 100%;background-color: #fff;">
<head>
  <meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
  <title>底层账户</title>
  <link href="{{ asset('/bootstrap/css/bootstrap.min.css') }}" rel="stylesheet">
  <script type="text/javascript" src="{{ asset('/js/jquery.min.js') }}"></script>
  <script type="text/javascript" src="{{ asset('/bootstrap/js/bootstrap.min.js') }}"></script>
  <style media="screen">
    body{
      font-size: 12px;
    }
    .account_cont{
      width: 98%;
      margin: 20px auto;
    }
    .table>thead:first-child>tr:first-child>th{
      color: rgb(153, 153, 153);
      border: none;
    }
    .account_btn{
      border: 1px #ddd solid;
      border-radius: 4px;
      background-color: #f2f2f2;
      outline: none;
    }
  </style>
</head>
<body>
  <div class="account_cont">
    <!-- <button class="btn">批量刷新</button> -->
    <table class="table table-hover">
    	<thead>
    		<tr class="account_th_color">
    			<th>资金账号</th>
    			<th>对应券商名称</th>
          <th>TB服务器</th>
          <th>IP端口</th>
          <th>运行状态</th>
          <th> </th>
    		</tr>
    	</thead>
    	<tbody>

    	</tbody>
    </table>
  </div>

  <script type="text/javascript">
    $(function () {
      //加载页面中底层账户的账户信息
      $.ajax({
        type: 'GET',
        url:  '/omsv2/admin_monitor/check_product_base?format=json',
        success: function (res) {
          var account = res.data.lists;
          var account_tab = '';
          for (var i = 0; i < account.length; i++) {
            account_tab += '<tr>' +
                              '<td>'+account[i].account_id+'</td>' +
                              '<td>'+account[i].securities_name+'</td>' +
                              '<td>'+account[i].server_host+'</td>' +
                              '<td>'+account[i].server_port+'</td>' +
                              '<td></td>' +
                              '<td class="running_stuta" base_id="'+account[i].id+'"><input type="button" name="name" value="刷新" class="account_btn" base_id="'+account[i].id+'"><td>' +
                           '</tr>';
          }
          //将tr中的数据添加到表格中
          $(".table tbody").html(account_tab);
          //点击  刷新  按钮的时候
          $(".account_btn").each(function () {
            $(this).on('click', function (e) {
              //点击单个账户的刷新按钮得到相对应账户的运行状态
              account_api($(this).attr('base_id'), $(this).parent().prev());
            })
          })

        },
        error: function () {

        }
      })
      function account_api(base_id,change_msg) {
        $.ajax({
          type: 'GET',
          url: '/omsv2/admin_monitor/get_product_base_state_info?base_id=' + base_id,
          success: function (res) {
            for (var i = 0; i < res.data.lists.length; i++) {
              //账户id对应单个账户数据中的base_id
                if (base_id = res.data.lists[i].base_id){
                  if(res.data.lists[i].code == 0){
                    change_msg.html('正常')
                  } else {
                    change_msg.html(res.data.lists[i].msg);
                  }
                }
            }
          },
          error: function () {

          }
        })
      }
      //批量刷新，点击批量刷新按钮之后，单个账户的刷新按钮自动一个接着一个的刷新
      $(".btn").on('click', function () {
        for (var i = 0; i < $(".account_btn").length; i++) {
          $('.table tbody tr:eq('+i+')').find($(".account_btn")).trigger('click');
          if (i == $(".account_btn").length) {
            return;
          }
        }
      })
    })



  </script>
</body>
</html>
