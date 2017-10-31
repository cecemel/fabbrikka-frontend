import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';
import BancontactPayment from './bancontact-payment';

export default BancontactPayment.extend({
  i18n: Ember.inject.service(),
  paymentType: "sofort",
  availibleCountries: [],

  model: {selectedCountry: null},

  init(){
    this._super(...arguments);
    this.set('model.selectedCountry', this.get('selectedCountry'));
    this.set('availibleCountries',
    [{
      "code": "BE",
      "name": this.get("i18n").t('controllers.shopping-cart.countries.belgium')
      },
      {
      "code": "DE",
      "name": this.get("i18n").t('controllers.shopping-cart.countries.germany')
      },
      {
        "code": "IT",
        "name": this.get("i18n").t('controllers.shopping-cart.countries.italy')
      },
      {
        "code": "NL",
        "name": this.get("i18n").t('controllers.shopping-cart.countries.netherlands')
      },
      {
        "code": "AT",
        "name": this.get("i18n").t('controllers.shopping-cart.countries.austria')
      },
      {
        "code": "ES",
        "name": this.get("i18n").t('controllers.shopping-cart.countries.spain')
      }
    ]);
  },

  actions: {
      submitPayment(){
          let self = this;
          self.set('isSubmittingPayment', true);
          self.get('onPay')()
          .then((billingData) => {
              if(self.validateForm()){
                  return Ember.RSVP.Promise.reject({"type": "bancontactFormIssue"});
              }

              billingData['paymentType'] = self.get("paymentType");
              billingData['sofortCountry'] = this.get('model.selectedCountry');

              //TODO: this is a temporary workaround, the model should not be passed around through queries. But no time sorry
              let redirectUrl = config.APP.publicHostName + Ember.getOwner(self).lookup('controller:application').target.currentURL;
              redirectUrl = redirectUrl +  "?" + Ember.$.param(billingData);

              //set data object
              let paymentData =
              {
                type: self.get('paymentType'),
                amount: Math.floor(self.get('totalAmount')*100),
                currency: 'eur',
                sofort: {
                  country: this.get('model.selectedCountry'),
                },
                redirect: {
                    return_url: redirectUrl,
                  },
                };

              return self.get('stripeService').initPayment(paymentData);
          })
          .catch(error => {
              self.set('isSubmittingPayment', false);
              if(error && error["type"] === "bancontactFormIssue"){
                  return;
              }
              return self.get('onPayError')(error);
          });
      }
  }
});
