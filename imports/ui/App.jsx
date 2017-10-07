import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { createContainer } from 'meteor/react-meteor-data';
//Componentes 
import InputPlayer from './InputPlayer.jsx'
import Board from './Board.jsx'
import Controls from './Controls.jsx'
//Collections players
import { Players } from '../api/players.js';

// Definicion de constantes de las teclas segun navegador
// http://www.javascripter.net/faq/keycodes.htm
const KEY = {
  A: 65,
  W: 87,
  D: 68,
  SPACE: 32
};

// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);
        this.state={
            players:[{
                name:'Joan',
                x:300,
                y:300,
                r:10
            }]
        }
        this.width=900;
        this.height=654;
        this.onEnterPlayer = this.onEnterPlayer.bind(this);
        this.movePlayer = this.movePlayer.bind(this);
    }
    onEnterPlayer(name){
        console.log(name);
        let player = {
            name:name,
            x:Math.random()*this.width,
            y:Math.random()*this.height,
            r:2
        }
        //console.log('Jugador antes de insertar',player)
        player._id = Players.insert(player);
        this.setState({
            currentPlayer:player
        });
        //console.log('Players registrados',this.state.players)
    }

    movePlayer(direction){
        let player = Players.findOne(this.state.currentPlayer._id),
        x = player.x,
        y = player.y;
        switch(direction){
            case "up":
            y-=5;
            break;
        }

        Players.update(this.state.currentPlayer._id,{
            name:player.name,
            x:x,
            y:y
        });
    }
    
  render() {
    return (
      <div>{this.state.currentPlayer ? <Controls onClick={this.movePlayer} /> :
       <InputPlayer onClick = {this.onEnterPlayer}/>
       }
       <Board 
         width={this.width} 
         height={this.height}
         players = {this.props.players}/>
      
      </div>
    );
  }
}
App.propTypes = {
    players:PropTypes.array.isRequired
};

export default createContainer(() => {
  return {
    //variable reactiva que se actualiza con cada cambio
    players: Players.find({}).fetch()
  };
}, App);