var React = require('react');
var ReactDOM = require('react-dom');
require('babel-core');

var HelloWorld = React.createClass({
    render: function() {
      return (
      <p>
       {this.props.player} Last Turn at {this.props.date.toTimeString()}
      </p>
      );
    }
});


window.HelloWorld = HelloWorld;
