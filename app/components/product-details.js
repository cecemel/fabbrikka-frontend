import Ember from 'ember';
import Materialize from 'materialize';

export default Ember.Component.extend({
    cartService: Ember.inject.service('shopping-cart'),

    didRender() {
    this._super(...arguments);
    this.$('select').material_select();  //see issue https://github.com/mike-north/ember-cli-materialize/issues/434
    },

    productVariants: Ember.computed.reads('data.productVariants'),
    sizes: Ember.computed.mapBy('productVariants', 'size'),
    uniqueSizes: Ember.computed.uniqBy('sizes', 'id'),
    selectedSizeId: Ember.computed.reads('uniqueSizes.firstObject.id'),

    //sets the variant based on future multiple criteria
    selectedVariant: Ember.computed('selectedSizeId', function(){
        let self = this;
        return this.get('productVariants').find(function(e){
             return e.get('size').get('id') === self.get('selectedSizeId');
        });
    }),

    images: Ember.computed.reads('data.productImages'),

    productName: Ember.computed.filterBy('data.productNames','locale', 'en_US'),
    name:  Ember.computed('productName', function(){
      return this.get('productName.firstObject.name');
    }),

    price: Ember.computed('selectedVariant', function(){
        let variant = this.get('selectedVariant');

        if(Ember.isEmpty(variant) || Object.keys(variant).length === 0){
            return '';
        }
        return variant.get('price') + '€';

    }),

    productDescription: Ember.computed.filterBy('data.productDescriptions','locale', 'en_US'),
    description: Ember.computed('productDescription', function(){
      return this.get('productDescription.firstObject.description');
    }),

    actions: {
        addToCart(){
            this.get('cartService').addItem(this.get('selectedVariant').get('id'), 1).then(() => {
                Materialize.toast("+1 sweater, thanks!", 4000, 'rounded');
                this.$('.detail-go-to-cart').addClass('scale-in');
            });
        }
    }

});
