import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('product-variant-size');
  },
  actions: {
    save(model) {
      var self = this;
      return model.save().then( () => {
        self.transitionTo( "admin.product-variant-sizes");
    }).catch( () => {
          alert("Creation of product-variant-size failed");
      });
    },
    deactivate() {
      let model = this.controllerFor('admin.product-variant-sizes.new').get('model');
      model.rollbackAttributes();
    },
  }
});
