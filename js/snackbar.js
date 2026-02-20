/**
 * SnackBar.js
 * 
 * This small component is borrowed from 
 * https://codepen.io/wibblymat/pen/avAjq
 */


var createSnackbar = (function() {
  var previous = null;
  
  return function(config) {
    var message = config.message || '';
    var actionText = config.actionText;
    var action = config.action;
    var duration = config.duration;

    if (previous) {
      previous.dismiss(true);
    }
    
    var snackbar = document.createElement('div');
    snackbar.className = 'paper-snackbar';
    
    var timeoutId = null;
    
    snackbar.dismiss = function(immediate) {
      var self = this;
      if (timeoutId) {
        clearTimeout(timeoutId);
        timeoutId = null;
      }
      if (immediate) {
        removeSnackbar(self);
      } else {
        self.style.opacity = 0;
      }
    };
    
    var text = document.createTextNode(message);
    snackbar.appendChild(text);
    
    var actionButton;
    if (actionText) {
      if (!action) {
        action = snackbar.dismiss.bind(snackbar, false);
      }
      actionButton = document.createElement('button');
      actionButton.className = 'action';
      actionButton.textContent = actionText;
      actionButton.addEventListener('click', action);
      snackbar.appendChild(actionButton);
    }
    
    function removeSnackbar(element) {
      if (element && element.parentElement) {
        element.parentElement.removeChild(element);
        if (previous === element) {
          previous = null;
        }
      }
    }
    
    var transitionHandler = function(event) {
      if (event.propertyName === 'opacity' && this.style.opacity == 0) {
        removeSnackbar(this);
      }
    }.bind(snackbar);
    
    snackbar.addEventListener('transitionend', transitionHandler);
    
    timeoutId = setTimeout(function() {
      if (previous === this) {
        this.dismiss(false);
      }
    }.bind(snackbar), duration || 5000);

    previous = snackbar;
    document.body.appendChild(snackbar);
    
    getComputedStyle(snackbar).bottom;
    snackbar.style.bottom = '0px';
    snackbar.style.opacity = 1;
  };
})();
