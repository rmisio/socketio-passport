window.app = window.app || {};
window.app.views = window.app.views || {};

window.app.views.LoggedOut = Backbone.View.extend({
    template: _.template($('#loggedOutTemplate').html()),

    initialize: function() {
        console.log('init yo');
    },

    render: function() {
        console.log('renderiffic');
        this.$el.html(this.template());

        return this;
    }
});