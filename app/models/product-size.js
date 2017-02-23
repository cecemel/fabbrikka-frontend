import DS from 'ember-data';

export default DS.Model.extend({
	sizeName: DS.attr('string'), 
	products: DS.hasMany('product', {inverse: 'productSizes'})
});
