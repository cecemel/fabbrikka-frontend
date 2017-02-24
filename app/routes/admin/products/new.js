import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			productAudiencesList: this.store.findAll('product-audience'),
			productSizesList: this.store.findAll('product-size'),
    	});
  	}
});
