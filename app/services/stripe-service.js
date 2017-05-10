/* global Stripe */
/**
TODO:
 - uniform promised based API -> not like e.g. initStripeElementsCard
 - optional data should not be passed around in URL's!!!
 - the import of the stripe is SYNC -> via script tag. Should be asyn and then some smart polling. Which reduces intial load time.
**/
import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Service.extend({

    stripeInstance: null,

    initBCNPayment(accountHolderName, amount, redirectUrl, optionalData){
        return new Ember.RSVP.Promise((resolve, reject) => {
            if(!this._stripeExists()){
                return reject({"message": "issue initiating payment, please try again"});
            }

            Stripe.setPublishableKey(config.stripe.key);

            //TODO: this is a temporary workaround, the model should not be passed around through queries. But no time sorry
            if(optionalData){
                redirectUrl = redirectUrl +  "?" + Ember.$.param(optionalData);
            }

            Stripe.source.create({
                type: 'bancontact',
                amount: Math.floor(amount*100),
                currency: 'eur',
                owner: {
                    name: accountHolderName,
                  },
                  redirect: {
                      return_url: redirectUrl,
                  },
              }, (status, sourceInstance) => {
                  if(status !== 200){
                      reject({"message": "something went wrong during bancontact payment"});
                  }
                  window.location.replace(sourceInstance.redirect.url); //redirects user to bank stuff
              });

        });
    },

    finishBCNPayment(source, clientSecret){
        return new Ember.RSVP.Promise((resolve, reject) => {

            if(!this._stripeExists()){
                return reject({"message": "issue finishing bancontact payment. You wil NOT be charged."});
            }

            Stripe.setPublishableKey(config.stripe.key);
            Stripe.source.poll(
                source,
                clientSecret,
                (status, source) => {
                    if(status !== 200 || source['status'] !== "chargeable"){
                        reject({"message": "issue finishing bancontact payment. You wil NOT be charged."});
                    }
                    resolve(source);
                });
            });
    },

    closeBCNPayment(sourceID){
        Stripe.setPublishableKey(config.stripe.key);
        Stripe.source.cancelPoll(sourceID);
    },

    initStripeElementsCard(){
        if(! this._stripeExists()){
            alert('Error initiating payment method, please try again'); //TODO: make interface uniform -> return promises!
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
