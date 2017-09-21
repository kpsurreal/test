/**
 * 风控规则定义
 */
// 风控规则基类
function RiskRules(){
  // 系统内部股票池
  this.insidePool = {
    // 全部股票
    '-1': function(stock){
      return true;
    },
    // st禁买股票 判断规则是
    '-2': function(stock){
      return /\*{0,1}ST/i.test(stock.stock_name);
    },
    // 创业板 判断规则是 300开头的股票
    '-3': function(stock){
      return /^300/.test(stock.stock_code);
    }
  };

  this.insidePoolName = {
    '-1': function(){
      return '全部股票';
    },
    '-2': function(){
      return 'ST股票池';
    },
    '-3': function(){
      return '创业板股票池';
    }
  };

  // 根据股票代码鉴别是1、股票；2、基金（非债券ETF、非货币ETF）；3、债券ETF OR 货币ETF
  var regBondETF = /^(511010|511210|511220)/;
  var regCurrencyETF = /^(511600|511601)/;
  var regFund = /^(51|50|16|18|15)\d{4}/;
  this.freeBrokerage = function(stock_code){
    if (regCurrencyETF.test(stock_code) || regBondETF.test(stock_code)) {
      return true;
    }else{
      return false;
    }
  };

  this.getMarketType = function(stock_code){
    if(regFund.test(stock_code)){
      return 2;
    }else{
      return 1;
    }
  };

  this.getFeePercent = function(stock_code, feeData){
    var _this = this;
    var marketType = this.getMarketType(stock_code);
    var freeFlag = this.freeBrokerage(stock_code);
    var szFlag = /\.sz/.test(stock_code.toLocaleLowerCase());
    var dstFeePercent = 0;
    var dstFeePercentMin = 0;
    var fee_lower_limit = 0;
    feeData.data.forEach(function(e){
      if (0 == e.status && e.market == marketType) {
        if ( (e.fee_type == 1) || (freeFlag && e.fee_type == 3) ) {
          // 印花税 买入时不收取
          // 债券ETF OR 货币ETF不收取 经手费
          // 股票 深交所不收取证管费和经手费 修改后，这条也是要收取的 || (1 == marketType && szFlag && e.fee_type == 3) || ( 1 == marketType && szFlag && e.fee_type == 4)
          ;
        }else{
          if (e.fee_lower_limit == 0) {
            // dstFeePercent += Number(e.fee_rate * 10000);
            // dstFeePercentMin += Number(e.fee_rate * 10000);

            if (stock_code.match(/\.sz/ig)) {
              dstFeePercent += Number(e.sz_fee_rate * 10000);
              dstFeePercentMin += Number(e.sz_fee_rate * 10000);
            }else{
              dstFeePercent += Number(e.fee_rate * 10000);
              dstFeePercentMin += Number(e.fee_rate * 10000);
            }
          }else{
            // dstFeePercent += Number(e.fee_rate * 10000);
            // fee_lower_limit = Number(e.fee_lower_limit);
            if (stock_code.match(/\.sz/ig)) {
              dstFeePercent += Number(e.sz_fee_rate * 10000);
              fee_lower_limit = Number(e.sz_fee_lower_limit);
            }else{
              dstFeePercent += Number(e.fee_rate * 10000);
              fee_lower_limit = Number(e.fee_lower_limit);
            }
          }
        }
      }
    });
    return {
      dstFeePercent: dstFeePercent / 10000,
      dstFeePercentMin: dstFeePercentMin / 10000,
      fee_lower_limit: fee_lower_limit
    }
  };

  this.doCheckFee = function(stock_code, balance, price, feeData){
    var obj = this.getFeePercent(stock_code, feeData);

    var freeNumV1 = Math.max(Math.floor(balance/(price * (1 + obj.dstFeePercent / 1000)), 0));
    var freeNumV2 = Math.max(Math.floor((balance - obj.fee_lower_limit)/(price * (1 + obj.dstFeePercentMin / 1000)), 0));

    return Math.min(freeNumV1, freeNumV2);
  }

  this.calFeeTotal = function(stock_code, balance, price, feeData, volume){
    var obj = this.getFeePercent(stock_code, feeData);

    var balanceV1 = (price * (1 + obj.dstFeePercent / 1000)) * volume;
    var balanceV2 = (price * (1 + obj.dstFeePercentMin / 1000)) * volume + obj.fee_lower_limit;

    return Math.max(balanceV1, balanceV2);
  }

  // 初始化返回信息
  this.initRtn = function(){
    var rtn = {
      code: 0, //错误码，0 为成功，其它失败
      limitAction: 0,
      ruleType: '初始化风控',
      msg: '初始化提示信息', //提示信息
      num: 0 //可交易数量
    };
    return rtn;
  };

  // 风控检查
  // 入参1：股票相关数据（obj）
  // 入参2: 风控规则数据（obj）
  this.check = function(stock, rules){
    var rtn = this.initRtn();
    if (!this.checkStockData(stock)) {
      rtn = {
        code: 10001,
        limitAction: 1, //0时预警 1时禁止
        msg: '股票信息不全',
        num: 0
      }
      return rtn;
    }

    if (!this.checkRulesData(rules)) {
      rtn = {
        code: 10002,
        limitAction: 1, //0时预警 1时禁止
        msg: '风控数据不全',
        num: 0
      }
      return rtn;
    }

    rtn = this.doCheck(stock, rules);
    return rtn;
  };

  // 数量比对，给定目标数量和可用数量，以及风控执行类型，准备返回的错误码和数量
  // 入参：obj{dstNum:'',freeNum:'',limitAction: ''}
  this.compareNums = function(obj){
    var numsPerHand = obj.trading_unit ? obj.trading_unit : 100;
    var dstNum = Number(obj.dstNum);
    if (true == obj.frozenFreeNum) {
      var freeNum = Number(obj.freeNum);
    }else{
      var freeNum = Math.floor(Number(obj.freeNum) / numsPerHand) * numsPerHand;
    }

    var rtn = this.initRtn();

    rtn.dstNum = dstNum;
    rtn.freeNum = freeNum;
    rtn.limitAction = obj.limitAction;
    if (obj.limitAction == 1) {
      // 禁止的风控处理
      if (dstNum <= freeNum) {
        rtn.code = 0; //成功
        rtn.num = dstNum;
      }else{
        rtn.code = 2; //失败
        rtn.num = freeNum;
      }
    }else if(obj.limitAction == 0){
      // 告警的风控处理
      if (dstNum <= freeNum) {
        rtn.code = 0; //成功
        rtn.num = dstNum;
      }else{
        rtn.code = 1; //告警，但是可以买
        rtn.num = dstNum;
      }
    }else{
      rtn.limitAction = -1; //无风控条件，
      rtn.code = 0;
      rtn.num = dstNum;
    }

    return rtn;
  };

  // 从旧方法 compareNums 改造过来，不再按手数取整
  this.compareReturn = function(obj){
    var numsPerHand = obj.trading_unit ? obj.trading_unit : 100;
    var dstNum = Number(obj.dstNum);
    var freeNum = Number(obj.freeNum);
    // // 继续按手数取整，这件事情应该是在这里做。因为风控提示的数字
    // if (true == obj.frozenFreeNum) {
    //   var freeNum = Number(obj.freeNum);
    // }else{
    //   var freeNum = Math.floor(Number(obj.freeNum) / numsPerHand) * numsPerHand;
    // }

    var rtn = this.initRtn();

    rtn.dstNum = dstNum;
    rtn.freeNum = freeNum;
    rtn.limitAction = obj.limitAction;
    if (obj.limitAction == 1) {
      // 禁止的风控处理
      if (dstNum <= freeNum) {
        rtn.code = 0; //成功
        rtn.num = dstNum;
      }else{
        rtn.code = 2; //失败
        rtn.num = freeNum;
      }
    }else if(obj.limitAction == 0){
      // 告警的风控处理
      if (dstNum <= freeNum) {
        rtn.code = 0; //成功
        rtn.num = dstNum;
      }else{
        rtn.code = 1; //告警，但是可以买
        rtn.num = dstNum;
      }
    }else{
      rtn.limitAction = -1; //无风控条件，
      rtn.code = 0;
      rtn.num = dstNum;
    }

    return rtn;
  }
}

