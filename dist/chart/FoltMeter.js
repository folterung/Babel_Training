define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var FoltMeter = exports.FoltMeter = function () {
    function FoltMeter() {
      _classCallCheck(this, FoltMeter);

      checkD3();
    }

    _createClass(FoltMeter, null, [{
      key: 'checkD3',
      value: function checkD3() {
        if (!window.d3) {
          throw new ReferenceError('d3.js is required for FoltMeter!');
        }
      }
    }]);

    return FoltMeter;
  }();
});