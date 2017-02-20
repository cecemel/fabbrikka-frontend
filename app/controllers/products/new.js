import Ember from 'ember';

export default Ember.Controller.extend({
	    product: {},
	    productDescriptions: [],
	    type: "",
	    productDescription: "",
	    productDescriptionLocale: "",
	    productDescriptionLocalesList:[{"value": "en_US"}, {"value": "nl_BE"}],

	    actions: {
	    	saveProduct: function() {
	    		this.product = this.store.createRecord('product', {"type": this.type});
            	this.product.save();
        	},

        	addDescription: function(){
        		//let description = this.get('store').createRecord('product-description', {locale: this.productDescriptionLocale, 
        		//	description: this.productDescription});
        	// 	this.product.get('productDescriptions').pushObject(description);
        	// 	this.product.save().then(function () {
        	// 		description.save();
        	// })
        	   this.productDescriptions.pushObject({locale: this.productDescriptionLocale, 
        			description: this.productDescription});
        	}
    	}
	});
