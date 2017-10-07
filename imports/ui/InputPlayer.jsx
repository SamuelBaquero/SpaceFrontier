import React, { Component } from 'react';
import PropTypes from 'prop-types';

class InputPlayer extends Component {
    constructor(props) {
        super(props);

        this.onClick=this.onClick.bind(this);
    }

    onClick(){
        this.props.onClick(this.input.value);
    }

  render() {
    return (
      <div>
        <input type="text"
        placeholder="Enter Player Name"
        ref = {(input) => {this.input = input}}/>
        <button onClick={this.onClick}>Enter</button>
      </div>
    );
  }
}
InputPlayer.propTypes = {
    onClick: PropTypes.func.isRequired
};

export default InputPlayer;