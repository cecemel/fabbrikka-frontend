import DS from 'ember-data';

export default DS.Model.extend({
  question: DS.attr('string'),
  response: DS.attr('string'),
  locale: DS.attr('string')
});
