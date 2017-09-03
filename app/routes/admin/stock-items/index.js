import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.query('stock-item', {include: 'product-variant,product-variant.product,' +
                                                      'product-variant.product.product-images,product-variant.size,' +
                                                      'product-variant.product.product-names',
                                           page: {size: 1000}});
  },

  actions: {
    update(stockItem) {
        stockItem.save();
    },
    delete(stockItem){
        stockItem.destroyRecord();
    }
}
});
