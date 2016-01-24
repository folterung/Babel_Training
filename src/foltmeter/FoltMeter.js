export class FoltMeter {
  element;

  constructor(selector) {
    this.checkD3();
    this.element = d3.select(selector);
  }

  create() {
    var dataset = {
      apples: [10, 100],
    };

    var degree = Math.PI / 180;

    var width = 150,
      height = 125;

    var color = d3.scale.category20();

    var pie = d3.layout.pie().startAngle(-90 * degree).endAngle(90 * degree)
      .sort(null);

    var arc = d3.svg.arc()
      .innerRadius(50)
      .outerRadius(60);

    var svg = d3.select(".chart-container").append("svg")
      .attr("width", width)
      .attr("height", height)
      .append("g")
      .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    var path = svg.selectAll("path")
      .data(pie(dataset.apples))
      .enter().append("path")
      .attr("fill", function (d, i) {
        return color(i);
      })
      .attr("d", arc)
      .each(function (d) {

        this._current = d;
      }); // store the initial values;


    //window.setInterval(dummyData, 2000);

// Store the displayed angles in _current.
// Then, interpolate from _current to the new angles.
// During the transition, _current is updated in-place by d3.interpolate.
    function arcTween(a) {
      var i = d3.interpolate(this._current, a);
      this._current = i(0);
      return function (t) {
        return arc(i(t));
      };
    }

    function dummyData() {
      var num = Math.floor(Math.random() * 100);
      var key = Math.floor(Math.random() * dataset.apples.length);

      dataset.apples[key] = num;

      draw();
    }

    function draw() {
      svg.selectAll("path")
        .data(pie(dataset.apples))
        .transition()
        .duration(2500)
        .attrTween("d", arcTween);
    }
  }

  //create() {
  //  let el = this.element.append('svg');
  //
  //  let arc_1 = d3.svg.arc();
  //  let arc_2 = d3.svg.arc();
  //  let arc_3 = d3.svg.arc();
  //
  //  let arc_1_start = d3.svg.arc();
  //  let arc_2_start = d3.svg.arc();
  //  let arc_3_start = d3.svg.arc();
  //
  //  let path_1 = el.append('path');
  //  let path_2 = el.append('path');
  //  let path_3 = el.append('path');
  //
  //  arc_1.innerRadius(50);
  //  arc_1.outerRadius(60);
  //  arc_1.startAngle(_toRadian(-90));
  //  arc_1.endAngle(_toRadian(-75));
  //
  //  arc_1_start.innerRadius(50);
  //  arc_1_start.outerRadius(60);
  //  arc_1_start.startAngle(_toRadian(-90));
  //  arc_1_start.endAngle(_toRadian(-87));
  //
  //  arc_2.innerRadius(50);
  //  arc_2.outerRadius(60);
  //  arc_2.startAngle(_toRadian(-65));
  //  arc_2.endAngle(_toRadian(0));
  //
  //  arc_2_start.innerRadius(50);
  //  arc_2_start.outerRadius(60);
  //  arc_2_start.startAngle(_toRadian(-65));
  //  arc_2_start.endAngle(_toRadian(-62));
  //
  //  arc_3.innerRadius(50);
  //  arc_3.outerRadius(60);
  //  arc_3.startAngle(_toRadian(10));
  //  arc_3.endAngle(_toRadian(90));
  //
  //  arc_3_start.innerRadius(50);
  //  arc_3_start.outerRadius(60);
  //  arc_3_start.startAngle(_toRadian(10));
  //  arc_3_start.endAngle(_toRadian(13));
  //
  //  el.attr('width', '400');
  //  el.attr('height', '400');
  //
  //  path_1.attr('d', arc_1_start);
  //  path_1.attr('fill', 'orange');
  //  path_1.attr('transform', 'translate(200, 200)');
  //
  //  path_2.attr('d', arc_2_start);
  //  path_2.attr('fill', 'orange');
  //  path_2.attr('transform', 'translate(200, 200)');
  //
  //  path_3.attr('d', arc_3_start);
  //  path_3.attr('fill', 'orange');
  //  path_3.attr('transform', 'translate(200, 200)');
  //
  //  setTimeout(() => {
  //    path_1
  //      .data(arc_1([15, 90]))
  //      .transition()
  //      .duration(1000)
  //      .each((d) => {
  //        arc_1._current = d;
  //      })
  //      .attrTween('d', _arcTween(arc_1, _toRadian(-75)));
  //  }, 2000);
  //
  //  setTimeout(() => {
  //    path_2
  //      .transition()
  //      .duration(500)
  //      .attr('d', arc_2);
  //  }, 3000);
  //
  //  setTimeout(() => {
  //    path_3
  //      .transition()
  //      .duration(500)
  //      .attr('d', arc_3);
  //  }, 4000);
  //
  //  function _toRadian(deg) {
  //    return deg * (Math.PI/180);
  //  }
  //
  //  function _arcTween(arc, b){
  //    var i = d3.interpolate(arc._current, b);
  //    arc._current = i(0);
  //
  //    return function(t) {
  //      return arc(i(t));
  //    };
  //  }
  //}

  checkD3() {
    if (!window.d3) {
      throw new ReferenceError('d3.js is required for FoltMeter!');
    }
  }
}
