import Ember from 'ember';

export default Ember.Controller.extend({
    localeTracker: Ember.inject.service(),
    locale: Ember.computed.reads("localeTracker.locale"),
    cartService: Ember.inject.service('shopping-cart'),
    scroller: Ember.inject.service(),
    i18n: Ember.inject.service(),
    model: {name:"", email:"", street:"", houseNumber:"",  city:"", zip:""},
    errors: {},

    foundGooglePlace: null,

    paymentMethods: [{name: "visa/mastercard", value: "visa"},
                     {name: "bancontact", value: "bancontact"}
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

    helpVisualizeError(){
        this.get('scroller').scrollVertical((Ember.$('h2')).first(), {duration: 1000, easing: 'linear'});
    },

    validateForm(){

        //check all required fields are there
        let hasErrors = false;
        let thisModel = this.get('model');
        let keys = Object.keys(thisModel);

        for (var key of keys) {
            hasErrors = this.validateEmptyField(key);
        }

        //check mail again
        if (!this.validateEmail(this.get('model.email'))) {
            let messages = [this.get("i18n").t('controllers.shopping-cart.index.errors.wrong-email')];
            this.set('errors.email', messages);
        }

        if(hasErrors){
            this.helpVisualizeError();
        }

        return hasErrors;

    },

    actions:{
        handleGoogleAddressUpdate(place){
            let zip = place.address_components.find((item) => {
                return item["types"] && item["types"][0] === 'postal_code' && item["long_name"];
            }) || {};
            this.set('foundGooglePlace', place);
            this.set('model.zip', zip['long_name'] || '');
            let addressComponents = place.formatted_address.split(",");
            this.set('model.city', addressComponents[0]);
            this.set('model.country', addressComponents[1] || "N/A");
        },

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
            let message = this.get("i18n").t('controllers.shopping-cart.checkout.payment.error-message') + " "+ (data["message"] || "general error");
            this.set('backendErrorText', message);
            this.set('hasBackendError', true);
        }
    }
});