// 可用资金限制。
function IndependentBalance(){
  // 校验内容：可用资金balance、价格price、数量dstNum、股票代码
  this.checkStockData = function(stock){
    return stock.hasOwnProperty('balance') && stock.hasOwnProperty('price') && stock.hasOwnProperty('dstNum') && stock.hasOwnProperty('stock_code');
  };
  // 校验风控规则数据：费用信息
  this.checkRulesData = function(rules){
    return rules.hasOwnProperty('feeData');
  };
  this.doCheck = function(stock, rules){
    // 修改：这里为了新增对于费用的计算，而需要新增判断。//入参：股票编码，计算总额，计算单价，费用规则
    var freeNum = this.doCheckFee(stock.stock_code, stock.balance, stock.price, rules.feeData);
    freeNum = Math.max(freeNum, 0);

    // var freeNum = Math.max(Math.floor(stock.balance/stock.price, 0));
    var max_cash = stock.balance;
    var dstNum = stock.dstNum;

    var rtn = this.compareReturn({
      trading_unit: stock.trading_unit,
      dstNum: dstNum,
      freeNum: freeNum,
      limitAction: 1 //禁止，因为这是可用资金的判断
    });

    if (0 == rtn.code) {
      rtn.msg = '可用资金校验成功';
    }else if(1 == rtn.code){
      rtn.msg = '已触发提示性风控（个股）：可用资金不足';
    }else{
      rtn.msg = '已触发禁止性风控（个股）：可用资金不足';
    }
    rtn.ruleType = 'IndependentBalance 可用资金限制风控';
    rtn.max_cash = max_cash;

    // 3.10.0版本，doCheck不再是返回对象，而是返回数组，包含多个之前格式的对象。因为预警操作有告警和提示两种嘛。
    return [rtn];
  }
}
IndependentBalance.prototype = new RiskRules();

