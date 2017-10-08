import Bullet from './Bullet';
import Particle from './Particle';
import { rotatePoint, randomNumBetween } from './helpers';

export default class Ship {
  constructor(args) {
    this.position = args.position
  }
  
  render(scontext){
    // Draw
    const context = scontext;
    context.save();
    context.translate(this.position.x, this.position.y);
    context.rotate(this.position.r * Math.PI / 180);
    context.strokeStyle = '#ef5350';
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
  }
}
