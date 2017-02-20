import DS from 'ember-data';

export default DS.Model.extend({
	accessURL: DS.attr('string'),
	type: DS.attr('string'), 
	product: DS.belongsTo('product', { inverse: 'productImages'})
});
