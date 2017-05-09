/* global Stripe */
import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Service.extend({

    stripeInstance: null,

    initStripeElementsCard(){
        if(! this._stripeExists()){
            alert('Error initiating payment method');
            return;
        }
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

        this.set('stripeInstance', stripe);

        // Create an instance of the card Element
        return elements.create('card', {style: style});
    },

    _stripeExists(){
        try {
            if (Stripe){
                return true;
            }
        } catch(e) {
            return false;
        }
    },

});
