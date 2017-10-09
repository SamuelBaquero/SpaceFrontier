import React, { Component } from 'react';
import Ship from '../sketches/Ship.js';
import OwnShip from '../sketches/OwnShip.js'
import Asteroid from '../sketches/Asteroids.js';
import { randomNumBetweenExcluding } from '../sketches/helpers.js'

const KEY = {
  A: 65,
  D: 68,
  W: 87,
  SPACE: 32
};

export class MultiGame extends Component {
  constructor() {
    super();
    this.state = {
      screen: {
        width: window.innerWidth,
        height: window.innerHeight,
        ratio: window.devicePixelRatio || 1,
      },
      context: null,
      keys : {
        left  : 0,
        right : 0,
        up    : 0,
        space : 0,
      },
      asteroidCount: 3,
      currentScore: 0,
      topScore: localStorage['topscore'] || 0,
      inGame: false,
      currentID:0
    }
    this.ownShip={
        velocity : {
                x: 0,
                y: 0
                },
        position :{
                x: 0,
                y: 0
                },
        rotation : 0,
        rotationSpeed : 6,
        speed : 0.15,
        inertia : 0.99,
        radius : 20,
        lastShot : 0,
    };

    this.ship = [];
    this.asteroids = [];
    this.bullets = [];
    this.particles = [];
    this.createShipDB=this.createShipDB.bind(this);
    this.updateShips=this.updateShips.bind(this);
    this.acelerateShip=this.acelerateShip.bind(this);
    this.postMovShip=this.postMovShip.bind(this);
    this.rotateShip=this.rotateShip.bind(this);
    this.checkMoveShip=this.checkMoveShip.bind(this);
    this.guidGenerator=this.guidGenerator.bind(this);
  }
 guidGenerator() {
    var S4 = function() {
       return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
    };
    return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
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

  handleKeys(value, e){
    let keys = this.state.keys;
    if( e.keyCode === KEY.A) keys.left  = value;
    if(e.keyCode === KEY.D) keys.right = value;
    if( e.keyCode === KEY.W) keys.up    = value;
    if(e.keyCode === KEY.SPACE) keys.space = value;
    this.setState({
      keys : keys
    });
  }

  componentDidMount() {
    window.addEventListener('keyup',   this.handleKeys.bind(this, false));
    window.addEventListener('keydown', this.handleKeys.bind(this, true));
    window.addEventListener('resize',  this.handleResize.bind(this, false));

    const context = this.refs.canvas.getContext('2d');
    this.setState({ context: context });
    this.startGame();
    requestAnimationFrame(() => {this.update()});
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.handleKeys);
    window.removeEventListener('resize', this.handleKeys);
    window.removeEventListener('resize', this.handleResize);
  }

  update() {
    const context = this.state.context;
    const keys = this.state.keys;
    // const ship = this.ship[0];

    context.save();
    context.scale(this.state.screen.ratio, this.state.screen.ratio);

    // Motion trail
    context.fillStyle = '#000';
    context.globalAlpha = 0.4;
    context.fillRect(0, 0, this.state.screen.width, this.state.screen.height);
    context.globalAlpha = 1;

    // // Next set of asteroids
    // if(!this.asteroids.length){
    //   let count = this.state.asteroidCount + 1;
    //   this.setState({ asteroidCount: count });
    //   this.generateAsteroids(count)
    // }

    // Check for colisions
    // this.checkCollisionsWith(this.bullets, this.asteroids);
    // this.checkCollisionsWith(this.ship, this.asteroids);

    // Remove or render
    //this.updateObjects(this.particles, 'particles')
    // this.updateObjects(this.asteroids, 'asteroids')
    // this.updateObjects(this.bullets, 'bullets')
    // this.updateObjects(this.ship, 'ship')
    this.updateShips();

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
      inGame: true,
      currentScore: 0,
    });

    let xN = Math.random() * this.state.screen.width,
        yN = Math.random() * this.state.screen.height,
        rN = Math.random() * 360;

    let idN = this.guidGenerator();
    this.setState({
        currentID:idN
    })
   // Make ship
    let own = {
         x: xN,
         y: yN,
         r: rN,
         id: idN
    }
    // console.log('x inicial:',xN);
    // console.log('y inicial:',yN);

    let ship = new Ship({
      position: {
        x: xN,
        y: yN,
      } ,create: this.createObject.bind(this),
        onDie: this.gameOver.bind(this)
    });
    //this.createObject(ship, 'ship');
    this.createShipDB(own);
    this.ownShip.position.x=xN;
    this.ownShip.position.y=yN;
    this.ownShip.rotation=rN;

    this.acelerateShip()
    // Make asteroids
    // this.asteroids = [];
    // this.generateAsteroids(this.state.asteroidCount)
  }
  createShipDB(own){
     this.props.cShip(own);      
  }
  updateShips(){
    this.checkMoveShip();
    this.props.uShip(this.ownShip.position.x,this.ownShip.position.y,this.ownShip.rotation,this.state.currentID);
    this.props.ships.map((s)=>{
        if(s.id == this.state.currentID){
            console.log("true")
            this.pintarShip(s.x,s.y,s.r,true);
        }else{
            this.pintarShip(s.x,s.y,s.r,false);
        }
            
        
    })
  }
