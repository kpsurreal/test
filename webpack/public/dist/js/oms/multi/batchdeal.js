'use strict';

var _Vue$component;

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

var vm_multi; //批量交易的vue对象
var user_id = $.pullValue(window, 'LOGIN_INFO.user_id', '');
var stock_list = [];
var list_data = []; //封装好的data
//判断是买入还是卖出
var direction = "buy";
var total_cash = 0; //空仓下可用金额最大值
var total_max_cash = 0; //可用金额最大值
var product; //策略信息
//最后一次加载时间
var last_loading_timestamp = new Date().valueOf();
//证券列表中被选中的证券机构
var position_stocks;
// var entrust_info = window.entrust_info?window.entrust_info:[];//委托信息
var market = 'marketA'; //默认a股
//检测环境是否发生变化，主要是 product_id
//multi_products:head:updated:checked_one   总列表中单选时触发  传递 产品信息
$(window).on('multi_products:head:updated:checked_one', function (event) {
  var new_product = event.product;
  vm_multi || multiViewUpdate();
  product = new_product;
  getStockList();
}).on('multi_products:head:updated:checked_notone', function () {
  //check没有选中的时候
});

// 切换市场时，重新获取自选股数据
$(window).on('order_create:market:changed', function (event) {
  market = event.market; //修改股票市场
  product && getStockList();
});

// 切换交易方式，重新获取自选股数据
$(window).on('order_create:deal_method:changed', function (event) {
  //切换买入 卖出
  direction = event.deal_method;
  product && getStockList();
});

var position_last_updated_timestamp = 0;
$(window).on('position_update_updated', function (event) {
  if (position_last_updated_timestamp < event.updated_timestamp) {
    position_last_updated_timestamp = event.updated_timestamp;
    product && direction == 'buy' ? getFollowListStocks() : getPositionStocks();
  }
});

$(window).on('load', function () {
  //清空缓存区的自选股列表
  direction == 'buy' && $.omsUpdateLocalJsonData('stock_follow', user_id);
}).on('order_create:nav:multi-stocks:buy', function () {
  product && getStockList();
}).on('order_create:nav:multi-stocks:sell', function () {
  product && getStockList();
}).on('add_multi_hand_order:success', getStockList).on('order_create:multi_order:data_change:bull', function (event) {
  data = event.new_data;
  distributeTradeData(data);
}).on('order_create:multi_order:data_change:sell', function (event) {
  data = event.new_data;
  distributeTradeData(data);
}).on('product:position:updated', function (event) {
  var position = event.position;
  position && updatePositionList(position);
}).on('risk_cash_check:success', function (event) {
  // render();
  var product_max_cash = $.pullValue(event, 'res_data.product_cash.max_cash', 0);
  $(window).trigger({
    type: 'create_order:multi_stocks:' + direction + ':max_cash:changed',
    max_cash: product_max_cash
  });
});

direction == 'buy' && $(window).on('create_order:multi_stocks:add_stock', function (event) {
  var stock = event.stock;
  //新增，更新本地缓存
  var cached_follow_stocks = $.omsGetLocalJsonData('stock_follow', user_id, false);
  if (cached_follow_stocks) {
    cached_follow_stocks.push($.extend(stock, {
      follow: true
    }));
    $.omsUpdateLocalJsonData('stock_follow', user_id, cached_follow_stocks);
  }
  combinePositionStocksInfo([stock], $.omsGetLocalJsonData('position_realtime', product.id, []));
  // 新增股票时，前端风控
  // var product = PRODUCT;
  // 计算可用余额
  // 新增股票的总可用资金
  var market_value = 0;
  var total_amount = 0;
  var enable_sell_volume = 0;
  window.position_realtime && window.position_realtime.forEach(function (e) {
    if (e.stock_id === stock.stock_id && e.product_id == product.id) {

      // market_value = e.market_value;
      // total_amount = e.total_amount;
      enable_sell_volume = e.enable_sell_volume;
    }
  });
  var all_market_value = 0;
  window.risk_position[product.id].data.forEach(function (el) {
    if (el.stock_id == stock.stock_id) {
      total_amount = el.total_amount;
      market_value = el.market_value;
    }
    all_market_value += el.market_value - 0;
  });
  var obj = riskCheck.checkRules({
    product_id: product.id, // 产品id， id
    // 交易数据 form_data
    trade_direction: 1, // 交易方向，1买入 2卖出 trade_direction
    trade_mode: 1, // 1限价／2市价  trade_mode
    volume: 0, // 交易数量
    price: 1, // 限价金额
    surged_limit: 1, // 涨停价 price已经做了处理了
    decline_limit: 1, // 跌停价 price已经做了处理了
    stock_code: stock.stock_id, // 股票code，包含“.SZ”,比较的时候最好都进行小写转换
    stock_name: stock.stock_name, // 股票名称，用于判断st股票
    // 产品的数据 product
    total_assets: product.runtime.total_assets, // 资产总值 runtime.total_assets
    enable_cash: product.runtime.enable_cash, // 可用资金 runtime.enable_cash
    security: all_market_value, // 持仓市值 runtime.security 改为 all_market_value
    net_value: product.runtime.net_value, // 当日净值 runtime.net_value
    // 持仓数据
    market_value: market_value, // 本股票持仓市值 //window.position_realtime里面有
    total_amount: total_amount, // 该股票当前持仓数
    enable_sell_volume: 0 // 该股票能卖的数量
  });
  // 剩余可用资金 ＝ 空仓下的总可用资金 － 股票资产
  var max_cash = Math.max(obj.max_cash, 0);
  stock.max_cash = Math.min(max_cash, total_max_cash);
  // stock.forEach(function(e){
  //     e.max_cash = max_cash;
  // });
  $(window).trigger({
    type: 'risk_cash_check:success',
    res_data: {
      product_cash: {
        max_cash: max_cash
      }
    }
  });
  // 新增自定义股票时需要得到新的股票的可用资金等信息
  mergeFreshStocksInfo([stock]).then(function () {
    stock_list.push(stock);
    var list = filterData(stock_list, vm_multi.header_data);
    if ('marketA' == market) {
      list = list.filter(function (e) {
        return (/\.(SZ|SH)$/.test(e.stock_id.toUpperCase())
        );
      });
    } else if ('marketHSH' == market) {
      list = list.filter(function (e) {
        return (/\.(HKSH)$/.test(e.stock_id.toUpperCase())
        );
      });
    } else if ('marketHSZ' == market) {
      list = list.filter(function (e) {
        return (/\.(HKSZ)$/.test(e.stock_id.toUpperCase())
        );
      });
    }
    vm_multi.stock_list = list;
  });

  $('.multi-stocks-section').find('.nothing-nothing').removeClass('nothing');
}).on('create_order:multi_stocks:delete_stock', function (event) {
  var stock = event.stock;
  //删除，更新本地缓存
  var cached_follow_stocks = $.omsGetLocalJsonData('stock_follow', user_id, false);
  if (cached_follow_stocks) {
    cached_follow_stocks = cached_follow_stocks.filter(function (cached_stock) {
      return cached_stock.stock_id != stock.stock_id;
    });
    $.omsUpdateLocalJsonData('stock_follow', user_id, cached_follow_stocks);
  }
  var list = vm_multi.stock_list;
  list.forEach(function (ele, index) {
    if (ele.stock_id == stock.stock_id) {
      list.splice(index, 1);
    }
  });
  vm_multi.stock_list = list;
  getStockList();
});

//动态更新持仓数据
function updatePositionList(position_stocks) {
  if (!position_stocks || !position_stocks.length) {
    return;
  }
}

// 批量购买的规则鉴定
function distributeTradeData(data) {
  product && getStockList();
}

function getStockList() {
  reset();
  direction == 'buy' ? getFollowListStocks() : getPositionStocks();
}

function getFollowListStocks() {
  var url = (window.REQUEST_PREFIX || '') + '/user/stock-follow/get';

  var cached_follow_stocks = $.omsGetLocalJsonData('stock_follow', user_id, false);

  cached_follow_stocks ? (stock_list = cached_follow_stocks, getPositionStocks()) : $.getJSON(url).done(function (res) {

    stock_list = stock_list.concat($.pullValue(res, 'data.list', []).map(function (stock_id) {
      return {
        stock_id: stock_id,
        follow: true
      };
    }).reverse());
    //缓存 stock_follow 的信息
    $.omsCacheLocalJsonData('stock_follow', user_id, stock_list);
    res.code == 0 && getPositionStocks();
    !res.code == 0 && $.failNotice(url, res);
  }).fail($.failNotice.bind(null, url));
}

function getPositionStocks() {
  var url = (window.REQUEST_PREFIX || '') + '/oms/api/position_realtime?product_id=' + $.pullValue(product, 'id');

  last_loading_timestamp = new Date().valueOf();
  $('.multi-stocks-section').attr('last_loading_timestamp', last_loading_timestamp);
  var cached_postion = $.omsGetLocalJsonData('position_realtime', $.pullValue(product, 'id'), false);
  cached_postion ? (position_stocks = cached_postion, displayStocksList()) : $.getJSON(url).done(function (res) {
    if (!product) {
      return;
    } //如果已经切换到多策略模式，抛弃

    position_stocks = $.pullValue(res, 'data', []);
    displayStocksList();
    !res.code == 0 && $.failNotice(url, res);
  }).fail($.failNotice.bind(null, url));
}

function render() {
  // reset();
  var list = stock_list;
  if ('marketA' == market) {
    list = list.filter(function (e) {
      return (/\.(SZ|SH)$/.test(e.stock_id.toUpperCase())
      );
    });
  } else if ('marketHSH' == market) {
    list = list.filter(function (e) {
      return (/\.(HKSH)$/.test(e.stock_id.toUpperCase())
      );
    });
  } else if ('marketHSZ' == market) {
    list = list.filter(function (e) {
      return (/\.(HKSZ)$/.test(e.stock_id.toUpperCase())
      );
    });
  }
  //修改 表格头部
  if ('marketA' == market) {
    if (direction == "buy") {
      vm_multi.header_data = tableData_maketA_buy;
    }
    if (direction == "sell") {
      vm_multi.header_data = tableData_maketA_sell;
    }
  } else if ('marketHSH' == market || 'marketHSZ' == market) {

    if (direction == "buy") {
      vm_multi.header_data = tableData_maketH_buy;
    }
    if (direction == "sell") {
      vm_multi.header_data = tableData_maketH_sell;
    }
  }
  //创建表格
  var new_list = filterData(list, vm_multi.header_data);
  vm_multi.table_data = new (Function.prototype.bind.apply(Array, [null].concat(_toConsumableArray(vm_multi.header_data))))();
  // vm_multi.table_data = temp;
  vm_multi.stock_list = new_list;
  vm_multi.total_cash = product.runtime.total_assets; //总资产
  vm_multi.product = product;
  vm_multi.total_max_cash = product.runtime.enable_cash; //剩余最大资金
  vm_multi.direction = direction;
}

function displayStocksList() {
  if (!product.runtime) {
    return;
  }
  if (direction == 'buy') {
    //合并自选股的持仓数据
    combinePositionStocksInfo(stock_list, position_stocks);
    // 购买时，显示自定义股票
    stock_list.length ? mergeFreshStocksInfo(stock_list).then(render) : render();
    return;
  }
  if (direction == 'sell') {
    stock_list = excludeFutures(position_stocks);
    // 卖出时，显示自定义股票
    stock_list.length ? mergeFreshStocksInfo(stock_list).then(render) : render();
    return;
  }
}

function combinePositionStocksInfo(target_stocks, position_stocks) {
  target_stocks.forEach && target_stocks.forEach(function (stock) {
    position_stocks.forEach && position_stocks.forEach(function (position) {
      if (stock.stock_id == position.stock_id) {
        $.extend(stock, position);
      }
    });
  });
}

