import DS from 'ember-data';

export default DS.Model.extend({
    quantity: DS.attr("number"),
    productVariant: DS.belongsTo('product-variant'),
    shoppingCart: DS.belongsTo('shopping-cart', {inverse: "shoppingCartItems"}),
});
