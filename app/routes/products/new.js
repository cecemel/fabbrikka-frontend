import Ember from 'ember';

export default Ember.Route.extend({
  store: Ember.inject.service(),
  model() {
    return this.get('store').createRecord('product');
  },
  actions: {
    save(model) {
      var self = this;
      return model.save().then( function(model) {
        self.transitionTo( "products.new", model );
      }).catch( function() {
        alert("Creation of product failed");
      });
    }
  }
});