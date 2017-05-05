import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Route.extend({
    fastboot: Ember.inject.service(),
    headData: Ember.inject.service(),

    beforeModel(){
        return this.get('cart').setupCart();
    },

    model(params) {
        return this.store.findRecord('product', params.id, {include: "product-images,product-variants,product-names,product-descriptions,product-variants.size"});
    },

    afterModel(model) {
        this._setupFacebookOG(model);
    },

    _setupFacebookOG(model){
        if(this.get('fastboot.isFastBoot')){
            let path = this.get('fastboot.request.path');
            this.set('headData.url', config.APP.publicHostName + path);
            this.set('headData.imageUrl', config.APP.publicHostName + model.get("productImages").find(this._filterFacebookOGImage).get('accessURL'));
        }
    },

    _filterFacebookOGImage(productImage){
        return productImage.get("type") === "facebook-share";
    },

});
