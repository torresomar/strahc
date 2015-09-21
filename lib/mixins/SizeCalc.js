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
    this._width = width;
    this._height = props.height - props.margin.top - props.margin.bottom;
    var svg = this.refs.svg.getDOMNode();
    d3.select(svg)
      .attr('width', this._width)
      .attr('height', height)
      .append('g')
      .attr('class', 'strahc-grouping')
      .attr('transform', 'translate(' + props.margin.left + ',' + props.margin.right + ')');
  }, 
  updateSize: function(){
    var props = this.props;
    var width = props.width;
    if(width === null){
      width = this.getDOMNode().offsetWidth;
    }
    this._width = width;
    var svg = this.refs.svg.getDOMNode();
    d3
      .select(svg)
      .attr('width', this._width)
      .select('.strahc-grouping')
      .attr('transform', 'translate(' + (props.margin.left + (width/2))  + ',' + (props.margin.right + (props.height/2))  + ')');

  }
};

module.exports = SizeCalc;
