define(['exports', 'FoltMeter'], function (exports, _FoltMeter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ChartController = ChartController;
  ChartController.$inject = [];

  function ChartController() {
    var chart = this;
    var foltMeter = new _FoltMeter.FoltMeter(document.querySelector('.chart-container'));
    foltMeter.create();
    chart.text = 'Chart page!';
  }
});