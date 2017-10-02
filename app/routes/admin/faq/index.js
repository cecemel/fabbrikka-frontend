import Ember from 'ember';

export default Ember.Route.extend({
  model() {
    return this.store.query('faq', {include: 'faq-contents'});
  },

  actions: {
    delete(faqItem){
        faqItem.get("faqContents").forEach(item => {
          item.destroyRecord();
        });
        faqItem.destroyRecord();
    },

    edit(faqItem){
        this.transitionTo('admin.faq.edit', faqItem.get("id"));
    },
}
});
