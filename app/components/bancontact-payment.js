import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Component.extend({
    _initStripe(){
        return  Ember.$.getScript('https://js.stripe.com/v2/');
    },

    _handleBcnResonse(...args){
        console.log(args[0]);
    },

    actions: {
        startBancontactProcedure(){
            this._initStripe()
            .then(() => {
                console.log('hello');
                Stripe.setPublishableKey(config.stripe.key);
                Stripe.source.create({
                    type: 'bancontact',
                    amount: 100,
                    currency: 'eur',
                    owner: {
                        name: this.get('accountHolder'),
                    },
                    redirect: {
                        return_url: 'https://google.com',
                    },
                }, this._handleBcnResonse);
            });
        }
    }
});
