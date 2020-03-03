var App = App || {};

App.TooltipModule = function () {
  "use strict";

  /*
    Tooltips:
    -> visualization via class (".hidden")
    -> templating and event handling initialized in App
  */

  var that = {},
    body = document.querySelector("body"),
    timeout = 2500;

  // show tooltip when mouseover (desktop: hover, mobile: click)
  function addTooltipToSelectableFoodItem(item) {
    let tooltip = getTooltipFromHTML(item);
    // tooltip not visible? -> show
    (tooltip.classList.contains("hidden"))? tooltip.classList.remove("hidden"): null;
    // prevent overflow to the right for tooltips
    (tooltip.getBoundingClientRect().x + tooltip.getBoundingClientRect().width >= body.getBoundingClientRect().width)? tooltip.style.left = "-170px" : null; 
    // hide again after some time (needed in mobile)
    setTimeout(() => {
      removeTooltipFromSelectableFoodItem(item);
    }, timeout);
  }
  
  // remove tooltip when mouseout (desktop only) or on timeout (mobile and desktop)
  function removeTooltipFromSelectableFoodItem(item) {
    let tooltip = getTooltipFromHTML(item);
    (tooltip.classList.contains("hidden"))? null: tooltip.classList.add("hidden");
  }

  function getTooltipFromHTML(item) {
    let tooltipId = (item.id).replace("item-", "tt-");
    return (item.querySelector("#"+tooltipId));
  }

  that.addTooltipToSelectableFoodItem = addTooltipToSelectableFoodItem;
  that.removeTooltipFromSelectableFoodItem = removeTooltipFromSelectableFoodItem;
  return that;
};
