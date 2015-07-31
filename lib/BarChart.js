'use strict';
var React = require('react');
// Chart Mixins
var xAxis = require('./mixins/XAxis');
var yAxis = require('./mixins/YAxis');
var SizeCalc = require('./mixins/SizeCalc');
var Loading = require('./Loading');
var d3 = require('d3');
var _ = require('lodash');
var dataHelper = require('./helpers/dataHelper.js');

var BarChart = React.createClass({
    mixins: [xAxis,yAxis,SizeCalc],
    getDefaultProps: function(){
        return {
            width: null,
            height: 400,
            valueFn: 'value',
            margin: {
                top: 20,
                bottom: 20,
                left: 50,
                right: 20
            }
        };
    },
    componentDidMount: function(){
        if(dataHelper.isFalsyCollection(this.props.data)){
            return;
        }
        var chart = this;
        chart._initChart();
    },
    componentDidUpdate: function(){
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
    _initChart: function(){
        var chart = this;
        chart.setupSize(); 
        chart.setupXAxis();
        chart.setupYAxis();
        chart._setupDomains();
        chart.renderXAxis();
        chart.renderYAxis();
        chart._renderBars();
    },
    _updateChart: function(){
        var chart = this;
        var valueFn = this.props.valueFn;
        var updateFn = [chart._setupDomains, chart.updateXAxis, chart.updateYAxis];
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
        .duration(200)
        .call(this._rect);
        // Add new data
        updatee.enter()
        .append('g')
        .attr('class', 'bars-group')
        .append('rect')
        .call(this._rect)
        .on('mouseover', function(d){
            console.log(d);
        });
    },
    _setupDomains: function(){
        var data = this.props.data;
        var valueFn = this.props.valueFn;
        var keys = _.map(data, function(d){
            return d.name;
        });
        var min = d3.min(data, function(d){
            return d[valueFn];
        });
        var max = d3.max(data, function(d){
            return d[valueFn];
        });
        // TODO Should include variable delta
        var delta = (max - min) * 0.05;
        this._colors = d3.scale.ordinal().range(this.props.colors);
        this._colors.domain(keys);
        this._x.domain(keys);
        this._y.domain([min, max + delta]);
    },
    _renderBars: function(){
        var chart = this;
        var svg = chart.refs.svg.getDOMNode();
        var props = chart.props;
        var valueFn = props.valueFn;
        d3.select(svg)
        .select('.strahc-grouping')
        .selectAll('.bars-group')
        .data(props.data, function(d){
            return d.name;
        })
        .enter()
        .append('g')
        .attr('class', 'bars-group')
        .append('rect')
        .call(this._rect)
        .on('mouseover', function(d){
            console.log(d);
        });
    },
    _rect: function(rect){
        var chart = this;
        var valueFn = this.props.valueFn;
        rect.attr('class', function(d){
            return 'rect-' + d.name;
        })
        .attr('width', chart._x.rangeBand())
        .attr('x', function(d){
            return chart._x(d.name);
        })
        .attr('y', function(d){
            return chart._y(d[valueFn]); 
        })
        .attr('height', function(d){
            return chart._height - chart._y(d[valueFn]);
        })
        .style('fill', function(d){
            if(_.isArray(chart.props.colors)){
                return chart._colors(d.name);
            }
            return chart.props.colors[d.name];
        });
    },
});

module.exports = BarChart;
