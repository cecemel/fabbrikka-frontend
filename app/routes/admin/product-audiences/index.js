import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('product-audience');
  },

  actions: {
    delete(index) {
      this.store.findRecord('product-audience', index, { backgroundReload: false }).then(function(productAudience) {
      productAudience.destroyRecord();
    });
  }
}
});
