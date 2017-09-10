import Ember from 'ember';

export default Ember.Component.extend({
    cartService: Ember.inject.service('shopping-cart'),
    totalFreeTries: Ember.computed.reads('cartService.totalFreeTries'),
    total: Ember.computed.reads('cartService.total'),
    didInsertElement(){
         this.$('.collapsible').collapsible();
    }
});
