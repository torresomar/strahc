'use strict';
var React = require('react');
// Chart Mixins
var xAxis =     require('./mixins/XAxis');
var yAxis =     require('./mixins/YAxis');
var SizeCalc =  require('./mixins/SizeCalc');
var yGrid =     require('./mixins/YGrid');
var Tooltip =   require('./mixins/Tooltip');
var YBreaks =   require('./mixins/YBreaks');

var Loading =       require('./Loading');
var d3 =            require('d3');
var _ =             require('lodash');
var dataHelper =    require('./helpers/dataHelper.js');

var LineChart = React.createClass({
  mixins: [xAxis,yAxis,SizeCalc,yGrid,Tooltip,YBreaks],
  getDefaultProps: function() {
    return {
      width: null,
      height: 400,
      valueFn: 'value',
      valueKey: 'name',
      margin: {
        top: 20,
        bottom: 20,
        left: 50,
        right: 20
      },
      xAxis: {
        rotate: 0,
        anchor: 'middle',
        format: function(d){
          return d;
        }
      },
      divisions: []
    };
  },
  componentDidMount: function() {
    if(dataHelper.isFalsyCollection(this.props.data)){
      return;
    }
    var chart = this;
    chart._initChart();
  },
  componentDidUpdate: function() {
    var chart = this;
    var svg = this.refs.svg.getDOMNode();
    var isInitialized = d3.select(svg)
      .select('.strahc-grouping')
      .empty();
    isInitialized ? chart._initChart() : chart._updateChart();
  },
  render: function(){
    var props = this.props;
    var data = props.data;
    if(dataHelper.isFalsyCollection(data)){
      return <Loading width={props.width} height={props.height}/>;
    } else {
      return (
        <div className='strahc-component'>
          <svg ref='svg' className='strahc-svg'>
          </svg>
        </div>
      );
    }
  },
  _getMinMax: function() {
    var props       = this.props;
    var higher      = 0;
    var fewer       = 0;
    var upperLimit  = 0;
    var lowerLimit  = props.data[0][0][props.valueFn];

    //Get Upper and Lower limit on values
    for (var i = 0; i < props.data.length; i++) {
      fewer = d3.min(props.data[i], function(d) {
        if (d.value !== null) {
          return d.value;
        }
      });

      if (fewer < lowerLimit) {
        lowerLimit = fewer;
      }

      higher = d3.max(props.data[i], function(d) {
        if (d.value !== null) {
          return d.value;
        }
      });

      upperLimit = upperLimit + higher;
    }

    return [lowerLimit, upperLimit];
  },
  _initChart: function() {
    window.addEventListener('resize',  _.throttle(this._updateDimensions, 200));
    // window.addEventListener('resize',  this._updateDimensions);
    var chart = this;
    var setupFns = [
      chart.setupSize(),
      chart.setupXAxis(),
      chart.setupYAxis(),
      chart._setupDomains(),
      chart._setupLineGen(),
    ];

    var renderFns = [
      chart.renderXAxis(),
      chart.renderYAxis(),
      chart._renderLines(),
      chart.renderYGrid(),
      chart.renderTooltip(),
      chart.renderYBreaks(),
      chart._renderTooltipRects(),
    ];
    // Run setup functions
    _.invoke(setupFns, _.call, this);
    // Run render functions
    _.invoke(renderFns, _.call, this);
  },
  _updateChart: function() {
    var chart = this;
    var props = chart.props;
    var rectObj = {};
    var rectArray = [];
    var valueFn = this.props.valueFn;
    var updateFn = [
      chart._setupDomains,
      chart.updateXAxis,
      chart.updateYAxis,
      chart.updateYGrid,
      chart.updateYBreak
    ];
    var svg = this.refs.svg.getDOMNode();
    // Run setup functions
    _.invoke(updateFn, _.call, this);

    chart.acumArray = props.data[0].map(function(element, index) {
      return (0);
    });

    d3.select(svg)
      .selectAll('path.line')
      .data(props.data)
      .transition()
      .duration(800)
      .attr('d', function(d, i) {
        return chart.lineGen(d);
      });

    for (var i = 0; i < props.data[0].length; i++) {
      for (var j = 0; j < props.data.length; j++) {
        rectObj['data-' + j] = props.data[j][i];
        rectObj['data-' + j].color = chart.props.colors[j];
      }
      rectArray.push(rectObj);
      rectObj = {};
    }

    d3.select(svg)
      .select('.strahc-grouping')
      .selectAll('rect.rect-tooltip')
      .attr('width', chart.rectWidth)
      .attr('x', function(d, i){
        return chart.rectWidth * (i);
      })
      .data(rectArray);
  },
  _setupDomains: function() {
    var data = this.props.data;
    var valueFn = this.props.valueFn;
    var valueKey = this.props.valueKey;
    var firstLineData = data[0];
    var minMax = this._getMinMax();
    var keys = _.map(firstLineData, function(d){
      return d[valueKey];
    });

    var min = d3.min(firstLineData, function(d){
      return d[valueFn];
    });

    var max = d3.max(firstLineData, function(d){
      return d[valueFn];
    });

    var delta = (max - min) * 0.1;
    this._colors = d3.scale.ordinal().range(this.props.colors);
    this._colors.domain(keys);
    this._x.domain([keys[0], keys[keys.length - 1]]);
    if (min < 0) {
      min -= delta;
    }

    this._y.domain([minMax[0], minMax[1]]);
  },
  _setupLineGen: function(){
    var chart = this;
    chart.lineGen = d3.svg.area()
      .x(function(d) {
        return chart._x(new Date(d.date));
      })
      .y0(function(d, i) {
        return chart._y(chart.acumArray[i]);
      })
      .y1(function(d, i) {
        chart.acumArray[i] = chart.acumArray[i] + d.value
        return chart._y(chart.acumArray[i]);
      });

    chart.lineGen.interpolate('monotone');
  },
  _renderLines: function() {
    var chart = this;
    var svg = chart.refs.svg.getDOMNode();
    var props = chart.props;
    var valueFn = props.valueFn;
    var valueKey = props.valueKey;

    chart.acumArray = props.data[0].map(function(element, index) {
      return (0);
    });

    d3.select(svg)
      .select('.strahc-grouping')
      .selectAll('path.line')
      .data(props.data)
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('stroke', function(d, i) {
        return chart.props.colors[i];
      })
      .attr('fill', function(d, i) {
        return chart.props.colors[i];
      })
      .attr('d', function(d, i) {
        return chart.lineGen(d);
      });

    chart._lineMarker = d3.select(svg)
      .select('.strahc-grouping')
      .append('line')
      .style('visibility', 'hidden');
  },
  _renderTooltipRects: function() {
    var chart = this;
    var svg = chart.refs.svg.getDOMNode();
    var props = chart.props;
    var rectObj = {};
    var rectArray = [];
    chart.rectWidth = d3.select(svg)
      .select('.strahc-grouping')[0][0]
      .getBoundingClientRect().width  / chart.props.data[0].length;

    for (var i = 0; i < props.data[0].length; i++) {
      for (var j = 0; j < props.data.length; j++) {
        rectObj['data-' + j] = props.data[j][i];
        rectObj['data-' + j].color = chart.props.colors[j];
      }
      rectArray.push(rectObj);
      rectObj = {};
    }

    d3.select(svg)
      .select('.strahc-grouping')
      .append('g')
      .attr('class', 'bars-group')
      .selectAll('rect.rect-tooltip')
      .data(rectArray)
      .enter()
      .append('rect')
      .attr('class', 'rect-tooltip')
      .call(this._rect)
      .on('mousemove', function(d){
        chart._showLineMarker(d);
        chart.showTooltip(d, 'multi');
      })
      .on('mouseleave', function(d){
        chart._hideLineMarker();
        chart.hideTooltip();
      });
  },
  _rect: function(rect) {
    var chart = this;
    var valueKey = this.props.valueKey;
    rect
      .attr('width', chart.rectWidth)
      .attr('x', function(d, i){
        return chart.rectWidth * (i);
      })
      .attr('y', function(d){
        return 0;
      })
      .attr('height', function(d){
        var props = chart.props;
        return (props.height - props.margin.bottom - props.margin.top);
      })
      .style('fill', 'rgba(0,0,0,0.0)')
      .style('cursor', 'pointer');
  },
  _showLineMarker: function(d) {
    var chart = this;
    var d = d['data-0'];
    chart._lineMarker
      .style('visibility', 'visible')
      .attr('x1', chart._x(new Date(d.date)))
      .attr('y1', chart._height)
      .attr('x2', chart._x(new Date(d.date)))
      .attr('y2', 0)
      .attr('stroke', 'rgb(203, 203, 203)')
      .attr('stroke-width', 1)
      .style('stroke-dasharray', ('5, 5'));
  },
  _hideLineMarker: function(d) {
    var chart = this;
    chart._lineMarker
      .style('visibility', 'hidden')
  },
  _updateDimensions: function() {
    var chart = this;
    var setupFns = [];
    var props = chart.props;
    var svg = chart.refs.svg.getDOMNode();
    chart.updateSize();
    chart.setupXAxis();
    var width = chart._width - props.margin.left - props.margin.right;
    chart.rectWidth = width / chart.props.data[0].length;
    chart._updateChart();
  },
});

module.exports = LineChart;
