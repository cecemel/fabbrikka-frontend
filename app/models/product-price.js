import DS from 'ember-data';

export default DS.Model.extend({
    amount: DS.attr('number'),
    currency: DS.attr('string'), 
    product: DS.belongsTo('product', {inverse: 'productPrice'})
});
