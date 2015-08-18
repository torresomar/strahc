'use strict';

var d3 = require('d3');
var _ =  require('lodash');

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
        var width = chart._width;
        var posX = d3.mouse(parent)[0];
        var posY = d3.mouse(parent)[1];
        posX = (posX > (width / 2)) ? posX - 210 : posX + 50;
        if(posY > (chart.props.height - 90)){
            posY = chart.props.height - 90;
        }
        var color = '';
        if(_.isArray(chart.props.colors)){
            color = chart._colors(d[chart.props.valueKey]);
        }else{
            color = chart.props.colors[d[chart.props.valueKey]];
        }
        var strBuffer = '';
        strBuffer += '<h4>' + chart.props.valueFn + '</h4>';
        strBuffer += '<hr>';
        strBuffer += '<div class="strahc-half">';
        strBuffer += '<div class="strahc-circle" style="background:'+ color +';"></div><h5>' + d[chart.props.valueKey] + '</h5>';
        strBuffer += '</div>';
        strBuffer += '<div class="strahc-half">';
        strBuffer += '<h5>' + d[chart.props.valueFn] + '</h5>';
        strBuffer += '</div>';
        d3.select(parent)
            .select('.strahc-tooltip')
            .style('display', 'block')
            .style('opacity', '1')
            .style('left', posX + 'px')
            .style('top', posY + 'px')
            .html(strBuffer);
    },
    hideTooltip: function(){
        var parent = this.getDOMNode();
        var div = d3.select(parent)
            .select('.strahc-tooltip')
            .style('display', 'none')
            .style('opacity', '0');
    }
}; 

module.exports = Tooltip;
