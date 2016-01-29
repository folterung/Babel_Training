define(['exports', 'Foltmeter2'], function (exports, _Foltmeter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ChartController = ChartController;
  ChartController.$inject = [];

  function ChartController() {
    var chart = this;
    chart.text = 'Chart page!';
    chart.innerRadius = 50;
    chart.outerRadius = 80;
    chart.initData = [100, 500, 1000];
    chart.duration = 750;
    chart.value = 0;
    chart.fill = fill;

    function fill(val) {
      chart.value = val;
    }
  }
});