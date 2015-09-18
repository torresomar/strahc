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

var BarChart = React.createClass({
  mixins: [xAxis,yAxis,SizeCalc,yGrid,Tooltip,YBreaks],
  getDefaultProps: function(){
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
    if(dataHelper.isFalsyCollection(this.props.data)){
      return;
    }
    var chart = this;
    var svg = chart.refs.svg.getDOMNode();
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
    }
    return (
      <div className='strahc-component'>
        <svg ref='svg' className='strahc-svg'>
        </svg>
      </div>
      );
  },
  _initChart: function() {
  window.addEventListener('resize',  _.throttle(this._updateDimensions, 200));
    // window.addEventListener('resize',  this._updateDimensions);
    var chart = this;
    var setupFns = [
      chart.setupSize(),
      chart.setupXVerticalAxis(),
      chart.setupYAxisVHorizontal(),
      chart._setupDomains(),
    ];
    var renderFns = [
      chart.renderXVerticalAxis(),
      chart.renderYAxis(),
      chart._renderBars(),
      chart.renderTooltip(),
    ];
    // Run setup functions
    _.invoke(setupFns, _.call, this);
    // Run render functions
    _.invoke(renderFns, _.call, this);
  },
  _updateChart: function(){
    var chart = this;
    var valueFn = this.props.valueFn;
    var updateFn = [
      chart._setupDomains,
      chart.updateXAxis,
      chart.updateYAxis,
    ];
    var svg = this.refs.svg.getDOMNode();
    var updatee = d3.select(svg)
      .select('.strahc-grouping')
      .selectAll('g.bars-group')
      .data(chart.props.data);
    // Run setup functions
    _.invoke(updateFn, _.call, this);
    // Remove old data
    updatee.exit().remove();
    // Update data
    updatee.select('rect')
      .transition()
      .duration(800)
      .call(this._rect);
    // Add new data
    updatee.enter()
      .append('g')
      .attr('class', 'bars-group')
      .append('rect')
      .call(this._rect);
  },
  _setupDomains: function() {
    var data = this.props.data;
    var valueFn = this.props.valueFn;
    var valueKey = this.props.valueKey;
    var keys = _.map(data, function(d){
      return d[valueKey];
    });
    var min = d3.min(data, function(d){
      return d[valueFn];
    });
    var max = d3.max(data, function(d){
      return d[valueFn];
    });
    // TODO Should include variable delta
    var delta = (max - min) * 0.01;
    this._colors = d3.scale.ordinal().range(this.props.colors);
    this._colors.domain(keys);
    this._x.domain(keys);
    if(min < 0){
      min -= delta;
    }
    this._y.domain([min, max + delta]);
  },
  _renderBars: function() {
    var chart = this;
    var svg = chart.refs.svg.getDOMNode();
    var props = chart.props;
    var valueFn = props.valueFn;
    var valueKey = props.valueKey;
    d3.select(svg)
      .select('.strahc-grouping')
      .selectAll('.bars-group')
      .data(props.data, function(d){
        return d[valueKey];
      })
      .enter()
      .append('g')
      .attr('class', 'bars-group')
      .append('rect')
      .call(this._rect)
      .on('mousemove', function(d){
        chart.showTooltip(d, 'one');
      })
      .on('mouseleave', function(d){
        chart.hideTooltip();
      });
  },
  _rect: function(rect) {
    var chart = this;
    var valueFn = this.props.valueFn;
    var valueKey = this.props.valueKey;
    rect.attr('class', function(d){
      return 'rect-' + d[valueKey];
    })
    .attr('height', function(d, i){
      return (chart._x.rangeBand());
    })
    .attr('x', function(d) {
      return chart._y(Math.min(0, d[valueFn]));
    })
    .attr('y', function(d) {
      return chart._x(d[valueKey]);
    })
    .attr('width', function(d) {
      var lower_bound = chart._y.domain()[0];
      if(lower_bound < 0){
        lower_bound = 0;
      }
      return Math.abs(chart._y(d[valueFn]) - chart._y(lower_bound));
    })
    .style('fill', function(d) {
      if(typeof chart.props.color === 'string'){
        return chart.props.color;
      }
      if(_.isArray(chart.props.colors)){
        return chart._colors(d[valueKey]);
      }
      return chart.props.colors[d[valueKey]];
    })
    .style('cursor', 'pointer');
  },
  _updateDimensions: function() {
    console.log('need to update');
    var chart = this;
    var setupFns = [];
    // Run setup functions
    chart.updateSize();
    chart.setupYAxisVHorizontal();
    chart._updateChart();
  },
});

module.exports = BarChart;
