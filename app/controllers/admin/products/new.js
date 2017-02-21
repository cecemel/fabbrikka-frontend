import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Controller.extend({
	    product: {},
	    productDescriptions: [],
        productNames: [],
        productPrice: {},
        productImages: [],
        productSizes: [],
        productAudienceDSObjects: [],
	    
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
        sizesList: [{"value": "S"}, {"value": "M"}, {"value": "L"}],
        
        imageUploadValidation: Ember.computed(() => {
          return Ember.run.bind(this, () => {
            if (Ember.isEmpty(this.productImageType)) {
              alert("please provide an image type");
              return false;
            }
            return true;
          });
        }),

        imageUploadSuccess: Ember.computed(() => {
          return Ember.run.bind(this, (data) => {
            this.productImages.pushObject({accessURL : this.fileUploadHost + data.links.self + "/download", type: this.productImageType});
          });
        }),

        imageUploadFail: Ember.computed(() => {
          return Ember.run.bind(this, (jqXHR, textStatus) => {
            alert("image upload failed:" + textStatus);
          });
        }),

        storePropertyCollection: function(modelName, property, parentObj, objCollection){
            for (var obj of objCollection) {
                this.storeProperty(modelName, property, parentObj, obj);
            }
        },

        storeProperty: function(modelName, property, parentObj, obj){
            let record = this.get('store').createRecord(modelName, obj);
            this.parentObj.get(property).pushObject(record);
            this.parentObj.save().then(function () {
                record.save();
            });
        },

	    actions: {

            storeProduct: function() {
	    		this.product = this.store.createRecord('product', {"type": this.productType, "ranking": this.productRanking});
            	this.product.save();

                this.storePropertyCollection('product-description', 'productDescriptions', this.product, this.productDescriptions);
                this.storePropertyCollection('product-name', 'productNames', this.product, this.productNames);
                this.storePropertyCollection('product-price', 'productPrice', this.product, [this.productPrice]);
                this.storePropertyCollection('product-image', 'productImages', this.product, this.productImages);
                this.storePropertyCollection('product-size', 'productsizes', this.product, this.productSizes);

        	},

        	addDescription: function(){
        	   this.productDescriptions.pushObject({locale: this.productDescriptionLocale, 
        			description: this.productDescription});

               this.set('productDescription', '');
        	},

            addName: function(){
               this.productNames.pushObject({locale: this.productNameLocale, 
                    name: this.productName});
               this.set('productName', ''); 
            },

            addSize: function(){
               this.productSizes.pushObject({sizeName: this.productSize});
               this.set('productSize', ''); 
            },

            addPrice: function(){
                this.productPrice["amount"] = this.productPriceAmount;
                this.productPrice["currency"] = "EUR";
            },

            addAudience: function(){
                let audience = this.store.findRecord('product-audience', this.productAudienceID);
                this.productAudienceDSObjects.pushObject(audience);
            }
    	}
	});
