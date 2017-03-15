import Ember from 'ember';

export default Ember.Service.extend({
    store: Ember.inject.service('store'),
    cart: null,
    totalObserver: Ember.observer('cart.shoppingCartItems.@each.quantity',
                                  'cart.shoppingCartItems.@each.productVariant',
                                  function(){Ember.run.once(this, this._setTotals);}),
     total: 0,
     totalItems: 0,

     addItem(id, quantity){
         let self = this;
         return self._initCart()
        .then(() => {
            return Ember.RSVP.Promise.all([
            self.get('store').findRecord('product-variant', id),
            ]);
        })
        .then((items) =>{
          let shoppingCartItem = self.get('store').createRecord('shopping-cart-item',
              {"quantity": quantity,
               "productVariant": items[0],
               "shoppingCart": self.get('cart')
            });
          return shoppingCartItem.save();
         });
     },

    updateItem(id, variantId, quantity){
        let self = this;
        return Ember.RSVP.Promise.all([self.get('store').findRecord('shopping-cart-item', id),
                                self.get('store').findRecord('product-variant', variantId),
                              ])
        .then((items) => {
          items[0].set("quantity", quantity);
          items[0].set("productVariant", items[1]);
          return items[0].save();
        });
    },

    removeItem(id){
        return this.get('store').findRecord('shopping-cart-item', id).then((item) =>{
          return item.destroyRecord();
        });
    },

    empty(){
        return this.get('cart').get('shoppingCartItems').then((items) => {
          let promises = [];

          items.forEach((item) => {
            promises.push(item.destroyRecord());
          });

          return Ember.RSVP.Promise.all(promises).then(()=>{
            return this.get('cart').destroyRecord();
          });
        });
    },

    _initCart(){
        let self = this;
        if(Ember.isNone(self.get('cart'))){
            let cart = self.get('store').createRecord('shopping-cart');
            return cart.save()
                .then(() => {
                    self.set('cart', cart);
                    return Ember.RSVP.Promise.resolve(self.get('cart'));
                });
        }
        return Ember.RSVP.Promise.resolve(self.get('cart'));
    },

    _setTotals(){
        //TODO: fix this -> mapping is not working
        //TODO: UPDATE: I know how now, but too lazy
        //does not work
        // let dataPromise = this.get('store').
        //findRecord('shopping-cart', this.get('cart').get('id'),
        //{include: 'shoppingCartItems,shoppingCartItems.product,shoppingCartItems.product.productPrice'});
        // dataPromise.then((data) => {
        //console.log('foo');
        // })
        let subTotals = [];
        this.get('cart').get('shoppingCartItems')
                        .then((items) => {
                            this.set('totalItems', items.length);
                            let promises = items.map((item) => {
                                    let quantity = item.get('quantity');
                                    return item.get('productVariant')
                                                .then((product) => {
                                                    subTotals.push(parseFloat(product.get('price')) * parseFloat(quantity));
                                                });
                                            });
                            return Ember.RSVP.Promise.all(promises);
                        })
        .then(() => {
            let total = subTotals.reduce((acc, val) => {
                return acc + val;
            }, 0);
            this.set('total', total);
        });
    }
});
