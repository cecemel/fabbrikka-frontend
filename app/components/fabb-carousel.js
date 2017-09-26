import Ember from 'ember';

export default Ember.Component.extend({
  fastboot: Ember.inject.service(),
  imageSources: ["https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCarousel1.png?alt=media&token=07672d73-1560-42f0-8e61-8b94ce60ee2b"],

  _loadCarouselImages(){
    let imageSources = this.get("imageSources");

    if (!this.get("fastboot.isFastBoot")) {
      return imageSources.concat([
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCarousel2.png?alt=media&token=efbc3e92-4a08-4c8b-9431-a413248df7a0",
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCarousel3.png?alt=media&token=d6fc36f9-8a3e-4240-93eb-2e027ccc56d4",
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2Fcarousel4.png?alt=media&token=9e760d92-5eff-406c-bdac-55f1d134baf9",
        "https://firebasestorage.googleapis.com/v0/b/fabbrikka.appspot.com/o/carouselimages%2FCarousel5.png?alt=media&token=4dbf306c-1949-4af3-b823-fe7563de4058",

      ]);
    }
    return imageSources;
  },

  init(){
    this._super(...arguments);
    this.set("imageSources", this._loadCarouselImages());
  }

});
