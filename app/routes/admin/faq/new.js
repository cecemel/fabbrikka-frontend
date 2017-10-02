import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.createRecord('faq').save();
  },

  afterModel(model){
    this.transitionTo('admin.faq.edit', model.get("id"));
  }
});