//动态更新持仓数据
function excludeFutures(list) {
  //排除期货，期货 stock_id 是 708090
  return list && list.map ? list.filter(function (stock) {
    return stock.stock_id != 708090;
  }) : [];
}

function reset() {
  vm_multi.stock_list = [];
  vm_multi.total_cash = 0; //总资产
  vm_multi.product = {};
  vm_multi.total_max_cash = 0; //剩余最大资金
}

//获取五档行情
function update5(request, index) {
  var url = (window.REQUEST_PREFIX || '') + "/oms/helper/stock_detail?stock_id=" + request;
  $.get(url).done(function (res) {
    res.code == 0 && function (list) {
      if (!vm_multi.stock_list.length) {
        return;
      }
      for (var i = 0; i < list.length; i++) {
        for (var n = 0; n < vm_multi.stock_list.length; n++) {
          if (vm_multi.stock_list[n].stock_id == list[i].stock_id) {
            if (direction == "buy") {
              vm_multi.stock_list[n].deal_price = list[i].ask1_price || 0;
            }
            if (direction == "sell") {
              vm_multi.stock_list[n].deal_price = list[i].bid1_price || 0;
            }
            vm_multi.stock_list[n].ask1_price = list[i].ask1_price || 0; //买一价
            vm_multi.stock_list[n].bid1_price = list[i].bid1_price || 0; //卖一价

            if ('marketA' == market) {
              vm_multi.stock_list[n].entrust_method = "1"; //默认显示市价
            } else {
              vm_multi.stock_list[n].entrust_method = "5"; //默认显示增强
            }
          }
        }
      }
    }($.pullValue(res, 'data'));
    if (1 == res.code) {} else {
      (res.code != 0 || !res.data || !res.data[0]) && failNotice(res);
    }
  }).fail(failNotice).always(function () {});

  function failNotice(res) {
    $.omsAlert($.pullValue(res, 'msg', '请求异常'), false);
  }
}
////////////////////////////////////////////////////////////////////////////////////////////
//vue重构

/**
 * 将数值四舍五入后格式化.
 * @param num 数值(Number或者String)
 * @param cent 要保留的小数位(Number)
 * @param isThousand 是否需要千分位 0:不需要,1:需要(数值类型);
 * @return 格式的字符串,如'1,234,567.45'
 * @type String
 */
function formatNumber(num, cent, isThousand) {
  if (num == undefined) {
    return 0;
  }
  num = num.toString().replace(/\$|\,/g, '');

  // 检查传入数值为数值类型
  if (isNaN(num)) num = "0";
  // 获取符号(正/负数)
  var sign = num == (num = Math.abs(num));
  num = Math.floor(num * Math.pow(10, cent) + 0.50000000001); // 把指定的小数位先转换成整数.多余的小数位四舍五入
  cents = num % Math.pow(10, cent); // 求出小数位数值
  num = Math.floor(num / Math.pow(10, cent)).toString(); // 求出整数位数值
  var cents = cents.toString(); // 把小数位转换成字符串,以便求小数位长度

  // 补足小数位到指定的位数
  while (cents.length < cent) {
    cents = "0" + cents;
  }if (isThousand) {
    // 对整数部分进行千分位格式化.
    for (var i = 0; i < Math.floor((num.length - (1 + i)) / 3); i++) {
      num = num.substring(0, num.length - (4 * i + 3)) + ',' + num.substring(num.length - (4 * i + 3));
    }
  }
  if (cent > 0) return (sign ? '' : '-') + num + '.' + cents;else return (sign ? '' : '-') + num;
}

// class_name使用的不纯粹，其的值不但控制样式名称，还控制了其它显示内容及逻辑，现在新该用class来承载样式名称。
// a股买入表格头部
var tableData_maketA_buy = [{
  th: "error_info",
  show_type: "error_icon",
  class_name: "error_info",
  class: '',
  name: " "
}, {
  th: "checkbox",
  show_type: "checkbox",
  name: "",
  class_name: ""
}, {
  th: "stock_code", //证劵代码
  show_type: 'number',
  name: "证券代码",
  class_name: "vue_number_default",
  class: 'left10 maxWidth70',
  float: 'left'
}, {
  th: "stock_name",
  show_type: "text",
  name: "证券名称",
  class_name: "vue_text_default",
  class: 'left10',
  float: 'left'
}, {
  th: "commodity_name",
  show_type: "text",
  name: "交易单元",
  class_name: "vue_text_default",
  class: 'left10',
  float: 'left'
}, {
  th: "cost_price",
  show_type: "number",
  name: "成本价",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "total_amount",
  show_type: "number",
  name: "持仓数量",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "market_value",
  show_type: "number",
  name: "市值",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "earning_ratio",
  show_type: "number",
  name: "盈亏率",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "weight",
  show_type: "number",
  name: "当前仓位(个股)",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "current_entrust",
  show_type: "number",
  name: "当前挂单",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "entrust_method",
  show_type: "select",
  name: "报价方式",
  option: [{
    value: "1",
    name: "限价"
  }, {
    value: "2",
    name: "市价"
  }],
  class_name: "vue_input_select",
  class: 'right10',
  float: 'right',
  value: 1
}, {
  th: "deal_price",
  show_type: "input",
  name: "买入价格",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right'
}, {
  th: "transfer_position",
  show_type: "input_buy_percentage",
  name: "总资产比例",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right',
  placeholder: '请输入比例'
}, {
  th: "transfer_commission",
  show_type: "input_buy_deal",
  name: "本次委买",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right',
  placeholder: '请输入数量'
}];

// a股卖出表格头部
var tableData_maketA_sell = [{
  th: "error_info",
  show_type: "error_icon",
  class_name: "error_info",
  class: '',
  name: " "
}, {
  th: "checkbox",
  show_type: "checkbox",
  name: "",
  class_name: ""
}, {
  th: "stock_code", //证劵代码
  show_type: 'number',
  name: "证券代码",
  class_name: "vue_number_default",
  class: 'left10 maxWidth70',
  float: 'left'
}, {
  th: "stock_name",
  show_type: "text",
  name: "证券名称",
  class_name: "vue_text_default",
  class: 'left10',
  float: 'left'
}, {
  th: "commodity_name",
  show_type: "text",
  name: "交易单元",
  class_name: "vue_text_default",
  class: 'left10',
  float: 'left'
}, {
  th: "cost_price",
  show_type: "number",
  name: "成本价",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "total_amount",
  show_type: "number",
  name: "持仓数量",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "market_value",
  show_type: "number",
  name: "市值",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "earning_ratio",
  show_type: "number",
  name: "盈亏率",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "weight",
  show_type: "number",
  name: "当前仓位(个股)",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "current_entrust",
  show_type: "number",
  name: "当前挂单",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "entrust_method",
  show_type: "select",
  name: "报价方式",
  option: [{
    value: "1",
    name: "限价"
  }, {
    value: "2",
    name: "市价"
  }],
  class_name: "vue_input_select",
  class: 'right10',
  float: 'right',
  value: 1
}, {
  th: "deal_price",
  show_type: "input",
  name: "卖出价格",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right'
}, {
  th: "total_position",
  show_type: "input_percentage",
  name: "总资产比例",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right',
  placeholder: '请输入比例'
}, {
  th: "transfer_position",
  show_type: "input_sell_percentage",
  name: "持仓比例",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right',
  placeholder: '请输入比例'
}, {
  th: "transfer_commission",
  show_type: "input_sell_deal",
  name: "本次委卖",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right',
  placeholder: '请输入数量'
}];

// 港股买入表格头部
var tableData_maketH_buy = [{
  th: "error_info",
  show_type: "error_icon",
  class_name: "error_info",
  class: '',
  name: " "
}, {
  th: "checkbox",
  show_type: "checkbox",
  name: "",
  class_name: ""
}, {
  th: "stock_code", //证劵代码
  show_type: 'number',
  name: "证券代码",
  class_name: "vue_number_default",
  class: 'left10 maxWidth70',
  float: 'left'
}, {
  th: "stock_name",
  show_type: "text",
  name: "证券名称",
  class_name: "vue_text_default",
  class: 'left10',
  float: 'left'
}, {
  th: "commodity_name",
  show_type: "text",
  name: "交易单元",
  class_name: "vue_text_default",
  class: 'left10',
  float: 'left'
}, {
  th: "cost_price",
  show_type: "number",
  name: "成本价",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "total_amount",
  show_type: "number",
  name: "持仓数量",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "market_value",
  show_type: "number",
  name: "市值",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "earning_ratio",
  show_type: "number",
  name: "盈亏率",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "weight",
  show_type: "number",
  name: "当前仓位(个股)",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "current_entrust",
  show_type: "number",
  name: "当前挂单",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "entrust_method",
  show_type: "select",
  name: "报价方式",
  option: [{
    value: "5",
    name: "增强限价买入"
  }, {
    value: "4",
    name: "竞价限价买入"
  }],
  class_name: "vue_input_select",
  class: 'right10',
  float: 'right',
  value: 5
}, {
  th: "deal_price",
  show_type: "input",
  name: "买入价格",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right'
}, {
  th: "transfer_position",
  show_type: "input_buy_percentage",
  name: "总资产比例",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right',
  placeholder: '请输入比例'
}, {
  th: "transfer_commission",
  show_type: "input_buy_deal",
  name: "本次委买",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right',
  placeholder: '请输入数量'
}];

// 港股卖出表格头部
var tableData_maketH_sell = [{
  th: "error_info",
  show_type: "error_icon",
  class_name: "error_info",
  class: '',
  name: " "
}, {
  th: "checkbox",
  show_type: "checkbox",
  name: "",
  class_name: ""
}, {
  th: "stock_code", //证劵代码
  show_type: 'number',
  name: "证券代码",
  class_name: "vue_number_default",
  class: 'left10 maxWidth70',
  float: 'right'
}, {
  th: "stock_name",
  show_type: "text",
  name: "证券名称",
  class_name: "vue_text_default",
  class: 'left10',
  float: 'left'
}, {
  th: "commodity_name",
  show_type: "text",
  name: "交易单元",
  class_name: "vue_text_default",
  class: 'left10',
  float: 'left'
}, {
  th: "cost_price",
  show_type: "number",
  name: "成本价",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "total_amount",
  show_type: "number",
  name: "持仓数量",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "market_value",
  show_type: "number",
  name: "市值",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "earning_ratio",
  show_type: "number",
  name: "盈亏率",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "weight",
  show_type: "number",
  name: "当前仓位(个股)",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "current_entrust",
  show_type: "number",
  name: "当前挂单",
  class_name: "vue_number_default",
  class: 'right10',
  float: 'right'
}, {
  th: "entrust_method",
  show_type: "select",
  name: "报价方式",
  option: [{
    value: "5",
    name: "增强限价卖出"
  }, {
    value: "4",
    name: "竞价限价卖出"
  }],
  class_name: "vue_input_select",
  class: 'right10',
  float: 'right',
  value: 5
}, {
  th: "deal_price",
  show_type: "input",
  name: "卖出价格",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right'
}, {
  th: "total_position",
  show_type: "input_percentage",
  name: "总资产比例",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right',
  placeholder: '请输入比例'
}, {
  th: "transfer_position",
  show_type: "input_buy_percentage",
  name: "持仓比例",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right',
  placeholder: '请输入比例'
}, {
  th: "transfer_commission",
  show_type: "input_sell_deal",
  name: "本次委卖",
  class_name: "vue_input_default",
  class: 'right10',
  float: 'right',
  placeholder: '请输入委卖数量'
}];

