import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  model() {
    return this.get('store').createRecord('product-size');
  },
  actions: {
    save(model) {
      var self = this;
      return model.save().then( function(/*model*/) {
        self.transitionTo( "admin.product-sizes");
      }).catch( function() {
        alert("Creation of product-size failed");
      });
    }, 
    deactivate: function() {
      let model = this.controllerFor('admin.product-sizes.new').get('model');
      model.rollbackAttributes();
    },
  }
});
