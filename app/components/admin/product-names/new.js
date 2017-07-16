import Ember from 'ember';

export default Ember.Component.extend({
    actions: {
        save() {
            this.sendAction('save', this.get('selectedLocale'), this.get('productName'));
            this.set('productName', '');
        }
  }
});
