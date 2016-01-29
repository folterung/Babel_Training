let uniqueCounter = 0;

export class Foltmeter2 {
  selector;
  container;
  svg;
  arc;
  colors;
  minVals;
  maxVals;
  groups;
  direction;
  duration;
  maxValue = 0;
  fillValue = 0;
  currentMeterValue = 0;
  targetMeterValue = 0;
  startIndex = 0;
  animationIndex = 0;
  paths = [];
  sortedPaths = [];
  pathIDs = [];
  svgData = {
    min: [],
    max: []
  };

  constructor(selector, innerRadius, outerRadius, inputData) {
    let self = this;
    let id = _getUniqueID();
    let minPathValue = 0;
    let maxPathValue = 0;

    let ranges = [
      [-90, -55],
      [-51, 10],
      [14,  90]
    ];

    let dataSet = [
      [0, inputData[0]],
      [0, inputData[1]],
      [0, inputData[2]]
    ];

    this.container = d3.select(selector);
    this.svg = this.container.append('svg');
    this.colors = ['#CFD8DC', '#455A64'];
    this.width = outerRadius * 2;
    this.height = outerRadius * 2;

    this.arc = d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius);

    this.minVals = [0, 0, 0];

    this.maxVals = inputData;

    this.maxVals.map((val) => {
      this.maxValue += val;
    });

    this.groups = [
      this.svg.append('g'),
      this.svg.append('g')
    ];

    this.svg.attr('width', this.width);
    this.svg.attr('height', this.height/2);

    this.svg.selectAll('g').attr('transform', 'translate(' + this.width/2 + ',' + (this.height/2) + ')');

