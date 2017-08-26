import Ember from 'ember';

export default Ember.Component.extend({
  fastboot: Ember.inject.service(),
  imageSources: ["https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/Carousel%20Images%2FCar1.jpeg?alt=media&token=5c913cdf-53f7-445f-ad57-ac6df0fcfc2f"],

  _loadCarouselImages(){
    let imageSources = this.get("imageSources");

    if (!this.get("fastboot.isFastBoot")) {
      return imageSources.concat([
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/Carousel%20Images%2FCar2.jpeg?alt=media&token=8c5822d6-5f7d-4b6e-a169-f0380263a03f",
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/Carousel%20Images%2FCar3.jpeg?alt=media&token=4889d382-c67f-482c-a9dd-7b08b4a3f695",
      ]);
    }
    return imageSources;
  },

  init(){
    this._super(...arguments);
    this.set("imageSources", this._loadCarouselImages());
  }

});
