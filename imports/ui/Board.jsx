import React, {Component} from 'react';
import PropTypes from 'prop-types';
import Ship from '../sketches/Ship.js';

//Constantes de teclas
const KEY = {
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    A: 65,
    D: 68,
    W: 87,
    SPACE: 32
};

class Board extends Component {
    constructor(props) {
        super(props);
        this.state = {
            context: null,
            keys: {
                left: 0,
                right: 0,
                up: 0,
                down: 0,
                space: 0
            },
            screen: { 
                width: 900,
                height: 654,
                ratio: window.devicePixelRatio || 1
            }
        }
    }
    //React life-cycle methods
    componentDidMount() {
        window.addEventListener('keyup', this.handleKeys.bind(this, false));
        window.addEventListener('keydown', this.handleKeys.bind(this, true));
        // window.addEventListener('resize',  this.handleResize.bind(this, false));
        
        this.redraw(this.props)
    }

    //Handle methods
    handleKeys(value, e) {
        let keys = this.state.keys;
        if (e.keyCode === KEY.LEFT || e.keyCode === KEY.A) 
            keys.left = value;
        if (e.keyCode === KEY.RIGHT || e.keyCode === KEY.D) 
            keys.right = value;
        if (e.keyCode === KEY.UP || e.keyCode === KEY.W) 
            keys.up = value;
        if (e.keyCode === KEY.SPACE) 
            keys.space = value;
        this.setState({keys: keys});
        this.props.movChange(this.state);
    }

    componentWillUpdate(newProps) {
        console.log('redraw');
        this.redraw(newProps);
    }
    redraw(newProps) {
        let context = this.canvas.getContext("2d");
        context.clearRect(0, 0, this.state.screen.width, this.state.height);

        newProps
            .players
            .forEach((p) => {
                // Make ship
                let ship = new Ship({
                    position: {
                        x: p.x,
                        y: p.y,
                        r: p.r
                    }
                    // create: this     .createObject     .bind(this), onDie: this     .gameOver
                    // .bind(this)
                });
                ship.render(context);
                context.restore();
            });
       
    }

    render() {
        return (
            <div className="Board">
                <canvas
                    width={this.state.screen.width}
                    height={this.state.screen.height}
                    ref=
                    {(c)=>this.canvas=c}></canvas>
            </div>
        );
    }
}
Board.propTypes = {
    players: PropTypes.array.isRequired
};

export default Board;