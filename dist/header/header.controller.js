define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.HeaderController = HeaderController;

  function HeaderController() {
    var header = this;
    header.title = 'Babel Training';
    header.subtext = 'Simple application to demonstrate babel';
    header.menu = {
      links: {
        home: {
          title: 'Home link',
          text: 'Home'
        },
        chart: {
          title: 'Chart link',
          text: 'Chart'
        }
      }
    };
  }
});