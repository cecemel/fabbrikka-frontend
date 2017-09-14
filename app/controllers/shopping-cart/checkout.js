import Ember from 'ember';
// WORKAROUND: see https://github.com/mike-north/ember-materialize-shim/issues/80
// import Materialize from 'materialize';

export default Ember.Controller.extend({
     //TODO: this should be re-thought. Basically the flow of bancontact works with a redirect.....
     queryParams:{
         clientSecretQP: 'client_secret',
         sourceQP: 'source',
         cityQP: 'deliveryAddress[city]',
         countryQP:  'deliveryAddress[country]',
         emailQP: 'deliveryAddress[email]',
         houseNumberQP: 'deliveryAddress[houseNumber]',
         nameQP: 'deliveryAddress[name]',
         streetQP: 'deliveryAddress[street]',
         zipQP: 'deliveryAddress[zip]',
         paymentTypeQP: 'paymentType',
     },
     clientSecretQP: null,
     sourceQP: null,
     cityQP: null,
     emailQP: null,
     houseNumberQP: null,
     nameQP: null,
     streetQP: null,
     zipQP: null,
     countryQP: null,
     paymentTypeQP: null,

     clientSecretObserver:  Ember.observer('clientSecretQP', function() {
         if(! this.get('clientSecretQP')){
             return;
         }
         this.set('model', {name: this.get('nameQP'), email: this.get('emailQP'),
                           street: this.get('streetQP'), houseNumber: this.get('houseNumberQP'),
                           city:this.get('cityQP'),
                           zip: this.get('zipQP'), country: this.get('countryQP')});
         this.set('chosenPaymentMethod', this.get('paymentTypeQP'));
     }),

    localeTracker: Ember.inject.service(),
    locale: Ember.computed.reads("localeTracker.locale"),
    cartService: Ember.inject.service('shopping-cart'),
    scroller: Ember.inject.service(),
    i18n: Ember.inject.service(),
    totalAmount: Ember.computed.reads('cartService.total'),
    totalFreeTries: Ember.computed.reads('cartService.totalFreeTries'),
    model: {name:"", email:"", street:"", houseNumber:"",  city:"", zip:"", country: ""},
    errors: {},

    displayFreeTryOutDeliveryLogicWarning: false,
    displayFreeTryOutDeliveryLogicWarningObserver: Ember.observer('totalFreeTries', function(){
      if(this.get('totalFreeTries') > 0){
        Ember.run.once(this, () => {this.set('displayFreeTryOutDeliveryLogicWarning', true);});
      }
    }),

    availibleCountries: Ember.computed(function() {
        let countries = [{"name": this.get("i18n").t('controllers.shopping-cart.countries.belgium')},
                         {"name": this.get("i18n").t('controllers.shopping-cart.countries.france')},
                         {"name": this.get("i18n").t('controllers.shopping-cart.countries.netherlands')},
                         {"name": this.get("i18n").t('controllers.shopping-cart.countries.germany')}, 
                         {"name": this.get("i18n").t('controllers.shopping-cart.countries.italy')},
                         {"name": this.get("i18n").t('controllers.shopping-cart.countries.uk')},
                         {"name": this.get("i18n").t('controllers.shopping-cart.countries.spain')}];

        if(this.get('cartService.totalFreeTries') > 0 ){
          return [{"name": this.get("i18n").t('controllers.shopping-cart.countries.belgium')}];
        }

        return countries.sort((a,b) => {
            return (a.name > b.name);
        });
    }).property('cartService.totalFreeTries'),

    paymentMethods: Ember.computed(function(){
      let paymentMethods = [{name: "visa/mastercard", value: "visa"},
                            {name: "bancontact", value: "bancontact"},
                            {name: "ideal", value: "ideal"}];
      if(this.get('cartService.totalFreeTries') > 0 ){
        return [{name: "visa/mastercard", value: "visa"}];
      }
      return paymentMethods;
    }).property('cartService.totalFreeTries'),

    emailDidChange: Ember.observer('model.email', function() {
        let messages = [];
        if (!this.validateEmail(this.get('model.email'))) {
            messages = [this.get("i18n").t('controllers.shopping-cart.index.errors.wrong-email')];
        }
        this.set('errors.email', messages);
    }),

    nameEmptyObserver:Ember.observer('model.name', function(){
        this.validateEmptyField('name');
    }),

    emailEmptyObserver:Ember.observer('model.email', function(){
        this.validateEmptyField('email');
    }),

    streetEmptyObserver:Ember.observer('model.street', function(){
        this.validateEmptyField('street');
    }),

    houseNumberEmptyObserver:Ember.observer('model.houseNumber', function(){
        this.validateEmptyField('houseNumber');
    }),

    cityEmptyObserver:Ember.observer('model.city', function(){
        this.validateEmptyField('city');
    }),

    zipEmptyObserver:Ember.observer('model.zip', function(){
        this.validateEmptyField('zip');
    }),

    countryEmptyObserver:Ember.observer('model.country', function(){
        this.validateEmptyField('country');
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

    validateEmail(email) {
        let re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    },

    extractBackendErrorMsg(error){
        let errorMsg = error && error.errors && error.errors[0] && error.errors[0].detail && error.errors[0].detail.message;
        if(!errorMsg){
            return error["message"] || "general error";
        }
        return errorMsg;
    },

    scrollToTop(){
        this.get('scroller').scrollVertical((Ember.$('h2')).first(), {duration: 1000, easing: 'linear'});
    },

    validateForm(){

        //check all required fields are there
        let hasErrors = false;
        let thisModel = this.get('model');
        let keys = Object.keys(thisModel);


        for (var i = 0; i < keys.length; i++) {
            hasErrors = this.validateEmptyField(keys[i]);
        }

        //check mail again
        if (!this.validateEmail(this.get('model.email'))) {
            let messages = [this.get("i18n").t('controllers.shopping-cart.index.errors.wrong-email')];
            this.set('errors.email', messages);
        }

        if(hasErrors){
            this.scrollToTop();
        }

        //additional help to visualize in small screens, since in firefox scrolling does not work
        if(hasErrors && this.get('media.isS')){
            let errorText = this.get("i18n").t('controllers.shopping-cart.checkout.errors.general');
            Materialize.toast(errorText, 2000, 'checkout-error-toast');
        }

        return hasErrors;

    },

    actions:{

        onSubmitPayment(){
            let self = this;
            return new Ember.RSVP.Promise((resolve, reject) => {
                if(self.validateForm()){
                    reject();
                }
                resolve({
                    "locale": self.get("locale"),
                    "cartId": self.get("cartService").get('cart').get('id'),
                    "deliveryAddress": self.get('model')
                });
            });

        },

        onSubmitPaymentError(data){
            let message = this.get("i18n").t('controllers.shopping-cart.checkout.payment.error-message') + " "+ this.extractBackendErrorMsg(data);
            this.set('backendErrorText', message);
            this.set('hasBackendError', true);
        },

        onSubmitPaymentSuccess(data){
            this.get("cartService").resetCart()
            .then(() => {
                this.set("orderConfirmation", data);
                this.set("orderConfirmed", true);
                this.scrollToTop();
            });
        }
    }

});
