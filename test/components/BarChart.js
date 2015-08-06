require('./../setup.js');
var React = require('react/addons'),
    assert = require('assert'),
    BarChart = require('../../lib/BarChart'),
    TestUtils = React.addons.TestUtils,
    d3 = require('d3');
describe('- BarChart component', function(){
    before('render and locate element', function() {
        var data = [
            {name: 'A',value: 1000},
            {name: 'B',value: 1400},
            {name: 'C',value: 800},
            {name: 'D',value: 100}
        ];
        var megaColors = ["#1abc9c", "#2ecc71", "#3498db", "#9b59b6", "#34495e", "#16a085", "#27ae60", "#2980b9", "#8e44ad", "#2c3e50", "#f1c40f", "#e67e22", "#e74c3c", "#ecf0f1", "#95a5a6", "#f39c12", "#d35400", "#c0392b", "#bdc3c7", "#7f8c8d"];
        var MockChart = React.createClass({
            getInitialState: function(){
                return {
                    data: [],
                    value: 'value'
                };
            },
            getData: function(num){
                var data = [];
                var size = num;
                while(size--){
                    var neg = -1;
                    if(size % 2 === 0){
                        neg = 1;
                    }
                    data.push({
                        name: String.fromCharCode(97 + size),
                        date: randomDate(new Date(2012,0,1), new Date()),
                        value: getRandomInt(0, 100) * neg,
                        ratio: getRandomInt(0, 1000) * neg
                    });
                }
                function getRandomInt(min, max) {
                    return Math.floor(Math.random() * (max - min + 1)) + min;
                }
                function randomDate(start, end) {
                    return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
                }  
                return data;
            },
            emptyData: function(){
                this.setState({
                    data: []
                });
            },
            render: function(){
                return (
                    <BarChart height={400}
                        width={600}
                        colors={megaColors}
                        data={this.state.data}/>
                );
            }
        });
        var renderedComponent = TestUtils.renderIntoDocument(
            <MockChart/>
        );
        var chart = TestUtils.findRenderedDOMComponentWithTag(
            renderedComponent,
            'div'
        );
        this.chart = chart.getDOMNode();
        this.component = renderedComponent;
    });
    it('<BarChart/> should not render chart if no data is available', function() {
        assert.equal(this.chart.getAttribute('class'),'strahc-pending-data');
    });
    it('<BarChart/> should have an svg when data is available', function(done){
        var newData = this.component.getData(10);
        console.log(this.chart.getAttribute('class'));
        this.component.setState({
           data: newData 
        },function(){
            var chart = TestUtils.findRenderedDOMComponentWithTag(
                this.component,
                'svg'
            );
            console.log(chart);
            var rects = d3.select(this.chart)
            .selectAll('.bars-group');
            console.log(rects.size());
            console.log('finished');
        });
    });
    it('<BarChart/> should have an xAxis', function(){
        var axisIsEmpty = d3.select(this.chart).select('.x-axis').empty();
        assert(!axisIsEmpty);
    });
    it('<BarChart/> should display correct number of axis labels', function(){
        var axisLabelsCount = d3.select(this.chart)
        .selectAll('.x-axis text').size();
        assert(axisLabelsCount === 4, 'The number of labels rendered is wrong');
    });
    it('<BarChart/> should have an yAxis', function(){
        var axisIsEmpty = d3.select(this.chart).select('.y-axis').empty();
        assert(!axisIsEmpty,'Y-Axis is not present in chart');
    });
    it('<BarChart/> should have rects', function(){
        var rects = d3.select(this.chart)
        .selectAll('.bars-group');
        assert(!rects.empty() && rects.size() === 4, 'Faulty rects');
    });
    it('<BarChart/> rects should have a top padding based on delta', function(){
        var rects = d3.select(this.chart)
        .selectAll('.strahc-grouping rect');
        // TODO Fix this test
        assert(true);
    });
    it('<BarChart/> should have no bars when data is removed', function(){
        var chart = this.chart;
        this.component.setState({
            data: []
        }, function(){
            var rects = d3.select(chart)
            .selectAll('.bars-group');
            console.log(rects.size());
            assert(rects.empty());
        });
    });
    it('<BarChart/> should have n-bars when data is updated', function(done){
        var chart = this.chart;
        this.component.setState({
            data: [
                {name: 'Q',value: 104},
                {name: 'W',value: 140},
                {name: 'E',value: 80},
                {name: 'R',value: 127},
                {name: 'T',value: 130},
                {name: 'Y',value: 190}
            ]
        },function(){
            var rects = d3.select(chart)
            .selectAll('.bars-group');
            console.log(rects.size());
            assert(rects.size() === 6);
        });
    });
    it('<BarChart/> should have a grid in Y');
    it('<BarChart/> should have a grid in Y with equal Y axis ticks');
    it('<BarChart/> should display tooltip on mouseover rect');
    it('<BarChart/> should remove tooltip on mouseout rect');
    it('<BarChart/> should resize');
});
