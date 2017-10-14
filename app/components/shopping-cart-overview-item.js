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

    isFreeTryOutAllowed: Ember.computed.reads('cartService.isFreeTryOutAllowed'),
    isTryOut: Ember.computed.reads('item.isTryOut'),

    image: Ember.computed.reads('primaryImages.firstObject.accessURL'),
    size: Ember.computed.reads('item.productVariant.size.id'),
    quantity: Ember.computed.reads('item.quantity'),
    productVariants: Ember.computed.reads('product.productVariants'),
    sizes: Ember.computed.mapBy('productVariants', 'size'),
    availibleSizes: Ember.computed.uniqBy('sizes', 'id'),

    isPageReady: Ember.computed('availibleSizes', function(){
        if(!this.get('availibleSizes') || this.get('availibleSizes').length === 0){
            return false;
        }
        return true;
    }),

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

    actions: {
        delete: function(id){
            this.get('cartService').removeItem(id).catch(() => alert('issue deleting item...'));
        },
        updateSize: function(sizeId){
            let selectedVariant = this.selectVariantBySize(this.get('productVariants'), sizeId);
            this.set('size', sizeId);
            this.get('cartService')
            .updateItem(this.get('item.id'),
                        selectedVariant.get('id'),
                        this.get('quantity'),
                        this.get('isTryOut'))
              .catch(this._handleItemUpdateError.bind(this));
        },
        updateQuantity: function(){
            let selectedVariant = this.selectVariantBySize(this.get('productVariants'), this.get('size'));
            this.get('cartService')
            .updateItem(this.get('item.id'),
                        selectedVariant.get('id'),
                        this.get('quantity'),
                        this.get('isTryOut'))
            .catch(this._handleItemUpdateError.bind(this));
        },
        updateIsTryOut: function(){
          let selectedVariant = this.selectVariantBySize(this.get('productVariants'), this.get('size'));
          this.get('cartService')
          .updateItem(this.get('item.id'),
                      selectedVariant.get('id'),
                      this.get('quantity'),
                      this.get('isTryOut'))
          .catch(this._handleItemUpdateError.bind(this));
        }
    },

    _handleItemUpdateError(error){
      if(error === "maxFreeTriesReached"){
        this.sendAction('handleMaxFreeTriesReached');
        this.get('cartService').getItem(this.get('item.id'))
        .then(item => {
          this.set('quantity', item.get('quantity'));
          this.set('isTryOut', item.get('isTryOut'));
        });
        return;
      }
      alert("General error, try again or contact hello@fabbrikka.com");
    }
});
