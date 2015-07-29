'use strict';

var React = require('react');

var Loading = React.createClass({
    render: function(){
        var width = this.props.width;
        var height = this.props.height;
        var divStyle = {
            width: width,
            height: height,
            position: 'relative',
            background: '#F9F9F9'
        };
        var iconStyle = {
            position: 'absolute',
            top: (height / 2) - 12,
            left: (width / 2) - 12,
            margin: 0
        };
        return(
            <div style={divStyle}>
                <h5 style={iconStyle}>
                    <i className='fa fa-cog fa-spin'></i>
                </h5>
            </div>
        );
    }
});

module.exports = Loading;
