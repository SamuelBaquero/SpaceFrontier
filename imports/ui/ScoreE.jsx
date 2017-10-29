import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Basic component - represents basic component
class ScoreE extends Component {
    constructor(props) {
        super(props);
    }
  render() {
      console.log("elemento")
    return (
        <li>{this.props.player.name} ____________________ {this.props.player.score}</li>
    );
  }
}
ScoreE.propTypes = {
};

export default ScoreE;