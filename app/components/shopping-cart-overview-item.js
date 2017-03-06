import Ember from 'ember';

export default Ember.Component.extend({
    cartService: Ember.inject.service('shopping-cart'),
    primaryImages: Ember.computed.filterBy('item.product.productImages', 'type', 'primary'),
    name: Ember.computed.reads('item.product.productNames.firstObject.name'),
    price: Ember.computed.reads('item.product.productPrice.amount'),
    image: Ember.computed.reads('primaryImages.firstObject.accessURL'),
    size: Ember.computed.reads('item.size.id'),
    quantity: Ember.computed.reads('item.quantity'),
    availibleSizes:  Ember.computed.reads('item.product.productSizes'),

    didRender() {
        this._super(...arguments);
        this.$('select').material_select();
    },
    actions: {
        delete: function(id){
            this.get('cartService').removeItem(id);
        },
        update: function(id, sizeId, quantity){
            this.get('cartService').updateItem(id, sizeId, quantity);
        }
    }
});
