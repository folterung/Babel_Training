define(['exports', 'ChartController', 'ChartDirective'], function (exports, _ChartController, _ChartDirective) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ChartModule = undefined;

  var _ChartModule = angular.module('chart.module', []);

  _ChartModule.controller('ChartController', _ChartController.ChartController);

  _ChartModule.directive('chart', _ChartDirective.ChartDirective);

  var ChartModule = exports.ChartModule = _ChartModule;
});