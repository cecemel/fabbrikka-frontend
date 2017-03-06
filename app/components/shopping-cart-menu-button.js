import Ember from 'ember';

export default Ember.Component.extend({
    cartService: Ember.inject.service('shopping-cart'),
    didInsertElement: function() {
        this.$('.dropdown-button').dropdown({
          inDuration: 300,
          outDuration: 225,
          constrainWidth: false, 
          hover: false,
          gutter: 5, 
          belowOrigin: true, 
          alignment: 'left',
          stopPropagation: false
        });
    }
});
