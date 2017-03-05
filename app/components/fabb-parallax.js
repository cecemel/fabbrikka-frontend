import Ember from 'ember';

export default Ember.Component.extend({

	 didInsertElement: function() {
	 	this._super(...arguments);
	 	this.$('.parallax').parallax();
    }
});