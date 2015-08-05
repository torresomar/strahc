'use strict';

var d3 = require('d3');

var Tooltip = {
    renderTooltip: function(){
        var parent = this.getDOMNode();
        var div = d3.select(parent)
            .append('div')
            .attr('class', 'strahc-tooltip')
            .attr('id', 'strach-tooltip-unique-chart-identifier');
    },
    showTooltip: function(d){
        var parent = this.getDOMNode();
        var chart = this;
        var posX = d3.mouse(parent)[0];
        var posY = d3.mouse(parent)[1];
        posX = (posX > (chart.props.width / 2)) ? posX - 210 : posX + 50;
        if(posY > (chart.props.height - 90)){
            posY = chart.props.height - 90;
        }
        d3.select(parent)
            .select('.strahc-tooltip')
            .transition()
            .duration(100)
            .style('display', 'block')
            .style('opacity', '1')
            .style('left', posX + 'px')
            .style('top', posY + 'px');
    },
    hideTooltip: function(){
        var parent = this.getDOMNode();
        var div = d3.select(parent)
            .select('.strahc-tooltip')
            .transition()
            .duration(100)
            .style('display', 'none')
            .style('opacity', '0');
    }
}; 

module.exports = Tooltip;
