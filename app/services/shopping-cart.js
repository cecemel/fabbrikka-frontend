import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Service.extend({
    fastboot: Ember.inject.service(),
    store: Ember.inject.service('store'),
    ajax: Ember.inject.service(),
    cart: null,
    totalObserver: Ember.observer('cart.shoppingCartItems.@each.quantity',
                                  'cart.shoppingCartItems.@each.productVariant',
                                  function(){
                                      Ember.run.once(this, this._setTotals);
                                  }),
     total: 0,
     totalItems: 0,

     addItem(id, quantity){
         let self = this;
         return self.get('store').findRecord('product-variant', id)
        .then((item) =>{
          let shoppingCartItem = self.get('store').createRecord('shopping-cart-item',
              {"quantity": quantity,
               "productVariant": item,
               "shoppingCart": self.get('cart')
            });
          return shoppingCartItem.save();
         });
     },

    updateItem(id, variantId, quantity){
        let self = this;
        return Ember.RSVP.all([self.get('store').findRecord('shopping-cart-item', id),
                                self.get('store').findRecord('product-variant', variantId),
                              ])
        .then((items) => {
          items[0].set("quantity", quantity);
          items[0].set("productVariant", items[1]);
          return items[0].save();
        });
    },

    removeItem(id){
        return this.get('store').findRecord('shopping-cart-item', id, { backgroundReload: false }).then((item) =>{
          return item.destroyRecord();
        });
    },

    setupCart(){
        let self = this;
        if(self.get('fastboot.isFastBoot')){
            console.log("INFO: setupCart disabled in fastboot modus...");
            return; //we don't need it here
        }

        if(Ember.isNone(self.get('cart'))){
            return self._tryFetchAssociatedCart()
            .then((id) => {
                if(!id){
                    return self._createNewCart();
                }
                return self.get('store').findRecord('shopping-cart', id, {include: "shopping-cart-items"});
            })
            .then((cart) => {
                self.set('cart', cart);
                self._associateCart(cart);
                return cart;
            });
        }
        return Ember.RSVP.Promise.resolve(self.get('cart'));
    },

    resetCart(){
        let self = this;
        self.get("store").unloadAll('shoppingCart');
        self.get("store").unloadAll('shoppingCartItem');
        self.set("cart", null);
        return self.setupCart();
    },

    _createNewCart(){
        let self = this;
        let cart = self.get('store').createRecord('shopping-cart');
        return cart.save();
    },

    _associateCart(cart){
        //links cart with session
        return this.get('ajax').request(config.APP.cartService + '/shopping-carts', {
            method: 'PATCH',
            data: JSON.stringify(cart.serialize({includeId: true})),
            contentType: 'application/vnd.api+json'
        });
    },

    _tryFetchAssociatedCart(){
        //fetch associated cart with session remotly
        return this.get('ajax')
        .request(config.APP.cartService + '/shopping-carts')
        .then(data => data[0]);
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
        if(!this.get('cart')){
            return; //no cart set, do nothing
        }
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
