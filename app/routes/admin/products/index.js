import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store
        .query('product', {
            reload: true,
        }).then(products => products.sortBy('ranking'));
    },
});
