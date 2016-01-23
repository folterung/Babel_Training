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

  var AUTHOR = 'Kevin Warnock';
  var SPACE = ' ';

  var BabelTrainingApp = exports.BabelTrainingApp = function () {
    var _BabelTrainingApp = function () {
      function _BabelTrainingApp() {
        _classCallCheck(this, _BabelTrainingApp);

        this.menu = {
          init: function init() {},
          show: function show() {},
          hide: function hide() {}
        };

        this.header = new html('header');
        this.content = new html('.content');
        this.footer = new html('footer');
      }

      _createClass(_BabelTrainingApp, [{
        key: 'init',
        value: function init() {
          var _this = this;

          this.header.addClass('active');
          this.footer.addClass('active');

          this.header.bind('transitionend', function () {
            _this.content.addClass('active');
            _this.header.unbind('transitionend');
          });
        }
      }], [{
        key: 'getAuthor',
        value: function getAuthor() {
          return AUTHOR;
        }
      }]);

      return _BabelTrainingApp;
    }();

    var html = function () {
      function html() {
        _classCallCheck(this, html);

        if (arguments.length < 1) {
          throw new ReferenceError('Invalid number of arguments');
        } else {
          this.element = _getElement(arguments[0]);
        }
      }

      _createClass(html, [{
        key: 'addClass',
        value: function addClass(className) {
          var regEx = /\w/g;

          if (regEx.test(this.element.className)) {
            this.element.className += SPACE;
          }

          this.element.className += className;
        }
      }, {
        key: 'removeClass',
        value: function removeClass(className) {
          var classes = this.element.className.split(SPACE);

          if (classes.length < 1) {
            return;
          }

          for (var i = 0; i < classes.length; i++) {
            if (classes[i] === className) {
              classes.splice(i, 1);
            }
          }

          this.element.className = classes.join(SPACE);

          return this;
        }
      }, {
        key: 'bind',
        value: function bind(eventName, cb) {
          this.element.addEventListener(eventName, cb);
        }
      }, {
        key: 'unbind',
        value: function unbind(eventName, cb) {
          this.element.removeEventListener(eventName, cb);
        }
      }]);

      return html;
    }();

    function _getElement(arg) {
      var elements = document.querySelectorAll(arg);

      if (elements.length < 2) {
        elements = elements[0];
      }

      return elements;
    }

    return new _BabelTrainingApp();
  }();
});