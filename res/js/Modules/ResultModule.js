var App = App || {};

App.ResultModule = function () {
  "use strict";

  /* 
    representation of result (#result-inner):
    -> logic of the circles | daily consumption (counter)
    -> visualization of the circles
  */

  var that = {},
    // counter for daily consumption (in promille)
    counter = {
      "salt": 0,
      "sugar": 0,
      "fat": 0,
      "egg": 0,
      "carb": 0,
      "cal": 0
    };

  function updateDailyCounter(mode, id, foodToSelectList) {
    for (let prop in counter) {
      (mode === "add")? counter[prop] += foodToSelectList[id].ingredients[prop+"_gda_permille"] : counter[prop] -= foodToSelectList[id].ingredients[prop+"_gda_permille"];
      setValue(prop, counter[prop]);
    }
  }

  function setValue(key, value) {
    let percent = document.querySelector("#"+key+"-percent"),
      path = document.querySelector("#"+key+"-circle"),
      percentValue = Math.trunc(value/10); // in data as permille, for the visualization as percent
    percent.innerHTML = percentValue + "%";
    path.style.strokeDasharray = percentValue +","+ path.getTotalLength();
  }

  that.updateDailyCounter = updateDailyCounter;
  return that;
};
