import Atom from "./atom";
import Algebrite from "./algebrite";
import nearley from "nearley";
import grammar from "./arithmetic";
import katex from "katex";

let replaceSingle = function(string, target, source){
  return string.replace(new RegExp("([^a-zA-Z]|^)("+target+")([^a-zA-Z]|$)", "g"), "$1"+source+"$3");
}

let parse = function(eq){
  let parser = new nearley.Parser(grammar.ParserRules, grammar.ParserStart);
  eq = eq.replace(/([^\/\+\-])(\s)([^\/\+\-])/g, "$1*$3");
  eq = eq.replace(/([^\/\+\-])(\s)([^\/\+\-])/g, "$1*$3"); // run it twice would be nice
  console.log("replaced wave function: ", eq);
  return parser.feed(eq).results[0];
}

export default class Simulation {
  constructor(numAtoms = 5, latticeConst = 1, l = 5, A = 10, g = 3){
    this.l = l;
    this.g = g;
    this.time = 0;
    this.A = A;
    this.latticeConst = latticeConst;
    this.numAtoms = numAtoms;
  }

  getWaveVector(){
    let eq = "2*pi/l";
    return eq;
  }

  getFrequency(){
    let eq = "2*sqrt(g/M)*abs(sin(k*a/2))";
    eq = replaceSingle(eq, "k", this.getWaveVector());
    katex.render(Algebrite.eval(eq).toLatexString(), $("#frequency")[0], {displayMode: true});
    return eq;
  }

  createDisplacementFunction(){
    let eq = "A*exp(i*(k*a*n-o*t))";
    eq = replaceSingle(eq, "o", this.getFrequency());
    eq = replaceSingle(eq, "k", this.getWaveVector());

    let res = Algebrite.simplify(eq);
    katex.render(res.toLatexString(), $("#frequency2")[0], {displayMode: true});

    res = Algebrite.real(res);
    katex.render(res.toLatexString(), $("#frequency3")[0], {displayMode: true});

    eq = replaceSingle(eq, "g", this.g/100);
    eq = replaceSingle(eq, "M", 1);
    eq = replaceSingle(eq, "a", this.latticeConst);
    eq = replaceSingle(eq, "A", this.A);
    eq = replaceSingle(eq, "l", this.l);

    res = Algebrite.real(eq);
    katex.render(res.toLatexString(), $("#frequency4")[0], {displayMode: true});
    res = Algebrite.float(res);
    katex.render(res.toLatexString(), $("#frequency5")[0], {displayMode: true});
    let parsed = parse(res.toString());
    console.log(parsed);
    this.displacementFunction = parsed;
    return parsed;
  }

  // Gets the displacement of the n-th atom
  getDisplacement(n){
    let t = this.time;
    return eval(this.displacementFunction);
  }
}
