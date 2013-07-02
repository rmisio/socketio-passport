window.app = window.app || {};
window.app.models = window.app.models || {};

window.app.models.SessionUser = Backbone.Model.extend({
    url: '/is-authenticated',

    initialize: function() {
        this.on('change:id', function(model, value) {
            this.trigger(value ? 'login' : 'logout');
        });
    }
});