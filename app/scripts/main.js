"use strict";
var React = require('react');

var BarChart = require('./../../lib/BarChart');

var Liskov = React.createClass({
    render: function(){
        return(
            <div className='col-sm-6'>
                <BarChart height={400}/>
            </div>
        );
    }
});

React.render(<Liskov/>, document.getElementById('react-strahc'));
