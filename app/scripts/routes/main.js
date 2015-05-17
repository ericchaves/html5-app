/*global App,  Backbone*/

App.Routers = App.Routers || {};

(function () {
    'use strict';

    App.Routers.Main = Backbone.Router.extend({
        routes: {
            "": "index"
        },
        index: function(){
            var home = new App.Views.Home();
            home.render();
        }
    });

})();
