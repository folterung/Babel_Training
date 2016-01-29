define(['exports', 'Foltmeter2'], function (exports, _Foltmeter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.ChartDirective = ChartDirective;
  ChartDirective.$inject = [];

  function ChartDirective() {
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
      var target = '#' + attrs.id;
      var meter = new _Foltmeter.Foltmeter2(target, scope.chartInnerRadius, scope.chartOuterRadius, scope.chartSegmentMaxes);
      scope.$watch('chartValue', function (val) {
        if (val) {
          meter.set(val, scope.chartAnimationDuration);
        }
      });
    }
  }
});