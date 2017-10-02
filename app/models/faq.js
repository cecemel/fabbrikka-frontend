import DS from 'ember-data';

export default DS.Model.extend({
  faqContents: DS.hasMany('faq-content'),
});
