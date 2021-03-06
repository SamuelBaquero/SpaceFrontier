import React, { Component } from 'react';
import Ship from '../sketches/Ship.js';
import OwnShip from '../sketches/OwnShip.js'
import Asteroid from '../sketches/Asteroids.js';
import {asteroidVertices, randomNumBetweenExcluding, rotatePoint, randomNumBetween } from '../sketches/helpers.js'

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
      asteroidCount: 1,
      currentScore: 0,
      topScore: localStorage['topscore'] || 0,
      inGame: false,
      currentID:0,
      currentIDA:0,
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
    this.pintarParticula=this.pintarParticula.bind(this);
    this.createParticleDB=this.createParticleDB.bind(this);
    this.updateParticles=this.updateParticles.bind(this);
    this.checkMoveParticle=this.checkMoveParticle.bind(this);
    this.createAsteroid=this.createAsteroid.bind(this);
    this.updateAsteroids=this.updateAsteroids.bind(this);
    this.postMovAsteroid=this.postMovAsteroid.bind(this);
    this.pintarAsteroide=this.pintarAsteroide.bind(this);
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

    // Next set of asteroids
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
    this.updateAsteroids();
    //this.updateParticles();

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

    // let ship = new Ship({
    //   position: {
    //     x: xN,
    //     y: yN,
    //   } ,create: this.createObject.bind(this),
    //     onDie: this.gameOver.bind(this)
    // });
    //this.createObject(ship, 'ship');
    this.createShipDB(own);
    this.ownShip.position.x=xN;
    this.ownShip.position.y=yN;
    this.ownShip.rotation=rN;

    this.acelerateShip()
    // Make asteroids
    // this.asteroids = [];
    this.generateAsteroids(this.state.asteroidCount)
  }

  //Creation Methods

  createShipDB(own){
     this.props.cShip(own);      
  }
    createParticleDB(p){
    this.props.cParticle(p);
  }
  createAsteroid(a){
    this.props.cAsteroid(a);
  }
  updateShips(){
    this.checkMoveShip();
    this.props.uShip(this.ownShip.position.x,this.ownShip.position.y,this.ownShip.rotation,this.state.currentID);
    this.props.ships.map((s)=>{
        if(s.id == this.state.currentID){
            // console.log("true")
            this.pintarShip(s.x,s.y,s.r,true);
        }else{
            this.pintarShip(s.x,s.y,s.r,false);
        }
            
        
    })
  }
updateParticles(){
    this.props.particles.map((p)=>{
      // console.log('llegan particulas')
      this.checkMoveParticle(p);
      if(p.delete)
        {
          this.props.dParticle(p._id);
        }else{
        this.props.uParticle(p.lifeSpan,p.size,p.position,p.velocity,p._id);
        this.pintarParticula(p.position.x,p.position.y,p.radius);
        }
        
    })
}
  updateAsteroids(){
    
    this.props.asteroids.map((a)=>{
      if(a.owner==this.state.currentIDA)
        {
          // console.log('es Igual')
          let aN = this.postMovAsteroid(a);
          this.props.uAsteroid(aN,aN._id);
          this.pintarAsteroide(aN.position.x,aN.positiony,aN.rotation,aN.radius,aN.vertices);
        }else{
          this.pintarAsteroide(a.position.x,a.positiony,a.rotation,a.radius,a.vertices);
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
checkMoveParticle(p){
    // Move
    p.position.x += p.velocity.x;
    p.position.y += p.velocity.y;
    p.velocity.x *= p.inertia;
    p.velocity.y *= p.inertia;

    // Shrink
    p.radius -= 0.1;
    if(p.radius < 0.1) {
      p.radius = 0.1;
    }
    if(p.lifeSpan-- < 0){
        p.delete=true;
    }
}

  acelerateShip(val){
      
    this.ownShip.velocity.x -= Math.sin(-this.ownShip.rotation*Math.PI/180) * this.ownShip.speed;
    this.ownShip.velocity.y -= Math.cos(-this.ownShip.rotation*Math.PI/180) * this.ownShip.speed;
    // Thruster particles
    // let posDelta = rotatePoint({x:0, y:-10}, {x:0,y:0}, (this.ownShip.rotation-180) * Math.PI / 180);
    // let ownP ={
    //   lifeSpan: randomNumBetween(20, 40),
    //   size: randomNumBetween(1, 3),
    //   position: {
    //     x: this.ownShip.position.x + posDelta.x + randomNumBetween(-2, 2),
    //     y: this.ownShip.position.y + posDelta.y + randomNumBetween(-2, 2)
    //   },
    //   velocity: {
    //     x: posDelta.x / randomNumBetween(3, 5),
    //     y: posDelta.y / randomNumBetween(3, 5)
    //   }
    // };
    //this.create(particle, 'particles');
    //this.createParticleDB(ownP);
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
  postMovAsteroid(a){
    // Move
    a.position.x += a.velocity.x;
    a.position.y += a.velocity.y;

    // Rotation
    a.rotation += a.rotationSpeed;
    if (a.rotation >= 360) {
      a.rotation -= 360;
    }
    if (a.rotation < 0) {
      a.rotation += 360;
    }

    // Screen edges
    if(a.position.x > this.state.screen.width + a.radius) a.position.x = -a.radius;
    else if(a.position.x < -a.radius) a.position.x = this.state.screen.width + a.radius;
    if(a.position.y > this.state.screen.height + a.radius) a.position.y = -a.radius;
    else if(a.position.y < -a.radius) a.position.y = this.state.screen.height + a.radius;

    return a;
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
    
    for (let i = 0; i < howMany; i++) {
      console.log('id actual',this.state.currentID)
      let idN = this.guidGenerator();
            console.log('idgenerado',idN);
            this.setState({
                currentIDA:idN
            })
      let asteroid =
      { owner:idN,
        position: {
          x: Math.random() * this.state.screen.width,
          y: Math.random() * this.state.screen.height,
        },
        velocity : {
          x: randomNumBetween(-1.5, 1.5),
          y: randomNumBetween(-1.5, 1.5)
           },
          rotation : 0,
          rotationSpeed : randomNumBetween(-1, 1),
          radius : 80,
          score : (80/80)*5,
          vertices : asteroidVertices(8, 80)
      }
      this.createAsteroid(asteroid);
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

  pintarParticula(x,y,r){
    console.log("entra a pintar")
    // Draw
    const context = this.state.context;
    context.save();
    context.translate(x,y);
    context.fillStyle = '#ff9800';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -r);
    context.arc(0, 0, r, 0, 2 * Math.PI);
    context.closePath();
    context.fill();
    context.restore();
  }
  pintarAsteroide(x,y,rot,rad,ver){
    // Draw
    const context = this.state.context;
    context.save();
    context.translate(x,y);
    context.rotate(rot * Math.PI / 180);
    context.strokeStyle = '#FFF';
    context.lineWidth = 2;
    context.beginPath();
    context.moveTo(0, -rad);
    for (let i = 1; i < ver.length; i++) {
      context.lineTo(ver[i].x, ver[i].y);
    }
    context.closePath();
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
