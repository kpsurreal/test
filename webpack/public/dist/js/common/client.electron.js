'use strict';

// 仅在使用electron打开网页时可用.
// Author: liuzeyafzy@gmail.com
// 注意：之前之所以能够支持是因为electron那边的index.html在子页面onload的时候提供了window.require方法
// 但是现在，已经可以直接使用top.window.require来获取方法了。

// 自定义错误码：
// 0: 成功
// 100: 文件失败
// 200: 内容不匹配
var __electron = {};
window.addEventListener('load', function () {
  __electron.getFs = function () {
    if (window.require && window.require('electron') && window.require('electron').remote && window.require('electron').remote.require('fs')) {
      __electron.fs = window.require('electron').remote.require('fs');
      return true;
    } else if (top.window.require && top.window.require('electron') && top.window.require('electron').remote && top.window.require('electron').remote.require('fs')) {
      __electron.fs = top.window.require('electron').remote.require('fs');
      return true;
    }
    return false;
  };
  // 加载时间不好确定，但是采用这样的方式是可以解决问题的。
  setTimeout(function () {
    __electron.getFs();
  }, 100);

  // 读取JSON文件全部，指定文件名、回调处理
  __electron.readFile = function (path, callback) {
    __electron.fs.readFile(path, 'utf8', function (err, data) {
      callback(err, data);
    });
  };

  // 读取JSON文件指定字段，指定文件名、字段名、回调处理
  __electron.getJsonDataByName = function (path, name, callback) {
    __electron.readFile(path, function (err, data) {
      if (err) {
        var rtn = {
          code: 101,
          msg: err.code,
          data: {}
        };

        callback(rtn);
        return;
      }

      if ('string' == typeof data) {
        var obj = JSON.parse(data);
        if (undefined == obj[name]) {
          var _rtn = {
            code: 201,
            msg: 'JSON文件中读不到该字段：' + name,
            data: {}
          };
          callback(_rtn);
          return;
        } else {
          var _rtn2 = {
            code: 0,
            msg: '读取成功',
            data: obj[name]
          };
          callback(_rtn2);
          return;
        }
      }
    });
  };

  // 修改JSON文件，指定文件名、字段名、字段值、回调处理
  // 顺便支持批量修改好了，字段名和字段值合成一个对象，再以数组的形式聚合
  __electron.setJsonDataByNames = function (path, dataArr, callback) {
    // 先准备好需要保存的新数据
    var newData = {};
    dataArr.forEach(function (e) {
      // let obj = {};
      newData[e.name] = e.value;
      // newData.push(obj)
    });

    var writeCallback = function writeCallback(err) {
      if (err) {
        callback({
          code: 101,
          msg: err.code,
          data: {}
        });
        return;
      }

      callback({
        code: 0,
        msg: '保存成功',
        data: {}
      });
    };

    __electron.readFile(path, function (err, data) {
      if (err) {
        // 读取错误，那么当文件不存在时，新增文件
        if (err.code === 'ENOENT') {
          __electron.fs.writeFile(path, JSON.stringify(newData), 'utf8', writeCallback);
          return;
        }
        callback({
          code: 102,
          msg: err.code,
          data: {}
        });
        return;
      }

      // 读取成功，data已经可以使用，覆盖需要修改的数据
      newData = Object.assign({}, JSON.parse(data), newData);
      __electron.fs.writeFile(path, JSON.stringify(newData), 'utf8', writeCallback);
    });
  };
}, true);
//# sourceMappingURL=client.electron.js.map
