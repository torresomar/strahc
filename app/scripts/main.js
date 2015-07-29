"use strict";
var React = require('react');
var strahc = require('./../../index');
var Liskov = React.createClass({
    render: function(){
        return(
            <div>
                <h1>Hey Transform This</h1>
                <h1>Hey Transform This</h1>
                <h1>Hey Transform This</h1>
                <h1>Hey Transform This</h1>
            </div>
        );
    }
});

React.render(<Liskov/>, document.getElementById('react-strahc'));
