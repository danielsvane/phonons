export default class Renderer {
  constructor(simulation){
    this.simulation = simulation;
  }

  init(){
    let canvas = document.getElementById("canvas");
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.render();
    this.drawFrequencyFunction();
  }

  drawFrequencyFunction(){
    let context = this.ctx;

    context.beginPath();
    context.fillStyle = '#ccc';
    context.fillRect(0, 300, 800, 300);

    let range = 40;
    let offsetX = this.canvas.width/2;
    let offsetY = 600;
    let scaleY = -3500;
    let intervals = 40; // Intervals per zone
    let intervalDistance = 2*Math.PI/this.simulation.latticeConst*2;
    context.beginPath();
    for(let i=-range; i<range+1; i++){
      let k = i*intervalDistance/intervals;
      let val = eval(this.simulation.frequencyFunction);
      context.lineTo(offsetX+i*this.canvas.width/2/intervals, offsetY+val*scaleY);

    }
    context.stroke();

    let markerX = offsetX+this.simulation.k/intervalDistance*this.canvas.width/2;
    context.save()
    context.beginPath();
    context.setLineDash([5, 3]);
    context.moveTo(markerX, 600);
    context.lineTo(markerX, 300);
    context.stroke();
    context.restore();
  }

  render(){
    this.simulation.time++;
    let context = this.ctx;

    context.beginPath();
    context.fillStyle = '#444';
    context.fillRect(0, 0, 800, 300);

    //this.drawPhonon();

    for(let n = 0; n<this.simulation.numAtoms; n++){
      this.drawAtom(n);
    }


    setTimeout(this.render.bind(this), 33);
  }

  drawAtom(n){
    let x = 400+(2*n-this.simulation.numAtoms+1)*10*this.simulation.latticeConst/2;
    let displacement = this.simulation.getDisplacement(n);
    let y = 230;
    let context = this.ctx;
    context.beginPath();
    context.arc(x+displacement, y, 10, 0, 2 * Math.PI, false);
    context.fillStyle = '#ccc';
    context.fill();

    context.beginPath();
    context.arc(x, y-100+displacement*5, 5, 0, 2 * Math.PI, false);
    context.fillStyle = '#222';
    context.fill();
  }

  drawPhonon(){
    let context = this.ctx;
    let subDivisions = 1;
    context.beginPath();
    context.strokeStyle = "#222";
    for(let i=0; i<this.simulation.numAtoms*subDivisions-subDivisions+1; i++){
      let x = i/subDivisions;
      let displacement = this.simulation.getDisplacement(x);
      let newX = 50+x*this.simulation.latticeConst;
      let newY = 200+displacement*5;

      if(i === 0) context.moveTo(newX, newY);
      else context.lineTo(newX, newY);
    }
    context.stroke();
  }
}
