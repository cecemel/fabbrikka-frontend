import Ember from 'ember';

export default Ember.Service.extend({
	store: Ember.inject.service('store'),
	cart: null,

	init() {
    let self = this;
		self._super(...arguments);
    let cart = self.get('store').createRecord('shopping-cart');
    cart.save()
    .then(function(){
      self.set('cart', cart)
      });
  	},

	addItem(id, sizeId, quantity){
    let self = this;
    Ember.RSVP.Promise.all([self.get('store').findRecord('product', id),
                            self.get('store').findRecord('product-size', sizeId)
                            ])
    .then((items) =>{
      let shoppingCartItem = self.get('store').createRecord('shopping-cart-item', 
          {"quantity": quantity,
           "product": items[0],
           "size": items[1],
           "shoppingCart": self.get('cart') 
        });
      return shoppingCartItem.save();
     })
	},

	updateItem(id, sizeId, quantity){
    let self = this;
    Ember.RSVP.Promise.all([self.get('store').findRecord('shopping-cart-item', id),
                            self.get('store').findRecord('product-size', sizeId),
                          ])
    .then((items) => {
      items[0].set("quantity", quantity);
      items[0].set("size", items[1]);
      return items[0].save();
    });

	},

	removeItem(id){
    this.get('store').findRecord('shopping-cart-item', id).then((item) =>{
      return item.destroyRecord();
    });  
	},

	empty(){
    this.get('cart').get('shoppingCartItems').then((items) => {
      let promises = []

      items.forEach((item) => {
        promises.push(item.destroyRecord());
      });

      return Ember.RSVP.Promise.all(promises).then(()=>{
        return this.get('cart').destroyRecord();
      });
    })
	},
});
