import Ember from 'ember';
export default Ember.Controller.extend({
    localeTracker: Ember.inject.service(),
    locale: Ember.computed.reads("localeTracker.locale"),
    cartService: Ember.inject.service('shopping-cart'),
    isFreeTryOutAllowed: Ember.computed.reads('cartService.isFreeTryOutAllowed'),
    totalFreeTries: Ember.computed.reads('cartService.totalFreeTries'),
    total: Ember.computed.reads('cartService.total'),
    hasItems:  Ember.computed.reads('cartService.totalItems'),
    displayModalMaxFreeTriesReached: false,

    init(){
      this._super(...arguments);
      this.set('displayModalMaxFreeTriesReached', false);
    },

    actions: {
      handleMaxFreeTriesReached(){
        this.set("displayModalMaxFreeTriesReached", true);
      }
    }

});
