import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Controls extends Component {
    constructor(props) {
        super(props);
    }
  render() {
    return (
      <div className="Controls"> 
        <button onClick = {()=>this.props.onClick("up")}>up</button>
      </div>
    );
  }
}
Controls.propTypes = {
};

export default Controls;