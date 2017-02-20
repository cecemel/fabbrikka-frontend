import DS from 'ember-data';

export default DS.Model.extend({
	sizeName: DS.attr('string'), 
	product: DS.belongsTo('product', {inverse: 'productSizes'})
});
