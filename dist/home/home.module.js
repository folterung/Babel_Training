define(['exports', 'HomeController'], function (exports, _HomeController) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HomeModule = undefined;

  var _HomeModule = angular.module('home.module', []);

  _HomeModule.controller('HomeController', _HomeController.HomeController);

  var HomeModule = exports.HomeModule = _HomeModule;
});