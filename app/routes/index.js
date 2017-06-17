import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store
        .query('product',{
            include: "product-names,product-images",
            reload: true,
            filter: {
                published: true
            }
        });
    },
});
