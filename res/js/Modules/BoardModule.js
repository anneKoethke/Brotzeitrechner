var App = App || {};

App.BoardModule = function () {
  "use strict";
  
  /*
    representation of the board (#selected-inner):
    -> visualize (build | destroy) items on board
    -> communicate with resultModule
  */
  
  var that = {},
    templateBuilderModule = new App.TemplateBuilderModule(),
    resultModule = new App.ResultModule();

   // handles items on board (selected items)
  function selectableFoodItemClicked(item, boardTemplate, foodToSelectList, boardContainer, clickEventType) {
    let id = (item.id).replace("item-", ""),
      currItem = document.querySelector("#b-item-"+id);
    // check for doubles: create item to board (if) or incrimate item counter (else)
    if (currItem === null) { 
      templateBuilderModule.buildTemplateItem(boardTemplate, foodToSelectList[id-1], boardContainer);
      currItem = document.querySelector("#b-item-"+id);
      currItem.addEventListener(clickEventType, function() {
        removeFoodItemFromBoard(this, foodToSelectList)
      });
    } else {
       incrementAmount(id);
    }
    resultModule.updateDailyCounter("add", id-1, foodToSelectList);
  }

  // counts user clicks on foodItem to calculate amount on board
  function incrementAmount(id) {
    let span = document.querySelector("#a-count-"+id),
      amountCounter = parseInt(span.innerHTML) + 1;
    span.innerHTML = amountCounter;
  } 

  function removeFoodItemFromBoard(item, foodToSelectList) {
    let id = ((item.id).replace("b-item-", ""))-1,
      queryName = (item.id).replace("b-item-", "a-count-"),
      span = document.querySelector("#"+queryName),
      amountCounter = parseInt(span.innerHTML);
      // item on board? decrease amountCounter OR remove item (because amountCounter = 0);
      (amountCounter > 1)? span.innerHTML = amountCounter - 1 : item.remove();
      resultModule.updateDailyCounter("remove", id, foodToSelectList);
  }

  that.selectableFoodItemClicked = selectableFoodItemClicked;
  return that;
}
