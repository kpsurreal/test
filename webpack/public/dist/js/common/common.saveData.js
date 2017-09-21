'use strict';

// 数据处理
// 具体操作依赖client.electron.js和localStorage.js里面提供的方法
// 注意，所有与electron客户端打交道的方法，均必须在onload之后才能执行。

// 就页面排序相关举例：
// 1. 报表产品组排序             {report_group__group_order: {field_sort: [00001, 00006, 00003, 00004, 00001]}}
// 2. 报表产品内部表格排序        {report_group__grid_order: {field_sort: ["security_type_name", "security_id"], order: "desc", order_by: "security_type_name"}}
// 3. 数据查询页面：资产查询列表   {report_list__assets_order: {field_sort: [], order: "desc", order_by: "security_type_name"}}
// 4. 数据查询页面：委托查询列表   {report_list__entrust_order: {field_sort: [], order: "desc", order_by: "security_type_name"}}
// 5. 数据查询页面：成交查询列表   {report_list__deal_order: {field_sort: [], order: "desc", order_by: "security_type_name"}}
// 6. 数据查询页面：持仓查询列表   {report_list__position_order: {field_sort: [], order: "desc", order_by: "security_type_name"}}

var fileName = 'localStorage.json';

var common_storage = {};

// 查询数据
common_storage.getItem = function (name, callback) {
  // 判断是否有fs方法，即是否在electron客户端打开
  if (__electron.fs || __electron.getFs && __electron.getFs()) {
    __electron.getJsonDataByName(fileName, name, function (rtn) {
      if (callback instanceof Function) {
        callback(rtn);
      }
    });
  } else {
    __localStorage.getJsonItem(fileName, name, function (rtn) {
      if (callback instanceof Function) {
        callback(rtn);
      }
    });
  }
};

// 保存数据
common_storage.setItem = function (name, value, callback) {
  // 判断是否有fs方法，即是否在electron客户端打开
  if (__electron.fs || __electron.getFs && __electron.getFs()) {
    __electron.setJsonDataByNames(fileName, [{ name: name, value: value }], function (rtn) {
      if (callback instanceof Function) {
        callback(rtn);
      }
    });
  } else {
    __localStorage.setJsonItem(fileName, [{ name: name, value: value }], function (rtn) {
      if (callback instanceof Function) {
        callback(rtn);
      }
    });
  }
};
//# sourceMappingURL=common.saveData.js.map
