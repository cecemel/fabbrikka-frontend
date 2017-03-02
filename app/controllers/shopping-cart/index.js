import Ember from 'ember';

export default Ember.Controller.extend({
	cartService: Ember.inject.service('shopping-cart'),
});
