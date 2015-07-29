'use strict';
var React = require('react');
var xAxis = require('./mixins/XAxis');
var Loading = require('./Loading');
var d3 = require('d3');

var BarChart = React.createClass({
    mixins: [xAxis],
    getDefaultProps: function(){
        return {
            width: null,
            height: 400
        };
    },
    componentDidMount: function(){
        var props = this.props;
        var width = props.width;
        var height = props.height;
        var svg = this.refs.svg.getDOMNode();
        if(width === null){
            width = this.getDOMNode().offsetWidth;
        }
        d3.select(svg)
            .attr('width',width)
            .attr('height', height);
    },
    render: function(){
        var props = this.props;
        var data = props.data;
        return (
            <div className='strahc-component'>
                <svg ref='svg' className='strahc-svg'>
                </svg>
            </div>
        );
    }
});

module.exports = BarChart;
