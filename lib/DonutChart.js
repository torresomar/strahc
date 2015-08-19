'use strict';
var React = require('react');
// Chart Mixins
var SizeCalc =  require('./mixins/SizeCalc');

var Loading =       require('./Loading');
var d3 =            require('d3');
var _ =             require('lodash');
var dataHelper =    require('./helpers/dataHelper.js');


var DonutChart = React.createClass({
    mixins: [SizeCalc],
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
    _initChart: function(){
        console.log('Init chart');
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
    }
});

module.exports = DonutChart;
