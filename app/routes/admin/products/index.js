import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store
        .findAll('product')
        .then(products => {
            return products.filter(product => {
                return product.get('published') !== false;
            });
        });
    },
});