// 整体仓位限制
function IndependentWholePosition(){
  // 校验内容：资产总值total_assets；价格price；数量dstNum；持仓市值security；当日净值net_value
  this.checkStockData = function(stock){
    return (stock.hasOwnProperty('total_assets') &&
      stock.hasOwnProperty('stock_code') && 
      stock.hasOwnProperty('price') &&
      stock.hasOwnProperty('dstNum') &&
      stock.hasOwnProperty('security') &&
      stock.hasOwnProperty('net_value'));
  };
  this.checkRulesData = function(rules){
    return rules.hasOwnProperty('wholePosition') && rules.hasOwnProperty('feeData');
  };
  this.getPositionInfo = function(stock, rules){
    var tmpArr = [];
    var dstNum = stock.dstNum;
    rules.wholePosition && rules.wholePosition.forEach(function(e){
      // if (stock.net_value > e.net_value) { // 注意 这里是取出不符合条件的净值
        tmpArr.push({
          net_value: e.net_value,
          position: e.limit_position,
          limitAction: e.limit_action
        });
      // }
    });

    return tmpArr;
  };

  // 获取可用资金，仅单组合多股票页面需要，现在那块以及不做前端风控了。
  this.getMaxCash = function(stock, rules){
    var tmpArr = [];
    var dstNum = stock.dstNum;
    rules.wholePosition && rules.wholePosition.forEach(function(e){
      if (stock.net_value < e.net_value) {
        // var max_cash = Math.floor(stock.total_assets * e.limit_position / 100);
        var max_cash = stock.total_assets * e.limit_position / 100;
        tmpArr.push({
          max_cash: max_cash,
          limitAction: e.limit_action
        });
      }
    });
    // 取出所有符合条件的最大数量之后，取最小的数量及其风控处理即可。
    var freeNum = Infinity;
    var limitAction = '';
    var limit_position = '';
    var net_value = '';
    var max_cash = stock.total_assets;
    tmpArr.forEach(function(e){
      if (1 == e.limitAction && e.max_cash < max_cash) {
        max_cash = e.max_cash;
      }
    });

    return max_cash;
  };

  // 整体仓位控制校验函数
  // rules格式：
  // {wholePosition:[{rule_id:'',net_value:'',limit_position:'',limit_action:''},{}]}
  this.doCheck = function(stock, rules){
    // 仓位限制，将采取这样的逻辑：所有满足净值条件的情况下，取出最大的可交易数量
    var _this = this;
    var tmpArr = [];
    var dstNum = stock.dstNum;
    rules.wholePosition && rules.wholePosition.forEach(function(e){
      if (stock.net_value < e.net_value) {
        // （总资产＊仓位限制－持仓市值）／价格 ？＝ 数量
        // var freeNum = Math.floor((stock.total_assets * e.limit_position / 100 - stock.security) / stock.price);
        var balance = (stock.total_assets * e.limit_position / 100 - stock.security);
        var freeNum = _this.doCheckFee(stock.stock_code, balance, stock.price, rules.feeData);
        freeNum = Math.max(freeNum, 0);
        var max_cash = Math.floor(stock.total_assets * e.limit_position / 100);
        tmpArr.push({
          net_value: e.net_value,
          limit_position: e.limit_position,
          freeNum: freeNum,
          max_cash: max_cash,
          limitAction: e.limit_action
        });
      }
    });

    // 旧的计算方式是只传入处理方式为禁止的风控数据，新的要把提示的也传进去
    var rtnArr = [{
      limitAction: 0,
    }, {
      limitAction: 1,
    }];
    // 因为要考虑的就是禁止和提示两种，所以准备一个两个元素的数组就可以啦
    rtnArr.forEach(obj => {
      var freeNum = Infinity;
      var limitAction = obj.limitAction;
      var limit_position = '';
      var net_value = '';
      var max_cash = Infinity;

      tmpArr.forEach(function(e){
        // 每次for循环准备不同的风控预警操作
        if (obj.limitAction == e.limitAction && e.freeNum < freeNum) {
          freeNum = e.freeNum;
          limitAction = e.limitAction;
          limit_position = e.limit_position;
          net_value = e.net_value;
          max_cash = e.max_cash;
        }
      });

      Object.assign(obj, this.compareReturn({
        dstNum: dstNum,
        freeNum: freeNum,
        limitAction: limitAction
      }));

      if (0 == obj.code) {
        obj.msg = '净值仓位校验成功';
      }else if(1 == obj.code){
        obj.msg = '已触发提示性风控（个股）：单位净值<'+ net_value +'，最大仓位限制' + limit_position + '%';
      }else{
        obj.msg = '已触发禁止性风控（个股）：单位净值<'+ net_value +'，最大仓位限制' + limit_position + '%';
      }
      obj.ruleType = 'IndependentWholePosition 净值仓位限制风控';
      obj.max_cash = max_cash;
    });

    // 3.10.0版本，doCheck不再是返回对象，而是返回数组，包含多个之前格式的对象。因为预警操作有告警和提示两种嘛。
    return rtnArr;
  };
}
IndependentWholePosition.prototype = new RiskRules();

