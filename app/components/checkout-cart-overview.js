import Ember from 'ember';

export default Ember.Component.extend({
    localeTracker: Ember.inject.service(),
    locale: Ember.computed.reads("localeTracker.locale"),
    cartService: Ember.inject.service('shopping-cart'),
    isFreeTryOutAllowed: Ember.computed.reads('cartService.isFreeTryOutAllowed'),
    totalFreeTries: Ember.computed.reads('cartService.totalFreeTries'),
    total: Ember.computed.reads('cartService.total'),
    displayModalMaxFreeTriesReached: false,

    didInsertElement(){
         this.$('.collapsible').collapsible();
         this.set('displayModalMaxFreeTriesReached', false);
    },

    actions: {
      handleMaxFreeTriesReached(){
        this.set("displayModalMaxFreeTriesReached", true);
      }
    }
});
