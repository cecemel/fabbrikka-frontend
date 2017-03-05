import Ember from 'ember';
export default Ember.Controller.extend({
	cartService: Ember.inject.service('shopping-cart'),
	total: Ember.computed.reads('cartService.total'),
	hasItems:  Ember.computed.reads('cartService.totalItems')

});
