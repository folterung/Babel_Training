import {FoltMeter} from 'FoltMeter';

ChartController.$inject = [];

export function ChartController() {
  var chart = this;
  var foltMeter = new FoltMeter(document.querySelector('.chart-container'));

  foltMeter.create();

  chart.text = 'Chart page!';
}