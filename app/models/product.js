import DS from 'ember-data';

export default DS.Model.extend({
    type: DS.attr('string'),
    ranking: DS.attr('number'),
    published:DS.attr('boolean',  {defaultValue: true}),
    productNames: DS.hasMany('product-name', {inverse: 'product'}),
    productDescriptions: DS.hasMany('product-description', {inverse: 'product'}),
    productImages: DS.hasMany('product-image', {inverse: 'product'}),
    productVariants: DS.hasMany('product-variant', {inverse: 'product'}),
    productAudiences: DS.hasMany('product-audience', {inverse: 'products'}),
});
