import Ember from 'ember';

export default Ember.Controller.extend({
        localesList: [{"value": "en-gb"}, {"value": "nl-be"}],
        productTypesList: [{"value": "sweater"}, {"value": "pants"}, {"value": "shirt"}],
        imageTypesList: [{"value": "primary"}, {"value": "detail"}, {"value": "facebook-share"}],

        actions: {
            storeProduct() {
                let self = this;
                this.product = this.store.createRecord('product',
                    {"type": this.get('productType'),
                    "ranking": this.get('productRanking')
                });
                this.product.save()
                .then((product) => {
                  self.transitionToRoute('admin.products.edit', product.get("id"));
                });
            }
        }
    });
