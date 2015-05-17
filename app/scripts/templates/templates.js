(function(root, factory) { if (typeof define === 'function' && define.amd) { define(factory); } else { root['JST'] = factory(); } }(this, function() {
var JST = JST || {}; 
JST['home'] = function anonymous(it
/**/) {
var out='<div class="hero-unit"> <h1>Hello!</h1> <p>You now have</p> <ul> <li>HTML5 Boilerplate</li> <li>jQuery</li> <li>Backbone.js</li> <li>Underscore.js</li> <li>Sass</li> <li>Modernizr</li> </ul></div>';return out;
} 
return JST; 
}));