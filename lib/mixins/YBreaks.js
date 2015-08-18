'use strict';
var d3 = require('d3');
var _ =  require('lodash');

var YBreaks = {
    filterBreaks: function(){
        var chart = this;
        var arrBreaks = this.props.divisions; // TODO should be props
        var filtered = _.filter(arrBreaks, function(br){
            if(br > chart._y.domain()[1] || br < chart._y.domain()[0]){
                return false;
            }
            return true;
        });
        return filtered;
    },
    renderYBreaks: function(){
        var chart = this;
        var arrBreaks = this.filterBreaks();
        var svg = chart.refs.svg.getDOMNode();
        var width = this._width;
        d3.select(svg).append('g')
            .attr('class','strahc-y-breaks')
            .selectAll('.strahc-y-break')
            .data(arrBreaks)
            .enter()
            .append('line')
            .attr('class','strahc-y-break')
            .attr('x1', chart.props.margin.left)
            .attr('x2', width - chart.props.margin.right)
            .attr('y1', function(d){
                return chart._y(d) + chart.props.margin.top;
            })
            .attr('y2', function(d){
                return chart._y(d) + chart.props.margin.top;
            });
    },
    updateYBreak: function(){
        var arrBreaks = this.filterBreaks();
        var chart = this;
        var svg = chart.refs.svg.getDOMNode();
        var width = this._width;
        var updatee = d3.select(svg)
        .select('.strahc-y-breaks')
        .selectAll('line.strahc-y-break')
        .data(arrBreaks)
        .transition()
        .duration(800)
        .attr('y1', function(d){
            return chart._y(d) + chart.props.margin.top;
        })
        .attr('x2', width - chart.props.margin.right)
        .attr('y2', function(d){
            return chart._y(d) + chart.props.margin.top;
        });
    }
};

module.exports = YBreaks;