// 单票(净值)仓位限制
function IndependentOnePosition(){
  // 校验内容：股票stock_code；资产总值total_assets；价格price；数量dstNum；单股持仓市值market_value；
  this.checkStockData = function(stock){
    return (stock.hasOwnProperty('stock_code') &&
      stock.hasOwnProperty('stock_name') &&
      stock.hasOwnProperty('total_assets') &&
      stock.hasOwnProperty('price') &&
      stock.hasOwnProperty('dstNum') &&
      stock.hasOwnProperty('market_value'));
  };
  this.checkRulesData = function(rules){
    return rules.hasOwnProperty('customPool') && rules.hasOwnProperty('onePosition') && rules.hasOwnProperty('feeData');
  };
  this.doCheck = function(stock, rules){
    var _this = this;
    // 过滤内部股票池，得到股票在股票池的规则集合
    var rulesAll = this.getPositionLimit(stock, rules);
    // 接下来的处理流程可用和wholePosition的处理类似了，但是不需要考虑净值分级
    var tmpArr = [];
    var dstNum = stock.dstNum;
    rulesAll.forEach(function(e){
      // （总资产＊仓位限制－持仓市值）／价格 ？＝ 数量
      // var freeNum = Math.floor((stock.total_assets * e.limitPosition / 100 - stock.market_value) / stock.price);
      var balance = (stock.total_assets * e.limitPosition / 100 - stock.market_value);
      var freeNum = _this.doCheckFee(stock.stock_code, balance, stock.price, rules.feeData);
      var max_cash = (stock.total_assets * e.limitPosition / 100 - stock.market_value);
      tmpArr.push({
        limit_position: e.limitPosition,
        freeNum: freeNum,
        max_cash: max_cash,
        limitAction: e.limitAction
      });
    });

    // 旧的计算方式是只传入处理方式为禁止的风控数据，新的要把提示的也传进去
    var rtnArr = [{
      limitAction: 0,
    }, {
      limitAction: 1,
    }];
    // 因为要考虑的就是禁止和提示两种，所以准备一个两个元素的数组就可以啦
    rtnArr.forEach(obj => {
      var freeNum = Infinity;
      var max_cash = Infinity;
      var limitAction = obj.limitAction;
      var limit_position = '';
      tmpArr.forEach(function(e){
        if (obj.limitAction == e.limitAction && e.freeNum < freeNum) {
          freeNum = e.freeNum;
          max_cash = e.max_cash;
          limitAction = e.limitAction;
          limit_position = e.limit_position;
        }
      });

      Object.assign(obj, this.compareReturn({
        dstNum: dstNum,
        freeNum: freeNum,
        limitAction: limitAction
      }));

      // // 根据tmpArr是否含有比freeNum还要小的freeNum，重新计算code
      // if (obj.code == 0) {
      //   tmpArr.forEach(function(e){
      //     if (e.freeNum < obj.freeNum) {
      //       obj.code = 1;
      //     }
      //   });
      // }

      if (0 == obj.code) {
        obj.msg = '单票(净值)仓位校验成功';
      }else if(1 == obj.code){
        obj.msg = '已触发提示性风控（个股）：个股最大仓位限制' + limit_position + '%';
      }else{
        obj.msg = '已触发禁止性风控（个股）：个股最大仓位限制' + limit_position + '%';
        // obj.msg = '单票(净值)仓位校验失败';
      }
      obj.max_cash = max_cash;
      obj.ruleType = 'IndependentOnePosition 单票(净值)仓位限制风控';
    })

    // 3.10.0版本，doCheck不再是返回对象，而是返回数组，包含多个之前格式的对象。因为预警操作有告警和提示两种嘛。
    return rtnArr;
  };

  //
  this.getPositionLimit = function(stock, rules){
    var _this = this;
    var rtn = [];
    rules.onePosition && rules.onePosition.forEach(function(e){
      if ( !_this.insidePool.hasOwnProperty(Number(e.stock_pool_id))) {
        // 取出该股票池的数据，判断股票代码是否在默认股票池内
        rules.customPool.forEach(function(el){
          if (el.id == e.stock_pool_id) {
            // 判断股票是否在股票池内
            if (el.list.some(function(cur, i){
              return cur.toLowerCase() === stock.stock_code.toLowerCase();
            })) {
              rtn.push({
                stockPoolId: Number(e.stock_pool_id),
                stockPoolName:  el.pool_name,
                limitPosition: e.limit_position,
                limitAction: e.limit_action
              });
            }
          }
        });
      }else{
        if (_this.insidePool[Number(e.stock_pool_id)](stock)) {
          rtn.push({
            stockPoolId: Number(e.stock_pool_id),
            stockPoolName:  _this.insidePoolName[e.stock_pool_id](),
            limitPosition: e.limit_position,
            limitAction: e.limit_action
          });
        }
      }
    });

    return rtn;
  };
}
IndependentOnePosition.prototype = new RiskRules();

