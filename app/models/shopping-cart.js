import DS from 'ember-data';

export default DS.Model.extend({
    ownerSession: DS.attr('string'),
    shoppingCartItems: DS.hasMany('shopping-cart-item', {inverse: 'shoppingCart'}),
});