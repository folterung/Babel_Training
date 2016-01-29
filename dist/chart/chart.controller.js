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
    chart.innerRadius = 100;
    chart.outerRadius = 200;
    chart.initData = [100, 500, 1000];
    chart.duration = 250;
    chart.value = 0;
    chart.fill = fill;

    function fill(val) {
      chart.value = val;
    }
  }
});