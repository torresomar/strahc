'use strict';
var d3 = require('d3');

var yAxis = {
    setupYAxis: function(){
        var y = d3.scale.linear()
        .range([this._height, 0]);
        var axis = d3.svg.axis()
        .scale(y)
        .orient('left')
        .ticks(5)
        .tickFormat(d3.format('.2s'));
        this._y = y;
        this._yAxis = axis;
    },
    renderYAxis: function(){
        var svg = this.refs.svg.getDOMNode();
        d3.select(svg)
        .append('g')
        .attr('class', 'y-axis')
        .attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')')
        .call(this._yAxis)
        .transition()
        .duration(800);
        d3.select(svg)
        .select('.y-axis path')
        .attr('fill', 'none')
        .attr('stroke', '#222')
        .attr('shape-rendering', 'crispEdges');
    },
    updateYAxis: function(){
        var svg = this.refs.svg.getDOMNode();
        d3.select(svg)
        .selectAll('g.y-axis')
        .transition()
        .duration(800)
        .call(this._yAxis);
    }
};

module.exports = yAxis;
