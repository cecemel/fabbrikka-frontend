import Ember from 'ember';

export default Ember.Component.extend({
	setPrimaryImage: function(item){
		let self = this;
		item.get('productImages').then(function(images){
			let image = images.find(function(image){
				return image.get('type') == "primary";
			});
			self.set('primaryImageURL', image.get("accessURL"));
		});
	},

	setName: function(item){
		let self = this;
		item.get('productNames').then(function(names){
			self.set('name', names.get("length") && names.nextObject(0).get('name'));
		});
	},

	setPrice: function(item){
		let self = this;
		item.get('productPrice').then(function(price){
			self.set("price", price.get("amount") + " €");
		});
	},

	id: "",
	name: "",
	primaryImageURL: "",
	price: "",

	init(){
		this._super(...arguments);
		this.setPrimaryImage(this.get('item'));
		this.setName(this.get('item'));
		this.setPrice(this.get('item'));
		this.set('id', this.get('item').get('id'));
	}
});
