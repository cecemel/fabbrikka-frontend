import DS from 'ember-data';

export default DS.Model.extend({
	description: DS.attr('string'),
	locale: DS.attr('string'), 
	product: DS.belongsTo('product', {inverse: 'productDescriptions'})
});
