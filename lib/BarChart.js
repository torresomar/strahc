'use strict';
var React = require('react');
var xAxis = require('./mixins/xAxis');

var BarChart = React.createClass({
    mixins: [xAxis],
    render: function(){
        console.log('Bar chart rendering...');
        this.setupXAxis(); 
        return (
            <h1>this is an amazing chart</h1>
        );
    }
});

module.exports = BarChart;