// 筛选数组
// 分析评价by: liuzeyafzy@gmail.com
// 这个函数看起来十分的复杂，因为变量的命名非常的杂乱无章。而且实际上做的并不是筛选的功能
// 问题1: 第二个入参filters根本就没起作用
// 问题2: forEach里面实现的只是将第二层的数据拿到第一层来。压根没有考虑第二层变量同名的情况。
// 问题3: 这个函数的意义何在？
// 问题4: 在这样一个类似于工具的函数内，穿插了业务的变量与逻辑。commodity_name这种东西意义何在？
// 问题5: 在这样一个类似于工具的函数内，使用了全局变量product.name。
function filterData(arr, filters) {
  var data = [];
  arr.forEach(function (v1) {
    if (v1 instanceof Object) {
      for (var key1 in v1) {
        if (v1[key1] instanceof Object) {
          for (var key2 in v1[key1]) {
            v1[key2] = v1[key1][key2];
          }
          delete v1[key1];
        }
      }
      v1.commodity_name = product.name;
      // v1.target_position = v1.weight ? (v1.weight * 100).toFixed(2) : (0.00).toFixed(2);
      // v1.transfer_position = (0.00).toFixed(2);
      v1.transfer_commission = '';
    }
  });
  return arr;
}

// vue单元格组件
// 分析评价by：liuzeyafzy@gmail.com
// 问题1: props传了placeholder，这是来自于tableData_maketA_buy这样的表头数据中的，但是例如float却又是在下面的函数中从this.header_data中获取的。同类数据走不同的路径，逻辑混乱。
// 问题2: props传输的变量数太多了。例如placeholder，直接从header_data获取就可以了。数据冗余，逻辑不清。
// 问题3: props变量名缺少注释，不是作者本人难以迅速理解父子组件关联
// 问题4: 一个抽象组件内，不应该去根据name是不是“earning_ratio”来走不同的分支
// 问题5: 这里用到了表格头数据show_type，有个可能的值是“input_buy_percentage”。组件里面的代码判断字符串是否含有buy来判断买入卖出方向。而此组件中又有地方获取买入卖出方向的方式是找$root的direction的值。同时使用两种方式会使得别人更加难以理解，只用某一种方式才对。
// 问题6: 接问题5，show_type的数据，被几个维度使用，一个是判断输入框的形式（input、下拉框等），一个是买入卖出方式，一个是百分比什么的。不应该将多个逻辑混合到一个变量中来判断。
// 问题7: 通过this.$parent.profittype来修改父组件的profittype值是不应该的。因为这样使用就隐含要求父组件包含profittype的data数据（computed、props都不行），而这是没有道理的。事件上报的好处就在这里。
// 问题8: template中的v-if嵌套导致可读性比较差。我要花10分钟才能总结出来这段代码的显示逻辑：my_showtype为‘error_icon’或者“nubmer”，走自己的显示流程，而如果是“input”“select”“readyonly”，又当没选中或者该隐藏时，显示“--”，否则按各自的样式显示。减少层级嵌套能够有助于理解逻辑。请参考这种if逻辑：判断“error_icon”、判断“nubmer”、判断“input且checktype且非hidden”、判断“select且checktype且非hidden”、判断“readonly且checktype且非hidden”、其它情况。这种只有一层的判断会不会更清晰些？
// 问题9: 这个组件内不应该使用闭包了。写了影响可读性。
// 问题10: 针对传进来的val值，formatNumber处理的逻辑 应该在表头就考虑好了再传进来。
Vue.component('vue-cell-default', {
  props: ["val", "showtype", "checktype", "name", "index", "class_name", "header_data", "earning_ratio_class", "placeholder"],
  template: '\n    <div :class="header_data.class" class="batchdeal-cell">\n      <div :class="class_name" v-if="my_showtype==\'text\'">\n        <span :style="{color:color}">{{myVal}}</span>\n      </div>\n      <div :class="class_name" v-if="my_showtype==\'checkbox\'">\n        <input type="checkbox" @change=checked_change v-model="my_checked_type" name="" value="" >\n      </div>\n\n      <div class="vue_input_default" v-if="my_showtype==\'input\' && checktype && !hidden">\n        <span v-show="deal_method">{{deal_method}}</span>\n        <input step="any" @keyup="input_keyup" v-model="input_val" ref="input_text" type="number" @blur="input_blur" :placeholder=placeholder>\n        <span v-show="is_percentage">%</span>\n        <span v-show="is_deal"></span>\n      </div>\n      <div class="vue_input_default" v-if="my_showtype==\'select\' && checktype && !hidden">\n        <select @change="select_change" :value="val">\n          <option :value="item.value" v-for="(item,index) in header_data.option">{{item.name}}</option>\n        </select>\n      </div>\n      <div :class="class_name" v-if="my_showtype==\'readyonly\' && checktype && !hidden">\n        <input :value="readyonly_placeholder" type="text" readyonly="readonly" disabled="disabled" style="color:gray;">\n      </div>\n      <div v-if="(my_showtype==\'input\' || my_showtype==\'select\' || my_showtype==\'readyonly\') && (!checktype || hidden)">\n        <span>- -</span>\n      </div>\n      <div :class="class_name" v-if="my_showtype==\'error_icon\'">\n        <span></span>\n      </div>\n      <div :class="class_name" v-if="my_showtype==\'nubmer\'" step="0.01">\n        <span>{{myVal}}</span>\n      </div>\n    </div>\n  ',
  data: function data() {
    return {
      // deal_method: false,
      // is_percentage: false,
      my_checked_type: this.checktype,
      input_val: this.val,
      my_showtype: '',
      float: '',
      color: 'black',
      myVal: '',
      // is_deal: false,
      readyonly_placeholder: "市价",
      hidden: false
    };
  },
  watch: {
    hidden: function hidden() {
      this.input_val = '';
    },
    checktype: function checktype() {
      this.my_checked_type = this.checktype;
    },
    val: function val(_val) {
      // val = val || 0.0;
      if (this.val == '' || this.val == undefined) {
        this.myVal = '- -';
      } else {
        this.myVal = this.val;
      }

      if (this.name == "earning_ratio") {
        if (_val == "- -") {
          this.$parent.profittype = "black";
        } else if (_val > 0) {
          this.$parent.profittype = "red";
        } else if (_val < 0) {
          this.$parent.profittype = "green";
        }
      }

      if (this.name == "cost_price") {
        if (this.val) {
          this.myVla = formatNumber(this.val, 3, 1);
        } else {
          this.myVla = "- -";
        }
      }

      if (this.name == "total_amount") {
        if (this.val) {
          return formatNumber(this.val, 0, 1);
        } else {
          this.myVal = "- -";
        }
      }

      if (this.name == "market_value") {
        if (this.val) {
          this.myVal = formatNumber(this.val, 2, 1);
        } else {
          this.myVal = "- -";
        }
      }

      if (this.name == "earning_ratio") {
        if (this.val) {
          this.myVal = formatNumber(this.val * 100, 2, 0) + "%";
        } else {
          this.myVal = "- -";
        }
      }

      if (this.name == "weight") {
        if (this.val) {
          this.myVal = formatNumber(this.val * 100, 2, 0) + "%";
        } else {
          this.myVal = "- -";
        }
      }

      if (this.name == "current_entrust") {
        if (this.val) {
          this.myVal = formatNumber(this.val, 0, 1);
        } else {
          this.myVal = "- -";
        }
      }

      if (this.name == "target_position" || this.name == "transfer_commission" || this.name == "transfer_position" || this.name == "total_position") {
        this.input_val = _val;
      }

      if (this.name == "deal_price") {
        this.input_val = _val;
      }
    },
    earning_ratio_class: function earning_ratio_class() {
      if (this.name == "market_value") {
        this.color = this.earning_ratio_class;
      }

      if (this.name == "earning_ratio") {
        this.color = this.earning_ratio_class;
      }
    },
    showtype: function showtype(val) {
      if (this.showtype.indexOf('text') > -1) {
        this.my_showtype = "text";
      }

      if (this.showtype.indexOf('input') > -1) {
        this.my_showtype = "input";
      }

      if (this.showtype.indexOf('checkbox') > -1) {
        this.my_showtype = "checkbox";
      }

      if (this.showtype.indexOf('select') > -1) {
        this.my_showtype = "select";
      }

      if (this.showtype.indexOf('error_icon') > -1) {
        this.my_showtype = 'error_icon';
      }

      this.my_showtype = "text";
    }
  },
  methods: {
    input_keyup: function input_keyup() {
      var stock_num = this.input_val;
      if (stock_num.indexOf('.') < 0 && '' != stock_num) {
        //以上已经过滤，此处控制的是如果没有小数点，首位不能为类似于 01、02的金额
        this.input_val = parseFloat(stock_num);
      }
    },
    select_change: function select_change(evt) {
      this.$emit('select_change', this.index, evt.target.value);
    },
    checked_change: function checked_change() {
      this.$emit('check_change', this.my_checked_type);
    },
    input_blur: function input_blur() {
      var input_val = this.input_val ? this.input_val : 0;

      //重新计算目标值 本次调仓值  委托数量
      this.$emit('modify_val', this.name, this.input_val);
      this.$emit('input_blur', this.name, this.input_val);

      //目标持仓
      if (this.name != "change_price_target" && this.name != "change_price_position" && this.name != "change_price_total") {
        this.$parent.$parent.wind_contrl_all();
      }
    },
    focus_action: function focus_action() {
      this.$refs.input_text.focus();
    }
  },
  computed: {
    is_percentage: function is_percentage() {
      if (this.showtype.indexOf('percentage') > -1) {
        return true;
      } else {
        return false;
      }
    },
    deal_method: function deal_method() {
      // if (this.showtype.indexOf('buy') > -1) {
      //   //return '+'
      // } else if (this.showtype.indexOf('sell') > -1) {
      //   //return '-'
      //   return false
      // } else {
      //   return false
      // }
    },
    is_deal: function is_deal() {
      if (this.showtype.indexOf('deal') > -1) {
        return true;
      } else {
        return false;
      }
    }
  },
  mounted: function mounted() {
    var _this2 = this;

    //当卖出时  默认隐藏持仓比例列
    if (this.$root.direction == "sell") {
      if (this.name == "transfer_position") {
        this.hidden = true;
      }
    }

    this.my_showtype = function () {
      if (_this2.showtype.indexOf('text') > -1) {
        return "text";
      }

      if (_this2.showtype.indexOf('input') > -1) {
        return "input";
      }

      if (_this2.showtype.indexOf('checkbox') > -1) {
        return "checkbox";
      }

      if (_this2.showtype.indexOf('select') > -1) {
        return "select";
      }
      if (_this2.showtype.indexOf('error_icon') > -1) {
        return 'error_icon';
      }
      return "text";
    }();

    if (this.header_data) {
      this.float = this.header_data.float;
    } else {
      this.float = '';
    }

    if (this.val == '' || this.val == undefined) {
      this.myVal = '- -';
    } else {
      this.myVal = this.val;
    }

    if (this.name == "earning_ratio" && this.val > 0) {
      this.$parent.earning_ratio_class = "red";
    }

    if (this.name == "earning_ratio" && this.val < 0) {
      this.$parent.earning_ratio_class = "green";
    }

    if (this.name == "cost_price") {
      if (this.val) {
        this.myVal = formatNumber(this.val, 3, 1);
      } else {
        this.myVal = "- -";
      }
    }

    if (this.name == "total_amount") {
      if (this.val) {
        this.myVal = formatNumber(this.val, 0, 1);
      } else {
        this.myVal = "- -";
      }
    }

    if (this.name == "market_value") {
      if (this.val) {
        this.myVal = formatNumber(this.val, 2, 1);
      } else {
        this.myVal = "- -";
      }
    }

    if (this.name == "earning_ratio") {
      if (this.val) {
        this.myVal = formatNumber(this.val * 100, 2, 0) + "%";
      } else {
        this.myVal = "- -";
      }
    }

    if (this.name == "weight") {
      if (this.val) {
        this.myVal = formatNumber(this.val * 100, 2, 0) + "%";
      } else {
        this.myVal = "- -";
      }
    }

    if (this.name == "current_entrust") {
      if (this.val) {
        this.myVal = formatNumber(this.val, 0, 1);
      } else {
        this.myVal = "- -";
      }
    }
  }
});

