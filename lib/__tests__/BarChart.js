// __tests__/BarChart.js
jest.dontMock('../BarChart.js');

describe('BarChart', function() {
    it('renders an svg on init', function() {
        var React = require('react/addons');
        var BarChart = require('../BarChart.js');
        var TestUtils = React.addons.TestUtils;

        // Render BarChart
        var barChart = TestUtils.renderIntoDocument(
            <div style={{width: 600, height: 400}}>
                <BarChart
                    height={400}
                    colors={megaColors}
                    data={this.state.data}/>
            </div>
        );
        var svg = TestUtils.findRenderedDOMComponentWithClass(
            barChart, 'svg');
        
        expect(svg.getDOMNode()).toBeDefined();
    });
});
