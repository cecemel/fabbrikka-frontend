import Ember from 'ember';

export default Ember.Component.extend({
    cartService: Ember.inject.service('shopping-cart'),
    isFreeTryOutAllowed: Ember.computed.reads('cartService.isFreeTryOutAllowed'),
    session: Ember.inject.service(),
    didInsertElement(){
        this.$(".button-collapse").sideNav({closeOnClick: true,  menuWidth: 200});
    },
    didRender(){
        this.$(".dropdown-button").dropdown();
    }
});
