define(['exports', 'ChartController'], function (exports, _ChartController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ChartModule = undefined;

  var _ChartModule = angular.module('chart.module', []);

  _ChartModule.controller('ChartController', _ChartController.ChartController);

  var ChartModule = exports.ChartModule = _ChartModule;
});