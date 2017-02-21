import Ember from 'ember';

export default Ember.Component.extend({

	 didInsertElement: function() {
	 	this.$(".dropdown-button").dropdown();
	 	this.$(".button-collapse").sideNav();
    }
});