// 黑名单
function IndependentTarget(){
  // 校验内容：股票stock_code
  this.checkStockData = function(stock){
    return stock.hasOwnProperty('stock_code') && stock.hasOwnProperty('dstNum') && stock.hasOwnProperty('stock_name');
  };
  this.checkRulesData = function(rules){
    return rules.hasOwnProperty('customPool') && rules.hasOwnProperty('target');
  };
  this.getStatus = function(stock, rules){
    var rules = this.getPositionLimit(stock,rules);
    var stockPoolName = '';
    var _this = this;
    var rtn = {
      status: 0,
      stockPoolName : '',
      blackListMsg: ''
    };
    rules.forEach(function(e){
      // todo 这里只有内置股票的处理，缺少自定义股票池的展示
      if (1 == e.limitAction) {
        rtn.blackListMsg = '已触发禁止性风控（个股）：属于'+ e.stockPoolName + '，禁止买入';
        rtn.stockPoolName = e.stockPoolName;
        rtn.status = 1;
      }
    });
    return rtn;
  };
  this.doCheck = function(stock, rules){
    var _this = this;
    var rules = this.getPositionLimit(stock,rules);
    var dstNum = stock.dstNum;

    // 旧的计算方式是只传入处理方式为禁止的风控数据，新的要把提示的也传进去
    var rtnArr = [{
      limitAction: 0,
    }, {
      limitAction: 1,
    }];
    // 因为要考虑的就是禁止和提示两种，所以准备一个两个元素的数组就可以啦
    rtnArr.forEach(obj => {
      var freeNum = Infinity;
      var limitAction = obj.limitAction;
      var stockPoolName = '';
      var max_cash = Infinity;
      rules.forEach(function(e){
        if (obj.limitAction == e.limitAction) {
          freeNum = 0;
          max_cash = 0;
          limitAction = e.limitAction;
          // todo 这里只有内置股票的处理，缺少自定义股票池的展示
          stockPoolName = e.stockPoolName;
        }
      });

      Object.assign(obj, this.compareReturn({
        dstNum: dstNum,
        freeNum: freeNum,
        limitAction: limitAction
      }));

      if (0 == obj.code) {
        obj.msg = '黑名单校验成功';
      }else if(1 == obj.code){
        obj.msg = '已触发提示性风控（个股）：属于'+ stockPoolName + '，禁止买入';
      }else{
        obj.msg = '已触发禁止性风控（个股）：属于'+ stockPoolName + '，禁止买入';
      }
      obj.max_cash = max_cash;
      obj.ruleType = 'IndependentTarget 黑名单限制风控';
    });

    // 3.10.0版本，doCheck不再是返回对象，而是返回数组，包含多个之前格式的对象。因为预警操作有告警和提示两种嘛。
    return rtnArr;
  };
  //
  this.getPositionLimit = function(stock, rules){
    var _this = this;
    var rtn = [];
    rules.target && rules.target.forEach(function(e){
      if ( !_this.insidePool.hasOwnProperty(Number(e.stock_pool_id))) {
        // 取出该股票池的数据，判断股票代码是否在默认股票池内
        rules.customPool.forEach(function(el){
          if (el.id == e.stock_pool_id) {
            // 判断股票是否在股票池内
            if (el.list.some(function(cur, i){
              return cur.toLowerCase() === stock.stock_code.toLowerCase();
            })) {
              rtn.push({
                stockPoolId: Number(e.stock_pool_id),
                stockPoolName:  el.pool_name,
                limitAction: e.limit_action
              });
            }
          }
        });
      }else{
        if (_this.insidePool[Number(e.stock_pool_id)](stock)) {
          rtn.push({
            stockPoolId: Number(e.stock_pool_id),
            stockPoolName:  _this.insidePoolName[e.stock_pool_id](),
            limitAction: e.limit_action
          });
        }
      }
    });

    return rtn;
  };
}
IndependentTarget.prototype = new RiskRules();

// 时间段
function IndependentTimeArea(){
  // 校验内容 小时数time_h
  this.checkStockData = function(stock){
    return stock.hasOwnProperty('time_h') && stock.hasOwnProperty('dstNum');
  };
  this.checkRulesData = function(rules){
    return true;
  };
  this.doCheck = function(stock, rules){
    var rtn;
    //16-17点，禁止下单
    if (Number(stock.time_h) == 16) {
      rtn = this.compareReturn({
        trading_unit: stock.trading_unit,
        dstNum: stock.dstNum,
        freeNum: 0,
        limitAction: 1 //禁止
      });
    }else{
      rtn = this.compareReturn({
        trading_unit: stock.trading_unit,
        dstNum: stock.dstNum,
        freeNum: Infinity,
        limitAction: 1 //禁止
      });
    }

    if (0 == rtn.code) {
      rtn.msg = '时间段校验成功';
      rtn.max_cash = Infinity;
    }else if(1 == rtn.code){
      rtn.msg = '异常：时间段校验失败后应该强制禁止';
      rtn.max_cash = Infinity;
    }else{
      rtn.msg = '时间段校验失败';
      rtn.max_cash = 0;
    }
    rtn.ruleType = 'IndependentTimeArea 时间段限制风控';
    return [rtn];
  }
}
IndependentTimeArea.prototype = new RiskRules();

// 可卖
function IndependentCanSellVolume(){
  // 校验内容：数量dstNum；可出售数量enable_sell_volume；
  this.checkStockData = function(stock){
    return stock.hasOwnProperty('dstNum') && stock.hasOwnProperty('enable_sell_volume');
  };
  this.checkRulesData = function(rules){
    return true;
  };
  this.doCheck = function(stock, rules){
    var dstNum = stock.dstNum;
    var freeNum = stock.enable_sell_volume;
    var rtn = this.compareReturn({
      trading_unit: stock.trading_unit,
      frozenFreeNum: true,
      dstNum: dstNum,
      freeNum: freeNum,
      limitAction: 1 //禁止
    });

    if (0 == rtn.code) {
      rtn.msg = '可卖数量校验成功';
    }else if(1 == rtn.code){
      rtn.msg = '已触发提示性风控（个股）：可卖数量不足';
    }else{
      rtn.msg = '已触发禁止性风控（个股）：可卖数量不足'; // '可卖数量校验失败';
    }
    rtn.ruleType = 'IndependentCanSellVolume 可卖限制风控';
    return [rtn];
  }
}
IndependentCanSellVolume.prototype = new RiskRules();

