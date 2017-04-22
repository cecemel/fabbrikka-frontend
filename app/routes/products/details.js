import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel(){
        return this.get('cart').setupCart();
    },
    model(params) {
        return this.store.findRecord('product', params.id, {include: "product-images,product-variants,product-names,product-descriptions,product-variants.size"});
    }
});