// Vue表头组件
Vue.component('vue-row-header', {
  props: ["header_data", "list_data", "checkall"],
  template: '\n    <thead>\n      <tr class="top_tr" style="padding-right: 10px;">\n        <template v-for="(item,index) in header_data">\n          <th v-if="index==0">\n            <div class="error_info"><span style="display:none;"></span></div>\n          </th>\n          <th v-if="index==1">\n            <vue-cell-default  @check_change="check_change" val=item.name showtype="checkbox"  :header_data=item :checktype="checkall"></vue-cell-default>\n          </th>\n          <th v-if="index>1" :style="index==0 || index==1?\'\':\'flex:1;\'">\n            <vue-cell-default  :val=item.name showtype="text"  :class_name="item.class" :header_data=item ></vue-cell-default>\n          </th>\n        </template>\n        <th style="width:22px;"></th>\n      </tr>\n    </thead>\n  ',
  data: function data() {
    return {};
  },
  methods: {
    check_change: function check_change(val) {
      this.$emit('check_all', val);
    }
  }
});

// Vue表格行组件
// 分析评价by：liuzeyafzy@gmail.com
// 问题1: error_info在这个行组件中做了处理，又在vue-cell-default这个子组件中处理，应该考虑在一个层面上处理
// 问题2: props传入了批量修改仓位什么的数值，这里会产生一个之前已经预见到的问题。产品已经明确指出只在修改了批量那里的值之后才修改选中行的数量。现在这种处理方式会导致：用户先改批量的值，再勾选某行，这行就会按批量的值展示数量。还有个问题，target_position_all这些变量在调试时发现一直都是undefined，是不是可以删除了？
// 问题3: earning_ratio_class传来传去，应该想好在哪里处理。
// 问题4: watch的radio_type使用了$refs来操作dom，不应该这样用。
// 问题5: 与问题2相关，这里原来没有使用问题2的处理方式，watch的checktype方法没有取明明传进来的批量数据，而是直接从root中获取change_price_position_value，不便于跟踪数据变化
Vue.component('vue-row-tr', {
  props: ["header_data", "stock", "transfer_position_all", "target_position_all", "checktype", "index", "delete_show", "odd_price", "error_obj", "radio_type"],
  template: '\n    <tr :class="{error:error_obj.type,line:line_type}" @mouseenter="mouseenter" @mouseleave="mouseleave">\n      <template v-for="(item,index) in header_data">\n        <td v-if="index==0">\n          <div class="error_info"><span v-show=error_obj.type></span></div>\n        </td>\n        <td v-else :style="index==1?\'\':\'flex:1;\'" style="max-width:">\n          <vue-cell-default :placeholder=header_data[index].placeholder @modify_val=modify_val @check_change=check_change @select_change=select_change  :name=item.th :val="stock[item.th]" :earning_ratio_class="earning_ratio_class" :showtype=item.show_type :class_name=item.class_name :header_data=item :checktype="checktype" :index=index :ref="item.th"></vue-cell-default>\n        </td>\n      </template>\n      <td>\n        <vue-error-ele :delete_show="delete_show" @delete_stock=delete_stock :isshow="error_show" :error_info="error_obj.error_info"></vue-error-ele>\n      </td>\n    </tr>\n  ',
  data: function data() {
    return {
      profittype: '',
      line_type: false,
      earning_ratio_class: "black",
      is_loading: false,
      error_show: false
    };
  },
  watch: {
    // 监听批量的变化
    target_position_all: function target_position_all(val) {
      if (this.checktype) {
        this.stock["target_position"] = this.val;
      }
    },

    // 监听批量的变化
    transfer_position_all: function transfer_position_all() {
      if (this.checktype) {
        this.stock["transfer_position"] = this.val;
      }
    },

    // 监听股票变化
    stock: function stock(ele) {
      if (this.$root.direction == "buy") {
        this.stock.deal_price = ele.ask1_price;
      } else {
        this.stock.deal_price = ele.bid1_price;
      }
    },

    // 监听勾选、取消勾选
    checktype: function checktype(val) {
      //勾选时 重新计算价格
      if (val) {
        var stock_num;
        if (this.$root.direction == "buy") {
          // let transfer_position = this.$root.change_price_position_value / 100;
          var transfer_position = 0;
          var stock = this.stock;
          // let current_positon = stock.weight ? stock.weight : 0;
          var current_positon = stock.weight ? stock.weight : 0;
          var weight_total_assets = this.$root.total_cash;
          var deal_price = stock.deal_price ? stock.deal_price : 0;
          var trading_unit = stock.trading_unit ? stock.trading_unit : 0;
          if (!deal_price) {
            //成本价格为0
            return;
          }
          stock_num = parseInt(transfer_position * weight_total_assets / deal_price / trading_unit) * trading_unit;
          stock.transfer_commission = stock_num;
          //stock.transfer_position = (transfer_position * 100).toFixed(2);
        }

        if (this.$root.direction == "sell") {
          // let transfer_position = this.$root.change_price_position_value / 100;
          var _transfer_position = 0;
          var _stock = this.stock;
          var _current_positon = _stock.total_amount ? _stock.total_amount : 0;
          var _trading_unit = _stock.trading_unit ? _stock.trading_unit : 0;
          stock_num = parseInt(_transfer_position * _current_positon / _trading_unit) * _trading_unit;
          _stock.transfer_commission = stock_num;
          // stock.transfer_position = (transfer_position * 100).toFixed(2);
        }
      }
    },

    // 监听批量处的radio修改，现在应该已经废弃了。
    radio_type: function radio_type(val) {
      //神操作 点击下面的radio 选择让td隐藏
      if (this.$root.direction == "sell") {
        //切换显示总资产比例或者持仓比例并清空输入框
        if (val == "total") {
          this.$refs.transfer_position[0].hidden = true;
          this.$refs.total_position[0].hidden = false;
        }

        if (val == "equal") {
          this.$refs.transfer_position[0].hidden = false;
          this.$refs.total_position[0].hidden = true;
        }
      }
      this.stock.transfer_commission = 0;
    }
  },
  methods: {
    modify_val: function modify_val(name, val) {
      this.stock[name] = val;
      val = val ? val : 0;

      if (this.$root.direction == 'buy') {
        //通过本次调仓 计算委托价格
        if (name == "transfer_position") {
          var _transfer_position2 = val / 100;
          var _stock2 = this.stock;
          var current_positon = _stock2.weight ? _stock2.weight : 0;
          var weight_total_assets = this.$root.total_cash;
          var deal_price = _stock2.deal_price ? _stock2.deal_price : 0;
          var trading_unit = _stock2.trading_unit ? _stock2.trading_unit : 100;
          var _stock_num = parseInt(_transfer_position2 * weight_total_assets / deal_price / trading_unit) * trading_unit;

          //判断委托数量是否正确
          if (_stock_num < 0) {
            // this.error_obj.type = true;
            // this.error_obj.error_info = "输入有误，请检查后重新输入";
            return;
          } else {
            this.error_obj.type = false;
            this.error_obj.error_info = "";
            _stock2.transfer_commission = _stock_num;
          }
        }
      }

      if (this.$root.direction == 'sell') {
        //本次调仓比例计算 本次委卖数量
        if (name == "transfer_position") {
          var transfer_position = val / 100;
          var stock = this.stock;
          var current_amout = parseInt(stock.total_amount);

          //   let stock_num = parseInt(transfer_position * stock.weight_total_assets/stock.deal_price /stock.trading_unit)*stock.trading_unit;
          // var stock_num = current_amout /current_positon *100 * transfer_position*100 -entrust_sell_num;
          var stock_num = parseInt(current_amout * transfer_position / stock.trading_unit) * stock.trading_unit;
          //判断委托数量是否正确
          if (stock_num < 0) {
            // this.error_obj.type = true;
            // this.error_obj.error_info = "输入有误，请检查后重新输入";
            return;
          } else {
            this.error_obj.type = false;
            this.error_obj.error_info = "";
            stock.transfer_commission = stock_num;
          }
        }
        //卖出时 总资产比例 计算本次委卖数量
        if (name == 'total_position') {
          var total_position = val / 100;
          var stock = this.stock;
          var new_price = +stock.market_value / +stock.total_amount; //根据市值计算最新价
          var last_price = +stock.last_price || 0;
          var total_cash = this.$root.total_cash;
          var stock_num = +total_cash * total_position / new_price;
          stock.transfer_commission = parseInt(stock_num / stock.trading_unit) * stock.trading_unit;
        }
      }

      if (name == "transfer_commission") {
        val = val ? val : 0;
        var stock = this.stock;
        var stock_num = parseInt(val / stock.trading_unit) * stock.trading_unit;
        // this.input_val = Math.abs( num );
        this.stock.transfer_commission = stock_num;
        //判断委托数量是否正确
        if (stock_num < 0) {
          // this.error_obj.type = true;
          // this.error_obj.error_info = "输入有误，请检查后重新输入";
          return;
        } else {
          this.error_obj.type = false;
          this.error_obj.error_info = "";
        }
      }
    },
    check_change: function check_change(val) {
      this.$emit('check_change', this.index, val);
    },
    select_change: function select_change(index, val) {
      this.stock.entrust_method = val;
      if (val == "2") {
        this.$refs.deal_price[0].my_showtype = 'readyonly';
        this.stock.deal_price = this.stock.last_price * 1.1;
      } else {
        this.$refs.deal_price[0].my_showtype = 'input';
        if (this.$root.direction == "buy") {
          this.stock.deal_price = this.stock.bid1_price;
          this.$refs.deal_price[0].input_val = this.stock.ask1_price;
        }
        if (this.$root.direction == "sell") {
          this.stock.deal_price = this.stock.ask1_price;
          this.$refs.deal_price[0].input_val = this.stock.bid1_price;
        }
      }
    },
    delete_stock: function delete_stock() {
      if (this.is_loading) {
        return;
      }
      var stock_id = this.stock.stock_id;
      var url = (window.REQUEST_PREFIX || '') + '/user/stock-follow/delete';
      this.is_loading = true;
      $.post(url, {
        stock_id: stock_id
      }).done(function (res) {
        if (res.code == 0) {
          $.omsAlert('删除自选股 ' + stock_id + ' 成功！');
          $(window).trigger({
            type: 'create_order:multi_stocks:delete_stock',
            stock: {
              stock_id: stock_id
            }
          });
        } else {
          $.failNotice(url, res);
        }
      }).fail($.failNotice.bind(null, url)).always(function () {
        this.is_loading = false;
      });
    },
    mouseenter: function mouseenter() {
      //鼠标移入 显示风控提示
      if (this.error_type) {
        this.error_show = true;
      }
    },
    mouseleave: function mouseleave() {
      this.error_show = false;
    }
  }
});

