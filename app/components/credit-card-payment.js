import Ember from 'ember';

export default Ember.Component.extend({
    scriptDownloaded: false,
    hasRendered: false,
    isPageReadyObserver: Ember.observer('scriptDownloaded', 'hasRendered', function(){
        if(this.get('scriptDownloaded') && this.get('hasRendered')){
            this.mountCart();
        }
    }),
    didInsertElement() {
        let self = this;
         Ember.$.getScript('https://js.stripe.com/v3/', () => {
             self.set('scriptDownloaded', true);
         });
     },
     didRender(){
         this.set('hasRendered', true);
        //  if (this.get('isReady')){

        // }
    },
    mountCart(){
        let stripe = new Stripe('pk_test_Od5jsn7vV50m8Y8OBf6ebmN5');
        let elements = stripe.elements();
             // Create an instance of the card Element
        var card = elements.create('card');
             // Add an instance of the card Element into the `card-element` <div>
        card.mount('#card-element');
    }
});
