import Ember from 'ember';

export default Ember.Route.extend({
    model(params) {
        return Ember.RSVP.hash({
            product: this.store
                .findRecord('product', params.id,
                    {include: "product-images,product-variants,product-names,product-descriptions,product-variants.size"}),

            productAudiencesList: this.store.findAll('product-audience'),
            productSizesList: this.store.findAll('product-variant-size'),
        });
    }
});
