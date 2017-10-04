import Ember from 'ember';

export default Ember.Controller.extend({
  localeTracker: Ember.inject.service(),
  locale: Ember.computed.reads("localeTracker.locale"),
  filteredFaqEntries :Ember.computed("locale", "model", function(){
    let entries = [];
    this.get("model").forEach(item => {
      item.get('faqContents').forEach(faqContent => {
        if(faqContent.get("locale") === this.get('locale')){
          entries.push(faqContent);
        }
      });
    });
    return entries;
  }),

});
