import Ember from 'ember';
import Materialize from 'materialize';

export default Ember.Component.extend({
    i18n: Ember.inject.service(),
    cartService: Ember.inject.service('shopping-cart'),
    localeTracker: Ember.inject.service(),
    locale: Ember.computed.reads("localeTracker.locale"),

    uniqueSizes: Ember.computed.uniqBy('sizes', 'id'),
    selectedSizeId: Ember.computed.reads('uniqueSizes.firstObject.id'),

    selectBoxDisplay: Ember.computed('data.productVariants', function(){
        return this.get('data.productVariants').map((item) =>{
           return {"id": item.get('id'), "name": item.get('size').get('name')};
       });
    }),

    didRender() {
    this._super(...arguments);
    this.$('select').material_select();  //see issue https://github.com/mike-north/ember-cli-materialize/issues/434
    },

    images: Ember.computed.reads('data.productImages'),

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

    actions: {
        addToCart(){
            this.get('cartService').addItem(this.get('selectedVariantId'), 1).then(() => {
                let thanksText = this.get("i18n").t('components.product-details.plusonesweater');
                Materialize.toast(thanksText, 2000, 'rounded');
                this.$('.detail-go-to-cart').addClass('scale-in');
            }).catch(() => alert('error adding to cart...'));
        }
    }

});
