'use strict';

var d3 = require('d3');

function LinearScale(options) {
  this.x = d3.scale.ordinal()
  .rangeBands([0, options.width], 0.05);
}

function TimeScale(options) {
  this.x = d3.time.scale()
  .range([0, options.width])
}

function ScaleFactory() {}
ScaleFactory.prototype.createScale = function createScaleType(options) {
  var parentClass = null;

  if (options.scale === 'linear') {
    parentClass = LinearScale;
  } else if(options.scale === 'time') {
    parentClass = TimeScale;
  }

  if (parentClass == null) {
    return false;
  }

  return new parentClass(options);
}
var xAxis = {
  setupXAxis: function(){
    var _ScaleFactory = new ScaleFactory();
    var options = {
      margin: this.props.margin,
      scale: this.props.scale,
      width: (this._width - this.props.margin.left - this.props.margin.right),
    }
    var scale = _ScaleFactory.createScale(options);

    // TODO include formatting options
    var axis = d3.svg.axis()
      .scale(scale.x)
      .tickFormat(this.props.xAxis.format)
      .orient('bottom');

    this._x = scale.x;
    this._xAxis = axis;
  },
  setupXVerticalAxis: function(){
    var _ScaleFactory = new ScaleFactory();
    var options = {
      margin: this.props.margin,
      scale: this.props.scale,
      width: (this._height),
    }
    var scale = _ScaleFactory.createScale(options);
    // TODO include formatting options
    var axis = d3.svg.axis()
      .scale(scale.x)
      .tickFormat(this.props.xAxis.format)
      .orient('left');

    this._x = scale.x;
    this._xAxis = axis;
  },
  renderXAxis: function(){
    var svg = this.refs.svg.getDOMNode();
    d3.select(svg) 
      .append('g')
      .attr('class', 'x x-axis')
      .attr('transform', 'translate(' + this.props.margin.left + ',' + (this.props.height - this.props.margin.bottom) + ')') 
      .transition()
      .duration(200) 
      .call(this._xAxis)
      .selectAll('g > text')
      .style('text-anchor', this.props.xAxis.anchor)
      .attr('transform', 'rotate(' + this.props.xAxis.rotate + ')')
      .style('font-family', 'Titillium Web');
    d3.select(svg)
      .select('.x-axis > path')
      .attr('fill', 'none')
      .attr('stroke', '#222')
      .attr('shape-rendering', 'crispEdges');
  },
  renderXVerticalAxis: function() {
    var svg = this.refs.svg.getDOMNode();
    d3.select(svg) 
      .append('g')
      .attr('class', 'x x-axis')
      .attr('transform', 'translate(' + this.props.margin.left + ',' + 20 + ')') 
      .transition()
      .duration(200) 
      .call(this._xAxis)
      .selectAll('g > text')
      .style('text-anchor', this.props.xAxis.anchor)
      .attr('transform', 'rotate(' + this.props.xAxis.rotate + ')')
      .style('font-family', 'Titillium Web');
    d3.select(svg)
      .select('.x-axis > path')
      .attr('fill', 'none')
      .attr('stroke', '#222')
      .attr('shape-rendering', 'crispEdges');
  },
  updateXAxis: function() {
    var svg = this.refs.svg.getDOMNode();
    d3.select(svg)
      .selectAll('.x-axis')
      .transition()
      .duration(800)
      .call(this._xAxis);
    d3.select(svg)
      .select('.x-axis > path')
      .attr('fill', 'none')
      .attr('stroke', '#222')
      .attr('shape-rendering', 'crispEdges');
  }
};

  module.exports = xAxis;
