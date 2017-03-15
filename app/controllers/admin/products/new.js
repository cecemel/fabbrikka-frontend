//Needs refactor, come on gimme a break was my first ember stuff...
import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Controller.extend({
        product: {},
        productDescriptions: [],
        productNames: [],
        productImages: [],
        productAudiences: [],
        productVariants:[],

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

        createRecordLocally(controllerProperty, modelName, data){
            let record = this.get('store').createRecord(modelName, data);
            let currentPoperty = this.get(controllerProperty);
            if(Ember.isArray(currentPoperty)){
                currentPoperty.pushObject(record);
                return;
            }
            this.set(controllerProperty, record);
        },

        storeNewRelations(parent, propertyName, data){
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
            storeProduct(productType, productRanking, productAudiences, productSizes) {
                let self = this;
                this.product = this.store.createRecord('product',
                    {"type": productType,
                    "ranking": productRanking,
                    "productAudiences": productAudiences,
                    "productSizes": productSizes});
                this.product.save().then(function(product){
                   return Ember.RSVP.Promise.all(
                     [ self.storeNewRelations(product, 'productDescriptions', self.productDescriptions),
                       self.storeNewRelations(product, 'productNames', self.productNames),
                       self.storeNewRelations(product, 'productImages', self.productImages),
                       self.storeNewRelations(product, 'productVariants', self.productVariants)]);
                }).then(() => {
                  self.transitionToRoute('admin.products');
                });
            },

            addDescription(productDescriptionLocale, productDescription){
                this.createRecordLocally('productDescriptions', 'product-description',
                    {locale: productDescriptionLocale, description: productDescription});
                this.set('productDescription', '');
            },

            addName(productNameLocale, productName){
                this.createRecordLocally('productNames', 'product-name', {locale: productNameLocale, name: productName});
                this.set('productName', '');
            },

            addVariant(productVariantSizeId, productVariantPrice){
                    let size = this.store.peekRecord('product-variant-size', productVariantSizeId);
                    this.createRecordLocally('productVariants', 'product-variant', {size: size, price: productVariantPrice});
                    this.set('productVariantPrice', '');
            },

            addAudience(productAudienceID){
                let audience = this.store.peekRecord('product-audience', productAudienceID);
                this.productAudiences.pushObject(audience);
            }
        }
    });
