import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Component.extend({
    card: null,
    cardMounted: false,
    stripeInstance: null,
    creditCardElement: "credit-card-element",
    creditCardErrors: "credit-card-errors",

    _stripeExists(){
        try {
            if (Stripe){
                return true;
            }
        } catch(e) {
            return false;
        }
    },

    didInsertElement() {
        let self = this;
        if(!self._stripeExists()){
             Ember.$.getScript('https://js.stripe.com/v3/', () => {
                 this.mountCart();
             });
             return;
         }
         this.mountCart();
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
        let self = this;
        card.addEventListener('change', function(event) {
            const displayError = document.getElementById(self.get('creditCardErrors'));
            if (event.error) {
                displayError.textContent = event.error.message;
            } else {
                displayError.textContent = '';
            }
        });

        this.set('card', card);
        this.set('stripeInstance', stripe);
        this.set('cardMounted', true);
    },

    actions: {
        submitPayment(){
            this.get('onPay')();
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
