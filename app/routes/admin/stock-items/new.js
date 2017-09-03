import Ember from 'ember';

export default Ember.Route.extend({

    model() {
      return Ember.RSVP.hash({
                    "stockItems": this.store.query('stock-item', {
            include: 'product-variant',
            page: {
              size:1000
            }
          }),


           //"stockItems": this.store.findAll('stock-item', {include: 'product-variant'}),
          //This is a nasty workaround because couldn't make the include work
          "products": this.store.findAll('product', {include: "product-images,product-variants,product-names,product-descriptions,product-variants.size"})
      });
    },

    afterModel(model){
        //filter the ones which already have stock information
        //note nasty workaround
        let productVariantsWithoutStock = model.products.reduce((acc, item) => {
          acc.pushObjects(item.get('productVariants').toArray());
          return acc;
        }, [])
        .filter((productVariant)=>{
            let stockItem = model.stockItems.find((item) => {
                return item.get('productVariant').get('id') === productVariant.get('id');
            });
            return !stockItem;
        });

        model.products = productVariantsWithoutStock.map((item) =>{
            return {'id': item.get('id'),
                    'name': "name: " + item.get('product').get('productNames').get('firstObject').get('name') +
                            ", size : " + item.get('size').get('name')};
        }) || [];
  },

    actions: {
        save(model) {
            let self = this;
            self.store.findRecord('product-variant', model.stockVariant)
            .then((productVariant) => {
                return self.get('store').createRecord('stock-item',
                                         {quantity: model.stockAmount,
                                          productVariant: productVariant}).save();

            })
            .then(() => {
                self.transitionTo( "admin.stock-items");
            })
            .catch(() => {
                alert("Creation of stock item failed");
            });
        },
        deactivate: function() {
            let model = this.controllerFor('admin.stock-items.new').get('model');
            model.rollbackAttributes();
        },
    }
});
