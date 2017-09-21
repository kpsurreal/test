'use strict';

// 之前代码中遗留了localStorage的方法，特别是有清空localStorage的操作，后续需要避免。
// 如果不能避免，也应该将localStorage的方法统一放在这个文件中。
// 因为历史遗留问题，散落在各处的localStorage方法还未挪到本文件中。
var __localStorage = {};

__localStorage.getJsonItem = function (path, name, callback) {
  var data = localStorage.getItem(path);
  if (data) {
    data = JSON.parse(data);
    if (data[name]) {
      callback({
        code: 0,
        msg: '读取成功',
        data: data[name]
      });
    } else {
      callback({
        code: 201,
        msg: '读不到该字段：' + name,
        data: {}
      });
    }
  } else {
    // 没有获取到数据
    callback({
      code: 202,
      msg: '读不到该文件：' + path,
      data: {}
    });
  }
};

__localStorage.setJsonItem = function (path, dataArr, callback) {
  var newData = {};
  dataArr.forEach(function (e) {
    newData[e.name] = e.value;
  });

  var data = localStorage.getItem(path);
  if (data) {
    data = JSON.parse(data);
    newData = Object.assign({}, data, newData);
    localStorage.setItem(path, JSON.stringify(newData));
    callback({
      code: 0,
      msg: '保存成功',
      data: {}
    });
  } else {
    // 没有获取到数据，新增
    localStorage.setItem(path, JSON.stringify(newData));
    callback({
      code: 0,
      msg: '保存成功',
      data: {}
    });
  }
};
//# sourceMappingURL=localStorage.js.map
