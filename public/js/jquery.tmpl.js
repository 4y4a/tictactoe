(function($, undefined) {
"use strict";

    var cache = {};

    $.fn.tmpl = function(data) {
        
        var el = this.get(0);
        
        // Simple JavaScript Templating
        // John Resig - http://ejohn.org/ - MIT Licensed
        
        // John, thank you, thank you, thank you very much
        
        // Figure out if we're getting a template, or if we need to
        // load the template - and be sure to cache the result.
        
        var str = $(el).html();

        var fn = cache[str] = cache[str] ||
            (function() {

                var body = "var p=[],print=function(){p.push.apply(p,arguments);};" +

                    // Introduce the data as local variables using with(){}
                    "with(it){p.push('" +

                    // Convert the template into pure JavaScript
                    str
                        .replace(/[\r\t\n]/g, " ")
                        .split("{{").join("\t")
//                        .replace("'", "&#39;")
                        .replace(/((^|\}\})[^\t]*)'/g, "$1\r")
                        .replace(/\t=(.*?)\}\}/g, "',$1,'")
                        .replace(/\t=(.*?)\}\}/g, "',$1,'")
                        .split("\t").join("');")
                        .split("}}").join("p.push('")
                        .split("\r").join("\\'")
                    + "');}return jQuery(p.join(''));";

              // Generate a reusable function that will serve as a template
              // generator (and which will be cached).

                try {
                    return new Function("it", body);
                } catch (e) {
                    console.log("Cannot compile template: ");
                    console.log(str);
                    throw e;
                }

            })();

          // Provide some basic currying to the user
        return data ? fn( data ) : fn;
    };

})(jQuery);