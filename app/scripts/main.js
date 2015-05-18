/* global App, $, Backbone */


window.App = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},
    init: function () {
        'use strict';
        var pushState = !!(window.history && window.history.pushState),
            settings = { pushState: pushState, silent: false, hashChange: !pushState ? true : false };
        App.router = new App.Routers.Main();
        Backbone.history.start(settings);
    }
};

$(document).ready(function () {
    'use strict';
    App.init();
});
