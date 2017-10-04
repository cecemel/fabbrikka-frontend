import Ember from 'ember';

export default Ember.Controller.extend({
  locales: [{"value": "en-gb"}, {"value": "nl-be"}, {"value": "de-de"}],
  faqContents: Ember.computed.reads('model.faqContents'),

  actions: {
    save() {
        let faqContentEntry = this.store.createRecord('faq-content', {
          locale: this.get('locale'),
          question: this.get('question'),
          response: this.get('response'),
        });
        this.get("model").get("faqContents").pushObject(faqContentEntry);
        return faqContentEntry.save().then(() => this.get("model").save());
      },

    delete(index) {
      this.store.findRecord('faq-content', index, { backgroundReload: false })
      .then(function(entry) {
        entry.destroyRecord();
      });
  },
}
});
