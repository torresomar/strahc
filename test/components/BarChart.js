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
        var renderedComponent = TestUtils.renderIntoDocument(
            <div style={{width: 600, height: 400}}>
                <BarChart
                    height={400}
                    width={600}
                    data={data}/>
            </div>
        );
        var chart = TestUtils.findRenderedDOMComponentWithTag(
            renderedComponent,
            'svg'
        );
        this.chart = chart.getDOMNode();
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
        .select('.bars-group');
        assert(!rects.empty() || rects.size() === 4, 'Faulty rects');
    });
});
