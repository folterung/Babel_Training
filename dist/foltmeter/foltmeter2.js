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

  var uniqueCounter = 0;

  var Foltmeter2 = exports.Foltmeter2 = function () {
    function Foltmeter2(selector, innerRadius, outerRadius, inputData) {
      var _this = this;

      _classCallCheck(this, Foltmeter2);

      this.maxValue = 0;
      this.fillValue = 0;
      this.currentMeterValue = 0;
      this.targetMeterValue = 0;
      this.startIndex = 0;
      this.animationIndex = 0;
      this.paths = [];
      this.sortedPaths = [];
      this.pathIDs = [];
      this.svgData = {
        min: [],
        max: []
      };

      var self = this;
      var id = _getUniqueID();
      var minPathValue = 0;
      var maxPathValue = 0;

      var ranges = [[-90, -55], [-51, 10], [14, 90]];

      var dataSet = [[0, inputData[0]], [0, inputData[1]], [0, inputData[2]]];

      this.container = d3.select(selector);
      this.svg = this.container.append('svg');
      this.colors = ['#CFD8DC', '#455A64'];
      this.width = outerRadius * 2;
      this.height = outerRadius * 2;

      this.arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);

      this.minVals = [0, 0, 0];

      this.maxVals = inputData;

      this.maxVals.map(function (val) {
        _this.maxValue += val;
      });

      this.groups = [this.svg.append('g'), this.svg.append('g')];

      this.svg.selectAll('g').attr('transform', 'translate(' + this.width / 2 + ',' + this.height / 2 + ')');

      this.groups.map(function (group, i) {
        var data = i > 0 ? _this.createDataset(dataSet, ranges) : _this.createMaxDataset(ranges);

        _this.groups[i].selectAll('path').data(data).enter().append('path').attr('fill', _this.colors[[i]]).attr('d', _this.arc).each(function (d, index) {
          if (i > 0) {
            this.setAttribute('id', id + index);
            self.pathIDs.push(id + index);
            self.svgData.min.push(this.getTotalLength());
            this.__foltmeter__ = {
              data: [0, inputData[index]],
              range: ranges[index]
            };

            self.paths.push(this);
          } else {
            self.svgData.max.push(this.getTotalLength());
          }

          this._current = d;
        });
      });

      this.paths.map(function (path, i) {
        minPathValue = i === 0 ? 0 : self.svgData.max[i - 1];
        maxPathValue += self.svgData.max[i] - self.svgData.min[i];

        path.__foltmeter__.svgData = [self.svgData.min[i], self.svgData.max[i]];
        path.__foltmeter__.evalData = [minPathValue, maxPathValue];

        path.__foltmeter__.pointValue = _this.maxValue * ((self.svgData.max[i] - self.svgData.min[i]) / _this.maxValue) / path.__foltmeter__.data[1];
        path.__foltmeter__.minPointsAvailable = minPathValue * path.__foltmeter__.pointValue;
        path.__foltmeter__.maxPointsAvailable = path.__foltmeter__.pointValue * path.__foltmeter__.data[1];
      });
    }

    _createClass(Foltmeter2, [{
      key: 'createMaxDataset',
      value: function createMaxDataset(rangeSet) {
        var temp = [];

        rangeSet.map(function (ranges) {
          temp.push(_setSingleVal(0, _rad(ranges[0]), _rad(ranges[1])));
        });
        return temp;
      }
    }, {
      key: 'createDataset',
      value: function createDataset(data, rangeSet) {
        var temp = [];

        rangeSet.map(function (ranges, i) {
          temp.push(_setSingleVal(data[i][0], _rad(ranges[0]), _getPercentVal(data[i][0], data[i][1], ranges[0], ranges[1])));
        });

        return temp;
      }
    }, {
      key: 'set',
      value: function set(value, duration) {
        this.groups[1].selectAll('path').transition();
        this.targetMeterValue = 0;
        this.fillValue = value;
        this.duration = duration;

        _setValues.call(this);
        _draw.call(this);
      }
    }]);

    return Foltmeter2;
  }();

  function _draw() {
    var chunk = this.duration / 3;
    var paths = this.sortedPaths;
    var max = 0;
    var currentMax = 0;

    _updatePath.call(this, this.startIndex, false);

    function _updatePath(i, interrupted) {
      var self = this;
      var pathNode = undefined;
      var pathData = undefined;

      if (!paths[i]) {
        return;
      }

      pathNode = paths[i][0][0];
      pathData = pathNode.__foltmeter__;
      currentMax += pathNode.getTotalLength() - pathData.svgData[0];
      max += pathData.svgData[1] - pathData.svgData[0];

      if (this.direction === 0 && currentMax === max) {
        _updatePath.call(self, _iterate.call(self, i));

        return;
      } else if (this.direction < 0 && pathNode.getTotalLength() - pathData.svgData[0] === 0) {
        _updatePath.call(self, _iterate.call(self, i));

        return;
      }

      paths[i].data(_createSingleDataset.call(self, i)).transition().duration(chunk).ease('linear').each('end', function () {
        _updatePath.call(self, _iterate.call(self, i));
      }).attrTween('d', _arcTween(self.arc));
    }
  }

  function _animationIterator(i) {
    return this.direction < 0 ? i < this.animationIndex : i > this.animationIndex;
  }

  function _iterate(i) {
    return this.direction < 0 ? i - 1 : i + 1;
  }

  function _arcTween(inputArc) {
    var arc = inputArc;
    return function (a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function (t) {
        return arc(i(t));
      };
    };
  }

  function _createSingleDataset(i) {
    var data = this.paths[i].__foltmeter__.data;
    var range = this.paths[i].__foltmeter__.range;
    return [_setSingleVal(data[0], _rad(range[0]), _getPercentVal(data[0], data[1], range[0], range[1]))];
  }

  function _setValues() {
    var _this2 = this;

    var max = undefined;
    this.paths.map(function (path) {
      max = path.__foltmeter__.data[1];

      if (_this2.fillValue > max) {
        _this2.fillValue -= max;
        path.__foltmeter__.points = path.__foltmeter__.pointValue * max;
        path.__foltmeter__.data[0] = max;
        _this2.targetMeterValue += path.__foltmeter__.pointValue * path.__foltmeter__.data[0];
      } else {
        path.__foltmeter__.points = path.__foltmeter__.pointValue * _this2.fillValue;
        path.__foltmeter__.data[0] = _this2.fillValue;
        _this2.fillValue = 0;
        _this2.targetMeterValue += path.__foltmeter__.pointValue * path.__foltmeter__.data[0];
      }
    });

    _setCurrentMeterValue.call(this);

    _setDirection.call(this);

    _setStartIndex.call(this);

    _setOrder.call(this);
  }

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

  function _getUniqueID() {
    var id = '1337-' + uniqueCounter + '-foltmeter-path-';
    uniqueCounter++;
    return id;
  }

  function _setCurrentMeterValue() {
    var meterValue = 0;
    var maxValue = 0;
    this.paths.map(function (path) {
      meterValue += path.getTotalLength() - path.__foltmeter__.svgData[0];
      maxValue += path.__foltmeter__.svgData[1] - path.__foltmeter__.svgData[0];
    });
    this.currentMeterValue = meterValue;
  }

  function _setStartIndex() {
    var meterValue = this.currentMeterValue;
    var pathData = undefined;
    this.animationIndex = 0;

    for (var i = 0; i < this.paths.length - 1; i++) {
      pathData = this.paths[i].__foltmeter__.evalData;

      if (meterValue > pathData[0] && meterValue <= pathData[1] || meterValue === 0) {
        this.animationIndex = i;
        return;
      }
    }
  }

  function _setDirection() {
    this.direction = this.targetMeterValue < this.currentMeterValue ? -1 : 0;
  }

  function _setOrder() {
    var group = this.groups[1];
    this.sortedPaths = [group.select('path:nth-child(1)'), group.select('path:nth-child(2)'), group.select('path:nth-child(3)')];
    this.startIndex = this.direction < 0 ? this.sortedPaths.length - 1 - this.animationIndex : 0 + this.animationIndex;
  }
});