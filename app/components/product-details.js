import Ember from 'ember';

export default Ember.Component.extend({
    cartService: Ember.inject.service('shopping-cart'),

    didRender() {
    this._super(...arguments);
    this.$('select').material_select();
    },

    getImages: function(item){
        let self = this;
        item.get('productImages').then(function(images){
            let filtered = images.filter(function(/*image*/){
                return true;
            });
            self.set('images', filtered);
        });
    },

    setName: function(item){
        let self = this;
        item.get('productNames').then(function(names){
            self.set('name', names.get("length") && names.nextObject(0).get('name'));
        });
    },

    setDescription: function(item){
        let self = this;
        item.get('productDescriptions').then(function(names){
            self.set('description', names.get("length") && names.nextObject(0).get('description'));
        });
    },

    setPrice: function(item){
        let self = this;
        item.get('productPrice').then(function(price){
          self.set("price", price.get("amount") + " €");
        });
    },

    setSizes: function(item){
        let self = this;
        item.get('productSizes').then(function(sizes){
            self.set('sizes', sizes);
        });
    },

    sizes: [],
    images: [],
    name: "",
    price: "",
    description: "",
    productSizeID: "",

    init(){
        this._super(...arguments);
        this.getImages(this.get('data'));
        this.setName(this.get('data'));
        this.setPrice(this.get('data'));
        this.setDescription(this.get('data'));
        this.setSizes(this.get('data'));
    },

    actions: {
        addToCart(id, sizeId){
            this.get('cartService').addItem(id, sizeId, 1);
        }
    }

});
