import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Component.extend({
    scriptDownloaded: false,
    hasRendered: false,
    card: null,
    stripeInstance: null,
    creditCardElement: "credit-card-element",
    creditCardErrors: "credit-card-errors",
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
    },

    mountCart(){
        // taken from https://stripe.com/docs/elements
        let stripe = new Stripe(config.stripe.key);
        // Create an instance of Elements
        let elements = stripe.elements();

        // Just inject sytling here
        var style = {
          base: {
            color: '#32325d',
            lineHeight: '24px',
            fontFamily: 'Helvetica Neue',
            fontSmoothing: 'antialiased',
            fontSize: '16px',
            '::placeholder': {
              color: '#aab7c4'
            }
          },
          invalid: {
            color: '#fa755a',
            iconColor: '#fa755a'
          }
        };

        // Create an instance of the card Element
        let card = elements.create('card', {style: style});

        // Add an instance of the card Element into the `card-element` <div>
        card.mount('#' + this.get('creditCardElement'));

        // Handle real-time validation errors from the card Element.
        card.addEventListener('change', function(event) {
            const displayError = document.getElementById(this.get('creditCardErrors'));
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });

        this.set('card', card);
        this.set('stripeInstance', stripe);
    },

    actions: {
        submitPayment(){
            this.get('stripeInstance').createToken(this.get('card'))
            .then((result) => {
                if (result.error) {
                    var errorElement = document.getElementById(this.get('creditCardErrors'));
                    errorElement.textContent = result.error.message;
                } else {
                    console.log('foo');
                }
            });
        }
    }
});
