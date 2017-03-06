import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Controller.extend({
        product: {},
        productDescriptions: [],
        productNames: [],
        productPrice: {},
        productImages: [],
        productSizes: [],
        productAudiences: [],

        productType: "",
        productPriceAmount: "",
        productRanking: "",
        productImageType: "",
        productSize: "",
        productDescription: "",
        productDescriptionLocale: "",
        productNameLocale: "",
        productName: "",
        productAudienceID: "",
        fileUploadHost: config.APP.backendHost,
        fileUploadEndpoint: config.APP.backendHost + "/files",
        localesList: [{"value": "en_US"}, {"value": "nl_BE"}],
        productTypesList: [{"value": "sweater"}, {"value": "pants"}, {"value": "shirt"}],
        imageTypesList: [{"value": "primary"}, {"value": "detail"}],

        imageUploadValidation: Ember.computed(function(){
          return Ember.run.bind(this, () => {
            if (Ember.isEmpty(this.productImageType)) {
              alert("please provide an image type");
              return false;
            }
            return true;
          });
        }),

        imageUploadSuccess: Ember.computed(function(){
          return Ember.run.bind(this, (data) => {
            this.createRecordLocally('productImages', 'product-image',
                {accessURL : this.fileUploadHost + data.links.self + "/download", type: this.productImageType});
          });
        }),

        imageUploadFail: Ember.computed(function(){
          return Ember.run.bind(this, (jqXHR, textStatus) => {
            alert("image upload failed:" + textStatus);
          });
        }),

        createRecordLocally: function(controllerProperty, modelName, data){
            let record = this.get('store').createRecord(modelName, data);
            let currentPoperty = this.get(controllerProperty);
            if(Ember.isArray(currentPoperty)){
                currentPoperty.pushObject(record);
                return;
            }
            this.set(controllerProperty, record);
        },

        storeNewRelations: function(parent, propertyName, data){
            if(Ember.isEmpty(data) || Object.keys(data).length === 0){
                return Ember.RSVP.Promise.resolve(true);
            }
            if(!Ember.isArray(data)){
                parent.set(propertyName, data);
                return data.save(); //returns promise
            }
            return Ember.RSVP.Promise.all(data.map(
            record => {
                parent.get(propertyName).pushObject(record);
                return record.save();
            }));
        },

        actions: {

            storeProduct: function() {
                let self = this;
                this.product = this.store.createRecord('product',
                    {"type": this.productType,
                    "ranking": this.productRanking,
                    "productAudiences": this.productAudiences,
                    "productSizes": this.productSizes});
                this.product.save().then(function(product){
                   return Ember.RSVP.Promise.all(
                    [ self.storeNewRelations(product, 'productDescriptions', self.productDescriptions)
                    , self.storeNewRelations(product, 'productNames', self.productNames)
                    , self.storeNewRelations(product, 'productPrice', self.productPrice)
                    , self.storeNewRelations(product, 'productImages', self.productImages)
                    , self.storeNewRelations(product, 'productSizes', self.productSizes)])
                }).then(function(data){
                    self.transitionToRoute('admin.products')
                });
            },

            addDescription: function(){
                this.createRecordLocally('productDescriptions', 'product-description',
                    {locale: this.productDescriptionLocale, description: this.productDescription});
                this.set('productDescription', '');
            },

            addName: function(){
                this.createRecordLocally('productNames', 'product-name', {locale: this.productNameLocale, name: this.productName});
                this.set('productName', '');
            },

            addSize: function(){
                //this is an already existing list
                let size = this.store.peekRecord('product-size', this.productSizeID);
                this.productSizes.pushObject(size);
            },

            addPrice: function(){
                this.createRecordLocally('productPrice', 'product-price', {"amount": this.productPriceAmount, "currency": "EUR"});
            },

            addAudience: function(){
                //this is an already existing list
                let audience = this.store.peekRecord('product-audience', this.productAudienceID);
                this.productAudiences.pushObject(audience);
            }
        }
    });