// 表格的多行数据组件
// 问题1: <重复问题>props传的数据太多。且有冗余
Vue.component('vue-multi-tbody', (_Vue$component = {
  props: ["header_data", "list_data", "total_cash", "target_position_all", "transfer_position_all", 'direction', "total_max_cash", "delete_show", "radio_type"],
  watch: {},
  template: '\n    <table class="nothing-nothing buy batch_list">\n      <vue-row-header @check_all=check_all :header_data="header_data" :list_data="list_data" :checkall="checkall" ></vue-row-header>\n      <tbody >\n        <template v-for="(stock,index) in  list_data" >\n          <vue-row-tr :radio_type=radio_type @check_change=check_change :delete_show=delete_show :header_data="header_data" :stock="stock" :error_obj="error_arr[index]"  :checktype="checkArr[index]" :odd_price="odd_arr[index]" :target_position_all="target_position_all" :transfer_position_all="transfer_position_all" :index="index" ></vue-row-tr>\n        </template>\n      </tbody>\n      <template v-if="direction == \'buy\' ">\n        <thead>\n          <tr class="total_tr" style="padding-right: 10px;" >\n            <th style="width:24px;">\n                <div class="error_info">\n                  <span style="display:none;"></span>\n                </div>\n            </th>\n            <th style="flex:1;text-align:left;">\u6C47\u603B</th>\n            <th style="width:18px;"></th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;text-align:right;">\n              <div style="padding-right: 10px;">\n                {{weight_total}}\n                <span if-show="weight_total">%</span>\n              </div>\n            </th>\n            <th style="flex:1;text-align:right;">\n              <div style="padding-right: 10px;">{{current_entrust_total}}</div>\n            </th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;text-align:right;">\n              <div style="padding-right: 10px;">{{transfer_position_total}}<span if-show="transfer_position_total">%</span></div>\n            </th>\n            <th style="flex:1;text-align:right;">\n              <div style="padding-right: 10px;">{{transfer_commission_total}}</div>\n            </th>\n            <th style="width:22px;"></th>\n          </tr>\n        </thead>\n      </template>\n      <template v-if="direction == \'sell\' ">\n        <thead>\n          <tr class="total_tr" style="padding-right: 10px;">\n            <th style="width:24px;">\n                <div class="error_info"><span style="display:none;"></span></div>\n            </th>\n            <th style="flex:1;text-align:left;">\u6C47\u603B</th>\n            <th style="width:18px;"></th>\n\n            <th style="flex:1;"></th>\n            <th style="flex:1;"></th>\n\n            <th style="flex:1;"></th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;text-align:right;">\n              <div style="padding-right: 10px;">\n                {{weight_total}}\n                <span if-show="weight_total">%</span>\n              </div>\n            </th>\n            <th style="flex:1;text-align:right;">\n              <div style="padding-right: 10px;">\n                {{current_entrust_total}}\n              </div>\n            </th>\n            <th style="flex:1;"></th>\n            <th style="flex:1;"></th>\n            <template v-if="radio_type==\'total\'">\n              <th style="flex:1;text-align:right;">\n                <div style="padding-right: 10px;">{{transfer_total_total}}<span if-show="transfer_total_total">%</span></div>\n              </th>\n            </template>\n            <template v-else>\n              <th style="flex:1;">\n                <div style="padding-right: 10px;">- -</div>\n              </th>\n            </template>\n            <template v-if="radio_type==\'equal\'">\n              <th style="flex:1;text-align:right;">\n                <div style="padding-right: 10px;">{{transfer_position_total}}<span if-show="transfer_position_total">%</span></div>\n              </th>\n            </template>\n            <template v-else>\n              <th style="flex:1;text-align:right;">\n                <div style="padding-right: 10px;">- -</div>\n              </th>\n            </template>\n            <th style="flex:1;text-align:right;">\n              <div style="padding-right: 10px;">{{transfer_commission_total}}</div>\n            </th>\n            <th style="width:22px;"></th>\n          </tr>\n        </thead>\n      </template>\n    </table>\n  ',
  data: function data() {
    return {
      "weight_total": 0, //总仓位
      "current_entrust_total": 0, //当前挂单
      "target_position_total": 0, //目标仓位
      "transfer_position_total": 0, //本次调仓
      "transfer_commission_total": 0, //本次委买
      "transfer_total_total": 0, //按相同总资产比例
      "checkref": "checkbox",
      "my_total_cash": this.total_cash,
      "checkall": false,
      "checklen": this.list_data.length,
      "checknum": 0,
      "checktr": false,
      "checkArr": [],
      "my_total_max_cash": this.total_max_cash,
      "odd_arr": [],
      "error_arr": []
    };
  }
}, _defineProperty(_Vue$component, 'watch', {
  list_data: function list_data(val) {
    this.checklen = val.length;
    this.checkArr = new Array(val.length);
    for (var i = 0; i < this.checkArr.length; i++) {
      this.checkArr[i] = false;
    }
    this.checkall = false;
    this.odd_arr = new Array(val.length);
    for (var _i = 0; _i < this.odd_arr.length; _i++) {
      this.odd_arr[_i] = 0;
    }
    this.error_arr = new Array(val.length);
    for (var _i2 = 0; _i2 < this.error_arr.length; _i2++) {
      this.error_arr[_i2] = {
        type: false,
        error_info: ""
      };
    }
    this.my_total_max_cash = this.total_max_cash;
    this.my_total_cash = this.total_cash;
    //股票数据改变获取新的委托数量
    this.update_entrust_info();
  },
  checkArr: function checkArr() {
    //当checkbox改变 调用整体风控
    this.wind_contrl_all();
  }
}), _defineProperty(_Vue$component, 'mounted', function mounted() {
  this.checkArr = new Array(this.checklen);
  for (var i = 0; i < this.checkArr.length; i++) {
    this.checkArr[i] = false;
  }
  this.odd_arr = new Array(this.checklen);
  for (var _i3 = 0; _i3 < this.odd_arr.length; _i3++) {
    this.odd_arr[_i3] = 0;
  }
}), _defineProperty(_Vue$component, 'methods', {
  check_all: function check_all(val) {
    this.checkall = val;
    this.checkArr = new Array(this.checklen);
    for (var i = 0; i < this.checkArr.length; i++) {
      this.checkArr[i] = val;
    }
    //添加吸顶的全选状态改变
    //$(this.$root.header_tr).find(':checkbox')[0].checked = val;
  },
  check_change: function check_change(index, val) {
    this.checkArr = new (Function.prototype.bind.apply(Array, [null].concat(_toConsumableArray(this.checkArr))))();
    this.checkArr[index] = val;

    var bool = true;

    this.checkArr.forEach(function (ele) {
      if (ele == false) {
        bool = false;
      }
    });
    this.checkall = bool;
  },
  onec_adjustment: function onec_adjustment() {
    this.my_total_max_cash = this.$root.total_max_cash;
    //清空tr中的交易金额
    for (var i = 0; i < this.odd_arr.length; i++) {
      this.odd_arr[i] = 0;
    }
    this.error_arr.forEach(function (ele) {
      ele.type = false;
      ele.error_info = '';
    });
    //一键调整
    var len = this.checkArr.length;
    for (var _i4 = 0; _i4 < len; _i4++) {
      if (this.checkArr[_i4]) {
        //使用tr中的委托数进行一键调整 传 stock的数组序号🈴和当前的委托数目
        // this.wind_contrl_op(i, this.list_data[i].transfer_commission)
      }
    }
  },
  wind_contrl_all: function wind_contrl_all() {
    //  统计数据
    this.weight_total = 0;
    this.current_entrust_total = 0;
    this.target_position_total = 0;
    this.transfer_position_total = 0;
    this.transfer_commission_total = 0;
    this.transfer_total_total = 0;
    var total_amount = 0;
    //计算统计
    for (var i = 0; i < this.checkArr.length; i++) {
      if (this.checkArr[i]) {

        this.weight_total += this.list_data[i].weight * 100 || 0;
        this.current_entrust_total += parseFloat(this.list_data[i].current_entrust) || 0;
        this.target_position_total += parseFloat(this.list_data[i].target_position) || 0;
        this.transfer_position_total += parseFloat(this.list_data[i].transfer_position) || 0;
        this.transfer_commission_total += parseFloat(this.list_data[i].transfer_commission) || 0;
        this.transfer_total_total += parseFloat(this.list_data[i].total_position) || 0;

        total_amount += parseFloat(this.list_data[i].total_amount) || 0;
      }
    }

    this.weight_total = this.weight_total.toFixed(2);
    this.current_entrust_total = formatNumber(this.current_entrust_total, 0, 1);
    this.target_position_total = this.target_position_total.toFixed(2);
    this.transfer_position_total = this.transfer_position_total.toFixed(2);
    this.transfer_total_total = this.transfer_total_total.toFixed(2);
    //修改持仓比例汇总
    if (this.$root.direction == "sell") {
      if (total_amount == 0) {
        total_amount = 1;
      }
      this.transfer_position_total = (this.transfer_commission_total / total_amount * 100).toFixed(2);
    }
  },
  submit_stock_tbody: function submit_stock_tbody() {
    //委托确认
    var orders = [];
    var obj = {};
    var len = this.list_data.length;
    var self = this;
    this.checkArr.forEach(function (ele, index) {
      if (ele) {
        if (self.list_data[index]["transfer_commission"] > 0) {
          obj = {
            price: self.list_data[index]['deal_price'],
            trade_direction: self.$root.direction,
            trade_mode: self.list_data[index].entrust_method || 2,
            market: self.list_data[index].market,
            volume: self.list_data[index]["transfer_commission"],
            stock_id: self.list_data[index].stock_id,
            stock_name: self.list_data[index].stock_name
          };
          orders.push(obj);
        }
      }
    });

    var url = (window.REQUEST_PREFIX || '') + '/oms/workflow/' + product.id + '/add_multi_hand_order';

    if (orders.length) {
      var is_trade_day = $.pullValue($('.trade-5').getCoreData(), 'is_trade_day');
      //这里新增二次提醒
      var htmlArr = [];
      var totalAmount = 0;
      var totalVolume = 0;
      orders.forEach(function (e) {
        var ins_price = e.price;
        ins_price = '' == ins_price ? 0 : ins_price;
        if (e.trade_direction == "buy") {
          e.trade_direction = 1;
        } else {
          e.trade_direction = 2;
        }
        var ins_type = e.trade_direction; //1买入 2卖出
        // var trade_market = 1;
        var typeStr1 = '';
        if (1 == ins_type) {
          typeStr1 = '<span style="color:#F44336;">买入</span>';
        } else if (2 == ins_type) {
          typeStr1 = '<span style="color:#2196F3">卖出</span>';
        }
        var ins_model = e.trade_mode; //限价、市价，市价时，价格切记传空
        var typeStr2 = '';
        if ('marketA' == market) {
          if ("1" == ins_model) {
            typeStr2 = '限价';
            if (0 == ins_price) {
              ins_model = utils.stock_custom.getMarketType(e.stock_id.match(/[a-zA-Z]+/));
              e.trade_mode = ins_model;
              typeStr2 = '市价';
              e.trade_mode = 2;
            }
            e.trade_mode = 1;
          } else if ("2" == ins_model) {
            // ins_price = 0;
            ins_model = utils.stock_custom.getMarketType(e.stock_id.match(/[a-zA-Z]+/));
            e.trade_mode = ins_model;
            typeStr2 = '市价';
            e.trade_mode = 2;
          }
          e.market = 1;
        } else if ('marketHSH' == market) {
          // trade_market = 2;
          //e.trade_mode = e.marketH_trade_mode;
          if (e.trade_mode == 5) {
            typeStr2 = '增强限价';
          } else if (e.trade_mode == 4) {
            typeStr2 = '竞价限价';
          }
          e.market = 2;
        } else if ('marketHSZ' == market) {
          // trade_market = 2;
          //e.trade_mode = e.marketH_trade_mode;
          if (e.trade_mode == 5) {
            typeStr2 = '增强限价';
          } else if (e.trade_mode == 4) {
            typeStr2 = '竞价限价';
          }
          e.market = 3;
        }
        var tmpInsVolume = e.volume;
        var tmpInsAmount = Number((10000 * ins_price).toFixed(2)) * tmpInsVolume / 10000;
        totalAmount = (parseFloat(totalAmount) * 10000 + parseFloat(tmpInsAmount) * 10000) / 10000;
        totalVolume = parseFloat(totalVolume) + parseFloat(tmpInsVolume);
        var priceStr = '市价' == typeStr2 ? utils.common.getData(PRICE_TYPE_LIST, ins_model) : ins_price;
        htmlArr.push('<tr style="border-bottom: 1px solid #E2E2E2;"><td class="cell-left">' + e.stock_id + ' ' + e.stock_name + '</td>' + '<td class="cell-left">' + typeStr1 + '</td>' + '<td class="cell-left">' + typeStr2 + '</td>' + '<td class="cell-right" style="max-width:190px;overflow:hidden;text-overflow:ellipsis;white-space:nowrap;" title="' + priceStr + '">' + priceStr + '</td>' + '<td class="cell-right">' + tmpInsVolume + '</td>' + '<td class="cell-right">' + tmpInsAmount + '</td></tr>');
      });
      var confirmHtml = '<table class="custom_confirm"><tbody style="width:100%;display: inline-table;"><tr><th class="cell-left">证券</th>' + '<th class="cell-left">买卖标志</th>' + '<th class="cell-left">报价方式</th>' + '<th class="cell-right">委托价格</th>' + '<th class="cell-right">交易数量(股)</th>' + '<th class="cell-right">交易金额(元)</th></tr>' + htmlArr.join('') + '</tbody></table>' + '<div class="custom_total"><span style="color:#999999;font-size:13px;">总计</span><span>' + totalVolume + '</span><span>' + totalAmount + '</span></div>';
      if (0 == is_trade_day) {
        //0是休市时间，也就是非交易日或者是交易日的15点之后 1为非休市时间
        confirmHtml += '<div style="color:#F44336;font-size: 14px;padding-bottom: 3px;">*当前为休市时间，指令将提交至下一交易日</div>';
      }
      $.confirm({
        title: '委托确认 <span style="margin-left:10px;font-size: 14px;font-weight: normal;">交易单元：' + $('.multi-product-head').find('input[type="checkbox"]:checked').siblings('span[data-src="name"]').html() + '</span>',
        content: confirmHtml,
        closeIcon: true,
        confirmButton: '确定',
        cancelButton: false,
        confirm: function confirm() {
          if ($.isLoading()) {
            return;
          }
          $.startLoading('正在提交订单...');

          $.post(url, {
            multi: orders
          }).done(function (res) {
            if (res.code == 0) {
              //reportResult(res);
              self.submit_result(res, orders);
              $(window).trigger({
                type: 'add_multi_hand_order:success',
                res: res
              });
              $(window).trigger({
                type: 'position_update_updated'
              });
              $(window).trigger({
                type: 'multi_batch:create_order:finish'
              }); //触发委托列表刷新
            } else {
              self.submit_result(res, orders);
            }
          }).fail($.failNotice.bind(null, url)).always(function () {
            $.clearLoading();
          });
        }
      });
    } else {
      $.omsAlert("提交失败，请检查！", false);
    }
  },
  wind_contrl_op: function wind_contrl_op(index, num) {
    //一键调整操作
    // if (num == 0) {
    //   return;
    // }
    // if (this.$root.direction == "buy") {
    //   // var tbody = this.$parent;
    //   var current_total_max_cash = this.my_total_max_cash;
    //   // let len = tbody.list_data.length;
    //   for (var i = 0; i < this.checkArr.length; i++) {
    //     if (this.checkArr[i] == true) {
    //       if (i != index) {
    //         current_total_max_cash -= this.odd_arr[i]
    //       }
    //     }
    //   }
    // }
    // //获取最大交易金额
    // var enable_cash = this.enable_cash
    // var price_type = 1
    // var stock = this.list_data[index];
    // var price = stock.deal_price;
    // var product = this.$root.product;
    // var all_market_value = 0;
    // window.risk_position[product.id].data.forEach(function(el) {
    //   if (el.stock_id == stock.stock_id) {
    //     let total_amount = el.total_amount;
    //     let market_value = el.market_value;
    //   }
    //   all_market_value += el.market_value - 0;
    // });
    // enable_cash = enable_cash ? enable_cash : product.runtime.enable_cash;
    // if (product) {
    //   var obj = riskCheck.checkRules({
    //     product_id: product.id, // 产品id， id
    //     // 交易数据 form_data
    //     trade_direction: direction == "buy" ? 1 : 2, // 交易方向，1买入 2卖出 trade_direction
    //     trade_mode: price_type, // 1限价／2市价  trade_mode
    //     volume: num, // 交易数量
    //     price: price, // 限价金额
    //     surged_limit: 1, // 涨停价 price已经做了处理了
    //     decline_limit: 1, // 跌停价 price已经做了处理了
    //     stock_code: stock.stock_id, // 股票code，包含“.SZ”,比较的时候最好都进行小写转换
    //     stock_name: stock.stock_name, // 股票名称，用于判断st股票
    //     // 产品的数据 product
    //     total_assets: product.runtime.total_assets, // 资产总值 runtime.total_assets
    //     enable_cash: current_total_max_cash, // 可用资金 runtime.enable_cash
    //     security: all_market_value, // 持仓市值 runtime.security 改为 all_market_value
    //     net_value: product.runtime.net_value, // 当日净值 runtime.net_value
    //     // 持仓数据
    //     market_value: stock.market_value, // 本股票持仓市值 //window.position_realtime里面有
    //     total_amount: stock.total_amount, // 该股票当前持仓数
    //     enable_sell_volume: 0 // 该股票能卖的数量
    //   });
    //   if (obj.code == 0) {
    //     this.error_arr[index].type = false;
    //     this.odd_arr[index] = num * price;
    //   } else {
    //     this.error_arr[index].type = true;
    //     stock.transfer_commission = obj.freeNum;
    //     this.error_arr[index].type = false;
    //     this.odd_arr[index] = obj.freeNum * price;
    //   }
    // }
  },
  wind_contrl: function wind_contrl(index, num) {
    //当行风控
    //当前可用余额
    if (num == 0) {
      return;
    }
    if (this.$root.direction == "buy") {
      var current_total_max_cash = this.my_total_max_cash;
      // let len = tbody.list_data.length;

      for (var i = 0; i < this.checkArr.length; i++) {
        if (this.checkArr[i] == true) {
          if (i != this.index) {
            current_total_max_cash -= this.odd_arr[i];
          }
        }
      }
    }
    if (num == 0) {
      this.error_arr[index] = true;
      this.error_info = '当前购买股票不足100股，请修改！';
      return;
    }
    if (num < 0) {
      this.error_arr[index] = true;
      this.error_info = '输入有误，请检查后重新输入';
      return;
    }
    var stock = this.list_data[index];
    // let price_type = this.price_method=="limit_price"?1:2;
    var price_type = 1;
    var price = stock.deal_price;
    var product = this.$root.product;
    var all_market_value = 0;
    window.risk_position[product.id].data.forEach(function (el) {
      if (el.stock_id == stock.stock_id) {
        var total_amount = el.total_amount;
        var market_value = el.market_value;
      }
      all_market_value += el.market_value - 0;
    });
    if (product) {
      var obj = riskCheck.checkRules({
        product_id: product.id, // 产品id， id
        // 交易数据 form_data
        trade_direction: this.$root.direction == "buy" ? 1 : 2, // 交易方向，1买入 2卖出 trade_direction
        trade_mode: price_type, // 1限价／2市价  trade_mode
        volume: num, // 交易数量
        price: price, // 限价金额
        surged_limit: 1, // 涨停价 price已经做了处理了
        decline_limit: 1, // 跌停价 price已经做了处理了
        stock_code: stock.stock_id.toLowerCase(), // 股票code，包含“.SZ”,比较的时候最好都进行小写转换
        stock_name: stock.stock_name, // 股票名称，用于判断st股票
        // 产品的数据 product
        total_assets: product.runtime.total_assets, // 资产总值 runtime.total_assets
        enable_cash: current_total_max_cash, // 可用资金 runtime.enable_cash
        security: all_market_value, // 持仓市值 runtime.security 改为 all_market_value
        net_value: product.runtime.net_value, // 当日净值 runtime.net_value
        // 持仓数据
        market_value: stock.market_value || 0, // 本股票持仓市值 //window.position_realtime里面有
        total_amount: stock.total_amount || 0, // 该股票当前持仓数
        enable_sell_volume: 0, // 该股票能卖的数量
        trading_unit: stock.trading_unit //每手数量
      });
      if (obj.code == 0) {
        var error_arr = new (Function.prototype.bind.apply(Array, [null].concat(_toConsumableArray(this.error_arr))))();
        error_arr[index].type = false;
        this.error_arr = error_arr;
        this.odd_arr[this.index] = num * price;
      } else {
        this.odd_arr[this.index] = num * price;
        var _error_arr = new (Function.prototype.bind.apply(Array, [null].concat(_toConsumableArray(this.error_arr))))();
        _error_arr[index].type = true;
        _error_arr[index].error_info = obj.msg + ' 当前可买数量：' + obj.freeNum + '';
        this.error_arr = _error_arr;
      }
    }
  },

  change_price_target: function change_price_target(val) {
    //批量修改目标仓位
  },
  change_price_position: function change_price_position(val) {
    //批量修改本次调仓
    //let self = this;
    this.my_total_max_cash = this.$root.total_max_cash;
    this.list_data.forEach(function (ele) {
      ele.transfer_commission = 0;
    });
    this.odd_arr.forEach(function (ele) {
      ele = 0;
    });
    this.error_arr.forEach(function (ele) {
      ele.type = false;
      ele.error_info = '';
    });
    //批量修改时 重置重大可交易金额
    //批量修改时 将委托数量 置为零
    for (var i = 0; i < this.checkArr.length; i++) {
      if (this.checkArr[i]) {

        var stock = this.list_data[i];
        var transfer_position = val / 100;
        var current_positon = stock.weight ? stock.weight : 0;
        var weight_total_assets = this.total_cash;
        var deal_price = stock.deal_price ? stock.deal_price : 0;
        var trading_unit = stock.trading_unit ? stock.trading_unit : 0;
        stock.transfer_position = val;
        if (!deal_price) {
          //成本价格为0
          continue;
        }
        var _stock_num2 = void 0; //委托数量
        if (this.$root.direction == "buy") {
          var _stock_num2 = parseInt(transfer_position * weight_total_assets / deal_price / trading_unit) * trading_unit;
        }
        if (this.$root.direction == "sell") {
          var current_amout = parseInt(stock.total_amount);
          var _stock_num2 = parseInt(transfer_position * current_amout / trading_unit) * trading_unit;
        }
        //判断委托数量是否正确
        if (_stock_num2 < 0) {
          this.error_arr[i].type = true;
          this.error_arr[i].error_info = "输入有误，请检查后重新输入";
          return;
        } else {
          this.error_arr[i].type = false;
          this.error_arr[i].error_info = "";
          stock.transfer_commission = _stock_num2;
        }
      }
    };
    this.wind_contrl_all();
  },
  change_price_total: function change_price_total(val) {
    //批量修改总资产比例调仓
    this.my_total_max_cash = this.$root.total_max_cash;
    this.list_data.forEach(function (ele) {
      ele.transfer_commission = 0;
    });
    this.odd_arr.forEach(function (ele) {
      ele = 0;
    });
    this.error_arr.forEach(function (ele) {
      ele.type = false;
      ele.error_info = '';
    });
    //批量修改时 重置重大可交易金额
    //批量修改时 将委托数量 置为零
    for (var i = 0; i < this.checkArr.length; i++) {
      if (this.checkArr[i]) {
        var total_position = val / 100;
        var stock = this.list_data[i];
        var new_price = +stock.market_value / +stock.total_amount; //根据市值计算最新价
        var last_price = +stock.last_price || 0;

        var _total_cash = this.$root.total_cash;
        var stock_num = +_total_cash * total_position / new_price;
        stock.total_position = val;
        //判断委托数量是否正确
        if (stock_num < 0) {
          this.error_arr[i].type = true;
          this.error_arr[i].error_info = "输入有误，请检查后重新输入";
          return;
        } else {
          this.error_arr[i].type = false;
          this.error_arr[i].error_info = "";
          stock.transfer_commission = stock_num;
        }
        stock.transfer_commission = parseInt(stock_num / stock.trading_unit) * stock.trading_unit;
      }
    };
    this.wind_contrl_all();
  },
  submit_result: function submit_result(res, orders) {
    // res = {
    //   "code": 0,
    //   "msg": "",
    //   "data": {
    //     "000017.SZ": {
    //       "code": 5022111,
    //       "msg": "",
    //       "data": {
    //         "msg": [
    //           "已触发风控:0329股票池禁止买入",
    //           "已触发风控(公司):0329股票池禁止买入"
    //         ],
    //         "limit_action": 0
    //       }
    //     },
    //     "000023.SZ": {
    //       "code": 5022111,
    //       "msg": "",
    //       "data": {
    //         "msg": [
    //           "已触发风控:0329股票池禁止买入",
    //           "已触发风控(公司):0329股票池禁止买入"
    //         ],
    //         "limit_action": 0
    //       }
    //     }
    //   }
    // }
    var str_deal_method = void 0;
    if (this.$root.direction == "buy") {
      str_deal_method = "买入";
    }
    if (this.$root.direction == "sell") {
      str_deal_method = "卖出";
    }
    orders.forEach(function (row) {
      if (res.code == 0) {
        row.btnType = false;
        row.msg = ["委托成功"];
        row.entrustStatus = "pass";
        row.style = {};
      } else if (res.code == 700001) {
        if (res.data[row.stock_id]) {
          var temp = res.data[row.stock_id];
          if (temp.code == 0) {
            //没问题
            row.btnType = false;
            row.msg = ["委托成功"];
            row.entrustStatus = "pass";
            row.style = {};
          } else if (temp.code == 5022111) {
            //提示性风控
            if (temp.msg == "") {
              if (temp.data.limit_action == 0) {
                //alert
                row.btnType = true;
                row.msg = temp.data.msg;
                row.entrustStatus = "alert";
                row.style = {
                  color: "#FAA11F"
                };
              } else {
                //购买失败
                row.btnType = false;
                row.entrustStatus = "fail";
                row.style = {
                  color: "red"
                };
                if (temp.msg == "") {
                  row.msg = temp.data.msg;
                } else {
                  row.msg = [temp.msg];
                }
                row.msg.unshift("委托失败");
              }
            } else {
              //购买失败
              row.btnType = false;
              row.entrustStatus = "fail";
              row.style = {
                color: "red"
              };
              if (temp.msg == "") {
                row.msg = [];
              } else {
                row.msg = [temp.msg];
              }
              row.msg.unshift("委托失败");
            }
          } else if (temp.code == 5022110) {
            row.btnType = false;
            row.msg = [temp.msg];
            row.msg.unshift("委托失败");
            row.entrustStatus = "fail";
            row.style = {
              color: "red"
            };
          } else {
            //禁止性风控
            row.btnType = false;
            if (temp.msg && temp.msg != "") {
              row.msg = [temp.msg];
            } else if (temp.data.msg) {
              row.msg = temp.data.msg;
            } else {
              row.msg = [];
            }
            row.msg.unshift("委托失败");
            row.entrustStatus = "fail";
            row.style = {
              color: "red"
            };
          }
        } else {
          row.btnType = false;
          row.entrustStatus = "pass";
          row.msg = ["委托成功"];
          row.style = {};
        }
      } else {
        //购买失败
        row.btnType = false;
        row.entrustStatus = "fail";
        row.style = {
          color: "red"
        };
        if (res.msg == "") {
          row.msg = [];
        } else {
          row.msg = [res.msg];
        }
        row.msg.unshift("委托失败");
      }
    });
    var product = this.$root.product;
    var contentChild = Vue.extend({
      data: function data() {
        this.$nextTick(function () {
          // 加处理，清空数据
          getStockList();
        });
        return {
          // tableData: orders,
          tableData: JSON.parse(JSON.stringify(orders)),
          product: product
        };
      },

      template: '\n          <div style="position:relative">\n          <span style="position: absolute;top: -36px;left: 91px;font-size:12px;">\u4EA4\u6613\u5355\u5143\uFF1A{{product.name}}</span>\n          <div class="vue-form-confirmation">\n              <table style="max-width: 600px;">\n                  <thead>\n                      <tr style="border-bottom: 1px solid rgba(0,0,0,0.05);">\n                          <th class="vue-form-confirmation__text-align-left" style="color:rgba(74,74,74,0.5);">\u8BC1\u5238</th>\n                          <th class="vue-form-confirmation__text-align-left" style="color:rgba(74,74,74,0.5);">' + str_deal_method + '\u4EF7\u683C</th>\n                          <th class="vue-form-confirmation__text-align-left" style="color:rgba(74,74,74,0.5);">' + str_deal_method + '\u6570\u91CF</th>\n                          <th class="vue-form-confirmation__text-align-left" style="color:rgba(74,74,74,0.5);">\u5907\u6CE8</th>\n\n                      </tr>\n                  </thead>\n                  <tbody>\n                      <tr  v-for="row in tableData" style="border-bottom: 1px solid rgba(0,0,0,0.05);">\n                          <td class="vue-form-confirmation__text-align-left">{{row.stock_name}}</td>\n                          <td class="vue-form-confirmation__text-align-left">{{row.price}}</td>\n                          <td class="vue-form-confirmation__text-align-left">{{row.volume}}</td>\n                          <td class="vue-form-confirmation__text-align-left vue-form-confirmation__span-center" >\n                              <div>\n                                  <span :style=row.style>\n                                      <template v-for="msg in row.msg">\n                                          {{msg}}</br>\n                                      </template>\n                                  </span>\n                                  <button type="" v-if="row.btnType" @click=btn_submit(row)>\u7EE7\u7EED\u59D4\u6258</button>\n                              </div>\n                          </td>\n                      </tr>\n                  </tbody>\n              </table>\n            </div>\n            </div>\n          ',
      methods: {
        btn_submit: function btn_submit(row) {
          //忽略提示性风控 继续购买
          var _this = this;
          var orders = [row];
          var url = (window.REQUEST_PREFIX || '') + '/oms/workflow/' + product.id + '/add_multi_hand_order';
          $.post(url, {
            multi: orders,
            ignore_tips: 1
          }).done(function (res) {
            if (res.code != 0) {
              if (res.data == '') {
                row.btnType = false;
                row.entrustStatus = "pass";
                row.msg = [];
                row.msg.unshift('委托成功');
                row.style = {};
              } else {
                var tmpObj = res.data[row.stock_id];
                if (0 == tmpObj.code) {
                  row.btnType = false;
                  row.entrustStatus = "pass";
                  row.msg = [];
                  row.msg.unshift('委托成功');
                  row.style = {};
                } else {
                  row.btnType = false;
                  row.entrustStatus = "fail";
                  row.msg = [];
                  row.msg.unshift(tmpObj.msg);
                  row.msg.unshift('委托失败');
                  row.style = {
                    color: "red"
                  };
                }
              }
            } else {
              row.btnType = false;
              row.entrustStatus = "pass";
              row.msg = [];
              row.msg.unshift('委托成功');
              row.style = {};
            }
            _this.tableData = Object.assign({}, _this.tableData);
          }).fail(function () {
            row.btnType = false;
            row.msg = ["委托失败"];
            row.entrustStatus = "fail";
            row.style = {
              color: "red"
            };
            _this.tableData = Object.assign({}, _this.tableData);
          });
        }
      },
      mounted: function mounted() {
        $.clearLoading();
      }
    });

    Vue.prototype.$confirm({
      title: '委托结果',
      content: contentChild,
      closeIcon: true
    });
  },
  update_entrust_info: function update_entrust_info() {
    var _this3 = this;

    //更新委托数量
    var entrust_info = window.entrust_info ? window.entrust_info : [];
    var self = this;
    if (entrust_info.length != 0) {
      this.list_data.forEach(function (stock) {
        stock.current_entrust = 0;
        stock.entrust_buy_num = 0;
        stock.entrust_buy_money = 0;
        stock.entrust_sell_num = 0;
        stock.entrust_sell_money = 0;
        entrust_info.forEach(function (entrust) {
          if (entrust.stock.code == stock.stock_id && entrust.product_id == self.$root.product.id && (![4, 5, 7, 8, 9].some(function (ele) {
            return entrust.status == ele;
          }) || entrust.status == 4 && !/1|2/.test(entrust.cancel_status))) {
            if ('buy' == self.$root.direction && 1 == entrust.entrust.type) {

              stock.entrust_buy_num += entrust.entrust.amount - entrust.deal.amount;
              stock.entrust_buy_money += (entrust.entrust.amount - entrust.deal.amount) * entrust.entrust.price;
            } else if ('sell' == self.$root.direction && 2 == entrust.entrust.type) {
              stock.entrust_sell_num += entrust.entrust.amount - entrust.deal.amount;
              stock.entrust_sell_money += (entrust.entrust.amount - entrust.deal.amount) * entrust.entrust.price;
            }
          }
        });
        // 修改当前委托数量为  买入数量或者卖出数量的最大值
        stock.current_entrust = Math.max(stock.entrust_buy_num, stock.entrust_sell_num);

        if (_this3.$root.direction == "buy") {
          // stock.target_position = stock.target_position || 0;
          // stock.target_position = parseFloat(stock.target_position);
          // stock.total_amount = (stock.total_amount || 0)

          // if (stock.total_amount) {
          //   stock.target_position = (stock.total_amount + stock.entrust_sell_num) * stock.weight / stock.total_amount;
          // } else {
          //   stock.target_position = 0.00;
          // }
          // stock.target_position = (stock.target_position * 100).toFixed(2);
        } else {
            // stock.target_position = stock.target_position || 0;
            // stock.target_position = parseFloat(stock.target_position)
            // stock.total_amount = stock.total_amount || 0
            // stock.target_position = (stock.total_amount - stock.entrust_sell_num) * stock.weight / stock.total_amount;
            // stock.target_position = (stock.target_position * 100).toFixed(2);
          }
      });
    } else {}
    //触发滚动事件 出现滚动条
    this.$nextTick(function () {
      setTimeout(function () {
        $(window).scroll();
      });
    });
  }
}), _Vue$component));

