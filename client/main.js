import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import "/node_modules/bootstrap/dist/css/bootstrap.css";
import './main.html';
import Simulation from "./imports/simulation";
import Renderer from "./imports/renderer";
import "./imports/analytics";

let simulation = new Simulation();
let renderer = new Renderer(simulation);

Template.menu.helpers({
  k: function(){
    return simulation.k;
  },
  g: function(){
    return simulation.g;
  },
  numAtoms: function(){
    return simulation.numAtoms;
  },
  latticeConst: function(){
    return simulation.latticeConst;
  },
  u: function(){
    return simulation.u;
  }
});

Template.menu.events({
  "click .increase-input": function(event){
    let el = $(event.target).parent().prev();
    let incr = el.data("increment");
    let decimalString = String(incr).split(".")[1];
    let decimals = decimalString ? decimalString.length : 0;

    console.log(decimals);
    el.val((i, prev) => {
      let next = parseFloat(prev)+incr;
      return next.toFixed(decimals);
    });
  },
  "click .decrease-input": function(event){
    let el = $(event.target).parent().next();
    let incr = el.data("increment");
    let decimalString = String(incr).split(".")[1];
    let decimals = decimalString ? decimalString.length : 0;

    el.val((i, prev) => {
      let next = parseFloat(prev)-incr;
      //if(next <= 0) return 0;
      return next.toFixed(decimals);
    });
  },
  "click #update": function(event){
      event.preventDefault();

      simulation.g = parseFloat($("#g").val());
      simulation.k = parseFloat($("#k").val());
      simulation.numAtoms = parseInt($("#numAtoms").val());
      simulation.latticeConst = parseInt($("#latticeConst").val());
      simulation.u = parseInt($("#u").val());

      simulation.createDisplacementFunction();
      renderer.drawFrequencyFunction();
    }
});

Meteor.startup(() => {
  simulation.createDisplacementFunction(30);
  renderer.init();
});
