import {HomeController} from 'HomeController';

let _HomeModule = angular.module('home.module', []);

_HomeModule.controller('HomeController', HomeController);

export var HomeModule = _HomeModule;