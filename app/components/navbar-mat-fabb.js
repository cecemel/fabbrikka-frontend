import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service(),
    didInsertElement(){
        this.$(".button-collapse").sideNav({closeOnClick: true});
    },
    didRender(){
        this.$(".dropdown-button").dropdown();
    }
});
