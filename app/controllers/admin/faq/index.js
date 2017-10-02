import Ember from 'ember';

export default Ember.Controller.extend({
  localeTracker: Ember.inject.service(),
  locale: Ember.computed.reads("localeTracker.locale"),
  filteredFaqEntries :Ember.computed("locale", "model", function(){
    return this.get("model").forEach(item => {
      return item; //TODO: needs locale filter
    });
  })

});
