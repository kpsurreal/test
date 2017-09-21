'use strict';

// 依赖jquery，不想依赖就自己把ajax方法用原生代码改写。
// 依赖moment，不想依赖就自己算小时数。
// 依赖于risk_rules.js
// 此处将股票及风控信息准备好，再通过调用risk_rules.js里面的方法进行计算
// risk_rules.js里面每个方法返回的结构为：
// obj = {
//   code: 0,
//   action: 0,
//   num: 100,
//   msg: '',
//   ruleType: '',
//   list: [{
//     code: 0,
//     action: 0,
//     num: 100,
//     msg: '',
//     ruleType: ''
//   }]
// }
// 为什么会list里面还包含一层同样结构，以单票持仓限制为例，某个股票可能属于多个股票池，a股票池可买数量是100，处理方式是提示，b股票池可买50，处理方式是禁止
// 此时list内可以保存详细的校验信息，外层则需要将list内的所有数据合并，取满足所有规则的最大数量。

// 定义，风控控制模块
function RiskController() {
  var rulesData = {};
  this.getRulesData = function (ids, callback) {
    //各种办法得到风控规则数据
    $.ajax({
      // url: '/rms-pub/rule/get_product_risk_brief',
      url: window.REQUEST_PREFIX + '/oms/helper/risk_rules',
      type: 'get',
      data: {
        product_id: ids
      },
      success: function success(res) {
        if (res.data) {
          //因为接口问题，不以code作为判断条件
          // res.data返回值形如
          // data: {'11889': {code:0, msg: '', data:{ rules: {target: [], wholePosition: [], onePosition: [], placards: [], controTrade: [], placardsCo: [], controTradeCo: []} } } }
          rulesData = res.data;
          if (Object.prototype.toString.call(callback) === '[object Function]') {
            callback.call();
          }
        } else {
          // 获取失败也不需要提示了，后续检测的时候（仅当rulesInfo还是空对象的时候）会知道的。
        }
      },
      error: function error() {
        // 获取失败也不需要提示了，后续检测的时候（仅当rulesInfo还是空对象的时候）会知道的。
      }
    });
  };

  var stockPoolData;
  var stockPoolList;
  this.getStockPoolData = function (callback) {
    $.ajax({
      url: '/rms-pub/stock_pool/get_list',
      type: 'get',
      success: function success(res) {
        if (0 == res.code) {
          // res.data返回值形如
          // data: {"code":0,"msg":"","data":[{"id":"-1","pool_name":"全部股票","pool_type":"0"}]}
          // stockPoolData从两个接口获取数据，这样就可能存在只从一个接口获取了数据的情况，所以，需要保存并计算
          stockPoolData = res.data;
          stockPoolList && Object.keys(stockPoolList).forEach(function (e) {
            stockPoolData.forEach(function (el) {
              if (el.id == e) {
                el.list = stockPoolList[e];
              }
            });
          });
          var ids = [];
          res.data.forEach(function (e) {
            ids.push(e.id);
          });
          $.ajax({
            url: '/rms-pub/stock_pool/get_stock_list',
            type: 'get',
            data: {
              pool_id: ids.join(',')
            },
            success: function success(res) {
              if (0 == res.code) {
                stockPoolList = res.data;
                Object.keys(stockPoolList).forEach(function (e) {
                  stockPoolData.forEach(function (el) {
                    if (el.id == e) {
                      el.list = stockPoolList[e];
                    }
                  });
                });
                if (Object.prototype.toString.call(callback) === '[object Function]') {
                  callback.call();
                }
              } else {
                // 获取失败也不需要提示了，后续检测的时候（仅当stockPoolData还是空对象的时候）会知道的。
              }
            },
            error: function error() {
              // 获取失败也不需要提示了，后续检测的时候（仅当stockPoolData还是空对象的时候）会知道的。
            }
          });
        } else {
          // 获取失败也不需要提示了，后续检测的时候（仅当stockPoolData还是空对象的时候）会知道的。
        }
      },
      error: function error() {}
    });
  };

  var feeData;
  this.getFeeData = function (ids, callback) {
    $.ajax({
      url: window.REQUEST_PREFIX + '/portfolio/multi-fee-list',
      data: {
        product_id: ids.join(',')
      },
      success: function success(res) {
        if (0 == res.code) {
          feeData = res.data;
        } else {
          $.omsAlert(res.msg);
        }
        if (Object.prototype.toString.call(callback) === '[object Function]') {
          callback.call();
        }
      },
      error: function error() {
        $.failNotice();
      }
    });
  };
  // // 获取满足风控的可用资金
  // this.getRiskCash = function(stockInfo){
  //   var rulesInfo = rulesData[stockInfo.product_id];

  this.checkFee = function (stock_code, balance, price, product_id) {

    return riskRules.doCheckFee(stock_code, balance, price, feeData[product_id]);
  };

  this.calFeeTotal = function (stock_code, balance, price, product_id, volume) {
    return riskRules.calFeeTotal(stock_code, balance, price, feeData[product_id], volume);
  };

  // };
  // 单股票检测
  this.checkRules = function (stockInfo) {
    var rtn = {};
    // 当设置为后端风控时，直接返回
    if (localStorage.getItem('____be_risk_check____')) {
      return {
        code: 0,
        msg: '后端风控',
        num: Infinity,
        dstNum: stockInfo.volume,
        freeNum: Infinity
      };
    }

    // 判断是否得到了风控规则数据
    if (Object.keys(rulesData).length == 0) {
      rtn = {
        code: 20002,
        msg: '暂无风控规则数据',
        num: 0
      };
      return rtn;
    }

    // 判断是买入风控还是卖出风控
    var rules = {};
    rules.code = rulesData[stockInfo.product_id].code;
    rules.msg = rulesData[stockInfo.product_id].msg;
    rules.data = {};
    rules.data.rules = Object.assign({}, rulesData[stockInfo.product_id].data.rules, rulesData[-1].data.rules);

    if (Number(stockInfo.trade_direction) == 1) {
      // rtn = this.checkBuyRules(stockInfo, rulesData[stockInfo.product_id]);
      rtn = this.checkBuyRules(stockInfo, rules);
    } else if (Number(stockInfo.trade_direction) == 2) {
      // rtn = this.checkSellRules(stockInfo, rulesData[stockInfo.product_id]);
      rtn = this.checkSellRules(stockInfo, rules);
    } else {
      rtn = {
        code: 20001,
        msg: '买入卖出方向异常',
        num: 0
      };
    }

    return rtn;
  };
  // 仅进行黑名单检测，查看是否在黑名单内
  // 拖动条的处理逻辑是：先进行黑名单检测，再降可用资金分配给所有通过检测的数据中。
  // 入参：product_id产品id；股票code；股票名称 //内置股票池的判断需要用到
  this.getTargetStatus = function (stockInfo) {
    // 判断是否得到了风控规则数据
    if (Object.keys(rulesData).length == 0) {
      return false;
    }

    var rules = {
      customPool: stockPoolData,
      target: rulesData[stockInfo.product_id].data.rules['target']
    };
    var rtn = independentTargetCheck.getStatus(stockInfo, rules);
    return rtn;
  };
  // 仅获取向下仓位限制信息
  this.getPositionInfo = function (stockInfo, rulesInfo) {
    // 判断是否得到了风控规则数据
    if (Object.keys(rulesData).length == 0) {
      return false;
    }

    var rules = {
      wholePosition: rulesData[stockInfo.product_id].data.rules['wholePosition']
    };
    var rtn = independentWholePositionCheck.getPositionInfo(stockInfo, rules);
    return rtn;
  };
  // 仅进行整体仓位控制校验，获取复合风控的最大的可用资金
  // 入参：total_assets资产总值；net_value净值；product_id产品id
  this.getMaxCash = function (stockInfo) {
    // 判断是否得到了风控规则数据
    if (Object.keys(rulesData).length == 0) {
      return 0;
    }
    var rules = {
      wholePosition: rulesData[stockInfo.product_id].data.rules['wholePosition']
    };
    var rtn = independentWholePositionCheck.getMaxCash(stockInfo, rules);
    return rtn;
  };
  // 新增支持告警提示，所以，this.checkWholePosition这样的函数返回值不再是一个obj了，而是一个数组，至少包含禁止规则计算的数量和提示规则计算的数量
  // 除checkBalance 和 checkCanSellVolume 这两个风控方法可以懒得改成数组，但为了便于理解 与维护，都要改！
  this.checkBuyRules = function (stockInfo, rulesInfo) {
    var rtn = [];
    // rtn.push(this.checkBalance(stockInfo, rulesInfo));
    // rtn.push(this.checkWholePosition(stockInfo, rulesInfo));
    // rtn.push(this.checkOnePosition(stockInfo, rulesInfo));
    // rtn.push(this.checkTarget(stockInfo, rulesInfo));
    // // rtn.push(this.checkTimeArea(stockInfo, rulesInfo)); // 禁止时间段已经不处理了。

    this.checkBalanceIndependent(stockInfo, rulesInfo).forEach(function (e) {
      rtn.push(e);
    });
    this.checkWholePositionIndependent(stockInfo, rulesInfo).forEach(function (e) {
      rtn.push(e);
    });
    this.checkOnePositionIndependent(stockInfo, rulesInfo).forEach(function (e) {
      rtn.push(e);
    });
    this.checkTargetIndependent(stockInfo, rulesInfo).forEach(function (e) {
      rtn.push(e);
    });

    // 新增，举牌风控
    this.checkPlacardsIndependent(stockInfo, rulesInfo).forEach(function (e) {
      rtn.push(e);
    });

    // 新增，对敲风控
    this.checkControTradeIndependent(stockInfo, rulesInfo).forEach(function (e) {
      rtn.push(e);
    });

    // 新增，联合风控，举牌风控
    this.checkPlacardsUnion(stockInfo, rulesInfo).forEach(function (e) {
      rtn.push(e);
    });

    // 新增，联合风控，对敲风控
    this.checkControTradeUnion(stockInfo, rulesInfo).forEach(function (e) {
      rtn.push(e);
    });

    return this.calcRtn(rtn);
  };
  this.checkSellRules = function (stockInfo, rulesInfo) {
    var rtn = [];
    // rtn.push(this.checkCanSellVolume(stockInfo, rulesInfo));

    this.checkCanSellVolumeIndependent(stockInfo, rulesInfo).forEach(function (e) {
      rtn.push(e);
    });

    // 新增，对敲风控
    this.checkControTradeIndependent(stockInfo, rulesInfo).forEach(function (e) {
      rtn.push(e);
    });

    // 新增，联合风控，对敲风控
    this.checkControTradeUnion(stockInfo, rulesInfo).forEach(function (e) {
      rtn.push(e);
    });

    return this.calcRtn(rtn);
  };

  this.checkBalanceIndependent = function (stockInfo, rulesInfo) {
    // 准备参数，只传需要用到的数据
    var price = Infinity;
    if (1 == Number(stockInfo.trade_mode)) {
      price = stockInfo.price;
    } else if (2 == Number(stockInfo.trade_mode)) {
      price = stockInfo.surged_limit; // 涨停价 该风控只在买入时判断，所以用涨停价即可
    }

    var stock = {
      trading_unit: stockInfo.trading_unit,
      product_id: stockInfo.product_id,
      stock_code: stockInfo.stock_code, // 股票代码，因为需要判断类型从而算费用而新增
      balance: stockInfo.enable_cash, // 可用资金
      price: price, // 价格
      dstNum: stockInfo.volume // 数量
    };

    var rules = {
      // 无需风控规则
      feeData: feeData[stockInfo.product_id]
    };

    var rtnArr = independentBalanceCheck.check(stock, rules);

    // // 价格为0，实际上计算不出最大可买数量，所以freeNum人为设置为0
    // if (0 == price) {
    //   rtn.freeNum = 0;
    // }

    return rtnArr;
  };
  this.checkWholePositionIndependent = function (stockInfo, rulesInfo) {
    // 准备参数，只传需要用到的数据
    var price = Infinity;
    if (1 == Number(stockInfo.trade_mode)) {
      price = stockInfo.price;
    } else if (2 == Number(stockInfo.trade_mode)) {
      price = stockInfo.surged_limit; // 涨停价 该风控只在买入时判断，所以用涨停价即可
    }

    var stock = {
      trading_unit: stockInfo.trading_unit,
      total_assets: stockInfo.total_assets, // 资产总值
      stock_code: stockInfo.stock_code, // 股票代码，因为需要判断类型从而算费用而新增
      price: price, // 价格
      dstNum: stockInfo.volume, // 数量
      security: stockInfo.security, // 持仓市值
      net_value: stockInfo.net_value // 当日净值
    };

    var rules = {
      feeData: feeData[stockInfo.product_id], //因为前端风控预扣费用，新增
      wholePosition: rulesInfo.data.rules['wholePosition']
    };
    var rtnArr = independentWholePositionCheck.check(stock, rules);

    // // 价格为0，实际上计算不出最大可买数量，所以freeNum人为设置为0
    // if (0 == price) {
    //   rtn.freeNum = 0;
    // }

    return rtnArr;
  };
  this.checkOnePositionIndependent = function (stockInfo, rulesInfo) {
    // 准备参数，只传需要用到的数据
    var price = Infinity;
    if (1 == Number(stockInfo.trade_mode)) {
      price = stockInfo.price;
    } else if (2 == Number(stockInfo.trade_mode)) {
      price = stockInfo.surged_limit; //涨停价 该风控只在买入时判断，所以用涨停价即可
    }

    var stock = {
      trading_unit: stockInfo.trading_unit,
      stock_name: stockInfo.stock_name, // 股票名称
      stock_code: stockInfo.stock_code, // 股票id
      total_assets: stockInfo.total_assets, // 资产总值
      price: price, // 价格
      dstNum: stockInfo.volume, // 数量
      market_value: stockInfo.market_value // 持仓市值
    };

    var rules = {
      customPool: stockPoolData,
      feeData: feeData[stockInfo.product_id], //因为前端风控预扣费用，新增
      onePosition: rulesInfo.data.rules['onePosition']
    };
    var rtnArr = independentOnePositionCheck.check(stock, rules);

    // // 价格为0，实际上计算不出最大可买数量，所以freeNum人为设置为0
    // if (0 == price) {
    //   rtn.freeNum = 0;
    // }

    return rtnArr;
  };
  this.checkTargetIndependent = function (stockInfo, rulesInfo) {
    // 准备参数，只传需要用到的数据
    var stock = {
      trading_unit: stockInfo.trading_unit,
      dstNum: stockInfo.volume, // 数量
      stock_name: stockInfo.stock_name, // 股票名称
      stock_code: stockInfo.stock_code // 股票id
    };
    var rules = {
      customPool: stockPoolData,
      target: rulesInfo.data.rules['target']
    };
    var rtnArr = independentTargetCheck.check(stock, rules);
    return rtnArr;
  };
  this.checkTimeArea = function (stockInfo, rulesInfo) {
    // 准备参数，只传需要用到的数据
    var stock = {
      trading_unit: stockInfo.trading_unit,
      dstNum: stockInfo.volume, // 数量
      // 需要时间数据
      time_h: moment().hours()
    };
    var rules = {
      // 暂时后台没有返回时间风控规则，TODO
    };
    var rtnArr = timeAreaCheck.check(stock, rules);
    return rtnArr;
  };
  this.checkCanSellVolumeIndependent = function (stockInfo, rulesInfo) {
    // 准备参数，只传需要用到的数据
    var stock = {
      trading_unit: stockInfo.trading_unit,
      dstNum: stockInfo.volume, // 数量
      enable_sell_volume: stockInfo.enable_sell_volume // 能出售数量
    };
    var rules = {
      // 不需要风控规则
    };
    var rtnArr = independentCanSellVolumeCheck.check(stock, rules);
    return rtnArr;
  };
  // 新增，独立风控，举牌风控
  this.checkPlacardsIndependent = function (stockInfo, rulesInfo) {
    // 准备参数，只传需要用到的数据
    var stock = {
      // trading_unit: stockInfo.trading_unit,
      stock_code: stockInfo.stock_code,
      dstNum: stockInfo.volume,
      stock_position_num: stockInfo.stock_position_num,
      stock_entrust_num: stockInfo.stock_entrust_num,
      stock_total_share: stockInfo.stock_total_share
    };
    var rules = {
      placards: rulesInfo.data.rules['placards']
    };
    var rtnArr = independentPlacardsCheck.check(stock, rules);
    return rtnArr;
  };
  // 新增，独立风控，对敲风控
  this.checkControTradeIndependent = function (stockInfo, rulesInfo) {
    var stock = {
      trade_direction: stockInfo.trade_direction,
      dstNum: stockInfo.volume,
      stock_entrust_buy_num: stockInfo.stock_entrust_buy_num,
      stock_entrust_sell_num: stockInfo.stock_entrust_sell_num
    };
    var rules = {
      controTrade: rulesInfo.data.rules['controTrade']
    };
    var rtnArr = independentControTradeCheck.check(stock, rules);
    return rtnArr;
  };
  // 新增，联合风控，举牌风控
  this.checkPlacardsUnion = function (stockInfo, rulesInfo) {
    var stock = {
      stock_code: stockInfo.stock_code,
      dstNum: stockInfo.volume,
      stock_all_position_num: stockInfo.stock_all_position_num,
      stock_all_entrust_num: stockInfo.stock_all_entrust_num,
      stock_total_share: stockInfo.stock_total_share
    };
    var rules = {
      placardsCo: rulesInfo.data.rules['placardsCo']
    };
    var rtnArr = unionPlacardsCheck.check(stock, rules);
    return rtnArr;
  };
  // 新增，联合风控，对敲风控
  this.checkControTradeUnion = function (stockInfo, rulesInfo) {
    var stock = {
      trade_direction: stockInfo.trade_direction,
      dstNum: stockInfo.volume,
      stock_all_entrust_buy_num: stockInfo.stock_all_entrust_buy_num,
      stock_all_entrust_sell_num: stockInfo.stock_all_entrust_sell_num
    };
    var rules = {
      controTradeCo: rulesInfo.data.rules['controTradeCo']
    };
    var rtnArr = unionControTradeCheck.check(stock, rules);
    return rtnArr;
  };

  // 归纳计算各个风控规则的返回值。
  // dstNum表示的是目标数量。
  // num表示的是实际可以成交的数量。正常范围是0-dstNum.
  // freeNum表示的是最大可成交数量。有个问题就是有些风控是告警提示的类型，在计算时会将freeNum设置为较小的值，超过这个值其实也可以。
  // 所以，应该修改下底层的freeNum计算方式，只取limitAction为1的freeNum的值，再看有没有freeNum比这个值小，有就修改错误码
  this.calcRtn = function (obj) {
    // var freeNum = Infinity;
    // var num = Infinity;
    // var dstNum = '';
    // var limitAction = '';
    // var msg = '';
    // var ruleType = '';
    // var code = '';
    // var max_cash = Infinity;
    // obj.forEach(function(e){
    //   if (e.num <= num) {
    //     num = e.num;
    //     freeNum = e.freeNum; // Math.min(e.freeNum, freeNum);
    //     max_cash = e.max_cash; // Math.min(e.max_cash, max_cash);
    //     dstNum = e.dstNum;
    //     limitAction = e.limitAction;
    //     msg = e.msg;
    //     ruleType = e.ruleType;
    //     code = e.code;
    //   }
    // });

    // var rtn = {
    //   code: code,
    //   num: num,
    //   max_cash: max_cash,
    //   freeNum: freeNum,
    //   dstNum: dstNum,
    //   limitAction: limitAction,
    //   msg: msg,
    //   ruleType: ruleType,
    //   list: obj
    // };

    var tmpArr = [{
      limitAction: 0
    }, {
      limitAction: 1
    }];
    tmpArr.forEach(function (el) {
      var freeNum = Infinity;
      var num = Infinity;
      var dstNum = '';
      var limitAction = el.limitAction;
      var msg = '';
      var ruleType = '';
      var code = '';
      var max_cash = Infinity;

      obj.forEach(function (e) {
        // if (e.num <= num && e.limitAction == el.limitAction) {
        if (e.freeNum <= freeNum && e.limitAction == el.limitAction) {
          num = e.num;
          freeNum = Math.min(e.freeNum, freeNum);
          max_cash = Math.min(e.max_cash, max_cash);
          dstNum = e.dstNum;
          limitAction = e.limitAction;
          msg = e.msg;
          ruleType = e.ruleType;
          code = e.code;
        }
      });

      el.code = code;
      el.num = num;
      el.max_cash = max_cash;
      el.freeNum = freeNum;
      el.dstNum = dstNum;
      el.msg = msg;
      el.ruleType = ruleType;
      el.limitAction = limitAction;
    });

    var rtn = {
      list: obj, // 透传具体每个风控校验后得到的结果
      actionList: tmpArr // 不同预警操作的计算后得到的列表
    };

    tmpArr.forEach(function (e) {
      if (1 == e.limitAction) {
        rtn.code = e.code;
        rtn.num = e.num;
        rtn.max_cash = e.max_cash;
        rtn.freeNum = e.freeNum;
        rtn.dstNum = e.dstNum;
        rtn.limitAction = e.limitAction;
        rtn.msg = e.msg;
        rtn.ruleType = e.ruleType;
      }
    });

    return rtn;
  };
}

