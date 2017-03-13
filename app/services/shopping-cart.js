import Ember from 'ember';

export default Ember.Service.extend({
    store: Ember.inject.service('store'),
    cart: null,
    totalObserver: Ember.observer('cart.shoppingCartItems.@each.quantity', function(){
        Ember.run.once(this, this._setTotals);
     }),
     total: 0,
     totalItems: 0,

     addItem(id, sizeId, quantity){
         let self = this;
         return self._initCart()
        .then(() => {
            return Ember.RSVP.Promise.all([
            self.get('store').findRecord('product', id),
            self.get('store').findRecord('product-size', sizeId)
            ]);
        })
        .then((items) =>{
          let shoppingCartItem = self.get('store').createRecord('shopping-cart-item',
              {"quantity": quantity,
               "product": items[0],
               "size": items[1],
               "shoppingCart": self.get('cart')
            });
          return shoppingCartItem.save();
         });
     },

    updateItem(id, sizeId, quantity){
        let self = this;
        return Ember.RSVP.Promise.all([self.get('store').findRecord('shopping-cart-item', id),
                                self.get('store').findRecord('product-size', sizeId),
                              ])
        .then((items) => {
          items[0].set("quantity", quantity);
          items[0].set("size", items[1]);
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
        //does not work
        // let dataPromise = this.get('store').
        //findRecord('shopping-cart', this.get('cart').get('id'),
        //{include: 'shoppingCartItems,shoppingCartItems.product,shoppingCartItems.product.productPrice'});
        // dataPromise.then((data) => {
        //console.log('foo');
        // })
        let quantities = [];
        this.get('cart').get('shoppingCartItems').then((items) => {
            this.set('totalItems', items.length);
            let promises = items.map((item) => {
                    quantities.push(item.get('quantity'));
                    let promiseInst = item.get('product')
                    .then((product) => {
                        return product.get('productPrice');
                    })
                    .then((price) => {
                        return price.get('amount');
                    });
                    return promiseInst;
                });
            return Ember.RSVP.Promise.all(promises);
        })
        .then((productPrices) => {
            let total = productPrices.reduce((acc, val, index) => {
                return acc + (parseFloat(val) * parseFloat(quantities[index]));
            }, 0);
            this.set('total', total);
        });
    }
});
