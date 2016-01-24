define(['exports', 'HeaderController'], function (exports, _HeaderController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HeaderModule = undefined;

  var _HeaderModule = angular.module('header.module', []);

  _HeaderModule.controller('HeaderController', _HeaderController.HeaderController);

  var HeaderModule = exports.HeaderModule = _HeaderModule;
});