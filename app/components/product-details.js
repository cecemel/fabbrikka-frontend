import Ember from 'ember';
// WORKAROUND: see https://github.com/mike-north/ember-materialize-shim/issues/80
// import Materialize from 'materialize';

export default Ember.Component.extend({
  session: Ember.inject.service(),
  addToCartId: Ember.computed('elementId', function() {
    return `${this.get('elementId')}-addToCartId`;
  }),
  i18n: Ember.inject.service(),
  cartService: Ember.inject.service('shopping-cart'),
  isFreeTryOutAllowed: Ember.computed.reads('cartService.isFreeTryOutAllowed'),
  localeTracker: Ember.inject.service(),
  locale: Ember.computed.reads("localeTracker.locale"),

  productType: Ember.computed.reads('data.type'),

  uniqueSizes: Ember.computed.uniqBy('sizes', 'id'),
  selectedSizeId: Ember.computed.reads('uniqueSizes.firstObject.id'),

  selectBoxDisplay: Ember.computed('data.productVariants.@each.size', function(){
      return this.get('data.productVariants').map((item) =>{
         return {"id": item.get('id'), "name": item.get('size').get('name')};
     });
  }),

  isSmallScreen: Ember.computed.reads('media.isS'),
  isGermanMobileDisplayComputed: Ember.computed('locale', 'isSmallScreen', function(){
    if(this.get('locale') === 'de-de' && this.get('isSmallScreen')){
      return true;
    }
    return false;
  }),

  isTryOut: false,
  maxFreeTriesReached: Ember.computed.reads('cartService.maxFreeTriesReached'),

  didInsertElement(){
    this._super(...arguments);

    if(this.get('productType') !== 'voucher'){
      this._setupSizeToolTip();
    }
  },

  didRender() {
      this._super(...arguments);
      this.$('select').material_select();  //see issue https://github.com/mike-north/ember-cli-materialize/issues/434
  },

  images: Ember.computed('data.@each.productImages', function(){
      return this.get("data.productImages").filter(e => {
          return e.get("type") === "primary" || e.get("type") === "detail";
      });
  }),

  sortedImages: Ember.computed('images', function(){
      return this.get("images").toArray().sort(image => {
        return image.get("type") !== 'primary';
      });
  }),

  productNames: Ember.computed.reads('data.productNames'),
  name: Ember.computed('locale', 'productNames', function(){
      let productName = this.get('productNames').find(function(e){
        return e.get("locale") === this.get('locale');
    }, this);
    return !Ember.isEmpty(productName) && productName.get("name");
  }),

  price: Ember.computed('selectedVariantId', function(){
      let selectedVariantId = this.get('selectedVariantId');
      if(!selectedVariantId){
          return this.get('data.productVariants.firstObject.price') + '€';
      }

      let variant = this.get('data.productVariants').find(i => i.get('id') === selectedVariantId);

      return variant.get('price') + '€';

  }),

  productDescriptions: Ember.computed.reads('data.productDescriptions'),
  description: Ember.computed('locale', 'productDescriptions', function(){
      let description = this.get('productDescriptions').find(function(e){
        return e.get("locale") === this.get('locale');
    }, this);
    return !Ember.isEmpty(description) && description.get("description");
  }),

  toolTipMessage: Ember.observer('selectedVariantId', function(){
    let selectedVariantId = this.get('selectedVariantId');
    if(selectedVariantId){
          this._destroySizeToolTip();
      }
  }),

  _setupSizeToolTip(){
    let message = this.get("i18n").t('components.product-details.choose-size-error');
    this.$("#" + this.get('addToCartId')).tooltip({position: "top", tooltip: message, delay: 0});
  },

  _destroySizeToolTip(){
      this.$("#" + this.get('addToCartId')).tooltip('remove');
  },

  actions: {
    addToCart(){
      if(!this.get('selectedVariantId') && (this.get('productType') !== 'voucher')){
            return;
      }

      if(this.get('productType') == 'voucher'){
        this.set('selectedVariantId', this.get('data.productVariants.firstObject.id'));
      }
      
      this.get('cartService').addItem(this.get('selectedVariantId'), 1, this.get('isTryOut')).then(() => {
            let thanksText = this.get("i18n").t('components.product-details.plusonesweater');
            Materialize.toast(thanksText, 2000, 'rounded');
            this.$('.detail-go-to-cart').addClass('scale-in');
        }).catch(() => alert('Oeps, je kan maximum 4 stuks gratis passen...'));
      }
  }

});
