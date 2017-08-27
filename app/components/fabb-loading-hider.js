import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement(){
    this._super(...arguments);
    this.$('.fabb-loading-hider').fadeOut();
    this.$('.fabb-loading-hider').scrollTop()
  }
});
