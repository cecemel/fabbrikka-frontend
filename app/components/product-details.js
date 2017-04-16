import Ember from 'ember';
import Materialize from 'materialize';

export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    cartService: Ember.inject.service('shopping-cart'),
    localeTracker: Ember.inject.service(),
    locale: Ember.computed.reads("localeTracker.locale"),

    productVariants: Ember.computed.reads('data.productVariants'),
    sizes: Ember.computed.mapBy('productVariants', 'size'),
    uniqueSizes: Ember.computed.uniqBy('sizes', 'id'),
    selectedSizeId: Ember.computed.reads('uniqueSizes.firstObject.id'),

    didRender() {
    this._super(...arguments);
    this.$('select').material_select();  //see issue https://github.com/mike-north/ember-cli-materialize/issues/434
    },

    //sets the variant based on future multiple criteria
    selectedVariant: Ember.computed('selectedSizeId', function(){
        let self = this;
        return this.get('productVariants').find(function(e){
             return e.get('size').get('id') === self.get('selectedSizeId');
        });
    }),

    images: Ember.computed.reads('data.productImages'),

    productNames: Ember.computed.reads('data.productNames'),
    name: Ember.computed('locale', 'productNames', function(){
        let productName = this.get('productNames').find(function(e){
          return e.get("locale") === this.get('locale');
      }, this);
      return !Ember.isEmpty(productName) && productName.get("name");
    }),

    price: Ember.computed('selectedVariant', function(){
        let variant = this.get('selectedVariant');

        if(Ember.isEmpty(variant) || Object.keys(variant).length === 0){
            return '';
        }
        return variant.get('price') + '€';

    }),

    productDescriptions: Ember.computed.reads('data.productDescriptions'),
    description: Ember.computed('locale', 'productDescriptions', function(){
        let description = this.get('productDescriptions').find(function(e){
          return e.get("locale") === this.get('locale');
      }, this);
      return !Ember.isEmpty(description) && description.get("description");
    }),

    isPageReady: Ember.computed('uniqueSizes', function(){
        if(!this.get('uniqueSizes') || this.get('uniqueSizes').length === 0){
            return false;
        }
        return true;
    }),

    actions: {
        addToCart(){
            this.get('cartService').addItem(this.get('selectedVariant').get('id'), 1).then(() => {
                let thanksText = this.get("i18n").t('components.product-details.plusonesweater');
                Materialize.toast(thanksText, 2000, 'rounded');
                this.$('.detail-go-to-cart').addClass('scale-in');
            });
        }
    }

});
