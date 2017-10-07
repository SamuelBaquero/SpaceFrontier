import React, {Component} from 'react';
import PropTypes from 'prop-types';

class Board extends Component {
    constructor(props) {
        super(props);
    }
    componentDidMount () {
      this.redraw(this.props)
    }
    
    componentWillUpdate(newProps) {
        console.log('redraw');
        this.redraw(newProps);
    }
    redraw(newProps){
        let context = this
            .canvas
            .getContext("2d");
                context.clearRect(0, 0, newProps.width, newProps.height);
                newProps.players.forEach((p) => {
                context.save();
                context.translate(p.x, p.y);
                context.rotate(p.r * Math.PI / 180);
                context.strokeStyle = '#d50000';
                context.fillStyle = '#ef5350';
                context.lineWidth = 2;
                context.beginPath();
                context.moveTo(0, -15);
                context.lineTo(10, 10);
                context.lineTo(5, 7);
                context.lineTo(-5, 7);
                context.lineTo(-10, 10);
                context.closePath();
                context.fill();
                context.stroke();
                context.restore();
            }); 
    }

    render() {
        return (
            <div className="Board">
                <canvas
                    width={this.props.width}
                    height={this.props.height}
                    ref=
                    {(c)=>this.canvas=c}></canvas>
            </div>
        );
    }
}
Board.propTypes = {
    width:PropTypes.number.isRequired,
    height:PropTypes.number.isRequired,
    players:PropTypes.array.isRequired
};

export default Board;