checkMoveShip(){
    // Controls
    if(this.state.keys.up){
      this.acelerateShip(1); 
    }
    if(this.state.keys.left){
      this.rotateShip('LEFT'); 
    }
    if(this.state.keys.right){
      this.rotateShip('RIGHT');
    }
    // if(state.keys.space && Date.now() - this.lastShot > 300){
    //   const bullet = new Bullet({ship: this});
    //   this.create(bullet, 'bullets');
    //   this.lastShot = Date.now();
    // }
  }

  acelerateShip(val){
      
    this.ownShip.velocity.x -= Math.sin(-this.ownShip.rotation*Math.PI/180) * this.ownShip.speed;
    this.ownShip.velocity.y -= Math.cos(-this.ownShip.rotation*Math.PI/180) * this.ownShip.speed;
    // Thruster particles
    // let posDelta = rotatePoint({x:0, y:-10}, {x:0,y:0}, (this.rotation-180) * Math.PI / 180);
    // const particle = new Particle({
    //   lifeSpan: randomNumBetween(20, 40),
    //   size: randomNumBetween(1, 3),
    //   position: {
    //     x: this.position.x + posDelta.x + randomNumBetween(-2, 2),
    //     y: this.position.y + posDelta.y + randomNumBetween(-2, 2)
    //   },
    //   velocity: {
    //     x: posDelta.x / randomNumBetween(3, 5),
    //     y: posDelta.y / randomNumBetween(3, 5)
    //   }
    // });
    // this.create(particle, 'particles');
    this.postMovShip();
    // console.log(this.ownShip);
  }

rotateShip(dir){
    if (dir == 'LEFT') {
      this.ownShip.rotation -= this.ownShip.rotationSpeed;
    }
    if (dir == 'RIGHT') {
      this.ownShip.rotation += this.ownShip.rotationSpeed;
    }
    this.postMovShip();
  }

postMovShip(){
     // Move
    this.ownShip.position.x += this.ownShip.velocity.x;
    this.ownShip.position.y += this.ownShip.velocity.y;
    this.ownShip.velocity.x *= this.ownShip.inertia;
    this.ownShip.velocity.y *= this.ownShip.inertia;

    // Rotation
    if (this.ownShip.rotation >= 360) {
      this.ownShip.rotation -= 360;
    }
    if (this.ownShip.rotation < 0) {
      this.ownShip.rotation += 360;
    }

    // Screen edges
    if(this.ownShip.position.x > this.state.screen.width) this.ownShip.position.x = 0;
    else if(this.ownShip.position.x < 0) this.ownShip.position.x = this.state.screen.width;
    if(this.ownShip.position.y > this.state.screen.height) this.ownShip.position.y = 0;
    else if(this.ownShip.position.y < 0) this.ownShip.position.y = this.state.screen.height;
}

  gameOver(){
    this.setState({
      inGame: false,
    });

    // Replace top score
    if(this.state.currentScore > this.state.topScore){
      this.setState({
        topScore: this.state.currentScore,
      });
      localStorage['topscore'] = this.state.currentScore;
    }
  }

  generateAsteroids(howMany){
    let asteroids = [];
    let ship = this.ship[0];
    for (let i = 0; i < howMany; i++) {
      let asteroid = new Asteroid({
        size: 80,
        position: {
          x: randomNumBetweenExcluding(0, this.state.screen.width, ship.position.x-60, ship.position.x+60),
          y: randomNumBetweenExcluding(0, this.state.screen.height, ship.position.y-60, ship.position.y+60)
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
        //   if(group=="ship"){

        //   }
        items[index].render(this.state);
      }
      index++;
    }
  }

  checkCollisionsWith(items1, items2) {
    var a = items1.length - 1;
    var b;
    for(a; a > -1; --a){
      b = items2.length - 1;
      for(b; b > -1; --b){
        var item1 = items1[a];
        var item2 = items2[b];
        if(this.checkCollision(item1, item2)){
          item1.destroy();
          item2.destroy();
        }
      }
    }
  }

  checkCollision(obj1, obj2){
    var vx = obj1.position.x - obj2.position.x;
    var vy = obj1.position.y - obj2.position.y;
    var length = Math.sqrt(vx * vx + vy * vy);
    if(length < obj1.radius + obj2.radius){
      return true;
    }
    return false;
  }

  //metodos de pintura
  pintarShip(x,y,r,e){
      // Draw
    const context = this.state.context;
    context.save();
    context.translate(x, y);
    context.rotate(r * Math.PI / 180);
    let color1,color2;
    if(e){
        color1= '#f44336';
        color2= '#c62828';
    }else{
        color1= '#ffffff';
        color2= '#000000';
    }
    context.strokeStyle = color1;
    context.fillStyle = color2;
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
  }

  render() {
    let endgame;
    let message;

    if (this.state.currentScore <= 0) {
      message = '0 points  You Can Do It Better!';
    } else if (this.state.currentScore >= this.state.topScore){
      message = 'New top score with ' + this.state.currentScore + ' points.';
    } else {
      message = this.state.currentScore + ' Points'
    }

    if(!this.state.inGame){
      endgame = (
        <div className="endgame">
          <p>Game over!!!</p>
          <p>{message}</p>
          <button
            onClick={ this.startGame.bind(this) }>
            Respawn
          </button>
        </div>
      )
    }

    return (
      <div>
        { endgame }
        <span className="score current-score" >Score: {this.state.currentScore}</span>
        <span className="score top-score" >Top Score: {this.state.topScore}</span>
        <span className="controls" >
          Use [A][S][W][D] to MOVE<br/>
          Use [SPACE] to SHOOT
        </span>
        <canvas ref="canvas"
          width={this.state.screen.width * this.state.screen.ratio}
          height={this.state.screen.height * this.state.screen.ratio}
        />
      </div>
    );
  }
}
