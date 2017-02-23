import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.findAll('product-size');
  },

  actions: {
    delete(index) {
      this.store.findRecord('product-size', index, { backgroundReload: false }).then(function(entry) {
      entry.destroyRecord();
  	});
  }
}
});
