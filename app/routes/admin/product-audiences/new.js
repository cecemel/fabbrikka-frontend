import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  model() {
    return this.get('store').createRecord('product-audience');
  },
  actions: {
    save(model) {
      var self = this;
      return model.save().then( function(/*model*/) {
        self.transitionTo( "admin.product-audiences");
      }).catch( function() {
        alert("Creation of product-audience failed");
      });
    }, 
    deactivate: function() {
      let model = this.controllerFor('admin.product-audiences.new').get('model');
      model.rollbackAttributes();
    },
  }
});
