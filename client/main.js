import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import "/node_modules/bootstrap/dist/css/bootstrap.css";
import './main.html';
import Simulation from "./imports/simulation";
import Renderer from "./imports/renderer";

let simulation = new Simulation();

Template.menu.helpers({
  l: function(){
    return simulation.l;
  },
  g: function(){
    return simulation.g;
  },
  numAtoms: function(){
    return simulation.numAtoms;
  },
  latticeConst: function(){
    return simulation.latticeConst;
  }
});

Template.menu.events({
  "click .increase-input": function(event){
    let el = $(event.target).parent().prev();
    let incr = parseInt(el.data("increment"));
    el.val((i, prev) => {
      return parseInt(prev)+incr;
    });
  },
  "click .decrease-input": function(event){
    let el = $(event.target).parent().next();
    let incr = parseInt(el.data("increment"));
    el.val((i, prev) => {
      let next = parseInt(prev)-incr;
      if(next <= 0) return 0;
      else return next;
    });
  },
  "click #update": function(event){
      event.preventDefault();
      let l = parseInt($("#l").val());
      let g = parseInt($("#g").val());

      simulation.l = l;
      simulation.g = g;
      simulation.numAtoms = parseInt($("#numAtoms").val());
      simulation.latticeConst = parseInt($("#latticeConst").val())

      simulation.createDisplacementFunction();
    }
});

Meteor.startup(() => {
  simulation.createDisplacementFunction(30);
  let renderer = new Renderer(simulation);
});
