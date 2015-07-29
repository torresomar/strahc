"use strict";
var React = require('react');

var BarChart = require('./../../lib/BarChart');

var Liskov = React.createClass({
    render: function(){
        return(
            <div>
                <h1>Hey Transform This</h1>
                <h1>Hey Transform This</h1>
                <h1>Hey Transform This</h1>
                <h1>Hey Transform This</h1>
                <BarChart/>
            </div>
        );
    }
});

React.render(<Liskov/>, document.getElementById('react-strahc'));
