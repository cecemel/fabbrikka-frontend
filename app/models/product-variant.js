import DS from 'ember-data';

export default DS.Model.extend({
    price: DS.attr("number"),
    size: DS.belongsTo('product-variant-size', { inverse: 'productVariants'}),
    product: DS.belongsTo('product', { inverse: 'productVariants'})
});
