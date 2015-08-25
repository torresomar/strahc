'use strict';

function OneObjectTooltip(options) {
  var data = options.data;
  var strBuffer = '<div class="chart-tooltip">';
  strBuffer += '<div><div class="color-div" style="background-color:' + options.color + '"></div>';
  strBuffer += '<h6 class="aligned data-title">';
  strBuffer += data[options.valueKey];
  strBuffer += '</h6>';
  strBuffer += '<h6 class="aligned data pull-right">';
  strBuffer += data[options.valueFn] + '</h6>';
  strBuffer += '</div>';

  this.text = strBuffer;
}
function MultiObjectTooltip(options) {
  var strBuffer = '<div class="chart-tooltip">';
  var data = options.data;
  var objects = _.sortByAll(data, options.valueFn).reverse();
  for (var i = 0; i < objects.length; i++) {
    strBuffer += '<div><div class="color-div" style="background-color:' + objects[i].color + '"></div>';
    strBuffer += '<h6 class="aligned data-title">';
    strBuffer += objects[i].name;
    strBuffer += '</h6>';
    strBuffer += '<h6 class="aligned data pull-right">';
    strBuffer += objects[i][options.valueFn] + '</h6>';
  }
  strBuffer += '</div>';

  this.text = strBuffer;
}

function TooltipFactory() {}
TooltipFactory.prototype.createTooltip = function createTooltipType(options) {
  var parentClass = null;

  if (options.tooltipType === 'multi') {
    parentClass = MultiObjectTooltip;
  } else if (options.tooltipType === 'one') {
    parentClass = OneObjectTooltip;
  }

  if (parentClass == null) {
    return false;
  }

  return new parentClass(options);
}

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
  showTooltip: function(d, type){
    var _TooltipFactory = new TooltipFactory();
    var parent = this.getDOMNode();
    var chart = this;
    var width = chart._width;
    var color = chart.props.color;
    var posX, posY;
    var tooltipContent = _TooltipFactory.createTooltip({
      color: chart.props.color,
      data: d,
      tooltipType: type,
      valueFn: chart.props.valueFn,
      valueKey: chart.props.valueKey,
    });

    var tooltip = d3.select(parent)
      .select('.strahc-tooltip')
      .style('display', 'block')
      .style('opacity', '1')
      .html(tooltipContent.text);

    var tooltipWidth = tooltip[0][0].offsetWidth;
    var tooltipHeigth = tooltip[0][0].offsetHeight;

    posX = (d3.mouse(parent)[0] > (width / 2))
      ? d3.event.pageX - tooltipWidth - 10
      : d3.event.pageX + 10;

    posY = (d3.mouse(parent)[1] > ((chart.props.height) / 2))
      ? d3.event.pageY - tooltipHeigth - 45
      : d3.event.pageY - 25;

    tooltip
      .style('left', posX + 'px')
      .style('top', posY + 'px');
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
