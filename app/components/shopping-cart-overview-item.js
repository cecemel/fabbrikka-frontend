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
        if(!this.get('productNames') || !this.get('locale')){
            return;
        }
        let productName = this.get('productNames').find(function(e){
          return e.get("locale") === this.get('locale');
      }, this);
      return !Ember.isEmpty(productName) && productName.get("name");
    }),

    image: Ember.computed.reads('primaryImages.firstObject.accessURL'),
    size: Ember.computed.reads('item.productVariant.size.id'),
    quantity: Ember.computed.reads('item.quantity'),
    productVariants: Ember.computed.reads('product.productVariants'),
    sizes: Ember.computed.mapBy('productVariants', 'size'),
    availibleSizes: Ember.computed.uniqBy('sizes', 'id'),

    selectVariantBySize: function (productVariants, sizeId) {
        return productVariants.find(function(e){
             return e.get('size').get('id') === sizeId;
        });
    },

    quantityValidator: Ember.observer('quantity', function(){
      this.set('validationError', []);
      let x = parseFloat(this.get('quantity'));
      let isNumber = !isNaN(x) && (x | 0) === x && x > 0;
      if(!isNumber){
        this.set('validationError', ['wrong']);
      }
    }),

    didRender() {
        this._super(...arguments);
        this.$('select').material_select();
    },

    isPageReady: Ember.computed('availibleSizes', function(){
        if(!this.get('availibleSizes') || this.get('availibleSizes').length === 0){
            return false;
        }
        return true;
    }),

    actions: {
        delete: function(id){
            this.get('cartService').removeItem(id).catch(() => alert('issue deleting item...'));
        },
        updateSize: function(sizeId){
            let selectedVariant = this.selectVariantBySize(this.get('productVariants'), sizeId);
            this.set('size', sizeId);
            this.get('cartService').updateItem(this.get('item.id'), selectedVariant.get('id'),
            this.get('quantity')).catch(() => alert('issue updating item...'));
        },
        updateQuantity: function(){
            let selectedVariant = this.selectVariantBySize(this.get('productVariants'), this.get('size'));
            this.get('cartService').updateItem(this.get('item.id'), selectedVariant.get('id'),
            this.get('quantity')).catch(() => alert('issue updating item...'));
        }
    }
});