// 新增，独立风控，举牌
function IndependentPlacards(){
  // 校验内容：该股票已发行股票数量stock_total_share；已持仓该股票数量stock_position_num；已委托该股票数量stock_entrust_num；数量dstNum
  this.checkStockData = function(stock){
    return stock.hasOwnProperty('stock_total_share') && stock.hasOwnProperty('stock_position_num') && stock.hasOwnProperty('stock_entrust_num') && stock.hasOwnProperty('dstNum')
  };
  this.checkRulesData = function(rules){
    return rules.hasOwnProperty('placards');
  };
  this.doCheck = function(stock, rules){
    var dstNum = stock.dstNum;
    var arr = this.checkMaxPlacardsNum(stock, rules);
    // 屏蔽港股校验
    if (/\.hk/.test(stock.stock_code.toLowerCase())) {
      arr = [];
    }
    var max_cash;

    // 旧的计算方式是只传入处理方式为禁止的风控数据，新的要把提示的也传进去
    var rtnArr = [{
      limitAction: 0,
    }, {
      limitAction: 1,
    }];
    rtnArr.forEach(obj => {
      var freeNum = Infinity;
      var limitAction = obj.limitAction;
      var limitPosition = '';

      arr.forEach(function(e){
        if (obj.limitAction == e.limit_action) {
          freeNum = e.freeNum;
          max_cash = Infinity;
          limitAction = e.limit_action;
          limitPosition = e.limitPosition; // 记住触发的比例
        }
      });

      Object.assign(obj, this.compareReturn({
        dstNum: dstNum,
        freeNum: freeNum,
        limitAction: limitAction
      }));

      if (0 == obj.code) {
        obj.msg = '举牌校验成功';
      }else if(1 == obj.code){
        obj.msg = '已触发提示性风控（个股）：超过'+ limitPosition + '%，触发举牌风控';
      }else{
        obj.msg = '已触发禁止性风控（个股）：超过'+ limitPosition + '%，触发举牌风控，禁止买入';
      }
      obj.max_cash = max_cash;
      obj.ruleType = 'IndependentPlacards 举牌风控';
    })

    return rtnArr;
  }
  this.checkMaxPlacardsNum = function(stock, rules){
    var _this = this;
    var rtn = [];
    rules.placards && rules.placards.forEach(function(e){
      // 计算最大可买数量
      var freeNum = Math.max(stock.stock_total_share * e.limit_position / 100 - stock.stock_position_num - stock.stock_entrust_num - 100, 0);
      rtn.push({
        // limit_position
        limitPosition: e.limit_position, // 记住触发的比例
        freeNum: freeNum,
        limit_action: e.limit_action
      })
    });

    return rtn;
  }
}
IndependentPlacards.prototype = new RiskRules();

// 新增，独立风控，对敲
function IndependentControTrade(){
  // 校验内容：该产品已委托买入数量stock_entrust_buy_num；该产品已委托卖出数量stock_entrust_sell_num；数量dstNum
  this.checkStockData = function(stock){
    return stock.hasOwnProperty('trade_direction') && stock.hasOwnProperty('stock_entrust_buy_num') && stock.hasOwnProperty('stock_entrust_sell_num') && stock.hasOwnProperty('dstNum');
  };
  this.checkRulesData = function(rules){
    return rules.hasOwnProperty('controTrade');
  };
  this.doCheck = function(stock, rules){
    var dstNum = stock.dstNum;
    var arr = this.checkControTradeNum(stock, rules);
    var max_cash;

    // 旧的计算方式是只传入处理方式为禁止的风控数据，新的要把提示的也传进去
    var rtnArr = [{
      limitAction: 0,
    }, {
      limitAction: 1,
    }];
    rtnArr.forEach(obj => {
      var freeNum = Infinity;
      var limitAction = obj.limitAction;
      arr.forEach(function(e){
        if (obj.limitAction == e.limitAction) {
          freeNum = e.freeNum;
          max_cash = e.max_cash;
          limitAction = e.limitAction;
        }
      });

      Object.assign(obj, this.compareReturn({
        dstNum: dstNum,
        freeNum: freeNum,
        limitAction: limitAction
      }));

      if (0 == obj.code) {
        obj.msg = '对敲校验成功';
      }else if(1 == obj.code){
        obj.msg = '已触发提示性风控（个股）：触发对敲风控';
      }else{
        obj.msg = '已触发禁止性风控（个股）：触发对敲风控，提交委托禁止与未成交委托反向';
      }
      obj.max_cash = max_cash;
      obj.ruleType = 'IndependentControTrade 对敲风控';
    })

    return rtnArr;
  };

  this.checkControTradeNum = function(stock, rules){
    var _this = this;
    var rtn = [];
    rules.controTrade && rules.controTrade.forEach(function(e){
      // 买入
      if (1 == stock.trade_direction && stock.stock_entrust_sell_num > 0) {
        rtn.push({
          freeNum: 0,
          max_cash: Infinity,
          limitAction: e.limit_action
        })
      }else if(2 == stock.trade_direction && stock.stock_entrust_buy_num > 0){
        rtn.push({
          freeNum: 0,
          max_cash: Infinity,
          limitAction: e.limit_action
        })
      }else{
        rtn.push({
          freeNum: Infinity,
          max_cash: Infinity,
          limitAction: e.limit_action
        })
      }
    });

    return rtn;
  };
}
IndependentControTrade.prototype = new RiskRules();

