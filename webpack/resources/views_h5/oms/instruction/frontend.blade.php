<!DOCTYPE html>
<html>
	<head>
		<meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, minimum-scale=1, maximum-scale=1, user-scalable=no">
		<title></title>
    <link rel="stylesheet" href="{{ asset('/h5/css/oms.min.css') }}" >
    <script src="{{ asset('/js/plugin/vue/vue.js') }}"></script>
    <script src="{{ asset('/dist/js/common/vue.component.js') }}"></script>
    <link rel="stylesheet" href="{{ asset('/dist/css/static/oms_h5.css') }}"></link>
	</head>

	<body>
    <section class="main-container">
      <div class="frontend-header">
        <h2 class="frontend-header__title js-page-title">指令列表</h2>
				<a class="frontend-header__out">
					<i></i>
				</a>
      </div>
      <!-- 指令列表 -->
      <div class="instruction-list">
        <!-- <div class="account-info" stype="position:relative;">
				  <img class='account-info__icon' src='{{ asset('/h5/images/welcome/sell-flat_icon.png') }}'/>
					<dl class="account-info__name">
						<dt class="account-info__name__dt" style="overflow: hidden;word-wrap: break-word;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient:vertical;font-size:13px;white-space:normal;">山东海事局多年不见</dt>
						<dd class="account-info__name__dd"></dd>
					</dl>
					<dl class="account-info__amount">
						<dt class="account-info__amount__dt">100</dt>
						<dd class="account-info__amount__dd">1,000</dd>
					</dl>
					<dl class="account-info__status">
						<dt class="account-info__status__change '+status_color+'"></dt>
						<dd class="account-info__status__icon '+product_status+'" data_id="67"></dd>
					</dl>
					<div class="revoke hide" data-id="'+e.id+'">撤销指令</div>
			  </div>
			  <ul class="product-list hide">
					<li><span>产品名字</span></li>
					<li><span>产品数量</span></li>
					<li><span></span></li>
			  </ul>-->
      </div>
      <!-- 指令下达 -->
      <div class="instruction-release hide">
        <div class="frontend-list">
          <a class="frontend-list_name shares-switch active" href="javascript:;">沪深A股</a>
          <a class="frontend-list_name futures-switch" href="javascript:;">期货</a>
          <!--  <a class="frontend-list_name active" href="#instructions=list">指令列表</a>
          <a class="frontend-list_name" href="#instructions=release">指令下达</a>  -->
        </div>
        
        <div>
          <form>
            {{--  股票输入  --}}
            <div class="investment-target js-shares-panel" id="id-investment_target">
              <label class="investment-target__label"><b>*</b>证券</label>
              <vue-stock-search assets_class="e" ref="stock-search" 
                :custom_cls="'trade-custom-tmp-class'" :stock_input_id="stock_input_type_id" 
                :placeholder="'请输入股票代码'" v-on:stock_id="chgStockId($event)" 
                v-on:stock_input="stock_input_type_id = $event">
              </vue-stock-search>
            </div>
            {{--  期货输入  --}}
            <div class="investment-target js-futures-panel hide">
              <label class="investment-target__label"><b>*</b>证券</label>
              <input class="js-futures-input investment-target__input" type="text" placeholder="请输入证券" maxlength="10" autocomplete="off"/>
            </div>

            <div class="investment-target">
              <label class="investment-target__label"><b>*</b>买卖方向</label>
              <a class="investment-target__change"><span id="investment-target__change">请选择</span><i></i></a>

              {{--  股票买卖方向  --}}
              <ul class="investment-target__menu js-direction-shares hide">
                <li data-direction="1" class="red"><span>买入</span></li>
                <li data-direction="2" class="blue"><span>卖出</span></li>
              </ul>
              {{--  期货买卖方向  --}}
              <ul class="investment-target__menu js-direction-futures hide">
                <li data-direction="3" class="red"><span>买入开仓</span></li>
                <li data-direction="4" class="blue"><span>卖出开仓</span></li>
                <li data-direction="6" class="red"><span>卖出平仓</span></li>
                <li data-direction="5" class="blue"><span>买入平仓</span></li>
              </ul>
            </div>
            <div class="investment-target">
              <label class="investment-target__label">指令价格</label>
              <input class="investment-target__input" id="ins_price" type="number" placeholder="请输入指令价格" autocomplete="off"/>
            </div>
            <div class="investment-target">
              <label class="investment-target__label">备注</label>
              <input class="investment-target__input js-remarks"  maxlength="15" type="input" placeholder="请输入备注"/>
            </div>
            <table class="instruction-account">
              <thead>
                <tr>
                  <th>产品账户</th>
                  <th>指令数量<span></span></th>
                  <th>预计金额</th>
                </tr>
              </thead>
              <tbody>
                <!-- <tr>
                  <td>产品账户</td>
                  <td><input type="text" value=""/></td>
                  <td>预计金额</td>
                </tr> -->
              </tbody>
            </table>
          </form>
          <div class="instruction-btn">
            <div class="instruction-btn__box">
              <button class="instruction-btn__box__submit">确认提交</button>
              <button class="instruction-btn__box__reset" data-type="reset">重置</button>
            </div>
          </div>
        </div>

        <!-- 二次确认弹出框 -->
        <div class="confirm-popup hide">
          <div class="confirm-popup__content">
            <h2>指令下达确认</h2>
						<div class="confirm-popup__content__name">
							<p><span style="color:#B2B2B2;font-weight:normal;"><b style="letter-spacing:25px;margin-right:-25px;">证券</b>：</span><span class="confirm-popup__content__name__security" style="width:74%;"></span></p>
							<p><span style="color:#B2B2B2;">买卖方向：</span><span class="confirm-popup__content__name__direction"></span></p>
							<p><span style="color:#B2B2B2;">指令价格：</span><span class="confirm-popup__content__name__price">0.00</span></p>
						</div>
						<ul class="confirm-popup__content__list">
							<li><span style="padding-left:10px;color:#B2B2B2;font-weight:bold;">产品账户</span></li>
							<li style="padding-left:10px;color:#B2B2B2;font-weight:bold;">指令数量</li>
							<li style="color:#B2B2B2;font-weight:bold;">预计金额</li>
						</ul>
            <ul class="confirm-popup__content__list add_product_list" style="height:192px;">
              <!-- <thead>
                <tr>
                  <td>产品账户</td>
                  <td>指令数量</td>
                  <td>预计金额</td>
                </tr>
              </thead>
              <tbody> -->
                <!-- <tr>
                  <td>产品账户</td>
                  <td>指令数量</td>
                  <td>预计金额</td>
                </tr> -->
              <!-- </tbody> -->
            </ul>
            <div class="confirm-popup__content__btn">
              <button class="confirm-popup__content__btn__submit">确认</button>
              <button class="confirm-popup__content__btn__cancel">取消</button>
            </div>
          </div>
        </div>
      </div>
      <!-- 提示框 -->
      <div class="cofirm-pup hide"></div>
			<!-- loading图 -->
			<div class="loading-box hide">
				<div class="loading-box__content">
				  <div class="loading-box__content__img"></div>
					<p class="loading-box__content__describle">正在提交...</p>
				</div>
			</div>
      <!-- 菜单 -->
      <div class="sideMenu-bg js-sideMenu_exit hide"></div>
      <div class="sideMenu-main">
        <a class="sideMenu-close js-sideMenu_exit"></a>
        <ul class="sideMenu-opt js-sideMenu_select">
          <li><a class="orderList" href="javascript:;">指令列表</a></li>
          <li><a class="orderOperate" href="javascript:;">指令下达</a></li>
          <!--  <li><a href="javascript:;">成交查询</a></li>  -->
        </ul>
        <div class="exit-btn"><a class="js-exit-btn" href="javascript:;">退出</a></div>
      </div>

      <!--  确认提示框  -->
      <div class="confirm-select-wrap js-confirm-select hide">
        <div class="conf-bg"></div>
        <div class="conf-main">
            <div class="conf-tit">检测提醒</div>
            <div class="conf-info"><p>系统检测到您的浏览器版本较低，是否下载最新的QQ手机浏览器以获得良好的产品体验？</p></div>
            <div class="conf-btn"><a onclick="closeConfirm()" href="javascript:;">否</a><a href="http://mktll.qq.com/qbrowser/newindex_22060.html">前往下载</a></div>
        </div>
      </div>
    </section>
 
    <!-- <script src="{{ asset('/js/jquery.min.js') }}"></script> -->
    <script src="{{asset('/js/zepto.js')}}"></script>
    <script src="{{asset('/js/touch.js')}}"></script>
    <script>
      window.onerror = function(errorMessage, scriptURI, lineNumber,columnNumber,errorObj) {
        //判断内核
        if(/AppleWebKit/ig.test(navigator.userAgent)){
          return false;
        }
        $('.js-confirm-select').show();
      }
      try{//全局用户信息 LOGIN_INFO
          window.LOGIN_INFO = JSON.parse( $('[logined-info-data]').html() );
      }catch(e){}
      window.REQUEST_PREFIX = "{{ config('view.path_prefix','') }}";
      window.REQUEST_PREFIX_MACHINE_LOOP = "{{ config('view.path_prefix','') }}-loop";
      //获取提交的产品
      var product_arr = [];
      //投资标的
      var investment_target = '';
      //指令价格
      var price = 0;
      //交易方向
      var direction = '';
			//点击后得到的展开数组
			var put_away = [];
			//false控制不能刷页面内容，true刷内容
			var doNotRefresh = false;
     
      var searchStock = new Vue({
        el: '#id-investment_target',
        data: {
          stock_id: '',
          stock_input_type_id: '',
        },
        methods: {
          chgStockId: function(event){
            this.stock_id = event;
            investment_target = this.stock_id;
          },
        }
      })

    
			// //2, '.', ','  判断数字，将数字类型为12120.00212553455   等等  改为  12,120.00  类型
	    Number.prototype.formatMoney = function(c, d, t){
        var n = this,
            c = isNaN(c = Math.abs(c)) ? 2 : c,
            d = d == undefined ? "." : d,
            t = t == undefined ? "," : t,
            s = n < 0 ? "-" : "",
            i = parseInt(n = Math.abs(+n || 0).toFixed(c)) + "",
            j = (j = i.length) > 3 ? j % 3 : 0;
        return s + (j ? i.substr(0, j) + t : "") + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + t) + (c ? d + Math.abs(n - i).toFixed(c).slice(2) : "");
	    };

			//全局 ajax 意外处理 类似于在document上绑定了一个全局变量，每当调用ajax时就会调用
      $(document).on('ajaxComplete', function(event, xhr, settings) {
				var obj = JSON.parse(xhr.responseText); //字符串转为对象
        if(
          /您还未登录/.test(xhr.responseText)
          || ( obj && obj.code===10000 )
          || /您还未登录/.test(obj && obj.msg)
        ){
          setTimeout(function(){
            location.href = "/omsv2/user/login";
          },2000);
        }
      });

      //获取买入卖出数据
      function notification_list () {
        var html = '';
        $.ajax({
          url: '/omsv2/sync/instruction/notification_list',
          type: 'GET',
          data: {
            direction_list: [1,2],
						count: 9999,
            page_type: 'h5' //区分是获取h5页面的接口
          },
          success: function (res) {
            if (0 == res.code) {
							res.data.list.forEach(function (e) {
	              var ins_status = '';
	              var securities_html = ''; //证券
	              var account_html = ''; //账户
	              var status_color = '';
	              if (1 == e.ins_status) {
	                ins_status = '已提交';
	                status_color = 'status_submit';
	              } else if (2 == e.ins_status) {
	                ins_status = '已收到';
	                status_color = 'status_receive';
	              } else if (3 == e.ins_status) {
	                ins_status = '执行中';
	                status_color = 'status_execution';
	              } else if (4 == e.ins_status) {
	                ins_status = '已完成';
	                status_color = 'status_complete';
	              } else if (5 == e.ins_status) {
	                ins_status = '部分撤销';
	                status_color = 'status_complete';
	              } else if (6 == e.ins_status) {
	                ins_status = '已撤销';
	                status_color = 'status_complete';
	              }
	              //买入卖出图标  1:买入 2:卖出 3:买入开仓 4:卖出开仓 5:买入平仓 6卖出平仓
	              var img_html = '';
	              if (1 == e.direction) { //买入－－－红色
	                img_html = "<img class='account-info__icon' src='{{ asset('/h5/images/welcome/sell-by_icon.png') }}'/>";
	              }
								if (2 == e.direction) { //卖出－－－蓝色
	                img_html = "<img class='account-info__icon' src='{{ asset('/h5/images/welcome/sell-out_icon.png') }}'/>";
	              }
								if (3 == e.direction) { //买开－－－红色
	                img_html = "<img class='account-info__icon' src='{{ asset('/h5/images/welcome/sell-open_icon.png') }}'/>";
	              }
								if (4 == e.direction) { //卖开－－－蓝色
	                img_html = "<img class='account-info__icon' src='{{ asset('/h5/images/welcome/sell-off_icon.png') }}'/>";
	              }
								if (5 == e.direction) { //买平－－－蓝色
	                img_html = "<img class='account-info__icon' src='{{ asset('/h5/images/welcome/buy-flat_icon.png') }}'/>";
	              }
								if (6 == e.direction) { //卖平－－－红色
	                img_html = "<img class='account-info__icon' src='{{ asset('/h5/images/welcome/sell-flat_icon.png') }}'/>";
	              }
	              // //数量
	              var num = 0;
                var isEmptytype = false;
	              e.product_position_list.forEach(function (i) {
                  if (i.volume == '全部清仓'){
                    isEmptytype = true;
                  }
	                num += parseFloat(i.volume);
	              })
                num = isEmptytype ? '全部清仓' : parseFloat(num).formatMoney(0, '.', ',')
								//指令列表默认产品展开，已完成状态产品收起
								var product_status = 'show_icon';

								if (-1 == put_away.indexOf(parseFloat(e.id))) {
									product_status = 'hide_icon';
								} else {
									product_status = 'show_icon';
								}
                var info = JSON.stringify(e).replace(/"/g, '\'');
	              securities_html =
									'<div class="account-info" stype="position:relative;">' +
										img_html+
                    '<dl class="account-info__number" style="display:inline-block">' +
                      paddingNum(e.number) +
                    '</dl>'+
										'<dl class="account-info__name">' +
											{{--  '<dt class="account-info__name__dt" style="overflow: hidden;word-break: break-all;word-wrap: break-word;text-overflow: ellipsis;display: -webkit-box;-webkit-line-clamp: 2;-webkit-box-orient:vertical;font-size:13px;white-space:normal;line-height: 15px;">'+e.investment_target+'</dt>' +  --}}
											'<dt class="account-info__name__dt" style="overflow: hidden;text-overflow: ellipsis;font-size:13px;white-space:nowrap;line-height: 15px;">'+e.investment_target+'</dt>' +
											'<dd class="account-info__name__dd">'+ e.stock_id.substring(0, 6) +'</dd>' +
										'</dl>' +
										'<dl class="account-info__amount">' +
											'<dt class="account-info__amount__dt">'+num+'</dt>' +
											'<dd class="account-info__amount__dd">'+parseFloat(e.price).formatMoney(2, '.', ',')+'</dd>' +
										'</dl>' +
										'<dl class="account-info__status">' +
											'<dt class="account-info__status__change '+status_color+'">'+ins_status+'</dt>' +
											'<dd class="account-info__status__icon '+product_status+'" data_id="'+e.id+'"></dd>' +
										'</dl>' +
										'<div class="revoke hide"><span class="js-revoke" data-id="'+e.id+'">撤销指令</span>|<span data-information="'+info+'" class="js-copy">复制指令</span></div>' +
									'</div>';
	              e.product_position_list.forEach(function (e) {
                  if(e.volume != '全部清仓'){
                    var volume = parseFloat(e.volume).formatMoney(0, '.', ',')
                  }else{
                    var volume = e.volume;
                  }
	                account_html +=
										'<li><span>'+e.product_name+'</span>' +
										'<span>'+ volume +'</span>' +
										'<span></span></li>';
	              })

								if (-1 == put_away.indexOf(parseFloat(e.id))) {
									html += securities_html + '<ul class="product-list hide">' + account_html + '</ul><p class="line"></p>';
								} else {
									html += securities_html + '<ul class="product-list">' + account_html + '</ul><p class="line"></p>';
								}
	            })

							if (!doNotRefresh) {
								$(".instruction-list").html('' +
								'<ul class="instruction-list__title">' +
                  '<li><span>编号</span></li>' +
									'<li><span>证券/账户</span></li>' +
									'<li><span>数量/价格</span></li>' +
									'<li><span>指令状态</span></li>' +
								'</ul>'+html);
							}
						}else{
              var emptyhtml = '<div class="empty-tips"><div><img src="../../images/welcome/empty_bg.png" alt="暂无数据"></div><p>您还没有提交的指令</p><a class="js-gotoOrder" href="javascript:;">去提交</a></div>';
              $(".instruction-list").html(emptyhtml);
            }
          },
					error: function () {

					}
        })

				$.ajax({
					url: ('/omsv2-loop'||'')+'/oms/helper/last_updated',
					type: 'GET',
					data: {
						page_type: 'h5'
					},
					success: function (res) {
						if (10000 == res.code) {
							$(document).on('tap', function () {
								location.href = '/omsv2/user/login';
							})
						}
					}
				})
      }

      notification_list();

			//可查询到url中的#字符后面的字段
			function _hash_get(name){
		    var params = {};
		    location.hash.replace(/^\#/,'').split('&').forEach(function(x){
		        params[ x.replace(/\=.*/,'') ] = decodeURIComponent( x.replace(/.*\=/,'') );
		    });
		    return params[name];
			}

      //指令编号处理
      function paddingNum(num){
        var numStr = num.toString();
        if(numStr.length < 3){
          var fix = '';
          for(var i = 0; i < 3 - numStr.length; i++){
            fix += '0';
          }
          return fix + numStr;
        }
        return num;
      }

      //点击切换 股票&期货
      $('.frontend-list').on('tap', '.frontend-list_name', function (e) {
        e.preventDefault();
        $(this).addClass('active').siblings().removeClass('active');
        if ($(this).hasClass('futures-switch')) {
          $('.js-shares-panel').hide();
          $('.js-futures-panel').show();
          $('.instruction-btn__box__reset').data('type','reset').html('重置');
          $('.js-futures-input').val('');
        } else {
          $('.js-futures-panel').hide();
          $('.js-shares-panel').show();
          $('#id-investment_target input.client-stockInput__input').val('')
          //清空vue组件的stockid
          searchStock.stock_input_type_id = '';
          investment_target = '';
        }
        //买卖方向重置
        $('#investment-target__change').html('请选择').removeClass().removeAttr('data-direction')
        $('.product_position').val('');
			  $('.estimate_money').html('0.00');
        $('#ins_price').val('');
        $('.js-remarks').val('');
      })
      
      //侧边菜单
      $('.js-sideMenu_select').on('tap', 'a', function (e) {
        e.preventDefault();
        if ($(this).hasClass('orderList')) {
          $('.js-page-title').html('指令列表')
          $('.instruction-list').show();
          $('.instruction-release').hide();
        }else if ($(this).hasClass('orderOperate')){
          $('.js-page-title').html('指令下达')
          $('.instruction-release').show();
          $('.instruction-list').hide();
        }
        $('.sideMenu-main').removeClass('moveAction');
        $('.sideMenu-bg').hide();
      })

      //前往下指令
      $(document).on('tap', '.js-gotoOrder', function(){
        $('.orderOperate').trigger('tap');
      })

      //获取指令下达的产品账户
      $.ajax({
        url: '/omsv2/sync/instruction/notification_product_list',
        type: 'GET',
				data: {
					count: 9999
				},
        success: function (res) {
          var html = '';
          res.data.list.forEach(function (e) {
            html += '<tr>' +
              '<td>'+e.product_name+'</td>' +
              '<td><input type="number" class="product_position" product-name="'+e.product_name+'" product-id="'+e.product_id+'" value="" placeholder="请输入数量"/></td>' +
              '<td class="estimate_money">0.00</td>' +
            '</tr>';
          })
          $(".instruction-account tbody").html(html);
        }
      })

      //指令价格
      $(document).on('input', '#ins_price', function () {
        price = $(this).val().replace(/^(\-)*(\d+)\.(\d{3}).*$/,'$1$2.$3')
        if(parseFloat(price) == 0){
          price = '';
        }
        $(this).val(price);
        $('.product_position').each(function () {
          if ('' != $(this).val()) {
						if ('' == price) {
							$(this).closest('td').next().html('0.00');
						} else {
							$(this).closest('td').next().html(Number(parseFloat($(this).val().replace(/,/g, '')) * parseFloat(price)).formatMoney(2, '.', ','));
						}
          } else {
						$(this).closest('td').next().html('0.00');
					}
        })
      })

      //指令下达预计金额计算 指令数量＊指令价格 键盘抬起
      $(document).on('input', '.product_position', function () {
				var num = $(this).val().replace(/\./g, ''); 
				$(this).val(parseFloat(num)); 
        price = $('#ins_price').val();
				if ('' != $(this).val() && 0 != $(this).val()) {
					if ('' == price) {
						$(this).closest('td').next().html('0.00');
					} else {
						$(this).closest('td').next().html(Number(parseFloat(num) * parseFloat(price)).formatMoney(2, '.', ','));
					}
				} else {
          $(this).val('');
					$(this).closest('td').next().html('0.00');
				}   
      })

      //是否显示产品账户
      $(document).on('tap', '.account-info', function(){
				// 产品账户的显示
        $(this).closest('div').next('ul').toggle();
				var put_away_item;
        // 样式修改
				if ($(this).children().children('.account-info__status__icon').hasClass('hide_icon')) {
					$(this).children().children('.account-info__status__icon').removeClass('hide_icon').addClass('show_icon');
					if (-1 == put_away.indexOf(parseFloat($(this).children().children('.account-info__status__icon').attr('data_id')))) {
						put_away.push(parseFloat($(this).children().children('.account-info__status__icon').attr('data_id')));
					}
				} else {
					$(this).children().children('.account-info__status__icon').removeClass('show_icon').addClass('hide_icon');
					if (-1 != put_away.indexOf(parseFloat($(this).children().children('.account-info__status__icon').attr('data_id')))) {
						put_away_item = parseFloat($(this).children().children('.account-info__status__icon').attr('data_id'));
						put_away.forEach(function (e, index) {
							if (e == put_away_item) {
								put_away.splice(index ,1);
							}
						})
 					}
				}
      })

      //指令提交，点击符合条件弹出二次确认框
      $('.instruction-btn__box__submit').on('tap', function () {
        handleSubmit();
      })

      //二次确认
      var confirm_flag = true;
      $('.confirm-popup__content__btn__submit').on('tap', function (e) {
        e.preventDefault();
        //产品持仓列表 product_position_list
        var product_position_list = {};
        var remarks = $(".js-remarks").val();
        $(".confirm_data").each(function () {
          var id = $(this).attr('product-id');
          product_position_list[id] = {};
          product_position_list[id]['volume'] = $(this).attr('product-volume').replace(/,/g, '');
        })
        var data = {
          asset_class: 0, //0股票 1期货
          fund_manager_memo: remarks,
          price: price,
          direction: direction,
          product_position_list: product_position_list
        }
        //期货
        if($('.frontend-list .active').hasClass('futures-switch')){
          data.asset_class = 1;
          data.investment_target = investment_target;
        }else{  //股票
          data.stock_id = investment_target;
        }
        if(!confirm_flag){
          return false;
        }  
        confirm_flag = false;     
        $.ajax({
          url: '/omsv2/sync/instruction/notification_add',
          type: 'POST',
          data: data,
          success: function (res) {
            if (0 == res.code) {
              $(".add_product_list").html('');
              $(".confirm-popup").hide();
              $(".cofirm-pup").html('提交成功').show();
							location.href="/omsv2/oms/instruction/frontend";
              setTimeout(function () {
                $(".cofirm-pup").hide();
              },3000);
            } else {
              alert(res.msg);
            }
            confirm_flag = true;
          },
          error: function(){
            confirm_flag = true;
          }
        })
      })

      //取消提交
      $(document).on('tap', '.confirm-popup__content__btn__cancel', function () {
        $(".add_product_list").html('');
        $(".confirm-popup").hide();
      })

      //买卖方向选择
      $(document).on('tap', '.investment-target__change', function () {
        if($('.frontend-list .active').hasClass('futures-switch')){
          $('.js-direction-futures').show()
        }else{
          $('.js-direction-shares').show()
        }
      })

      //点击页面的其他地方  买卖方向菜单消失
      $(document).on('tap', function(e){
        if ($(e.target).hasClass('investment-target__change') || $(e.target.parentElement).hasClass('investment-target__change')) {

        }else{
           $('.investment-target__menu').hide();
        }
      });

      //指令下达 买卖方向选择
      $('.investment-target__menu').on('tap', 'li', function (e) {
        e.preventDefault();
        $('.investment-target__menu').hide();
				if (1 == $(this).attr('data-direction') || 3 == $(this).attr('data-direction') || 6 == $(this).attr('data-direction')) {
					$('#investment-target__change').html($(this).html()).attr('data-direction',$(this).attr('data-direction')).addClass('red').removeClass('blue');
				} else {
					$('#investment-target__change').html($(this).html()).attr('data-direction',$(this).attr('data-direction')).addClass('blue').removeClass('red');
				}
        if (2 == $(this).data('direction')) {
          //设置全部清仓
          $('.instruction-btn__box__reset').data('type','emptyShares').html('全部清仓');
        }else{
          $('.instruction-btn__box__reset').data('type','reset').html('重置');
        }
      })

      //撤销指令
      $(document).on('tap', '.revoke .js-revoke', function () {
				$(".loading-box").show();
        $.ajax({
          url: '/omsv2/sync/instruction/notification_modify_status',
          type: 'POST',
          data: {
            id: $(this).attr('data-id'),
            action: 4
          },
          success: function (res) {
            if (0 == res.code) {
							notification_list();
							$(".loading-box").hide();
              $(".cofirm-pup").html('撤销成功').show();
              setTimeout(function () {
                $(".cofirm-pup").hide();
              },3000);
            } else {
							$(".loading-box").hide();
							$(".cofirm-pup").html('撤销失败').show();
              setTimeout(function () {
                $(".cofirm-pup").hide();
              },3000);
            }
            $('.revoke').hide();
						$('.account-info').removeClass('add_account_bgd');
						doNotRefresh = false;
          },
          error: function () {
            $('.revoke').hide();
						$(".loading-box").hide();
						$(".cofirm-pup").html('撤销失败').show();
						$('.account-info').removeClass('add_account_bgd');
						doNotRefresh = false;
						setTimeout(function () {
							$(".cofirm-pup").hide();
						},3000);
          }
        })
      })

			//点击页面的其他地方  撤销按钮消失
      $(document).on('tap', function(e){
        if ($(e.target).hasClass('revoke') || $(e.target.parentElement).hasClass('revoke')) {

        }else{
           $('.revoke').hide();
					 $('.account-info').removeClass('add_account_bgd');
					 doNotRefresh = false;
        }
      });

      //指令复制
      $(document).on('tap', '.revoke .js-copy', function(e){
        e.preventDefault();
        var data =  JSON.parse($(this).data('information').replace(/'/g, '"'));
        var copyprice = parseFloat(data.price) > 0 ? parseFloat(data.price) : '';
        $('.js-page-title').html('指令下达')
        $('.instruction-release').show();
        $('.instruction-list').hide();
        //价格
        $('#ins_price').val(copyprice)
        //股票
        if('' != data.stock_id && undefined != data.stock_id){
          $('.shares-switch').addClass('active').siblings().removeClass('active');
          $('.js-shares-panel').show().find('.client-stockInput__unit').html('');
          $('.js-futures-panel').hide();
          $('#id-investment_target input.client-stockInput__input').val(data.stock_id)
          investment_target = data.stock_id;
        } else {  //期货
          $('.futures-switch').addClass('active').siblings().removeClass('active');
          $('.js-futures-panel').show();
          $('.js-shares-panel').hide();
          $('.js-futures-input').val(data.investment_target);
        }
        //买卖方向
        $('.investment-target__menu li').eq(data.direction-1).trigger('tap');
        $('.js-remarks').val('');
        
        $('.product_position').val('').parent().next().html('0.00');
        data.product_position_list.forEach(function(e, index){
          $('.product_position').each(function(){
            if(e.product_id == $(this).attr('product-id')){
              if(isNaN(parseFloat(e.volume))){
                $(this).val('').parent().next().html('0.00');
              }else{
                $(this).val(parseFloat(e.volume)).parent().next().html((e.volume * data.price).formatMoney(2, '.', ','));
              }
            }
          })
        })
      })

			//指令列表页面自动刷新
			var timer = setInterval(function () {
				notification_list();
			}, 5000)

			//重置按钮
			$('.instruction-btn__box__reset').on('tap', function () {
        //全部清仓
        if($(this).data('type') == 'emptyShares'){
          handleSubmit('emptyBtn');
        }else{
				  $('.product_position').val('');
				  $('.estimate_money').html('0.00');
        }
			})

			//退出登录
      $('.js-exit-btn').on('tap', function () {
				$.ajax({
	        type: 'post',
	        url: '/bms-pub/user/logout',
	        success: function(){
	          location.href = "/omsv2/user/login";
	        }
	      })
      })
      //进入菜单
			$(document).on('tap', '.frontend-header__out', function () {
        $('.sideMenu-main').addClass('moveAction');
        $('.sideMenu-bg').show();
			})

      //退出菜单
      $(document).on('tap', '.js-sideMenu_exit', function () {
        $('.sideMenu-main').removeClass('moveAction');
        $('.sideMenu-bg').hide();
      })

			//长按撤销按钮显示
			var timeout;
			document.addEventListener('touchstart',function (i) {
				doNotRefresh = true;
				clearTimeout(timeout);
				timeout = undefined;
				var self = i.target;
				if ($(self).closest('.account-info').find('.revoke').length > 0) {
					if (timeout == undefined) {
						timeout = setTimeout(function() {
							doNotRefresh = true;
							$(self).closest('.account-info').find('.revoke').show();
							$(self).closest('.account-info').addClass('add_account_bgd');
						}, 1000);
					}
				}
			}, false);
			document.addEventListener('touchend', function (i) {
				if ($(i.target).closest('.account-info').hasClass('add_account_bgd')) {
					doNotRefresh = true;
				}else{
					doNotRefresh = false;
				}
				var self = i.target;
				clearTimeout(timeout);
				timeout = undefined;
			})

			//去除浏览器默认的右键菜单
			document.oncontextmenu = function(){
			  return false;
			}

      //提交处理
      function handleSubmit(btnType){
        
        product_arr = [];

        //指令价格
        price = $('#ins_price').val();
        //交易方向
        direction = $('#investment-target__change').attr('data-direction');
        //判断全部清仓
        var isEmpty = btnType == 'emptyBtn';
        //输入的证券时,用户直接在证券框内输入的值
        var investment_input = $('#id-investment_target input').val();
        //判断当前操作是否期货的情况
        var isFutures = false;
        if ($('.frontend-list .active').hasClass('futures-switch')) {
          isFutures = true;
          investment_target = $('.js-futures-input').val();
        }

				// 此时input上的blur事件触发，input失去焦点
				$('input').trigger('blur');
        //产品持仓列表 product_position_list
        if('' != investment_input && investment_input.substring(0, 6) != investment_target.substring(0, 6) && !isFutures) {
          $('.cofirm-pup').html('证券代码错误').show();
          setTimeout(function () {
            $('.cofirm-pup').hide();
          },3000);
          return false;
        } else if ('' == investment_target) {
          $('.cofirm-pup').html('证券不能为空').show();
          setTimeout(function () {
            $('.cofirm-pup').hide();
          },3000);
          return false;
        }

        if (undefined == direction) {
          $(".cofirm-pup").html('请选择买卖方向').show();
          setTimeout(function () {
            $(".cofirm-pup").hide();
          },3000);
          return false;
        }

        //判断输入数量的产品个数,产品输入的个数不为0，才可以进行提交
        var vol_num = 0;
        $(".product_position").each(function (index, e) {
          if (('' != e.value && 0 != e.value) || isEmpty) {
            var obj = {};
            obj.name = $(this).attr('product-name');
            obj.id = $(this).attr('product-id');
            obj.volume = $(this).val();
            obj.money = Number(parseFloat($(this).val().replace(/,/g, '')) * parseFloat(price)).formatMoney(2, '.', ',');
            product_arr.push(obj);
            vol_num += 1;
          }
        })

        if (0 == vol_num && !isEmpty) {
          $(".cofirm-pup").html('输入指令数量').show();
          setTimeout(function () {
            $(".cofirm-pup").hide();
          },3000);
          return false;
        }
        $(".confirm-popup").show();
        var confirm_html = '';
        product_arr.forEach(function (e) {
          if (isEmpty) {
            e.volume = '全部清仓';
            e.money = '--'
          }
          confirm_html += '<li class="confirm_data" product-id="'+e.id+'" product-volume="'+e.volume+'"><span style="padding-left:10px;">'+e.name+'</span></li>' +
					'<li style="padding-left:10px;">'+e.volume+'</li>' +
					'<li style="text-align:right;">'+e.money+'</li>';
        })
				//证券
				$(".confirm-popup__content__name__security").html(investment_target);
				//买卖方向
				$(".confirm-popup__content__name__direction").html($("#investment-target__change span").html()).css('color',$("#investment-target__change span").css('color'));
				//价格
				$(".confirm-popup__content__name__price").html(price)

        $(".add_product_list").html(confirm_html);
      }

      function closeConfirm(){
        $('.js-confirm-select').hide();
      }
    </script>
	</body>
</html>
