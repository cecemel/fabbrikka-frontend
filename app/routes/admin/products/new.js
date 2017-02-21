import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			productAudiences: this.store.findAll('product-audience'),
    	});
  	}
});
