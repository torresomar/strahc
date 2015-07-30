// __tests__/BarChart.js
jest.dontMock('../BarChart.js');
jest.dontMock('../mixins/SizeCalc.js');
jest.dontMock('../mixins/XAxis.js');
jest.dontMock('lodash');
jest.dontMock('d3');

describe('BarChart', function() {
    it('renders an svg on init', function() {
        var React = require('react/addons');
        var BarChart = require('../BarChart.js');
        var TestUtils = React.addons.TestUtils;
        
        var data = [
            {
                name: 'example',
                value: 1000
            }
        ];
        // Render BarChart
        var barChart = TestUtils.renderIntoDocument(
            <div style={{width: 600, height: 400}}>
                <BarChart
                    height={400}
                    width={600}
                    data={data}/>
            </div>
        );
        var svg = TestUtils.findRenderedDOMComponentWithClass(
            barChart, 'strahc-grouping');
        
        expect(svg.getDOMNode()).toBeDefined();
    });
});
