// modules are defined as an array
// [ module function, map of requires ]
//
// map of requires is short require name -> numeric require
//
// anything defined in a previous bundle is accessed via the
// orig method which is the require for previous bundles
parcelRequire = (function (modules, cache, entry, globalName) {
  // Save the require from previous bundle to this closure if any
  var previousRequire = typeof parcelRequire === 'function' && parcelRequire;
  var nodeRequire = typeof require === 'function' && require;

  function newRequire(name, jumped) {
    if (!cache[name]) {
      if (!modules[name]) {
        // if we cannot find the module within our internal map or
        // cache jump to the current global require ie. the last bundle
        // that was added to the page.
        var currentRequire = typeof parcelRequire === 'function' && parcelRequire;
        if (!jumped && currentRequire) {
          return currentRequire(name, true);
        }

        // If there are other bundles on this page the require from the
        // previous one is saved to 'previousRequire'. Repeat this as
        // many times as there are bundles until the module is found or
        // we exhaust the require chain.
        if (previousRequire) {
          return previousRequire(name, true);
        }

        // Try the node require function if it exists.
        if (nodeRequire && typeof name === 'string') {
          return nodeRequire(name);
        }

        var err = new Error('Cannot find module \'' + name + '\'');
        err.code = 'MODULE_NOT_FOUND';
        throw err;
      }

      localRequire.resolve = resolve;
      localRequire.cache = {};

      var module = cache[name] = new newRequire.Module(name);

      modules[name][0].call(module.exports, localRequire, module, module.exports, this);
    }

    return cache[name].exports;

    function localRequire(x){
      return newRequire(localRequire.resolve(x));
    }

    function resolve(x){
      return modules[name][1][x] || x;
    }
  }

  function Module(moduleName) {
    this.id = moduleName;
    this.bundle = newRequire;
    this.exports = {};
  }

  newRequire.isParcelRequire = true;
  newRequire.Module = Module;
  newRequire.modules = modules;
  newRequire.cache = cache;
  newRequire.parent = previousRequire;
  newRequire.register = function (id, exports) {
    modules[id] = [function (require, module) {
      module.exports = exports;
    }, {}];
  };

  var error;
  for (var i = 0; i < entry.length; i++) {
    try {
      newRequire(entry[i]);
    } catch (e) {
      // Save first error but execute all entries
      if (!error) {
        error = e;
      }
    }
  }

  if (entry.length) {
    // Expose entry point to Node, AMD or browser globals
    // Based on https://github.com/ForbesLindesay/umd/blob/master/template.js
    var mainExports = newRequire(entry[entry.length - 1]);

    // CommonJS
    if (typeof exports === "object" && typeof module !== "undefined") {
      module.exports = mainExports;

    // RequireJS
    } else if (typeof define === "function" && define.amd) {
     define(function () {
       return mainExports;
     });

    // <script>
    } else if (globalName) {
      this[globalName] = mainExports;
    }
  }

  // Override the current require with this new one
  parcelRequire = newRequire;

  if (error) {
    // throw error from earlier, _after updating parcelRequire_
    throw error;
  }

  return newRequire;
})({"epB2":[function(require,module,exports) {
var $siteList = $('.siteList');
var $lastLi = $siteList.find('li.last'); // $lastLi 表示添加网站的按钮(找出siteList中带有last这个类名的li)

var x = localStorage.getItem('x'); // 让变量x接受localStorage里x的值

var xObject = JSON.parse(x); // 将字符串类型转换为对象

var hashMap = xObject || [// 如果xObject是空的，就给它后面一个初始值,否则就用xObject里的值。localStorage里面没有数据时就给两个基础网站,没有数据时就相当于第一次进入。
{
  logo: 'A',
  url: 'https://www.acfun.cn'
}, {
  logo: 'B',
  url: 'https://www.bilibili.com'
}]; // 声明一个简化网址的函数

var simplifyUrl = function simplifyUrl(url) {
  return url.replace('https://', '').replace('http://', '').replace('www.', '').replace(/\/.*/, ''); //利用正则表达式将/后面的所有字符串替换为空字符串
}; // 封装一个函数render，作用是读取haspMap数据用来创建新网址


var render = function render() {
  $siteList.find('li:not(.last)').remove(); // 找出siteList里面的li(不包括.last类的li)并将其删除，渲染网页的函数大部分都需要先清楚数据，再重新通过遍历添加网页。

  hashMap.forEach(function (node, index) {
    // 遍历haspMap数组，node指的是数组里面的每一个对象。主要目的是用哈希数组里面的网址数据来创建每一个li模块，并插入到添加按钮前面。
    var $li = $("<li>\n                        <div class=\"site\">\n                            <div class=\"logo\">".concat(node.logo, "</div>\n                            <div class=\"link\">").concat(simplifyUrl(node.url), "</div>\n                            <div class=\"close\">\n                                <svg class=\"icon\">\n                                    <use xlink:href=\"#icon-close\"></use>\n                                </svg>\n                            </div>\n                        </div>\n                </li>")).insertBefore($lastLi);
    $li.on('click', function () {
      // 给每个li绑定点击事件，只要点击li就会打开网页
      window.open(node.url);
    });
    $li.on('click', '.close', function (e) {
      // 给每个li里面的close绑定点击事件，点击了li里面的close部分，会删除该网站
      e.stopPropagation(); //阻止冒泡，防止打开网页

      hashMap.splice(index, 1); //删除网址

      render();
    });
  });
};

render(); // 渲染一次网页

$('.addButton').on('click', function () {
  var url = window.prompt('请输入您要添加的网址：');

  if (url.indexOf('http') !== 0) {
    // 如果网站不是以http开头的，就增加上https://
    url = 'https://' + url;
  }

  console.log(url);
  console.log($siteList);
  hashMap.push( // 把需要添加的网址信息储存到haspMap里面
  {
    logo: simplifyUrl(url)[0].toUpperCase(),
    url: url
  });
  render(); // 添加新网址后又渲染一次网页
});

window.onbeforeunload = function () {
  // 离开页面时就将数据储存到localStorage里面
  var string = JSON.stringify(hashMap); // localStorage只能储存字符串，所以要将hashMap转换为字符串

  localStorage.setItem('x', string); // 在本地储存中设置一个x，它的值是string
};

$(document).on('keypress', function (e) {
  var key = e.key; // const key = e.key的简写;

  for (var i = 0; i < hashMap.length; i++) {
    if (hashMap[i].logo.toLowerCase() === key) window.open(hashMap[i].url);
  }
});
},{}]},{},["epB2"], null)
//# sourceMappingURL=main.1d358b5b.js.map