import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {createContainer} from 'meteor/react-meteor-data';
//Componentes
import InputPlayer from './InputPlayer.jsx'
import Board from './Board.jsx'
import Controls from './Controls.jsx'
import OwnShip from '../sketches/OwnShip.js';
import {AloneG} from './AloneG.jsx';
import {Principal} from './Principal.jsx';

//Collections players
import {Players} from '../api/players.js';
import {Shipsdb} from '../api/shipsdb.js';

// App component - represents the whole app
class App extends Component {

    constructor(props) {
        super(props);
        this.state = {
            enConstruccion:true,
            alone:false,
            multiplayer:false,
            players: [
                {
                    name: 'Joan',
                    x: 300,
                    y: 300,
                    r: 10
                }
            ]
        }
        this.width = 900;
        this.height = 654;
        this.onEnterPlayer = this.onEnterPlayer.bind(this);
        this.movePlayer = this.movePlayer.bind(this);
        this.crearShip = this.crearShip.bind(this);
        this.updateShip = this.updateShip.bind(this);
        this.selectionSingle = this.selectionSingle.bind(this);
        this.selectionMultiplayer = this.selectionMultiplayer.bind(this);
    }
    
    crearShip(item){
        console.log("crea ship")
        item._id=Shipsdb.insert(item);
    }
    selectionSingle(){
        this.setState({
            alone:!this.state.alone
        })
    }
    selectionMultiplayer(){
        this.setState({
            multiplayer:!this.state.multiplayer
        })
    }
    logOut(){
        this.setState({
            currentPlayer:''
        })
    }
    updateShip(){

    }
    
    onEnterPlayer(name,pass) {
        //Deberiamos validar un monton de cosas
        console.log(name);
        let player = {
            name: name,
            x: Math.random() * this.width,
            y: Math.random() * this.height,
            r: Math.random() * 360
        }
        //console.log('Jugador antes de insertar',player)
        player._id = Players.insert(player);

        this.setState({currentPlayer: player});
     
        //console.log('Players registrados',this.state.players)
    }
    
    movePlayer(state) {

         let player = Players.findOne(this.state.currentPlayer._id),
            xActual = player.x,
            yActual = player.y,
            rActual = player.r;
        
        let own = new OwnShip({
         position: {
            x: xActual,
            y: yActual
        },r:rActual
         });
        // Controls
        if(state.keys.up){
        console.log("se movio arriba")
        own.accelerate(1,state);
        console.log('posicion antigua',xActual)
        console.log('posicion nueva',own.position.x)
        }
        if(state.keys.left){
        own.rotate('LEFT');
        }
        if(state.keys.right){
        own.rotate('RIGHT');
        }

        Players.update(this.state.currentPlayer._id, {
            name: player.name,
            x: own.position.x,
            y: own.position.y,
            r: own.rotation
        });
    }

    render() {

        let menu;
         if(!this.state.currentPlayer){
      menu = (
          <div>
              <Principal onClick = {this.onEnterPlayer}  
              single = {this.selectionSingle}
              multi ={this.selectionMultiplayer}
              under={this.state.multi}/>
          </div>
      )
    }
    else if(this.state.currentPlayer && this.state.alone){
        menu = (
            <div>
              <AloneG/>
          </div>
        )
    }else if(this.state.currentPlayer && this.state.multiplayer){
        menu = (
            <div>
             <Principal onClick = {this.onEnterPlayer} 
             under={this.state.enConstruccion}/>
          </div>
        )
    }
        return (

            <div>
               {menu}
            </div>
        );
    }
}
App.propTypes = {
    players: PropTypes.array.isRequired
};

export default createContainer(() => {
    return {
        //variable reactiva que se actualiza con cada cambio
        players: Players.find({}).fetch(),
        shiplist:Shipsdb.find({}).fetch()
    };
}, App);