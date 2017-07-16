import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        save() {
            this.sendAction('save', this.get('selectedSize'), this.get('price'));
        }
  }
});
