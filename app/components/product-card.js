import Ember from 'ember';

export default Ember.Component.extend({
  primaryImage: Ember.computed( 'item.images.@each.type', function() {
    return this.get('item.productImages').findBy('type', 'primary');
  }),
  primaryImageURL: Ember.computed.oneWay('primaryImage.accessURL'),
  name: Ember.computed.oneWay('item.productNames.firstObject.name'),
  price: Ember.computed( 'item.productPrice', function() {
    let price = this.get('item.productPrice.amount');
    if( price ) {
      return `${price} €`;
    }
  } )
});
