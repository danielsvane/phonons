export default class Renderer {
  constructor(simulation){
    this.simulation = simulation;
    let canvas = document.getElementById("canvas");
    this.ctx = canvas.getContext("2d");
    this.render();
  }

  render(){
    this.simulation.time++;
    let context = this.ctx;

    context.beginPath();
    context.fillStyle = '#333';
    context.fillRect(0, 0, 800, 600);

    this.drawPhonon();

    for(let n = 0; n<this.simulation.numAtoms; n++){
      this.drawAtom(n);
    }


    setTimeout(this.render.bind(this), 33);
  }

  drawAtom(n){
    let x = 200+n*100*this.simulation.latticeConst;
    let displacement = this.simulation.getDisplacement(n);
    let y = 300;
    let context = this.ctx;
    context.beginPath();
    context.arc(x+displacement, y, 20, 0, 2 * Math.PI, false);
    context.fillStyle = '#ccc';
    context.fill();

    context.beginPath();
    context.arc(x, 200+displacement*5, 5, 0, 2 * Math.PI, false);
    context.fillStyle = '#ccc';
    context.fill();
  }

  drawPhonon(){
    let context = this.ctx;
    let subDivisions = 5;
    context.beginPath();
    context.strokeStyle = "#111";
    for(let i=0; i<this.simulation.numAtoms*subDivisions-subDivisions+1; i++){
      let x = i/subDivisions;
      let displacement = this.simulation.getDisplacement(x);
      let newX = 200+x*100*this.simulation.latticeConst;
      let newY = 200+displacement*5;

      if(i === 0) context.moveTo(newX, newY);
      else context.lineTo(newX, newY);
    }
    context.stroke();
  }
}
