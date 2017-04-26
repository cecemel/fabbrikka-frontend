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
});
