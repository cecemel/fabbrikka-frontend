import Ember from 'ember';
// WORKAROUND: see https://github.com/mike-north/ember-materialize-shim/issues/80
// import Materialize from 'materialize';

export default Ember.Component.extend({

    addToCartId: Ember.computed('elementId', function() {
        return `${this.get('elementId')}-addToCartId`;
      }),

    i18n: Ember.inject.service(),
    cartService: Ember.inject.service('shopping-cart'),
    localeTracker: Ember.inject.service(),
    locale: Ember.computed.reads("localeTracker.locale"),

    uniqueSizes: Ember.computed.uniqBy('sizes', 'id'),
    selectedSizeId: Ember.computed.reads('uniqueSizes.firstObject.id'),

    selectBoxDisplay: Ember.computed('data.productVariants.@each.size', function(){
        return this.get('data.productVariants').map((item) =>{
           return {"id": item.get('id'), "name": item.get('size').get('name')};
       });
    }),

    didInsertElement(){
        this._super(...arguments);
        this._setupSizeToolTip();
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
            if(!this.get('selectedVariantId')){

                return;
            }
            this.get('cartService').addItem(this.get('selectedVariantId'), 1).then(() => {
                let thanksText = this.get("i18n").t('components.product-details.plusonesweater');
                Materialize.toast(thanksText, 2000, 'rounded');
                this.$('.detail-go-to-cart').addClass('scale-in');
            }).catch(() => alert('error adding to cart...'));
        }
    }

});