Vue.component('vue-error-ele', {
  props: ["isshow", "error_info", "delete_show"],
  template: '\n    <div class="error-box">\n      <div class="error-info" v-show=isshow><span>\u98CE\u9669\u63D0\u793A\uFF1A</span>{{error_info}}</div>\n      <span v-if=delete_show class="dele_icon" @click="delete_stock"></span>\n    </div>\n  ',
  methods: {
    delete_stock: function delete_stock() {
      this.$emit('delete_stock');
    }
  }
});

// 自选股功能，又夹杂了交易相关功能。
// 分析评价by：liuzeyafzy@gmail.com
// 问题1: $refs来操作dom，导致不好被跟踪定位，严重影响定位解决问题的效率
// 问题2: 此组件使用了子组件“vue-cell-default”，或者是命名，或者是理解不对。此组件明明只需要多个下拉框而已，却使用带表格cell含义的vue-cell-default
Vue.component('vue-foot-inner', {
  props: ["error_type", "direction", "radio_type"],
  template: '\n    <div class="foot-inner" style="display: flex;">\n      <div class="add_stock" v-show="direction == \'buy\'" style="padding-left: 24px;clear: both;">\n        <input id="add_stock_code" style="padding: 0 5px;border-radius: 3px;border: 1px solid #ccc;" :value="displayStockCode(stock_code)" placeholder="\u8F93\u5165\u80A1\u7968\u4EE3\u7801 ..." pattern="^(d{6}.(SZ|SH)|d{5}.(HK))$" focus-class="active" active-slide="#magic-suggest" >\n        <div class="magic-suggest-wrap" data-src="|getMagicSuggest" display="none"></div>\n        <button @click="addStock">\u6DFB\u52A0</button>\n      </div>\n\n      <div class="modify_stock" style="flex: 1;text-align: right;">\n        <template v-if="direction==\'sell\'">\n          <label @click="radio_change(\'total\')">\n            <input style="border-radius: 3px;" name="modify_method" type="radio" checked />\n            \u6309\u540C\u7B49\u603B\u8D44\u4EA7\u6BD4\u4F8B\n            <vue-cell-default :header_data="{class: \'vue_text_default\'}" ref="total" placeholder="\u8BF7\u8F93\u5165\u6BD4\u4F8B" @input_blur="input_blur" showtype="input_percentage" index="none" name="change_price_total" checktype="true" class_name="vue_input_default"></vue-cell-default>\n          </label>\n          <label>\n            <input style="border-radius: 3px;" name="modify_method" type="radio" @click="radio_change(\'equal\')" />\n            \u6309\u540C\u7B49\u6301\u4ED3\u6BD4\u4F8B\n            <vue-cell-default :header_data="{class: \'vue_text_default\'}" ref="equal" placeholder="\u8BF7\u8F93\u5165\u6BD4\u4F8B" @input_blur="input_blur" showtype="input_percentage" index="none" name="change_price_position" checktype="true" class_name="vue_input_default"></vue-cell-default>\n          </label>\n        </template>\n        <template v-if="direction==\'buy\'">\n          <label @click="radio_change(\'equal\')">\n            <input name="modify_method" type="radio" style="display:none;border-radius: 3px;"/>\n            \u6309\u540C\u7B49\u603B\u8D44\u4EA7\u6BD4\u4F8B\n            <vue-cell-default :header_data="{class: \'vue_text_default\'}" placeholder="\u8BF7\u8F93\u5165\u6BD4\u4F8B" @input_blur="input_blur" showtype="input_percentage" index="none" name="change_price_position" checktype="true" class_name="vue_input_default"></vue-cell-default>\n          </label>\n        </template>\n      </div>\n\n      <div class="form_stock" style="margin-right: 20px;clear: both;">\n        <button v-show="direction==\'buy\'" class="delal_btn_buy" @click="submit_list">\u6279\u91CF\u4E70\u5165</button>\n        <button v-show="direction!=\'buy\'" class="delal_btn_sell" @click="submit_list">\u6279\u91CF\u5356\u51FA</button>\n        <button class="adjustment_btn" @click="onec_adjustment" style="display:none">\u4E00\u952E\u8C03\u4ED3</button>\n        <span v-show="error_type">\u8BF7\u4FEE\u6539\u89E6\u53D1\u98CE\u63A7\u7684\u80A1\u7968</span>\n      </div>\n\n    </div>\n  ',
  data: function data() {
    return {
      set_amount_type: "part",
      equal_show: false,
      target_show: false,
      stock_code: ''
    };
  },
  watch: {
    radio_type: function radio_type(name) {
      if (this.$root.direction != "buy") {
        this.$nextTick(function () {
          if (name == "total") {
            this.$refs.total.my_showtype = "input";
            this.$refs.equal.my_showtype = "readyonly";
            this.$refs.equal.readyonly_placeholder = "请输入比例";
            this.$refs.equal.input_val = '';
          }
          if (this.$root.direction == "sell") {
            if (name == "equal") {
              this.$refs.equal.my_showtype = "input";
              this.$refs.total.my_showtype = "readyonly";
              this.$refs.total.readyonly_placeholder = "请输入比例";
            }
          }
          this.$refs.equal.input_val = '';
          this.$refs.total.input_val = '';
        });
      }
    }
  },
  methods: {
    displayStockCode: function displayStockCode(val) {
      if ('marketA' == market) {
        return val;
      } else if ('marketHSH' == market) {
        return val.replace('SH', '');
      } else if ('marketHSZ' == market) {
        return val.replace('SZ', '');
      }
    },
    input_blur: function input_blur(name, val) {
      if (name == "change_price_target") {
        this.$emit("change_price_target", val);
      }
      if (name == "change_price_position") {
        this.$emit("change_price_position", val);
      }
      if (name == "change_price_total") {
        this.$emit('change_price_total', val);
      }
    },

    radio_change: function radio_change(name) {
      //切换input状态为只读
      if (name == "total") {
        this.$emit('change_radio_type', "total");
      }

      if (name == "equal") {
        this.$emit('change_radio_type', "equal");
      }
    },
    addStock: function addStock() {
      var _this = this;
      if (!this.stock_code.length) {
        $.omsAlert('股票代码不正确！', false);
        return;
      }
      var stock_id = this.stock_code;
      var url = (window.REQUEST_PREFIX || '') + '/user/stock-follow/add';

      $.post(url, {
        stock_id: this.stock_code
      }).done(function (res) {
        if (res.code == 0) {
          $.omsAlert('添加自选股 ' + stock_id + ' 成功！');
          var tmpLi = $('.multi-stocks-section').find('.magic-suggest>li');
          var stock_name = '';
          tmpLi.each(function () {
            var arr = $(this).html().split(' &nbsp; ');
            if (arr[0] == stock_id) {
              stock_name = arr[1];
            }
          });
          $(window).trigger({
            type: 'create_order:multi_stocks:add_stock',
            stock: {
              stock_id: stock_id,
              stock_name: stock_name
            }
          });
          _this.stock_code = '';
        } else {
          res.code == 502204 ? $.omsAlert(res.msg, false) : $.failNotice(url, res);
        }
      }).fail($.failNotice.bind(null, url)).always(function () {});
    },
    submit_list: function submit_list() {
      //跳转到tbody执行 委托确认
      this.$emit('submit_list');
    },
    onec_adjustment: function onec_adjustment() {
      //tobody处理意见调仓
      this.$emit('adjustment');
    }
  },
  mounted: function mounted() {
    this.$on('addStock', 'addStock');
    var self = this;
    $(function () {
      $('.multi-stocks-section').find('.magic-suggest-wrap').render();
      $('.multi-stocks-section').on('stock_code:suggest', function (event) {
        var stock = event.stock;

        $('.multi-stocks-section').find('#add_stock_code').val(stock.stock_code + '.' + stock.exchange.slice(0, 2)).change();
        self.stock_code = stock.stock_id;
      });
    });
    $(window).on('stock:add_follow', function (event) {
      var stock = event.stock;
      // $('.multi-stocks-section').find('input').val(stock.stock_id).change();
      // self.stock_code = stock.stock_id;
      // self.$emit('addStock');
      var url = (window.REQUEST_PREFIX || '') + '/user/stock-follow/add';
      var stock_id = stock.stock_id;
      var stock_name = stock.stock_name;
      $.post(url, {
        stock_id: stock_id
      }).done(function (res) {
        if (res.code == 0) {
          $.omsAlert('添加自选股 ' + stock_id + ' 成功！');
          $(window).trigger({
            type: 'create_order:multi_stocks:add_stock',
            stock: {
              stock_id: stock_id,
              stock_name: stock_name
            }
          });
        } else {
          res.code == 502204 ? $.omsAlert(res.msg, false) : $.failNotice(url, res);
        }
      }).fail($.failNotice.bind(null, url)).always(function () {});
    });

    $(window).on('order_create:market:changed', function (event) {
      var market = event.market; //修改股票市场
      $('.multi-stocks-section').find('input#add_stock_code').attr('data-market', market);
      $('.multi-stocks-section').find('.magic-suggest-wrap').render();
    });
    // 切换交易方式，重新获取自选股数据
    $(window).on('order_create:deal_method:changed', function (event) {
      // 此处使用全局的market
      $('.multi-stocks-section').find('input#add_stock_code').attr('data-market', market);
      $('.multi-stocks-section').find('.magic-suggest-wrap').render();
    });
  }
});

