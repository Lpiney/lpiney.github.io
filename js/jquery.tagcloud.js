(function($) {
  $.fn.tagcloud = function(options) {
    const opts = $.extend({}, $.fn.tagcloud.defaults, options);
    const tagWeights = this.map(function() {
      return parseFloat($(this).attr("rel"));
    });
    const weights = Array.from(tagWeights).sort((a, b) => a - b);
    const min = weights[0];
    const max = weights[weights.length - 1];
    const range = max - min || 1;
    
    let fontSizeIncr, colorIncr;
    if (opts.size) {
      fontSizeIncr = (opts.size.end - opts.size.start) / range;
    }
    if (opts.color) {
      colorIncr = colorIncrement(opts.color, range);
    }
    
    return this.each(function() {
      const weight = parseFloat($(this).attr("rel")) - min;
      if (opts.size) {
        $(this).css("font-size", opts.size.start + (weight * fontSizeIncr) + opts.size.unit);
      }
      if (opts.color) {
        $(this).css("backgroundColor", tagColor(opts.color, colorIncr, weight));
      }
    });
  };

  $.fn.tagcloud.defaults = {
    size: { start: 14, end: 18, unit: "pt" }
  };

  function toRGB(code) {
    const normalized = code.length === 4 ? 
      code.replace(/\w/g, match => match + match) : 
      code;
    const parts = normalized.match(/\w{2}/g);
    return parts ? parts.map(part => parseInt(part, 16)) : [0, 0, 0];
  }

  function toHex(rgb) {
    return "#" + rgb.map(val => {
      const hex = Math.max(0, Math.min(255, val)).toString(16).padStart(2, '0');
      return hex;
    }).join("");
  }

  function colorIncrement(color, range) {
    const startRGB = toRGB(color.start);
    const endRGB = toRGB(color.end);
    return startRGB.map((val, i) => (endRGB[i] - val) / range);
  }

  function tagColor(color, increment, weighting) {
    const startRGB = toRGB(color.start);
    const rgb = startRGB.map((val, i) => {
      return Math.round(val + (increment[i] * weighting));
    });
    return toHex(rgb);
  }
})(jQuery);