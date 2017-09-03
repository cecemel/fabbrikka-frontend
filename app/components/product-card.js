import Ember from 'ember';

export default Ember.Component.extend({
    session: Ember.inject.service(),
    localeTracker: Ember.inject.service(),
    locale: Ember.computed.reads("localeTracker.locale"),
    primaryImages: Ember.computed.filterBy( 'item.productImages','type', 'primary'),
    primaryImageURL: Ember.computed.oneWay('primaryImages.firstObject.accessURL'),
    productNames: Ember.computed.reads('item.productNames'),
    name: Ember.computed('locale', 'productNames', function(){
        let productName = this.get('productNames').find(function(e){
          return e.get("locale") === this.get('locale');
      }, this);
      return !Ember.isEmpty(productName) && productName.get("name");
    }),
    price: Ember.computed('item.productVariants.firstObject', function(){
        let price = this.get('item.productVariants.firstObject.price');
        if( price ) {
            return `${price} €`;
        }
    }),
});
