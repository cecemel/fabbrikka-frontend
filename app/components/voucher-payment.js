import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    ajax: Ember.inject.service(),
    stripeService: Ember.inject.service(),
    isSubmittingPayment: false,

    model: {voucherCode: ""},
    errors: {},

    billingData: null,
     
    //Validation stuff, literal copy paste from checkout. need to abstract this away...
    accountHolderNameEmptyObserver:Ember.observer('model.voucherCode', function(){
        this.validateEmptyField('voucherCode');
    }),

    validateEmptyField(key){
        let hasErrors = false;
        let thisModel = this.get('model');

        if(!thisModel[key]){
            this.set(`errors.${key}`, [this.get("i18n").t('controllers.shopping-cart.index.errors.required')]);
            hasErrors = true;
        }
        else{
            this.set(`errors.${key}`, []);
        }
        return hasErrors;
    },

    validateForm(){
        let hasErrors = false;
        let thisModel = this.get('model');
        let keys = Object.keys(thisModel);

        for (var i = 0; i < keys.length; i++) {
            hasErrors = this.validateEmptyField(keys[i]);
        }

        return hasErrors;
    },

    submitPaymentToPaymentService(){
      let checkoutData = {"billingData": this.get("billingData"),
                          tokenData: {
                            token: {
                              id: this.get('model.voucherCode'),
                              card: {brand: 'voucher'}}}};
        return this.get('ajax').request(config.APP.checkoutService + '/checkouts', {
            method: 'POST',
            data: JSON.stringify(checkoutData),
            contentType: 'application/vnd.api+json'
        });
    },
  actions: {
    submitPayment(){
      let self = this;
      self.set('isSubmittingPayment', true);
      self.get('onPay')()
        .then((billingData) => {
                if(self.validateForm()){
                    return Ember.RSVP.Promise.reject({"type": "voucherFormIssue"});
                }
          self.set('billingData', billingData);
          return true;
        })
        .then(self.submitPaymentToPaymentService.bind(self))
        .then((data)=> {
            self.set('isSubmittingPayment', false);
            return self.get('onPaySuccess')(data);
        })
        .catch((error)=>{
            self.set('isSubmittingPayment', false);
            if(error && error["type"] === "voucherFormIssue"){
                return;
            }
            return self.get('onPayError')(error);
        });
     }
  }
});