// 类似于入口函数
// 分析评价by：liuzeyafzy@gmail.com
// 问题1: "vm_multi || multiViewUpdate()" 不应该这种使用方式来调用，应该使用显示的if判断来处理。不是说能写这样的代码能看懂这样的代码就牛的。
// 问题2: 在我看来，使用vm_multi赋值给全局变量已经是一个不应该的事情了，更何况使用了这些全局变量变量：total_cash、direction、product、total_max_cash、product等。既然使用了函数扩起来，就该用传入参的方式来处理。
// 问题3: 不推荐使用“this.delete_show = val == "buy" ? true : false;”这样的写法。
// 问题4: 使用了“update5”的函数，函数中修改vm_multi的数据过于频繁了，其实可以在“update5”中拼好了再赋值给vm_multi的。
// 问题5: 按我的理解，此root组件与vue-multi-tbody的数据交互，不需要传delete_show的，而应该传direction就可以了。这个root组件为什么要理解delete_show呢？把交易方向交给tbody组件，甚至于交给tr组件，再让子组件自己去判断就好了。感觉父子组件数据传输的逻辑关系不清晰。radio_type同理
// 问题6: onec_adjustment这种一键调仓的功能去掉了就删掉，至少注释掉。
function multiViewUpdate() {
  vm_multi = new Vue({
    el: "[batch-deal-view]",
    data: _defineProperty({
      "table_data": [],
      "stock_list": [],
      "total_cash": total_cash,
      "direction": direction,
      "error_type": false,
      "product": product,
      "total_max_cash": total_max_cash,
      "change_price_position_value": 0,
      "change_price_target_value": 0,
      "change_price_total_value": 0,
      "amount_type": 'part',
      "delete_show": true,
      "header_tr": '',
      "radio_type": ''
    }, 'product', product),
    template: '\n      <div id="batch_section">\n        <div class="buy multi-stocks-section" >\n          <div style="padding-bottom: 20px;">\n            <div id="multi_table_batch_buy" >\n              <div class="section-loading loading-loading"></div>\n              <vue-multi-tbody :radio_type=radio_type :header_data=table_data  :delete_show=delete_show ref="tbody" :change_price_target=change_price_target :change_price_position=change_price_position :list_data=stock_list :total_cash="total_cash" :total_max_cash="total_max_cash" :direction="direction"></vue-multi-tbody>\n            </div>\n          </div>\n          <div class="multi_footer">\n            <vue-foot-inner :radio_type=radio_type @change_radio_type=change_radio_type :error_type="error_type" :direction="direction" @change_amount_type=change_amount_type @submit_list=submit_list @adjustment=adjustment @change_price_target=change_price_target @change_price_position=change_price_position @change_price_total=change_price_total></vue-foot-inner>\n          </div>\n        </div>\n      </div>\n    ',
    watch: {
      stock_list: function stock_list(val) {
        var _stock_list = this.stock_list;

        if (_stock_list.length > 0) {
          var requset = [];
          this.stock_list.forEach(function (ele, index) {
            requset.push(ele.stock_id);
          });
          requset = requset.join(",");

          update5(requset);
        }
      },
      direction: function direction(val) {
        this.delete_show = val == "buy" ? true : false;
        if (val == "sell") {
          this.radio_type = "total";
        } else {
          this.radio_type = '';
        }
      }
    },
    methods: {
      submit_list: function submit_list() {
        this.$refs.tbody.submit_stock_tbody();
      },
      adjustment: function adjustment() {
        this.$refs.tbody.onec_adjustment();
      },
      change_price_position: function change_price_position(val) {
        this.change_price_position_value = val;
        this.$refs.tbody.change_price_position(val);
      },
      change_price_target: function change_price_target(val) {
        this.change_price_target_value = val;
        this.$refs.tbody.change_price_target(val);
      },
      change_price_total: function change_price_total(val) {
        this.change_price_total_value = val;
        this.$refs.tbody.change_price_total(val);
      },
      change_amount_type: function change_amount_type(val) {
        this.amount_type = val;
      },
      change_radio_type: function change_radio_type(val) {
        this.radio_type = val;
      }
    }
  });
}
//# sourceMappingURL=batchdeal.js.map