    this.groups.map((group, i) => {
      let data = i > 0 ? this.createDataset(dataSet, ranges) : this.createMaxDataset(ranges);

      this.groups[i].selectAll('path')
        .data(data)
        .enter()
        .append('path')
        .attr('fill', this.colors[[i]])
        .attr('d', this.arc)
        .each(function(d, index) {
          if(i > 0) {
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

    this.paths.map((path, i) => {
      minPathValue = (i === 0) ? 0 : self.svgData.max[i-1];
      maxPathValue += self.svgData.max[i] - self.svgData.min[i];

      path.__foltmeter__.svgData = [self.svgData.min[i], self.svgData.max[i]];
      path.__foltmeter__.evalData = [minPathValue, maxPathValue];

      path.__foltmeter__.pointValue = (this.maxValue * ((self.svgData.max[i] - self.svgData.min[i]) / this.maxValue)) / path.__foltmeter__.data[1];
      path.__foltmeter__.minPointsAvailable = minPathValue * path.__foltmeter__.pointValue;
      path.__foltmeter__.maxPointsAvailable = path.__foltmeter__.pointValue * path.__foltmeter__.data[1];
    });
  }

  createMaxDataset(rangeSet) {
    let temp = [];

    rangeSet.map((ranges) => {
      temp.push(_setSingleVal(0, _rad(ranges[0]), _rad(ranges[1])));
    });
    return temp;
  }

  createDataset(data, rangeSet) {
    let temp = [];

    rangeSet.map((ranges, i) => {
      temp.push(_setSingleVal(data[i][0], _rad(ranges[0]), _getPercentVal(data[i][0], data[i][1], ranges[0], ranges[1])));
    });

    return temp;
  }

  set(value, duration) {
    this.groups[1].selectAll('path').transition();
    this.targetMeterValue = 0;
    this.fillValue = value;
    this.duration = duration;

    _setValues.call(this);
    _draw.call(this);
  }
}

function _draw() {
  let chunk = this.duration / 3;
  let paths = this.sortedPaths;
  var max = 0;
  let currentMax = 0;

  _updatePath.call(this, this.startIndex, false);

  function _updatePath(i, interrupted) {
    let self = this;
    let pathNode;
    let pathData;

    if(!paths[i]) {
      return;
    }

    pathNode = paths[i][0][0];
    pathData = pathNode.__foltmeter__;
    currentMax += pathNode.getTotalLength() - pathData.svgData[0];
    max += pathData.svgData[1] - pathData.svgData[0];

    if(this.direction === 0 && (currentMax === max)) {
      _updatePath.call(self, _iterate.call(self, i));
      return;
    } else if(this.direction < 0 && (pathNode.getTotalLength() - pathData.svgData[0]) === 0) {
      _updatePath.call(self, _iterate.call(self, i));
      return;
    }

    paths[i]
      .data(_createSingleDataset.call(self, i))
      .transition()
      .duration(chunk)
      .ease('linear')
      .each('end', function() {
        _updatePath.call(self, _iterate.call(self, i));
      })
      .attrTween('d', _arcTween(self.arc));
  }
}

function _animationIterator(i) {
  return (this.direction < 0) ? (i < this.animationIndex) : (i > this.animationIndex);
}

function _iterate(i) {
  return (this.direction < 0) ? i-1 : i+1;
}

function _arcTween(inputArc) {
  let arc = inputArc;

  return function(a) {
    var i = d3.interpolate(this._current, a);
    this._current = i(0);
    return function (t) {
      return arc(i(t));
    };
  };
}

function _createSingleDataset(i) {
  let data = this.paths[i].__foltmeter__.data;
  let range = this.paths[i].__foltmeter__.range;

  return [_setSingleVal(data[0], _rad(range[0]), _getPercentVal(data[0], data[1], range[0], range[1]))];
}

function _setValues() {
  let max;

  this.paths.map((path) => {
    max = path.__foltmeter__.data[1];

    if(this.fillValue > max) {
      this.fillValue -= max;

      path.__foltmeter__.points = path.__foltmeter__.pointValue * max;
      path.__foltmeter__.data[0] = max;

      this.targetMeterValue += path.__foltmeter__.pointValue * path.__foltmeter__.data[0];
    } else {
      path.__foltmeter__.points = path.__foltmeter__.pointValue * this.fillValue;
      path.__foltmeter__.data[0] = this.fillValue;

      this.fillValue = 0;
      this.targetMeterValue += path.__foltmeter__.pointValue * path.__foltmeter__.data[0];
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
  let percentage = num1/num2;
  let delta = Math.abs(minDeg - maxDeg);
  let degDiff = delta * percentage;
  let newDeg = minDeg + degDiff;

  if(percentage === 1 && (newDeg) !== maxDeg) {
    newDeg *= -1;
  }

  return _rad(newDeg);
}

function _getUniqueID() {
  let id = '1337-' + uniqueCounter + '-foltmeter-path-';

  uniqueCounter++;

  return id;
}

function _setCurrentMeterValue() {
  let meterValue = 0;
  let maxValue = 0;

  this.paths.map((path) => {
    meterValue += path.getTotalLength() - path.__foltmeter__.svgData[0];
    maxValue += path.__foltmeter__.svgData[1] - path.__foltmeter__.svgData[0];
  });

  this.currentMeterValue = meterValue;
}

function _setStartIndex() {
  let meterValue = this.currentMeterValue;
  let pathData;

  this.animationIndex = 0;

  for(let i = 0; i < this.paths.length-1; i++) {

    pathData = this.paths[i].__foltmeter__.evalData;

    if((meterValue > pathData[0] && meterValue <= pathData[1]) || meterValue === 0) {
      this.animationIndex = i;
      return;
    }
  }
}

function _setDirection() {
  this.direction = (this.targetMeterValue < this.currentMeterValue) ? -1 : 0;
}

function _setOrder() {
  let group = this.groups[1];
  this.sortedPaths = [
    group.select('path:nth-child(1)'),
    group.select('path:nth-child(2)'),
    group.select('path:nth-child(3)')
  ];

  this.startIndex = (this.direction < 0) ? (this.sortedPaths.length-1 - this.animationIndex) : (0 + this.animationIndex);
}