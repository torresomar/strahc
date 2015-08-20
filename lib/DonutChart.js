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
            valueFn: 'value',
            valueKey: 'name',
            margin: {
                top: 0,
                bottom: 0,
                left: 0,
                right: 100
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
        console.log('Init chart');
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
    _slice: function(){
        var svg = this.refs.svg.getDOMNode();
        var chart = this;
        var props = chart.props;
        var arc = d3.svg.arc()
            .outerRadius(200)
            .innerRadius(80);
        var centerWidth = ((this._width - props.margin.left - props.margin.right) / 2);
        var centerHeight = ((props.height - props.margin.top - props.margin.bottom) / 2);
        d3.select(svg)
            .select('.strahc-grouping')
            .attr('transform', 'translate(' + centerWidth + ',' + centerHeight + ')');
        var arcs = d3.select(svg)
            .select('.strahc-grouping')
            .selectAll('g.slice')
            .data(this._pie)
            .enter()
            .append('svg:g')
            .attr('class', 'slice-group');
        arcs.append('svg:path')
            .attr('class', 'slice')
            .attr('id', function(d){
                return 'slice-' + d.data.name;
            })
            .attr('fill', function(d, i) {
                return '#222';
            })
            .attr("d", arc ) 
            // .each(function(d) {
            //     this._current = d;
            // })
            .on('mousemove', function(d){
                chart.showTooltip(d.data);
            })
            .on('mouseleave', function(d){
                chart.hideTooltip();
            });
    },
    _deltaSize: function(width) {
        var deltaHeight = 30;
        var props = this.props;
        var marginOffset = props.margin.left + props.margin.right;
        var innerRadius;
        var outerRadius;
        if ((width / 2) > this.conf.height) {
            deltaHeight += ((width - marginOffset) / 2) - this.conf.height;
        }
        if (this.props.isFullDonut) {
            innerRadius = ((this.conf.height - marginOffset) / 2.2) * 0.75 - marginOffset + 25;
            outerRadius = innerRadius + 25;
        } else {
            innerRadius = ((width - marginOffset) / 2) * 0.85 - deltaHeight - marginOffset;
            outerRadius = innerRadius + 30;
        }
        return [outerRadius,innerRadius];
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
