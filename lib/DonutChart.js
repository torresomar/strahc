'use strict';
var React = require('react');
// Chart Mixins
var SizeCalc =  require('./mixins/SizeCalc');
var Tooltip =   require('./mixins/Tooltip');

var Loading =       require('./Loading');
var d3 =            require('d3');
var _ =             require('lodash');
var dataHelper =    require('./helpers/dataHelper.js');


var DonutChart = React.createClass({
    mixins: [SizeCalc,Tooltip],
    getDefaultProps: function(){
        return {
            width: null,
            height: 400,
            thickness: 500,
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
    _initChart: function(){
        this.setupSize();
        var svg = this.refs.svg.getDOMNode();
        this._setupPie();
        this._slice();
        this.renderTooltip();
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
        d3.select(svg)
            .select('.strahc-grouping')
            .attr('transform', 'translate(' + centerWidth + ',' + centerHeight + ')');
        var arcs = d3.select(svg)
            .select('.strahc-grouping')
            .selectAll('g.slice-group')
            .data(this._pie)
            .enter()
            .append('svg:g')
            .attr('class', 'slice-group');
        arcs.append('svg:path')
            .attr('class', 'strahc-slice')
            .attr('id', function(d){
                return 'slice-' + d.data.name;
            })
            .attr('fill', function(d, i) {
                return '#222';
            })
            .attr("d", this._arc(false)) 
            .on('mousemove', function(d){
                if(chart.props.tooltip){
                    chart.showTooltip(d.data);
                }
                chart._mouseOver(this);
            })
            .on('mouseleave', function(d){
                chart.hideTooltip();
                chart._mouseOut(this);
            });
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
            .duration(500)
            .ease('elastic')
            .attr('d', this._arc(false));
    },
    _mouseOver: function(slice){
        d3.select(slice)
            .style('fill-opacity', 0.5)
            .transition()
            .duration(500)
            .ease('elastic')
            .attr('d', this._arc(true));
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
