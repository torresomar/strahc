'use strict';

var d3 = require('d3');

var xAxis = {
    setupXAxis: function(){
        // TODO allow multiple types of scale
        var x = d3.scale.ordinal()
            .rangeRoundBands([0, this._width - this.props.margin.left - this.props.margin.right], 0.1);
        // TODO include formatting options
        var axis = d3.svg.axis()
                    .scale(x)
                    .tickFormat(this.props.xAxis.format)
                    .orient('bottom');
        this._x = x;
        this._xAxis = axis;
    },
    renderXAxis: function(){
        var svg = this.refs.svg.getDOMNode();
        d3.select(svg) 
            .append('g')
            .attr('class', 'x-axis')
            .attr('transform', 'translate(' + this.props.margin.left + ',' + (this.props.height - this.props.margin.bottom) + ')') 
            .transition()
            .duration(200) 
            .call(this._xAxis)
            .selectAll('g > text')
            .style('text-anchor', this.props.xAxis.anchor)
            .attr('transform', 'rotate(' + this.props.xAxis.rotate + ')')
            .style('font-family', 'Titillium Web');
        d3.select(svg)
            .select('.x-axis > path')
            .attr('fill', 'none')
            .attr('stroke', '#222')
            .attr('shape-rendering', 'crispEdges');
    },
    updateXAxis: function(){
        var svg = this.refs.svg.getDOMNode();
        d3.select(svg)
        .selectAll('g.x-axis')
        .attr('transform', 'translate(' + this.props.margin.left + ',' + (this.props.height - this.props.margin.bottom) + ')') 
        .call(this._xAxis)
        .transition()
        .duration(200) 
        .selectAll('g > text')
        .style('text-anchor', this.props.xAxis.anchor)
        .attr('transform', 'rotate(' + this.props.xAxis.rotate + ')')
        .style('font-family', 'Titillium Web');
    }
};

module.exports = xAxis;
