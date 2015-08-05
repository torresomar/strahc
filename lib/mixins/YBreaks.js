'use strict';
var d3 = require('d3');

var YBreaks = {
    renderYBreaks: function(){
        var arrBreaks = [0, 80];
        var chart = this;
        var svg = chart.refs.svg.getDOMNode();
        d3.select(svg).append('g')
            .attr('class','strahc-y-breaks')
            .selectAll('.strahc-y-break')
            .data(arrBreaks)
            .enter()
            .append('line')
            .attr('class','strahc-y-break')
            .attr('x1', chart.props.margin.left)
            .attr('x2', chart.props.width - chart.props.margin.right)
            .attr('y1', function(d){
                return chart._y(d) + chart.props.margin.top;
            })
            .attr('y2', function(d){
                return chart._y(d) + chart.props.margin.top;
            });
    }
};

module.exports = YBreaks;
