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
    },
    componentDidUpdate: function(){
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
    },
    _updateChart: function(){
        console.log('Update chart');
    }
});

module.exports = BarChart;
