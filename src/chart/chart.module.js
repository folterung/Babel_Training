import {ChartController} from 'ChartController';
import {ChartDirective} from 'ChartDirective';

var _ChartModule = angular.module('chart.module', []);

_ChartModule.controller('ChartController', ChartController);
_ChartModule.directive('chart', ChartDirective);

export var ChartModule = _ChartModule;