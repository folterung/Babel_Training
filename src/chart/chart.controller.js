import {Foltmeter2} from 'Foltmeter2';

ChartController.$inject = [];

export function ChartController() {
  let chart = this;

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