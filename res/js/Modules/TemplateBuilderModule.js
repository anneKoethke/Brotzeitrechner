var App = App || {};

App.TemplateBuilderModule = function () {
    "use strict";

    /*
      template builder:
      -> builds items of #selection-inner (App), the tooltips (App) and #selected-inner (boardModule)
      -> data conversion (mg to g) and localization 
    */

    var that = {};

    function buildTemplateItem(template, item, container) {
      let newEntry = _.template(template),
        entryNode = document.createElement("div"),
        currItem;

      // tooltip: converting milligram values to gramm values + setting german delimiters (1.000,00)
      (item.ingredients.salt)? item.ingredients.salt = (item.ingredients.salt/1000).toFixed(1).toString().replace(/[.]/, ",") : null;
      (item.ingredients.sugar)? item.ingredients.sugar = (item.ingredients.sugar/1000).toFixed(1).toString().replace(/[.]/, ",") : null;
      (item.ingredients.fat)? item.ingredients.fat = (item.ingredients.fat/1000).toFixed(1).toString().replace(/[.]/, ",") : null;
      (item.ingredients.egg)? item.ingredients.egg = (item.ingredients.egg/1000).toFixed(1).toString().replace(/[.]/, ",") : null;
      (item.ingredients.carb)? item.ingredients.carb = (item.ingredients.carb/1000).toFixed(1).toString().replace(/[.]/, ",") : null;

      entryNode.innerHTML = newEntry(item);
      currItem = entryNode.children[0];
      currItem.style.backgroundImage = item.img;
      container.appendChild(currItem);
    }

    that.buildTemplateItem = buildTemplateItem;
    return that;
};
