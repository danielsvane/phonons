import Algebrite from "./algebrite2";
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
  constructor(numAtoms = 5, latticeConst = 11, k = 0.35, u = 10, g = 0.03){
    this.k = k;
    this.g = g;
    this.time = 0;
    this.u = u;
    this.latticeConst = latticeConst;
    this.numAtoms = numAtoms;
  }

  getWaveVector(){
    let eq = "2*pi/(l)";
    return eq;
  }

  getFrequency(){
    let eq = "2*sqrt(g/M)*abs(sin(k*a/2))";
    //eq = replaceSingle(eq, "k", this.getWaveVector());
    let res = Algebrite.eval(eq);
    katex.render("\\omega = "+res.toLatexString(), $("<div></div>").appendTo("#equations")[0], {displayMode: true});

    let eq2 = eq;
    eq = replaceSingle(eq, "g", this.g/100);
    eq = replaceSingle(eq, "M", 1);
    //eq = replaceSingle(eq, "k", this.getWaveVector());
    eq = replaceSingle(eq, "a", this.latticeConst);

    res = Algebrite.eval(eq);
    let parsed = parse(res.toString());
    console.log(parsed);
    this.frequencyFunction = parsed;

    return eq2;
  }

  createDisplacementFunction(){
    $("#equations").html("");

    let eq = "u*exp(i*(k*a*n-o*t))";
    eq = replaceSingle(eq, "o", this.getFrequency());
    //eq = replaceSingle(eq, "k", this.getWaveVector());

    let res = Algebrite.simplify(eq);
    katex.render("u_n ="+res.toLatexString(), $("<div></div>").appendTo("#equations")[0], {displayMode: true});

    // res = Algebrite.real(res);
    // katex.render("Re\\{u_n\\} ="+res.toLatexString(), $("<div></div>").appendTo("#equations")[0], {displayMode: true});

    eq = replaceSingle(eq, "g", this.g);
    eq = replaceSingle(eq, "M", 1);
    eq = replaceSingle(eq, "a", this.latticeConst);
    eq = replaceSingle(eq, "u", this.u);
    eq = replaceSingle(eq, "k", this.k);

    res = Algebrite.real(eq);
    katex.render("Re\\{u_n\\} ="+res.toLatexString(), $("<div></div>").appendTo("#equations")[0], {displayMode: true});

    //
    // res = Algebrite.eval(eq);
    // katex.render(res.toLatexString(), $("<div></div>").appendTo("#equations")[0], {displayMode: true});

    //res = Algebrite.float(res);
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
