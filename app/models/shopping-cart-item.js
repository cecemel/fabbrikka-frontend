import DS from 'ember-data';

export default DS.Model.extend({
	quantity: DS.attr("number"),
	product: DS.belongsTo('product'),
	size: DS.belongsTo('product-size'),
	shoppingCart: DS.belongsTo('shopping-cart', {inverse: "shoppingCartItems"}),
	
});