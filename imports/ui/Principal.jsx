import React, { Component } from 'react';
import Ship from '../sketches/Ship.js';
import Asteroid from '../sketches/Asteroids.js';
import { randomNumBetweenExcluding } from '../sketches/helpers.js'

const KEY = {
  LEFT:  37,
  RIGHT: 39,
  UP: 38,
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32
};

export class Principal extends Component {
  constructor() {
    super();
    this.state = {
        selection:false,
        name:"",
        pass:"",
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      asteroidCount: 6,
      currentScore: 0,
      topScore: localStorage['topscore'] || 0,
      inGame: false,
      getAccount:false
    }
    this.ship = [];
    this.asteroids = [];
    this.bullets = [];
    this.particles = [];
  }

  handleResize(value, e){
    this.setState({
      screen : {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      }
    });
  }

  componentDidMount() {
    window.addEventListener('resize',  this.handleResize.bind(this, false));

    const context = this.refs.canvas.getContext('2d');
    this.setState({ context: context });
    this.startGame();
    requestAnimationFrame(() => {this.update()});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleResize);
  }

  update() {
    const context = this.state.context;

    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Motion trail
    context.fillStyle = '#000';
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;

    // Next set of asteroids
    if(!this.asteroids.length){
      let count = this.state.asteroidCount + 1;
      this.setState({ asteroidCount: count });
      this.generateAsteroids(count)
    }

    // Remove or render
    this.updateObjects(this.particles, 'particles')
    this.updateObjects(this.asteroids, 'asteroids')

    context.restore();

    // Next frame
    requestAnimationFrame(() => {this.update()});
  }

  addScore(points){
    if(this.state.inGame){
      this.setState({
        currentScore: this.state.currentScore + points,
      });
    }
  }

  startGame(){
    this.setState({
      inGame: false,
      currentScore: 0,
    });

    // Make asteroids
    this.asteroids = [];
    this.generateAsteroids(this.state.asteroidCount)
  }


  generateAsteroids(howMany){
    let asteroids = [];
    let ship = this.ship[0];
    for (let i = 0; i < howMany; i++) {
      let asteroid = new Asteroid({
        size: 80,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, 240, 360),
          y: randomNumBetweenExcluding(0, this.state.screen.height, 500, 600)
        },
        create: this.createObject.bind(this),
        addScore: this.addScore.bind(this)
      });
      this.createObject(asteroid, 'asteroids');
    }
  }

  createObject(item, group){
    this[group].push(item);
  }

  updateObjects(items, group){
    let index = 0;
    for (let item of items) {
      if (item.delete) {
        this[group].splice(index, 1);
      }else{
        items[index].render(this.state);
      }
      index++;
    }
  }
makeSelection(){
    this.setState({
        selection:!this.state.selection
    })
}
onClickSingle(){
        this.props.single();
        this.props.onClick(this.state.name,this.state.pass);
    }
onClickMulti(){
    this.props.multi();
    this.props.onClick(this.state.name,this.state.pass);
}

getAccount(){
    this.setState({
        getAccount:!this.state.getAccount
    });
}
    handleUser(e){
        this.setState({
            name : e.target.value
        })
    }
    handlePass(e){
         this.setState({
            pass : e.target.value
        })
    }
  render() {
    let endgame;
    if(this.props.under)
        {
            endgame = (
               <div>
                    <div className="wrapper">
                    <div className="container">
                        <div className="form under">
                            Sorry Man, this part is under Construction<br/>
                             <button  onClick={this.onClickSingle.bind(this)}>Try Single Player</button>
                        </div>
                 </div>
	        </div>

               </div> 
            )
        }else if(this.state.selection){
            endgame = (
          <div>
              <div className="wrapper">
                    <div className="container">
                       <p className="form">Please select one Game Mode</p>
                        <div className="form">
                            <button  onClick={this.onClickSingle.bind(this)}>SinglePlayer</button>
                            <button  onClick={this.onClickMulti.bind(this)}>MultiPlayer</button>
                        </div>
                </div>
	        </div>
          </div>
            )
        }
        else if(!this.state.inGame && !this.state.getAccount){
      endgame = (
          <div>
              <div className="wrapper">
                    <div className="container">
                        <div className="form">
                            <input type="text" placeholder="Username" onChange={this.handleUser.bind(this)}/>
                            <input type="password" placeholder="Password" onChange ={this.handlePass.bind(this)}/>
                            <button  onClick={this.makeSelection.bind(this)}>Login</button>
                        </div>
                        <a className="getAn" href="#"onClick={this.getAccount.bind(this)}> Create An Account </a>
                 </div>
	        </div>
          </div>
      )
    }else if(!this.state.inGame && this.state.getAccount){
        endgame = (
          <div>
              <div className="wrapper">
                    <div className="container">
                        <form className="form">
                            <input type="text" placeholder="Username"/>
                            <input type="password" placeholder="Password"/>
                            <input type="password" placeholder="ReTypePassword"/>
                            <button type="submit" id="login-button" onSubmit={this.onClick}>Create Account</button>
                        </form>
                        <a className="getAn" href="#"onClick={this.getAccount.bind(this)}> Already have an account ? </a>
                </div>
	        </div>
          </div>
      )
    }

    return (
      <div>
        { endgame }
        <span className="welcome" >
          Space Battle
        </span>
        <canvas ref="canvas"
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    );
  }
}