// 初始化
var riskCheck = new RiskController();

// 需要传入多个id值，用逗号分隔 该方法在原来“/oms/helper/risk_position”调用的地方调用就可以。
// riskCheck.getRulesData();

// 需要时调用
// 入参：策略数据
// var obj = riskCheck.checkRules({
//   product_id: '',           // 产品id， id
//   // 交易数据 form_data
//   trade_direction: '',      // 交易方向，1买入 2卖出 trade_direction
//   trade_mode: '',           // 1限价／2市价  trade_mode
//   volume: '',               // 交易数量
//   price: '',                // 限价金额
//   surged_limit: '',         // 涨停价 $('.stop_top_price').html()
//   decline_limit: '',        // 跌停价 $('.stop_down_price').html()
//   stock_code: '',           // 股票code，包含“.SZ”,比较的时候最好都进行小写转换
//   stock_name: '',           // 股票名称，用于判断st股票
//   // 产品的数据 product
//   total_assets: '',         // 资产总值
//   enable_cash: '',          // 可用资金 runtime.enable_cash
//   security: '',             // 持仓市值 runtime.security
//   net_value: '',            // 当日净值 runtime.net_value
//   // 持仓数据
//   market_value: '',         // 本股票持仓市值 //window.position_realtime里面有
//   total_amount: '',         // 该股票当前持仓数
//   enable_sell_volume: '',   // 该股票能卖的数量
//   // 其它
//   time: ''                  // 交易时间 //不需要传入，内部自己生成

//   联合风控：个股仓位风控
//   前端不处理。基于以下公理：
//   1. 前端不应该拿到权限之外的公司数据
//   2. 前端基于有限的数据可能比后端基于全部数据的风控还要严格。

//   举牌
//   stock_position_num: 该产品已持仓该股票数量
//   stock_entrust_num: 该产品已委托该股票数量
//   stock_total_share 该股票总股票数量，即总股本

//   联合风控：举牌
//   stock_all_position_num: 所有的持仓汇总该股票数量
//   stock_all_entrust_num: 所有的委托汇总该股票数量

//   对敲
//   stock_entrust_buy_num: 该产品已委托买入数量
//   stock_entrust_sell_num: 该产品已委托卖出数量

//   联合风控：对敲
//   stock_all_entrust_buy_num: 所有的产品已委托买入数量
//   stock_all_entrust_sell_num: 所有的产品已委托卖出数量
// });
//# sourceMappingURL=risk_controller.js.map
