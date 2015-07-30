'use strict';
var React = require('react');
// Chart Mixins
var xAxis = require('./mixins/XAxis');
var SizeCalc = require('./mixins/SizeCalc');
var Loading = require('./Loading');
var d3 = require('d3');
var _ = require('lodash');
var dataHelper = require('./helpers/dataHelper.js');

var BarChart = React.createClass({
    mixins: [xAxis,SizeCalc],
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
        console.log('Receiving data...', data);
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
        console.log('Initialize chart');
        var chart = this;
        chart.setupSize(); 
        console.log('Initialize size');
        console.log(this);
        chart.setupXAxis();
        chart._setupDomains();
        chart.renderXAxis();

    },
    _updateChart: function(){
        console.log('Update chart');
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
        // console.log(min,max);
        // TODO Should include variable delta
        var delta = (max - min) * 0.05;
        // this._colors = d3.scale.ordinal().range(this.props.colors);
        // this._colors.domain(keys);
        this._x.domain(keys);
        // this._y.domain([min, max + delta]);
    }
});

module.exports = BarChart;
