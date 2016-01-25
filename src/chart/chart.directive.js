import {FoltMeter} from 'FoltMeter';

ChartDirective.$inject = [];

export function ChartDirective() {
  return {
    restrict: 'A',
    scope: {
      chartInnerRadius: '=',
      chartOuterRadius: '=',
      chartSegmentMaxes: '=',
      chartAnimationDuration: '=',
      chartValue: '='
    },
    link: link
  };

  function link(scope, element, attrs) {
    //var foltMeter = new FoltMeter('.chart-container', 55, 80, [100, 500, 1000]);
    let target = '#' + attrs.id;

    let meter = new FoltMeter(target, scope.chartInnerRadius, scope.chartOuterRadius, scope.chartSegmentMaxes);

    scope.$watch('chartValue', function(val) {
      if(val) {
        meter.set(val, scope.chartAnimationDuration);
      }
    });
  }
}