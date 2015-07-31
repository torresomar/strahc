'use strict';
var d3 = require('d3');

var yGrid = {
    renderYGrid: function(){
        var chart = this;
        var svg = this.refs.svg.getDOMNode();
        d3.select(svg)
        .insert('g',':first-child')
        .attr('class','grid')
        .attr('transform', 'translate(' + this.props.margin.left + ',' + this.props.margin.top + ')')
        .call(this._renderYGrid())
        .selectAll('line')
        .attr('class','grid-delimiter')
        .attr('stroke-dasharray','4, 4')
        .attr('stroke','rgb(203, 203, 203)');
    },
    _renderYGrid: function(){
        var chart = this;
        return d3.svg.axis()
        .scale(chart._y)
        .orient('left')
        .ticks(5)
        .tickSize(-chart.props.width + chart.props.margin.right + chart.props.margin.left, 0, 0)
        .tickFormat('');
    }, 
    updateYGrid: function(){
        var svg = this.refs.svg.getDOMNode();
        d3.select(svg)
        .selectAll('g.grid')
        .attr('transform', 'translate(' + this.props.margin.left + ',' + (this.props.margin.top) + ')') 
        .call(this._renderYGrid())
        .selectAll('line')
        .attr('class','grid-delimiter')
        .attr('stroke-dasharray','4, 4')
        .attr('stroke','rgb(203, 203, 203)');
    }
};

module.exports = yGrid;