// 新增，联合风控，举牌
function UnionPlacards(){
  // 校验内容：所有的持仓汇总该股票数量stock_all_position_num；所有的委托汇总该股票数量stock_all_entrust_num；数量dstNum
  this.checkStockData = function(stock){
    return stock.hasOwnProperty('stock_all_position_num') && stock.hasOwnProperty('stock_all_entrust_num') && stock.hasOwnProperty('dstNum')
  };
  this.checkRulesData = function(rules){
    return rules.hasOwnProperty('placardsCo');
  };
  this.doCheck = function(stock, rules){
    var dstNum = stock.dstNum;
    var arr = this.checkMaxPlacardsNum(stock, rules);
    // 屏蔽港股校验
    if (/\.hk/.test(stock.stock_code.toLowerCase())) {
      arr = [];
    }
    var max_cash;

    // 旧的计算方式是只传入处理方式为禁止的风控数据，新的要把提示的也传进去
    var rtnArr = [{
      limitAction: 0,
    }, {
      limitAction: 1,
    }];
    rtnArr.forEach(obj => {
      var freeNum = Infinity;
      var limitAction = obj.limitAction;
      var limitPosition = '';
      arr.forEach(function(e){
        if (obj.limitAction == e.limit_action) {
          freeNum = e.freeNum;
          max_cash = Infinity;
          limitAction = e.limit_action;
          limitPosition = e.limitPosition; // 记住触发的比例
        }
      });

      Object.assign(obj, this.compareReturn({
        dstNum: dstNum,
        freeNum: freeNum,
        limitAction: limitAction
      }));

      if (0 == obj.code) {
        obj.msg = '举牌校验成功';
      }else if(1 == obj.code){
        obj.msg = '已触发提示性风控（联合）：超过'+ limitPosition + '%，触发举牌风控';
      }else{
        obj.msg = '已触发禁止性风控（联合）：超过'+ limitPosition + '%，触发举牌风控，禁止买入';
      }
      obj.max_cash = max_cash;
      obj.ruleType = 'UnionPlacards 举牌联合风控';
    });

    return rtnArr;
  };
  this.checkMaxPlacardsNum = function(stock, rules){
    var _this = this;
    var rtn = [];
    rules.placardsCo && rules.placardsCo.forEach(function(e){
      // 计算最大可买数量 //因为举牌要考虑等号，所以额外减去100了。
      var freeNum = Math.max(stock.stock_total_share * e.limit_position / 100 - stock.stock_all_position_num - stock.stock_all_entrust_num - 100, 0);
      rtn.push({
        // limit_position
        limitPosition: e.limit_position, // 记住触发的比例
        freeNum: freeNum,
        limit_action: e.limit_action
      })
    });

    return rtn;
  }
}
UnionPlacards.prototype = new RiskRules();

// 新增，联合风控，对敲
function UnionControTrade(){
  // 校验内容：所有的产品已委托买入数量stock_all_entrust_buy_num；所有的产品已委托卖出数量stock_all_entrust_sell_num；数量dstNum
  this.checkStockData = function(stock){
    return stock.hasOwnProperty('trade_direction') && stock.hasOwnProperty('stock_all_entrust_buy_num') && stock.hasOwnProperty('stock_all_entrust_sell_num') && stock.hasOwnProperty('dstNum')
  };
  this.checkRulesData = function(rules){
    return rules.hasOwnProperty('controTradeCo');
  };

  this.doCheck = function(stock, rules){
    var dstNum = stock.dstNum;
    var arr = this.checkControTradeNum(stock, rules);
    var max_cash;

    // 旧的计算方式是只传入处理方式为禁止的风控数据，新的要把提示的也传进去
    var rtnArr = [{
      limitAction: 0,
    }, {
      limitAction: 1,
    }];
    rtnArr.forEach(obj => {
      var freeNum = Infinity;
      var limitAction = obj.limitAction;
      arr.forEach(function(e){
        if (obj.limitAction == e.limitAction) {
          freeNum = e.freeNum;
          max_cash = e.max_cash;
          limitAction = e.limitAction;
        }
      });

      Object.assign(obj, this.compareReturn({
        dstNum: dstNum,
        freeNum: freeNum,
        limitAction: limitAction
      }));

      if (0 == obj.code) {
        obj.msg = '对敲风控校验成功';
      }else if(1 == obj.code){
        obj.msg = '已触发提示性风控（联合）：触发对敲风控';
      }else{
        obj.msg = '已触发禁止性风控（联合）：触发对敲风控，提交委托禁止与未成交委托反向';
      }
      obj.max_cash = max_cash;
      obj.ruleType = 'UnionControTrade 对敲联合风控';
    });

    return rtnArr;
  };

  this.checkControTradeNum = function(stock, rules){
    var _this = this;
    var rtn = [];
    rules.controTradeCo && rules.controTradeCo.forEach(function(e){
      // 买入
      if (1 == stock.trade_direction && stock.stock_all_entrust_sell_num > 0) {
        rtn.push({
          freeNum: 0,
          max_cash: Infinity,
          limitAction: e.limit_action
        })
      }else if(2 == stock.trade_direction && stock.stock_all_entrust_buy_num > 0){
        rtn.push({
          freeNum: 0,
          max_cash: Infinity,
          limitAction: e.limit_action
        })
      }else{
        rtn.push({
          freeNum: Infinity,
          max_cash: Infinity,
          limitAction: e.limit_action
        })
      }
    });

    return rtn;
  };
}
UnionControTrade.prototype = new RiskRules();

