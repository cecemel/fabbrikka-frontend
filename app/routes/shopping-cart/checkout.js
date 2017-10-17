import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel(){
        return this.get('cart').setupCart();
    },
    deactivate: function() {
        this.controllerFor('shopping-cart.checkout').set('hasBackendError', false);
        this.controllerFor('shopping-cart.checkout').set('backendErrorText', null);
        this.controllerFor('shopping-cart.checkout').set("orderConfirmation", null);
        this.controllerFor('shopping-cart.checkout').set('orderConfirmed', false);
    },

    resetController(controller, isExiting) {
        if (isExiting) {
            controller.set('clientSecretQP', null);
            controller.set('sourceQP', null);
            controller.set('cityQP', null);
            controller.set('emailQP', null);
            controller.set('houseNumberQP', null);
            controller.set('nameQP', null);
            controller.set('streetQP', null);
            controller.set('zipQP', null);
            controller.set('countryQP', null);
            controller.set('paymentTypeQP', null);
            controller.set('sofortCountryQP', null);
        }
    },

    actions: {
      back(){
        history.back();
      }
    }
});
