import Ember from 'ember';
import { task } from 'ember-concurrency';

export default Ember.Controller.extend({
	cartService: Ember.inject.service('shopping-cart'),
	total: Ember.computed.reads('cartService.total'),  
	
});
