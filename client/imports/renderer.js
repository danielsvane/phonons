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

  getFrequencyValue(k){
    return eval(this.simulation.frequencyFunction);
  }

  drawFrequencyFunction(){
    let context = this.ctx;

    context.beginPath();
    context.fillStyle = '#ccc';
    context.fillRect(0, 300, 800, 300);

    let range = 35;
    let offsetX = this.canvas.width/2;
    let offsetY = 570;
    let scaleY = -3500;
    let intervals = 40; // Intervals per zone
    let intervalDistance = 2*Math.PI/this.simulation.latticeConst*2;
    context.beginPath();
    for(let i=-range; i<range+1; i++){
      console.log(k);
      let k = i*intervalDistance/intervals;
      let val = this.getFrequencyValue(k);
      context.lineTo(offsetX+i*this.canvas.width/2/intervals, offsetY+val*scaleY);

    }
    context.stroke();

    let markerX = offsetX+this.simulation.k/intervalDistance*this.canvas.width/2;
    context.save()

    context.beginPath();
    context.setLineDash([5, 3]);
    context.moveTo(markerX, this.canvas.height/3*2+30);
    context.lineTo(markerX, this.canvas.height-30);
    context.stroke();

    let k = this.simulation.k;
    let markerY = this.getFrequencyValue(k)*scaleY+offsetY;

    context.beginPath();
    context.setLineDash([5, 3]);
    context.moveTo(50, markerY);
    context.lineTo(this.canvas.width-50, markerY);
    context.stroke();

    context.restore();

    context.strokeStyle = "#222";
    context.beginPath();
    context.moveTo(50, this.canvas.height/3*2+30);
    context.lineTo(50, this.canvas.height-30);
    context.stroke();

    context.beginPath();
    context.moveTo(50, this.canvas.height-30);
    context.lineTo(this.canvas.width-50, this.canvas.height-30);
    context.stroke();

    context.fillStyle = "#222";
    context.textAlign = "right";
    context.fillText("ω", 40, markerY+3);

    context.textAlign = "center";
    context.fillText("k", markerX, this.canvas.height-15);
    context.fillText("0", offsetX, this.canvas.height-15);
    context.fillText("2π/a", offsetX+200, this.canvas.height-15);
    context.fillText("-2π/a", offsetX-200, this.canvas.height-15);
    //context.fillText("-u", 40, this.canvas.height/2+this.simulation.u+3);
  }

  render(){
    this.simulation.time++;
    let context = this.ctx;

    context.beginPath();
    context.fillStyle = '#444';
    context.fillRect(0, 0, this.canvas.width, this.canvas.height/3);

    for(let n = 0; n<this.simulation.numAtoms; n++){
      this.drawAtom(n);
    }

    context.beginPath();
    context.fillStyle = '#ccc';
    context.fillRect(0, this.canvas.height/3, this.canvas.width, this.canvas.height/3);


    this.drawPhonon();



    setTimeout(this.render.bind(this), 33);
  }

  drawAtom(n){
    let x = this.canvas.width/2+(2*n-this.simulation.numAtoms+1)*10*this.simulation.latticeConst/2;
    let displacement = this.simulation.getDisplacement(n);
    let y = this.canvas.height/6;
    let context = this.ctx;
    context.beginPath();
    context.arc(x+displacement, y, 10, 0, 2 * Math.PI, false);
    context.fillStyle = '#ccc';
    context.fill();
  }

  drawPhonon(){

    let context = this.ctx;
    let subDivisions = 8;
    let y = this.canvas.height/2;
    let prevX = 0;
    let prevY = 0;

    context.strokeStyle = "#222";
    context.beginPath();
    context.moveTo(50, this.canvas.height/3+30);
    context.lineTo(50, this.canvas.height/3*2-30);
    context.stroke();


    context.setLineDash([5, 3]);

    context.beginPath();
    context.moveTo(50, this.canvas.height/2+this.simulation.u);
    context.lineTo(this.canvas.width-40, this.canvas.height/2+this.simulation.u);
    context.stroke();

    context.beginPath();
    context.moveTo(50, this.canvas.height/2-this.simulation.u);
    context.lineTo(this.canvas.width-40, this.canvas.height/2-this.simulation.u);
    context.stroke();

    context.setLineDash([0,0]);

    context.fillStyle = "#222";
    //context.font = "14px sans-serif";
    //context.fillText("uₙ(t)", 15, this.canvas.height/2);
    context.textAlign = "right";
    context.fillText("u", 40, this.canvas.height/2-this.simulation.u+3);
    context.fillText("-u", 40, this.canvas.height/2+this.simulation.u+3);

    for(let i=0; i<this.simulation.numAtoms*subDivisions-subDivisions+1; i++){

      let n = i/subDivisions;
      let x = this.canvas.width/2+(2*n-this.simulation.numAtoms+1)*10*this.simulation.latticeConst/2;
      let displacement = this.simulation.getDisplacement(n);
      let newX = x;
      let newY = y+displacement;

      if(i != 0){
        context.beginPath();
        context.strokeStyle = "#222";
        context.moveTo(prevX, prevY);
        context.lineTo(newX, newY);
        context.stroke();
      }

      if(i%subDivisions === 0){
        context.beginPath();
        context.arc(newX, newY, 5, 0, 2 * Math.PI, false);
        context.fillStyle = '#222';
        context.fill();
      }

      prevX = newX;
      prevY = newY;
    }
  }
}
