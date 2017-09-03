import Ember from 'ember';

export default Ember.Route.extend({
    beforeModel(){
        return this.get('cart').setupCart();
    },

    actions: {
      back(){
        history.back();
      }
    }
});
