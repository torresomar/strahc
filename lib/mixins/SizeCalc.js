'use strict';
var d3 = require('d3');

var SizeCalc = {
    setupSize: function(){
        var props = this.props;
        var width = props.width;
        var height = props.height;
        if(width === null){
            width = this.getDOMNode().offsetWidth;
        }
        this._width = width - props.margin.left - props.margin.right;
        this._height = props.height - props.margin.top - props.margin.bottom;
        console.log(this._width, this._height);
        var svg = this.refs.svg.getDOMNode();
        console.log(d3);

        d3.select(this.getDOMNode()).select('svg')
            .attr('width',width)
            .attr('height', height)
            .append('g')
            .attr('class', 'strahc-grouping')
            .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.right + ')');
    }
};

module.exports = SizeCalc;
