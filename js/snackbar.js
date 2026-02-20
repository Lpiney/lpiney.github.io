var createSnackbar = (function() {
  let previous = null;
  
  return function(config) {
    const { message = '', actionText, action, duration = 5000 } = config;

    if (previous) previous.dismiss(true);
    
    const snackbar = document.createElement('div');
    snackbar.className = 'paper-snackbar';
    
    let timeoutId = null;
    
    snackbar.dismiss = function(immediate) {
      if (timeoutId) clearTimeout(timeoutId);
      if (immediate) removeSnackbar(this);
      else this.style.opacity = 0;
    };
    
    snackbar.appendChild(document.createTextNode(message));
    
    if (actionText) {
      const btn = document.createElement('button');
      btn.className = 'action';
      btn.textContent = actionText;
      btn.onclick = action || (() => snackbar.dismiss());
      snackbar.appendChild(btn);
    }
    
    function removeSnackbar(element) {
      if (element?.parentElement) {
        element.parentElement.removeChild(element);
        if (previous === element) previous = null;
      }
    }
    
    snackbar.addEventListener('transitionend', e => {
      if (e.propertyName === 'opacity' && this.style.opacity == 0) {
        removeSnackbar(this);
      }
    });
    
    timeoutId = setTimeout(() => previous === this && this.dismiss(), duration);

    previous = snackbar;
    document.body.appendChild(snackbar);
    
    getComputedStyle(snackbar).bottom;
    snackbar.style.bottom = '0px';
    snackbar.style.opacity = 1;
  };
})();