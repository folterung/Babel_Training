import {Foltmeter2} from 'Foltmeter2';

ChartController.$inject = [];

export function ChartController() {
  let chart = this;

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