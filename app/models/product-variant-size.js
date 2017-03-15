import DS from 'ember-data';

export default DS.Model.extend({
    name: DS.attr('string'),
    productVariants: DS.hasMany('product-variant', {inverse: 'size'})
});
