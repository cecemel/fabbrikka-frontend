import DS from 'ember-data';

export default DS.Model.extend({
	type: DS.attr('string'),
	productNames: DS.hasMany('product-name', {inverse: 'product'}),
	productDescriptions: DS.hasMany('product-description', {inverse: 'product'}),
	productImages: DS.hasMany('product-image', {inverse: 'product'}),
	productPrices: DS.hasMany('product-price', {inverse: 'product'}),
	productSizes: DS.hasMany('product-size', {inverse: 'product'}),
	
});
