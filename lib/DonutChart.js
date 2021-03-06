'use strict';
var React = require('react');
// Chart Mixins
var SizeCalc    = require('./mixins/SizeCalc');
var Tooltip     = require('./mixins/Tooltip');

var Loading     = require('./Loading');
var d3          = require('d3');
var _           = require('lodash');
var dataHelper  = require('./helpers/dataHelper.js');


var DonutChart = React.createClass({
    mixins: [SizeCalc,Tooltip],
    getDefaultProps: function(){
        return {
            width: null,
            height: 400,
            thickness: 1000,
            sliceDelta: 5,
            valueFn: 'value',
            valueKey: 'name',
            tooltip: true,
            margin: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 0
            }
        };
    },
    componentDidMount: function(){
        if(dataHelper.isFalsyCollection(this.props.data)){
            return;
        }
        var chart = this;
        chart._initChart();
    },
    componentDidUpdate: function(){
        if(dataHelper.isFalsyCollection(this.props.data)){
            return;
        }
        var props = this.props;
        var data = props.data;
        var chart = this;
        var svg = chart.refs.svg.getDOMNode();
        var isInitialized = d3.select(svg)
            .select('.strahc-grouping')
            .empty();
        isInitialized ? chart._initChart() : chart._updateChart();
    },
    _updateChart: function(){
        var chart = this;
        var svg = chart.refs.svg.getDOMNode();
        var radii = this._deltaSize();
        chart._pie.value(function(d){
            return d.value;
        });
        d3.select(svg).data([this.props.data]);

        var updatee = d3.select(svg)
        .select('.strahc-grouping')
        .selectAll('.slice-group > path')
        .data(chart._pie);
        // .attr("d", this._arc(false));

        updatee.exit().remove();

        updatee
        .transition()
        .duration(1000)
        .ease('elastic')
        .attrTween('d', arcTween);

        updatee.enter()
        .append('g')
        .attr('class', 'slice-group')
        .append('path')
        .call(this._sliceR);

        var arc = d3.svg.arc()
            .innerRadius(radii[1])
            .outerRadius(radii[0]);

        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) {
                return arc(i(t));
            };
        }
    },
    _initChart: function(){
        window.addEventListener('resize',  _.throttle(this._updateDimensions, 200));
        d3.select(this.getDOMNode())
            .append('div')
            .attr('class', 'strahc-donut-legend')
            .style('width', '100px')
            .style('height', '100px')
            .style('position', 'absolute')
            .style('top', '0')
            .style('border', '1px dashed black')
            .style('left', '0');
        this.setupSize();
        this._setupPie();
        this._slice();
        this.renderTooltip();
        var svg = this.refs.svg.getDOMNode();
    },
    _setupPie: function(){
        const pi = Math.PI;
        var props = this.props;
        var valueFn = props.valueFn;
        var svg = this.refs.svg.getDOMNode();
        d3.select(svg)
            .data([props.data]);
        var pie = d3.layout.pie()
        .sort(null)
        .padAngle(0.01)
        .value(function(d) {
            return d[valueFn];
        });
        this._pie = pie;
    },
    _arc: function(willGrow){
        var radii = this._deltaSize();
        var delta = 0;
        if(willGrow){
            delta = this.props.sliceDelta;
        }
        return d3.svg.arc()
            .outerRadius(radii[0] + delta)
            .innerRadius(radii[1]);
    },
    _slice: function(){
        var svg = this.refs.svg.getDOMNode();
        var chart = this;
        var props = chart.props;
        var centerWidth = ((this._width - props.margin.left) / 2);
        var centerHeight = ((props.height - props.margin.top) / 2);
        var radii = this._deltaSize();
        var legendSquare = (Math.sqrt(radii[1] * radii[1] * 2));
        d3.select(svg)
            .select('.strahc-grouping')
            .attr('transform', 'translate(' + centerWidth + ',' + centerHeight + ')');
        d3.select('.strahc-donut-legend')
            .style('width', legendSquare + 'px')
            .style('height', legendSquare + 'px')
            .style('top', (centerHeight - (legendSquare / 2)) + 'px')
            .style('left', (centerWidth - (legendSquare / 2)) + 'px');
        var arcs = d3.select(svg)
            .select('.strahc-grouping')
            .selectAll('g.slice-group')
            .data(this._pie)
            .enter()
            .append('svg:g')
            .attr('class', 'slice-group')
            .attr('id', function(d){
            });

        var slices = arcs.append('svg:path')
            .call(this._sliceR);

        this._slices = slices;
    },
    _sliceR: function(slice){
        var chart = this;
        var props = chart.props;
        slice.attr('class', 'strahc-slice')
        .attr('id', function(d){
            return 'slice-' + d.data.name;
        })
        .attr('fill', function(d, i) {
            if(chart.props.colors === 'undefined'){
                return '#222';
            }else{
                return chart.props.colors[d.data.name];
            }
        })
        .attr("d", this._arc(false)) 
        .each(function(d){
            this._current = d;
        })
        .on('mousemove', function(d){
            if(chart.props.tooltip){
                chart.showTooltip(d.data);
            }
            d3.select('.strahc-donut-legend')
            .html(chart._htmlLegend(d));
            chart._mouseOver(this);
        })
        .on('mouseleave', function(d){
            chart.hideTooltip();
            chart._mouseOut(this);
        });
    },
    _htmlLegend: function(d){
        if(typeof this.props.legendFormatter !== 'undefined'){
            return this.props.legendFormatter(d);
        }
        return  '<h4>' + d.data.name + '</h4>' + 
                '<h4>' + d.data.value + '</h4>';
    },
    _deltaSize: function() {
        // Get maximum width of pie chart
        var props = this.props;
        var thickness = props.thickness;
        var reducedWidth = this._width - props.margin.left - props.margin.right - props.sliceDelta - 1;
        var reducedHeight = props.height - props.margin.top - props.margin.bottom - props.sliceDelta - 1;
        var maxRadius = Math.min(reducedWidth, reducedHeight) / 2;
        var outerRadius = maxRadius;
        var innerRadius = maxRadius - thickness;
        if(innerRadius < 0){
            innerRadius = 0;
        }
        if(maxRadius < 0){ 
            console.warn('Warning: [strahc] The measures you provided produce a negative radius (Remove margins if possible)');
        }
        this._radii = [outerRadius, innerRadius];
        return [outerRadius,innerRadius];
    },
    _mouseOut: function(slice){
        d3.select(slice)
            .style('fill-opacity', 1)
            .transition()
            .duration(1000)
            .ease('elastic')
            .attr('d', this._arc(false));
    },
    _mouseOver: function(slice){
        d3.select(slice)
            .style('fill-opacity', 0.5)
            .transition()
            .duration(1000)
            .ease('elastic')
            .attr('d', this._arc(true));
    },
    _updateLegend: function(){
        var props = this.props;
        var svg = this.refs.svg.getDOMNode();
        var centerWidth = ((this._width - props.margin.left) / 2);
        var centerHeight = ((props.height - props.margin.top) / 2);
        var radii = this._deltaSize();
        var legendSquare = (Math.sqrt(radii[1] * radii[1] * 2));
        d3.select(svg)
            .select('.strahc-grouping')
            .attr('transform', 'translate(' + centerWidth + ',' + centerHeight + ')');
        d3.select('.strahc-donut-legend')
            .style('width', legendSquare + 'px')
            .style('height', legendSquare + 'px')
            .style('top', (centerHeight - (legendSquare / 2)) + 'px')
            .style('left', (centerWidth - (legendSquare / 2)) + 'px');
    },
    _updateDimensions: function(){
        this.updateSize();
        this._updateChart();
        this._updateLegend();
    },
    render: function(){
        var props = this.props;
        var data = props.data;
        if(dataHelper.isFalsyCollection(data)){
            return <Loading width={props.width} height={props.height}/>;
        }
        return (
            <div className='strahc-component'>
                <svg ref='svg' className='strahc-svg'>
                </svg>
            </div>
        );
    }
});

module.exports = DonutChart;
