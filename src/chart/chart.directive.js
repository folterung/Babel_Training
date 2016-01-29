import {Foltmeter2} from 'Foltmeter2';

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
    let target = '#' + attrs.id;

    let meter = new Foltmeter2(target, scope.chartInnerRadius, scope.chartOuterRadius, scope.chartSegmentMaxes);

    scope.$watch('chartValue', function(val) {
      if(val) {
        meter.set(val, scope.chartAnimationDuration);
      }
    });
  }
}