import Ember from 'ember';

export default Ember.Component.extend({
    localeTracker: Ember.inject.service(),
    locale: Ember.computed.reads("localeTracker.locale"),
    cartService: Ember.inject.service('shopping-cart'),
    totalFreeTries: Ember.computed.reads('cartService.totalFreeTries'),
    total: Ember.computed.reads('cartService.total'),
    displayModalMaxFreeTriesReached: false,

    didInsertElement(){
         this.$('.collapsible').collapsible();
    },

    actions: {
      handleMaxFreeTriesReached(){
        this.set("displayModalMaxFreeTriesReached", true);
      }
    }
});
