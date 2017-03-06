import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    description: DS.attr('string'),
    label: DS.attr('string'),
    products: DS.hasMany('product', {inverse: 'productAudiences'}),
});
