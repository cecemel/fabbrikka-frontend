import Ember from 'ember';

export default Ember.Route.extend({
    model() {
        return this.store
        .query('product', {
            reload: true,
            filter: {
                published: true
            }
        });
    },
});
