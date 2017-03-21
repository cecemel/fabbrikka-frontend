import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service(),
    didInsertElement: function() {
        this.$(".dropdown-button").dropdown();
        this.$(".button-collapse").sideNav({closeOnClick: true});
    }
});
