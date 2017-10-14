import Ember from 'ember';
import config from 'fabbrikka-frontend/config/environment';

export default Ember.Service.extend({
    localeTracker: Ember.inject.service(),
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
     isFreeTryOutAllowed: Ember.computed("localeTracker.countryCode", function(){
       //we work with black-list. This is a safer path, as if no decent locale is provided
       //then we have fallback
       let blackList = ['de'];
       let countryCode = this.get("localeTracker.countryCode");
       if(blackList.indexOf(countryCode) > -1) {
         return false;
       }
       return true;
     }),

     totalFreeTries: 0,
     maxFreeTries: 4,
     totalItems: 0,
     maxFreeTriesReached: false,
     isFreeTryCountry: true,

     getItem(id){
       return this.get('store').findRecord('shopping-cart-item', id, {include: 'product-variant'});
     },

     addItem(id, quantity, isTryOut){
         let self = this;
         return self.get('store').findRecord('product-variant', id)
        .then((item) =>{
          let shoppingCartItem = self.get('store').createRecord('shopping-cart-item',
              {"quantity": quantity,
               "productVariant": item,
               "shoppingCart": self.get('cart'),
               "isTryOut": isTryOut || false
            });

          if(self._isMaxFreeTriesReached(shoppingCartItem)){
             shoppingCartItem.rollbackAttributes();
             return new Ember.RSVP.Promise(function(resolve, reject){
                 reject("maxFreeTriesReached");
             });
          }

          return shoppingCartItem.save();
         });
     },

    updateItem(id, variantId, quantity, isTryOut){
        let self = this;
        return Ember.RSVP.all([self.get('store').findRecord('shopping-cart-item', id),
                                self.get('store').findRecord('product-variant', variantId),
                              ])
        .then((items) => {
          items[0].set("quantity", quantity);
          items[0].set("productVariant", items[1]);
          items[0].set("isTryOut", isTryOut || false);

          if(self._isMaxFreeTriesReached(items[0])){
             items[0].rollbackAttributes();
             return new Ember.RSVP.Promise(function(resolve, reject){
                 reject("maxFreeTriesReached");
             });
          }

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
                return self.get('store').findRecord('shopping-cart', id, {include: "shopping-cart-items,shopping-cart-items.product-variant"});
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

    _isMaxFreeTriesReached(item){
      if(!item.get("isTryOut") || !this.get('cart')){
        return false;
      }
      let items = this.get('cart').get('shoppingCartItems');
      items.addObject(item);
      let totals = this._getTotals(items);
      if(totals.totalFreeTries > this.get('maxFreeTries')){
        return true;
      }
      return false;
    },

    _getTotals(items){
      let totals = {total: 0, totalItems: 0, totalFreeTries: 0};
      items.map(item => {
        let quantity = parseInt(item.get('quantity'));
        let price = parseFloat(item.get('productVariant.price'));
        totals.totalItems +=quantity;
        if(item.get('isTryOut')){
          totals.totalFreeTries += quantity;
          return;
        }
        totals.total += price * quantity;
      });
      return totals;
    },

    _setTotals(){
        if(!this.get('cart')){
            return; //no cart set, do nothing
        }
        let items = this.get('cart').get('shoppingCartItems');
        let totals = this._getTotals(items);
        this.set('total', totals.total);
        this.set('totalItems', totals.totalItems);
        this.set('totalFreeTries', totals.totalFreeTries);
        this.set('maxFreeTriesReached', totals.totalFreeTries >= this.get('maxFreeTries'));
    }
});
