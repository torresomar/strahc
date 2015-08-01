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
        var renderedComponent = TestUtils.renderIntoDocument(
            <BarChart
                height={400}
                width={600}
                colors={megaColors}
                data={data}/>
        );
        var chart = TestUtils.findRenderedDOMComponentWithTag(
            renderedComponent,
            'svg'
        );
        this.chart = chart.getDOMNode();
        this.component = renderedComponent;
    });
    it('<BarChart/> should be of class "strahc-svg"', function() {
        assert(this.chart.getAttribute('class') === 'strahc-svg');
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
