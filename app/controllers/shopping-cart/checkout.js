import Ember from 'ember';
import Materialize from 'materialize';

export default Ember.Controller.extend({
    localeTracker: Ember.inject.service(),
    locale: Ember.computed.reads("localeTracker.locale"),
    cartService: Ember.inject.service('shopping-cart'),
    scroller: Ember.inject.service(),
    i18n: Ember.inject.service(),
    model: {name:"", email:"", street:"", houseNumber:"",  city:"", zip:"", country: ""},
    errors: {},
    availibleCountries: Ember.computed(function() {
        let countries = [{"name": this.get("i18n").t('controllers.shopping-cart.countries.belgium')},
                         {"name": this.get("i18n").t('controllers.shopping-cart.countries.france')},
                         {"name": this.get("i18n").t('controllers.shopping-cart.countries.spain')},
                         {"name": this.get("i18n").t('controllers.shopping-cart.countries.netherlands')},
                         {"name": this.get("i18n").t('controllers.shopping-cart.countries.germany')}];
        return countries.sort((a,b) => {
            return (a.name > b.name);
        });
    }),

    foundGooglePlace: null,

    paymentMethods: [{name: "visa/mastercard", value: "visa"},
                    //  {name: "bancontact", value: "bancontact"}
                    ],

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
