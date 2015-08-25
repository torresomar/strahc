'use strict';

var d3 = require('d3');

function LinearScale(options) {
    this.scale = d3.scale.ordinal()
            .rangeBands([0, options.width - options.margin.left - options.margin.right], 0.05);

    // TODO include formatting options
    this.axis = d3.svg.axis()
            .scale(this.scale)
            .tickFormat(options.format)
            .orient('bottom');
}

function TimeScale(options) {
    this.scale = d3.time.scale()
            .range([0, options.width - options.margin.left - options.margin.right])
            
    // TODO include formatting options
    this.axis = d3.svg.axis()
            .scale(this.scale)
            .tickFormat(options.format)
            .ticks(10)
            .orient('bottom');
}

function ScaleFactory() {}
ScaleFactory.prototype.createScale = function createScaleType(options) {
    var parentClass = null;

    if (options.scale === 'linear') {
        parentClass = LinearScale;
    } else if(options.scale === 'time') {
        parentClass = TimeScale;
    }

    if (parentClass == null) {
        return false;
    }

    return new parentClass(options);
}
var xAxis = {
    setupXAxis: function(){
        var _ScaleFactory = new ScaleFactory();
        var options = {
            format: this.props.xAxis.format,
            margin: this.props.margin,
            scale: this.props.scale,
            width: this._width,
        }
        var scale = _ScaleFactory.createScale(options);

        this._x = scale.scale;
        this._xAxis = scale.axis;
    },
    renderXAxis: function(){
        var svg = this.refs.svg.getDOMNode();
        d3.select(svg) 
            .append('g')
            .attr('class', 'x x-axis')
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
        .selectAll('.x-axis')
        .transition()
        .duration(800)
        .call(this._xAxis);
        d3.select(svg)
            .select('.x-axis > path')
            .attr('fill', 'none')
            .attr('stroke', '#222')
            .attr('shape-rendering', 'crispEdges');
    }
};

module.exports = xAxis;
