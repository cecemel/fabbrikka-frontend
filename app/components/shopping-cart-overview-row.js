import Ember from 'ember';

export default Ember.Component.extend({
    localeTracker: Ember.inject.service(),
    locale: Ember.computed.reads("localeTracker.locale"),
    tagName: 'tr',
    classNames: [],
    cartService: Ember.inject.service('shopping-cart'),
    product: Ember.computed.reads('item.productVariant.product'),
    primaryImages: Ember.computed.filterBy('product.productImages', 'type', 'primary'),
    productNames: Ember.computed.reads('product.productNames'),
    name: Ember.computed('locale', 'productNames', function(){
        let productName = this.get('productNames').find(function(e){
          return e.get("locale") === this.get('locale');
      }, this);
      return !Ember.isEmpty(productName) && productName.get("name");
    }),

    price: Ember.computed.reads('item.productVariant.price'),
    image: Ember.computed.reads('primaryImages.firstObject.accessURL'),
    size: Ember.computed.reads('item.productVariant.size.id'),
    quantity: Ember.computed.reads('item.quantity'),
    productVariants: Ember.computed.reads('product.productVariants'),
    sizes: Ember.computed.mapBy('productVariants', 'size'),
    availibleSizes: Ember.computed.uniqBy('sizes', 'id'),

    //sets the variant based on future multiple criteria
    selectedVariant: Ember.computed('size', function(){
        return this.get('productVariants').find(function(e){
             return e.get('size').get('id') === this.get('size');
        }, this);
    }),

    didRender() {
        this._super(...arguments);
        this.$('select').material_select();
    },
    actions: {
        delete: function(id){
            this.get('cartService').removeItem(id);
        },
        update: function(){
            this.get('cartService').updateItem(this.get('item.id'), this.get('selectedVariant').get('id'),
                                               this.get('quantity'));
        }
    }
});
