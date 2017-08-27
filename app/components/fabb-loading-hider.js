import Ember from 'ember';

export default Ember.Component.extend({

  didInsertElement(){
    this._super(...arguments);
    this.$('.fabb-loading-hider-almost').css('visibility','visible');
    this.$('.fabb-loading-hider').delay(500).fadeOut(700);
    this.$('.fabb-loading-hider').scrollTop();
  }
});
