import Ember from 'ember';

export default Ember.Component.extend({
  primaryImages: Ember.computed.filterBy( 'item.productImages','type', 'primary'),
  primaryImageURL: Ember.computed.oneWay('primaryImages.firstObject.accessURL'),
  name: Ember.computed.oneWay('item.productNames.firstObject.name'),
  price: Ember.computed( 'item.productPrice', function() {
    let price = this.get('item.productPrice.amount');
    if( price ) {
      return `${price} €`;
    }
  } )
});
