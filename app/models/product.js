import DS from 'ember-data';

export default DS.Model.extend({
	type: DS.attr('string'),
	ranking: DS.attr('number'),
	productNames: DS.hasMany('product-name', {inverse: 'product'}),
	productDescriptions: DS.hasMany('product-description', {inverse: 'product'}),
	productImages: DS.hasMany('product-image', {inverse: 'product'}),
	productPrice: DS.belongsTo('product-price', {inverse: 'product'}),
	productSizes: DS.hasMany('product-size', {inverse: 'product'}),
	productAudiences: DS.hasMany('product-audience', {inverse: 'product'}),
	
});
