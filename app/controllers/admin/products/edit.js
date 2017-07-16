import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Controller.extend({
    fileUploadHost: config.APP.backendHost,
    fileUploadEndpoint: config.APP.backendHost + "/files",
    localesList: [{"value": "en-gb"}, {"value": "nl-be"}],
    productTypesList: [{"value": "sweater"}, {"value": "pants"}, {"value": "shirt"}],
    imageTypesList: [{"value": "primary"}, {"value": "detail"}, {"value": "facebook-share"}],

    productDescriptions: Ember.computed.reads('data.productDescriptions'),

    actions: {
        updateProduct(){
            let self = this;
            this.get('store')
            .findRecord('product', this.get('model.product.id'))
            .then(function(product) {
                product.set("type", self.get('model.product.type'));
                product.set("ranking", self.get('model').get('ranking'));
                product.save();
            });
        },

        addName(locale, name){
            let record = this.get('store')
            .createRecord('product-name',{locale: locale, name: name});
            this.get('model.product.productNames').pushObject(record);
            return record.save();
        },

        deleteName(id){
            this.get('store')
            .findRecord('product-name', id, { backgroundReload: false })
            .then(function(record) {
                record.destroyRecord();
            });
        },

        addDescription(productDescriptionLocale, productDescription){
            let record = this.get('store')
            .createRecord('product-description',{locale: productDescriptionLocale, description: productDescription});
            this.get('model.product.productDescriptions').pushObject(record);
            return record.save();
        },

        deleteDescription(id){
            this.get('store')
            .findRecord('product-description', id, { backgroundReload: false })
            .then(function(description) {
                description.destroyRecord();
            });
        },

        addVariant(sizeId, price){
            let size = this.store.peekRecord('product-variant-size', sizeId);
            let record = this.get('store')
            .createRecord('product-variant',{size: size, price: price});
            this.get('model.product.productVariants').pushObject(record);
            return record.save();
        },

        deleteVariant(id){
            this.get('store')
            .findRecord('product-variant', id, { backgroundReload: false })
            .then(function(item) {
                item.destroyRecord();
            });
        },

        addAudience(id){
            let audience = this.store.peekRecord('product-audience', id);
            this.get('store')
            .findRecord('product', this.get('model.product.id'))
            .then(function(product) {
                product.get("productAudiences").pushObject(audience);
                product.save();
            });
        },

        deleteAudience(id){
            this.get('store')
            .findRecord('product-audience', id, { backgroundReload: false })
            .then(function(item) {
                item.destroyRecord();
            });
        },

        addImage(url, imageType){
            let record = this.get('store')
            .createRecord('product-image', {accessURL : url, type: imageType});
            this.get('model.product.productImages').pushObject(record);
            return record.save();
        },

        deleteImage(id){
            this.get('store')
            .findRecord('product-image', id, { backgroundReload: false })
            .then(function(item) {
                item.destroyRecord();
            });
        }
    }
});
