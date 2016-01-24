define(['exports', 'FooterController'], function (exports, _FooterController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.FooterModule = undefined;

  var _FooterModule = angular.module('footer.module', []);

  _FooterModule.controller('FooterController', _FooterController.FooterController);

  var FooterModule = exports.FooterModule = _FooterModule;
});