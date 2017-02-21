import Ember from 'ember';

export default Ember.Route.extend({
	model() {
		return Ember.RSVP.hash({
			productAudiences: this.store.findAll('product-audience'),
    	});
  	},

  	setupController(controller, models) {
  		controller.set('productAudiencesList', models.productAudiences);
  	}
});
