'use strict';

var React = require('react');

var Loading = React.createClass({
    render: function(){
        var width = this.props.width;
        var height = this.props.height;
        var divStyle = {
            height: height,
            background: '#F9F9F9'
        };
        var iconStyle = {
            paddingTop: (height / 2) - 12,
            textAlign: 'center'
        };
        return(
            <div className='strahc-pending-data' style={divStyle}>
                <h5 style={iconStyle}>
                    <i className='fa fa-cog fa-spin'></i>
                    No data available
                </h5>
            </div>
        );
    }
});

module.exports = Loading;
