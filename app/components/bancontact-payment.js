import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    ajax: Ember.inject.service(),
    stripeService: Ember.inject.service(),
    isSubmittingPayment: false,

    model: {accountHolderName: ""},
    errors: {},

    init() {
        this._super(...arguments);
        this.set('model.accountHolderName', this.get('accountHolderName'));
    },

    didRender(){
        if(this.get('clientSecret') && this.get('source') && !this.get('hasRendered')){
            this.completePayement();
        }
        this.set('hasRendered', true);
    },

    //Validation stuff, literal copy paste from checkout. need to abstract this away...
    accountHolderNameEmptyObserver:Ember.observer('model.accountHolderName', function(){
        this.validateEmptyField('accountHolderName');
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

    submitPaymentToPaymentService(tokenData){
        tokenData['card'] = {'brand': 'bancontact'};
        let checkoutData = {'tokenData': {'token' : tokenData}, "billingData": this.get("billingData")};
        return this.get('ajax').request(config.APP.checkoutService + '/checkouts', {
            method: 'POST',
            data: JSON.stringify(checkoutData),
            contentType: 'application/vnd.api+json'
        });
    },

    completePayement(){
        let self = this;
        self.set('isSubmittingPayment', true);
        self.set('waitMessage', this.get('paymentType') + ' ' + this.get("i18n").t("components.bancontact-payment.payment-ok-wait"));
        self.get('onPay')()
        .then((billingData) => {
            self.set('billingData', billingData);
            return self.get('stripeService').finishBCNPayment(self.get('source'), self.get('clientSecret'));
        })
        .then(self.submitPaymentToPaymentService.bind(self))
        .then((data)=> {
            self.get('stripeService').closeBCNPayment(self.get('source'));
            self.set('isSubmittingPayment', false);
            return self.get('onPaySuccess')(data);
        })
        .catch((error)=>{
            self.get('stripeService').closeBCNPayment(self.get('source'));
            self.set('isSubmittingPayment', false);
            if(error && error["type"] === "tokenFetchError"){
                return;
            }
            return self.get('onPayError')(error);
        });

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

                let redirectUrl = config.APP.publicHostName + Ember.getOwner(self).lookup('controller:application').target.currentURL;

                return self.get('stripeService').initBCNPayment(
                    self.get('paymentType'),
                    self.get('model.accountHolderName'),
                    self.get('totalAmount'),
                    redirectUrl,
                    billingData
                );
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
