/*global JST, App, Backbone*/

App.Views = App.Views || {};

(function () {
    'use strict';

    App.Views.Home = Backbone.View.extend({
        template: JST['home'],
        tagName: 'div',
        el : '.container',
        events: {},

        initialize: function () {
            if (this.model)
                this.listenTo(this.model, 'change', this.render);
        },

        render: function () {
            this.$el.empty().append(this.template(this.model ? this.model.toJSON() : this));
            return this;
        }

    });

})();
