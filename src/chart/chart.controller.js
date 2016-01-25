import {FoltMeter} from 'FoltMeter';

ChartController.$inject = [];

export function ChartController() {
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