export class FoltMeter {
  container;
  width;
  height;
  colors;
  svg;
  arcs;
  arcState;
  groups;
  value;

  constructor(selector, innerRadius, outerRadius, data) {
    FoltMeter.checkD3();
    this.container = d3.select(selector);
    this.width = outerRadius * 2;
    this.height = outerRadius * 2;
    this.colors = ['#CFD8DC', '#455A64'];
    this.svg = this.container.append('svg');
    this.masterGroup = this.svg.append('g');

    this.arcs = [
      {
        self: d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius),
        range: [-90, -55],
        minValue: 0,
        maxValue: data[0]
      },
      {
        self: d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius),
        range: [-53, 10],
        minValue: 0,
        maxValue: data[1]
      },
      {
        self: d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius),
        range: [12, 90],
        minValue: 0,
        maxValue: data[2]
      }
    ];

    this.groups = [
      this.masterGroup.append('g'),
      this.masterGroup.append('g'),
      this.masterGroup.append('g')
    ];

    this.svg.attr('width', this.width).attr('height', this.height / 2);
    this.masterGroup.attr('transform', 'translate(' + this.width/2 + ',' + (this.height/2) + ')');

    this.groups.map((group, index) => {
      this.groups[index].selectAll('path')
        .data(_createDataset(this.arcs[index]))
        .enter()
        .append('path')
        .attr('fill', (d, i) => {
          return this.colors[i];
        })
        .attr('d', this.arcs[index].self)
        .each(function(d) {
          this._current = d;
        });
    });
  }

  set(value, duration) {
    let reverse = value < this.value;
    duration = duration || 0;

    this.udpateArcs(value);
    this.updateGroups(duration, reverse);
    this.value = value;
  }

  udpateArcs(value) {
    let arcs = this.arcs;
    let arc;

    for(var i = 0; i < arcs.length; i++) {
      arc = arcs[i];

      if(value > arc.maxValue) {
        value -= arc.maxValue;
        arc.minValue = arc.maxValue;
      } else {
        arc.minValue = value;
        value = 0;
      }
    }
  }

  updateGroups(duration, reverse) {
    let groups = this.groups;
    let arcs = this.arcs;
    let chunk = duration / groups.length;
    let marker = this.getCurrentState(reverse);
    let delays = [];
    let counter = 0;

    if(!reverse) {
      groups.map((group, i) => {
        if(i < marker) {
          delays.push(0);
        } else {
          delays.push(chunk * counter);
          counter++;
        }
      });
    } else {
      counter = 1;

      for(let i = (groups.length - 1); i >= 0; i--) {
        if(i >= marker) {
          delays.push(0);
        } else {
          delays.push(chunk * counter);
          counter++;
        }
      }

      delays.reverse();
    }

    for(let i = 0; i < groups.length; i++) {
      this.draw(groups[i], arcs[i].self, _createDataset(arcs[i]), chunk, delays[i]);
    }
  }

  getCurrentState(reverse) {
    let foundStart;

    if(!reverse) {
      for(let k = 0; k < this.groups.length; k++) {
        let group = this.groups[k];
        let arc = this.arcs[k];
        let path = group.select('path:last-child')[0][0].__data__;

        if(_isEmpty(path) || _isPartFull(path, arc)) {
          foundStart = k;
          break;
        }
      }
    } else {
      for(let k = (this.groups.length - 1); k >= 0; k--) {
        let group = this.groups[k];
        let arc = this.arcs[k];
        let path = group.select('path:last-child')[0][0].__data__;

        if(_isFull(path, arc) || _isPartFull(path, arc)) {
          foundStart = k;
          break;
        }
      }
    }

    return foundStart;

    function _isEmpty(path) {
      return path.startAngle === path.endAngle;
    }

    function _isPartFull(path,arc) {
      return (path.endAngle > path.startAngle) && !_isFull(path, arc);
    }

    function _isFull(path, arc) {
      return path.endAngle === _rad(arc.range[1]);
    }
  }

  saveArcState() {
    let arcState = [];

    this.arcs.map((arc) => {
      arcState.push([arc.minValue, arc.maxValue]);
    });

    this.arcState = arcState;
  }

  getStartArc() {
    this.arcState.map((minValue, i) => {

    });
  }

  arcTween(inputArc) {
    let arc = inputArc;

    return function(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function (t) {
        return arc(i(t));
      };
    };
  }

  draw(group, arc, data, duration, delay) {
    group.selectAll("path")
      .data(data)
      .transition()
      .delay(delay || 0)
      .duration(duration)
      .ease('linear')
      .attrTween("d", this.arcTween(arc));
  }

  static checkD3() {
    if (!window.d3) {
      throw new ReferenceError('d3.js is required for FoltMeter!');
    }
  }
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

function _createDataset(arc) {
  return [
    _setSingleVal(arc.minValue, _rad(arc.range[0]), _rad(arc.range[1])),
    _setSingleVal(arc.minValue, _rad(arc.range[0]), _getPercentVal(arc.minValue, arc.maxValue, arc.range[0], arc.range[1]))
  ];
}

function _getDelays(groups, arcs, duration, flip) {
  let delays = [];
  let currentArc;
  let nextArc;
  let durationChunk = duration / groups.length;

  if(flip) {
    for(let i = 0; i < groups.length; i++) {
      delays.push(duration * i);
    }
  } else {
    for(let i = 0; i < groups.length; i++) {
      currentArc = arcs[i];
      nextArc = arcs[i+1];

      if(_arcHasValue(currentArc)) {
        delays.push(0);
      } else {
        delays.push(durationChunk);
        durationChunk += durationChunk
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