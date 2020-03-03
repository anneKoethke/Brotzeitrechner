var App = App || {};

App = (function () {
  "use strict";

  /*
    Start of the App:
    -> get event type (click | touch) -> Safari
    -> get html for templates and containers
    -> parse data 
    -> build up #selection-inner (images, events)  
  */

  var that = {},
    data,
    // HTML 
    foodToSelectList,
    selectionContainer, foodItemToSelectTemplate, foodItemSelection,
    boardContainer, boardItemAddedTemplate,
    // Safari-Drecksmethode
    clickEventType,
    // modules
    boardModule = new App.BoardModule(),
    tooltipModule = new App.TooltipModule(),
    templateBuilderModule = new App.TemplateBuilderModule();

  function init() {
    clickEventType = getEventType();
    getHTMLContainers();
    getData();
    showFoodToSelectListImages();
    makeFoodToSelectListAvailable();
  }

  // Apple devices need touch events; called in init()
  function getEventType () {
    let eventType = "click";
    if(navigator.userAgent.match(/mobile/i)) {
      if(navigator.userAgent.match(/iPad|iPhone/i)) {
        eventType = "touchend";
      }
	  }
    return eventType;
  }

  function getHTMLContainers() {
    // selection
    selectionContainer = document.querySelector("#selection-inner"),
    foodItemToSelectTemplate = document.querySelector("#food-item").innerHTML,
    // board
    boardContainer = document.querySelector("#selected-inner"),
    boardItemAddedTemplate = document.querySelector("#board-item").innerHTML;
  }

  function getData() {
    data = document.querySelector("#data").innerHTML;
    foodToSelectList = JSON.parse(data);
  }

  function showFoodToSelectListImages() {
    for (let i = 0; i < foodToSelectList.length; i++) {
      templateBuilderModule.buildTemplateItem(foodItemToSelectTemplate, foodToSelectList[i], selectionContainer);
    }
  }

  function makeFoodToSelectListAvailable() {
    // HTML representation of selectable food items
    foodItemSelection = document.querySelectorAll(".food-list-item"); 
    addEventListenersToFoodList(); 
  }

  function addEventListenersToFoodList() {
    for (let i = 0; i < foodItemSelection.length; i++) {
      let item = foodItemSelection[i];
      addEventListenersToFoodItem(item)
    }  
  }

  function addEventListenersToFoodItem(item) {
    // board module on board (#selected-inner)
    item.addEventListener(clickEventType, function() {
      boardModule.selectableFoodItemClicked(this, boardItemAddedTemplate, foodToSelectList, boardContainer, clickEventType);
      });
    // tooltip module in selection (#selection-inner)
    item.addEventListener("mouseover", function() {
      tooltipModule.addTooltipToSelectableFoodItem(this); 
    });
    item.addEventListener("mouseout", function() {
      tooltipModule.removeTooltipFromSelectableFoodItem(this);
    });
  }

  that.init = init;
  return that;
})();
