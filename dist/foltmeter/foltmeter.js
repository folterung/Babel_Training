define(['exports'], function (exports) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }

  var _createClass = function () {
    function defineProperties(target, props) {
      for (var i = 0; i < props.length; i++) {
        var descriptor = props[i];
        descriptor.enumerable = descriptor.enumerable || false;
        descriptor.configurable = true;
        if ("value" in descriptor) descriptor.writable = true;
        Object.defineProperty(target, descriptor.key, descriptor);
      }
    }

    return function (Constructor, protoProps, staticProps) {
      if (protoProps) defineProperties(Constructor.prototype, protoProps);
      if (staticProps) defineProperties(Constructor, staticProps);
      return Constructor;
    };
  }();

  var FoltMeter = exports.FoltMeter = function () {
    function FoltMeter(selector, innerRadius, outerRadius, data) {
      var _this = this;

      _classCallCheck(this, FoltMeter);

      this.checkD3();
      this.container = d3.select(selector);
      this.width = outerRadius * 2;
      this.height = outerRadius * 2;
      this.colors = ['#CFD8DC', '#455A64'];
      this.svg = this.container.append('svg');
      this.masterGroup = this.svg.append('g');

      this.arcs = [{
        self: d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius),
        range: [-90, -55],
        minValue: 0,
        maxValue: data[0]
      }, {
        self: d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius),
        range: [-53, 10],
        minValue: 0,
        maxValue: data[1]
      }, {
        self: d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius),
        range: [12, 90],
        minValue: 0,
        maxValue: data[2]
      }];

      this.groups = [this.masterGroup.append('g'), this.masterGroup.append('g'), this.masterGroup.append('g')];

      this.svg.attr('width', this.width).attr('height', this.height / 2);
      this.masterGroup.attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

      this.groups.map(function (group, index) {
        _this.groups[index].selectAll('path').data(_createDataset(_this.arcs[index])).enter().append('path').attr('fill', function (d, i) {
          return _this.colors[i];
        }).attr('d', _this.arcs[index].self).each(function (d) {
          this._current = d;
        });
      });
    }

    _createClass(FoltMeter, [{
      key: 'set',
      value: function set(value, duration) {
        var reverse = value < this.value;
        duration = duration || 0;

        this.udpateArcs(value, duration);
        this.updateGroups(duration, reverse);
        this.value = value;
      }
    }, {
      key: 'udpateArcs',
      value: function udpateArcs(value) {
        var arcs = this.arcs;
        var arc = undefined;

        for (var i = 0; i < arcs.length; i++) {
          arc = arcs[i];

          if (value > arc.maxValue) {
            value -= arc.maxValue;
            arc.minValue = arc.maxValue;
          } else {
            arc.minValue = value;
            value = 0;
          }
        }
      }
    }, {
      key: 'updateGroups',
      value: function updateGroups(duration, reverse) {
        var groups = this.groups;
        var arcs = this.arcs;
        var durationChunk = duration / groups.length;
        var delays = [];

        for (var i = 0; i < groups.length; i++) {
          delays.push(durationChunk * i);
        }

        if (reverse) {
          delays.reverse();
        }

        for (var i = 0; i < groups.length; i++) {
          this.draw(groups[i], arcs[i].self, _createDataset(arcs[i]), durationChunk, delays[i]);
        }
      }
    }, {
      key: 'arcTween',
      value: function arcTween(inputArc) {
        var arc = inputArc;

        return function (a) {
          var i = d3.interpolate(this._current, a);
          this._current = i(0);
          return function (t) {
            return arc(i(t));
          };
        };
      }
    }, {
      key: 'draw',
      value: function draw(group, arc, data, duration, delay) {
        group.selectAll("path").data(data).transition().delay(delay || 0).duration(duration).ease('linear').attrTween("d", this.arcTween(arc));
      }
    }, {
      key: 'checkD3',
      value: function checkD3() {
        if (!window.d3) {
          throw new ReferenceError('d3.js is required for FoltMeter!');
        }
      }
    }]);

    return FoltMeter;
  }();

  function _rad(deg) {
    return deg * (Math.PI / 180);
  }

  function _setSingleVal(val, minRad, maxRad) {
    return {
      data: val,
      startAngle: minRad,
      endAngle: maxRad,
      value: val
    };
  }

  function _getPercentVal(num1, num2, minDeg, maxDeg) {
    var percentage = num1 / num2;
    var delta = Math.abs(minDeg - maxDeg);
    var degDiff = delta * percentage;
    var newDeg = minDeg + degDiff;

    if (percentage === 1 && newDeg !== maxDeg) {
      newDeg *= -1;
    }

    return _rad(newDeg);
  }

  function _createDataset(arc) {
    return [_setSingleVal(arc.minValue, _rad(arc.range[0]), _rad(arc.range[1])), _setSingleVal(arc.minValue, _rad(arc.range[0]), _getPercentVal(arc.minValue, arc.maxValue, arc.range[0], arc.range[1]))];
  }

  function _getDelays(groups, arcs, duration, flip) {
    var delays = [];
    var currentArc = undefined;
    var nextArc = undefined;
    var durationChunk = duration / groups.length;

    if (flip) {
      for (var i = 0; i < groups.length; i++) {
        delays.push(duration * i);
      }
    } else {
      for (var i = 0; i < groups.length; i++) {
        currentArc = arcs[i];
        nextArc = arcs[i + 1];

        if (_arcHasValue(currentArc)) {
          delays.push(0);
        } else {
          delays.push(durationChunk);
          durationChunk += durationChunk;
        }
      }
    }

    function _arcHasValue(arc) {
      return arc.minValue > 0;
    }

    function _arcIsFull(arc) {
      return arc.minValue === arc.maxValue;
    }

    function _arcIsEmpty(arc) {
      return arc && arc.minValue === 0;
    }

    return delays;
  }
});