// 可用资金为例
// 计算式：股票价格＊数量 ?= 可用资金
// var balanceCheck = new Balance();
// var stockData = {
//   balance: '可用资金',
//   price: '股票价格',
//   dstNum: '想要交易数量'
// };
// var rulesData = {
//   // 可用资金不需要风控规则
// };
// // 使用方法
// var obj = balanceCheck.check(stockData, rulesData);

// 净值仓位限制
// 计算式：总资产＊仓位限制 ?= 持仓市值＋价格＊数量
// var wholePositionCheck = new WholePosition();
// var stockData = {
//   '总资产': '总资产',
//   '持仓市值': '持仓市值',
//   price: '股票价格',
//   dstNum: '想要交易数量'
// };
// var rulesData = {
//   wholePosition:[[净值，仓位], [净值，仓位]]
// };
// var obj = wholePositionCheck.check(stockData, rulesData);

// 单票持仓限制
// 计算式：总资产＊个股仓位限制 ?= 单票持仓＋价格＊数量
// var onePositionCheck = new OnePosition();
// var stockData = {
//   '总资产': '',
//   '单票持仓市值': '',
//   price: '股票价格',
//   dstNum: '想要交易数量',
//   stockCode: '股票id'
// };
// var rulesData = {
//   // 不需要风控规则
//   // 系统内置股票池内部计算即可
//   // 自定义股票池，后续要支持的话，提前一次性获取股票池。（通过调用实例onePositionCheck的(其它新增的)方法传入自定义股票池）

//   // 还是要风控规则的
//   // 比如说规则时股票池11不允许超过12，这条消息还是要传过来的。这里再根据股票池枚举值11知道是那个系统内置股票池，再判断股票在不在股票池内
//   // 然后才能谈及仓位限制。
// };
// var obj = onePositionCheck.check(stockData, rulesData);

// 黑名单
// 计算式：判断是否属于黑名单
// var targetCheck = new Target();
// var stockData = {
//   stockCode: '股票id'
// };
// var rulesData = {
//   // 不需要风控规则

// };
// var obj = targetCheck.check(stockData, rulesData);

// 时间段
// 计算式：判断是否属于该时间段
// var timeAreaCheck = new TimeArea();
// var stockData = {
//   dstNum: '想要交易数量'
// };
// var rulesData = {
//   timeArea: [{
//     time: '时间段',
//     action: '处理方式'
//   }];
// };
// var obj = timeAreaCheck.check(stockData, rulesData);

// 可卖
// var canSellVolumeCheck = new CanSellVolume();
// var stockData = {
//   dstNum: '想要交易数量',
//   '当前持仓数量': '',
//   '当日买入数量': ''
// };
// var rulesData = {
//   // 不需要风控规则
// }
// var obj = canSellVolumeCheck.check(stockData, rulesData);

// 多仓位判断，风控处理可能不同的净值不同的风控处理结果，需要
// 要么这里单条单条的处理
// 要么，风控处理的结果要和单条的数据一起传过来（应该选用这种，因为如果只是告警提醒，可交易数量应该还是dstNum）

// 费用计算，额外暴露给外面使用
var riskRules = new RiskRules();

// 3.10.0版本，新增了新的风控规则，并且支持告警提醒。采取这样的方式，所有的风控全部重写！
// 前缀independent表示独立风控，前缀
var independentBalanceCheck = new IndependentBalance(); // 可用资金风控
var independentWholePositionCheck = new IndependentWholePosition(); // 净值仓位风控
var independentOnePositionCheck = new IndependentOnePosition(); // 单票持仓风控
var independentTargetCheck = new IndependentTarget(); // 黑名单
var independentTimeAreaCheck = new IndependentTimeArea(); // 时间段
var independentCanSellVolumeCheck = new IndependentCanSellVolume(); // 独立风控
var independentPlacardsCheck = new IndependentPlacards(); // 举牌
var independentControTradeCheck = new IndependentControTrade(); // 对敲

// var unionOnePositionCheck = new UnionOnePosition(); // 联合风控，单票持仓 不需要，因为 前端基于有限的数据可能比后端基于全部数据的风控还要严格
var unionPlacardsCheck = new UnionPlacards(); // 联合风控，举牌
var unionControTradeCheck = new UnionControTrade(); // 联合风控，对敲