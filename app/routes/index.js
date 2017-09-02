import Ember from 'ember';

export default Ember.Route.extend({
   preserveScrollPosition: true,
    model() {
        return this.store
        .query('product',{
            include: "product-names,product-images",
            backgroundReload: true,
            filter: {
                published: true
            }
        });
    },
    afterModel(model){
      return model.sortBy('ranking');
    }
});
